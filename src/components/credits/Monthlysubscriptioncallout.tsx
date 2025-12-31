import pay from "@/assets/pay.png";
import subCard from "@/assets/sub.png";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const MonthlySubscriptionCallout = () => {
  const navigate = useNavigate();

  const goToSubscription = () => {
    navigate("/carboncredits?tab=subscription#subscription");
  };

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-8">
                Monthly
                <br />
                Subscription
              </h2>

              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0 mb-10">
                Reduce your carbon footprint with Forevergreen&apos;s monthly
                carbon offset subscription. Support impactful global projects,
                from reforestation to renewable energy, and make a difference
                every month. Join us in creating a greener planet, one
                subscription at a time.
              </p>

              <button
                onClick={goToSubscription}
                className="inline-flex items-center justify-center px-10 py-3 rounded-full border-2 border-foreground text-foreground hover:bg-foreground hover:text-background transition-all duration-300 font-semibold"
              >
                Subscribe
              </button>
            </motion.div>

            {/* Right: Card */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="flex justify-center lg:justify-end"
            >
              <div className="w-full max-w-lg bg-white rounded-3xl border border-border shadow-2xl p-12">
                <div className="flex flex-col items-center text-center">
                  {/* Image instead of SVG */}
                  <div className="mb-8">
                    <img
                      src={subCard}
                      alt="Carbon Credit Subscription"
                      className="w-48 h-48 object-contain mx-auto"
                    />
                  </div>

                  <div className="text-muted-foreground text-xl mb-3">
                    Carbon Credit Subscription
                  </div>

                  <div className="flex items-end gap-2 mb-10">
                    <div className="text-6xl font-extrabold text-foreground">
                      $10
                    </div>
                    <div className="text-muted-foreground leading-none pb-2 text-base">
                      per
                      <br />
                      month
                    </div>
                  </div>

                  <button
                    onClick={goToSubscription}
                    className="w-full px-8 py-5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 font-bold text-xl shadow-lg"
                  >
                    Subscribe
                  </button>

                  <img
                    src={pay}
                    alt="Supported payment methods"
                    className="mt-6 h-10 w-auto object-contain"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MonthlySubscriptionCallout;
