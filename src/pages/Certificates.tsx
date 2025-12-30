import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import {
  collection,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { db, functions } from "@/lib/firebase";
import { FileText, Calendar, ExternalLink, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface CertificateData {
  id: string; // Firestore document ID
  certificates: {
    filename: string;
    path: string;
    url: string;
  }[];
  completedAt?: Date;
  createdAt?: Date;
  type?: 'net_zero' | 'flight_offset' | 'carbon_credits';
  monthlyEmissions?: number;
  totalOffset?: number;
  line_items?: {
    price: string;
    quantity: string;
    status: string;
    productName?: string;
    unitAmount?: number;
  }[];
  transaction_id?: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

const Certificates = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [certificates, setCertificates] = useState<CertificateData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingCertificate, setLoadingCertificate] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/");
      return;
    }

    const fetchCertificates = async () => {
      if (!user) return;

      try {
        const certificatesRef = collection(db, "users", user.uid, "certificates");
        const certificatesSnap = await getDocs(certificatesRef);

        const certificateData = (await Promise.all(
          certificatesSnap.docs.map(async (docSnap) => {
            const data = docSnap.data();

            // Handle net zero certificates
            if (data.type === 'net_zero') {
              return {
                id: docSnap.id, // Store the actual Firestore document ID
                ...data,
                completedAt: data.completedAt?.toDate(),
                createdAt: data.createdAt?.toDate(),
              };
            }

            // Skip invalid regular certificates
            if (!data.line_items || data.amount_recieved === 0) return null;

            const lineItemsWithPrices = await Promise.all(
              data.line_items.map(async (item: any) => {
                if (!item.price) return item;

                // Query all products to find the one containing our price
                const productsRef = collection(db, "products");
                const productsSnap = await getDocs(productsRef);

                for (const productDoc of productsSnap.docs) {
                  const priceDoc = await getDoc(
                    doc(db, "products", productDoc.id, "prices", item.price)
                  );

                  if (priceDoc.exists()) {
                    const priceData = priceDoc.data();
                    const productData = productDoc.data();

                    return {
                      ...item,
                      productName: productData?.name || "Carbon Credit",
                      unitAmount: priceData.unit_amount,
                    };
                  }
                }
                return item;
              })
            );

            return {
              id: docSnap.id, // Store the actual Firestore document ID
              ...data,
              line_items: lineItemsWithPrices,
              completedAt: data.completedAt?.toDate(),
              createdAt: data.createdAt?.toDate(),
            };
          }),
        )) as CertificateData[];

        const validCertificates = certificateData.filter(cert => cert !== null && cert.createdAt);
        const sortedCertificates = validCertificates.sort(
          (a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0),
        );

        setCertificates(sortedCertificates);
      } catch (error) {
        console.error("Error fetching certificates:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchCertificates();
    }
  }, [user, authLoading, navigate]);

  const handleCertificateClick = async (
    certificate: CertificateData['certificates'][0],
    firestoreDocId: string,
    uiCertId: string
  ) => {
    try {
      setLoadingCertificate(uiCertId);

      // Try to refresh the certificate URL using Firebase Function
      const refreshCertificateUrl = httpsCallable(functions, 'refreshCertificateUrl');
      const result = await refreshCertificateUrl({
        certificateId: firestoreDocId, // Use actual Firestore document ID
        filePath: certificate.path
      });

      const response = result.data as { url: string };
      window.open(response.url, '_blank');
    } catch (error) {
      console.error("Error refreshing certificate URL:", error);
      // Fallback to direct URL if refresh fails
      window.open(certificate.url, '_blank');
    } finally {
      setLoadingCertificate(null);
    }
  };

  const getCertificateType = (type?: string) => {
    switch (type) {
      case 'net_zero':
        return { label: 'Net Zero', color: 'bg-green-100 text-green-800 border-green-300' };
      case 'flight_offset':
        return { label: 'Flight Offset', color: 'bg-blue-100 text-blue-800 border-blue-300' };
      default:
        return { label: 'Carbon Credit', color: 'bg-gray-100 text-gray-800 border-gray-300' };
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-blue-50">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto space-y-6">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-blue-50">
      <Navigation />

      <div className="container mx-auto px-4 py-12 relative z-10 mt-8">
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="text-center mb-8 py-8">
            <div className="relative inline-block mb-6">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-2xl">
                <FileText className="h-14 w-14 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              My Certificates
            </h1>
            <p className="text-xl text-gray-600">
              View and download your carbon offset certificates
            </p>
          </motion.div>

          {/* Certificates List */}
          {certificates.length > 0 ? (
            <motion.div variants={stagger} className="space-y-4">
              {certificates.map((cert) => {
                const certificateId = cert.type === 'net_zero'
                  ? new Date(cert.createdAt!).toISOString().slice(0, 7)
                  : cert.transaction_id || `${cert.createdAt!.getTime()}`;
                const isLoading = loadingCertificate === certificateId;
                const typeInfo = getCertificateType(cert.type);

                return (
                  <motion.div key={certificateId} variants={fadeUp}>
                    <Card className="shadow-md border-2 border-gray-200 hover:shadow-xl transition-shadow">
                      <CardHeader className="bg-gray-50 pb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-gray-500" />
                            <span className="text-lg font-semibold text-gray-700">
                              {formatDate(cert.createdAt!.getTime())}
                            </span>
                          </div>
                          <Badge className={`${typeInfo.color} border font-semibold`}>
                            {typeInfo.label}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-6">
                        {/* Unified Certificate Display */}
                        <div className="space-y-4 mb-4">
                          {/* Certificate Type Title */}
                          <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">
                            {typeInfo.label}
                          </h3>

                          {/* Line Items */}
                          <div className="space-y-2">
                            {cert.type === 'net_zero' ? (
                              // For Net Zero, show offset amount as line item
                              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="font-semibold text-gray-900">
                                  Carbon Offset
                                </span>
                                <span className="text-gray-700">
                                  {cert.totalOffset?.toFixed(1)} tons CO₂
                                </span>
                              </div>
                            ) : cert.line_items && cert.line_items.length > 0 ? (
                              // For all other certificates, show line items with quantity x price
                              cert.line_items.map((item, index) => (
                                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                  <span className="font-semibold text-gray-900">
                                    {item.productName || "Carbon Credit"}
                                  </span>
                                  <span className="text-gray-700">
                                    {item.quantity} x ${((item.unitAmount || 0) / 100).toFixed(2)}
                                  </span>
                                </div>
                              ))
                            ) : null}
                          </div>

                          {/* Transaction ID - Hide for net zero certificates */}
                          {cert.type !== 'net_zero' && (
                            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                              <p className="text-sm text-gray-600 mb-1">Transaction ID</p>
                              <p className="text-sm font-mono text-gray-900 break-all">
                                {cert.transaction_id || cert.id}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Certificate Download Buttons */}
                        <div className="space-y-2">
                          {cert.certificates?.map((certificate, index) => (
                            <Button
                              key={index}
                              onClick={() => handleCertificateClick(certificate, cert.id, certificateId)}
                              disabled={isLoading}
                              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold shadow-md hover:shadow-lg transition-all"
                            >
                              {isLoading ? (
                                <>
                                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                  Loading Certificate...
                                </>
                              ) : (
                                <>
                                  <ExternalLink className="mr-2 h-5 w-5" />
                                  View Certificate
                                </>
                              )}
                            </Button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div variants={fadeUp}>
              <Alert className="bg-gray-50 border-2 border-gray-200">
                <FileText className="h-5 w-5 text-gray-500" />
                <AlertDescription className="ml-2">
                  <p className="text-lg font-semibold text-gray-900 mb-2">
                    No certificates available
                  </p>
                  <p className="text-gray-600">
                    Your certificates will appear here once you make a carbon offset purchase.
                  </p>
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          {/* Back to Profile Button */}
          <motion.div variants={fadeUp} className="mt-8 text-center">
            <Button
              onClick={() => navigate("/profile")}
              variant="outline"
              size="lg"
              className="border-2 font-semibold shadow-md hover:shadow-lg transition-all"
            >
              Back to Profile
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Certificates;
