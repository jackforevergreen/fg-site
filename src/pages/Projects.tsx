import Navigation from "@/components/Navigation";
import { motion } from "framer-motion";
import { Droplet, ExternalLink, Sprout, Trees, Zap } from "lucide-react";

// Project main images
import c1 from "@/assets/projects/c1.png";
import p1 from "@/assets/projects/p1.png";
import q1 from "@/assets/projects/q1.png";
import r1 from "@/assets/projects/r1.png";

// Gallery images - Russas Project (r)
import r2 from "@/assets/projects/r2.jpeg";
import r3 from "@/assets/projects/r3.jpg";
import r4 from "@/assets/projects/r4.jpg";
import r5 from "@/assets/projects/r5.jpg";

// Gallery images - Pamona (p)
import p2 from "@/assets/projects/p2.jpg";
import p3 from "@/assets/projects/p3.jpeg";
import p4 from "@/assets/projects/p4.jpeg";
import p5 from "@/assets/projects/p5.jpg";

// Gallery images - Quebec/Energy (q)
import q2 from "@/assets/projects/q2.png";
import q3 from "@/assets/projects/q3.png";
import q4 from "@/assets/projects/q4.png";
import q5 from "@/assets/projects/q5.png";

// Gallery images - Corridors (c)
import c2 from "@/assets/projects/c2.png";
import c3 from "@/assets/projects/c3.png";
import c4 from "@/assets/projects/c4.png";
import c5 from "@/assets/projects/c5.png";

// Hero section images
import m1 from "@/assets/projects/m1.jpg";
import m2 from "@/assets/projects/m2.png";
import m3 from "@/assets/projects/m3.jpeg";

const Projects = () => {
  const projects = [
    {
      id: 1,
      name: "The Russas Project",
      type: "REDD+",
      icon: Trees,
      iconColor: "text-green-700",
      image: r1,
      location: "Privately-owned property in Acre, Brazil",
      standards:
        "Verified Carbon Standard (VCS) and Climate, Community and Biodiversity Standard (CCBS) certified",
      community:
        "Development and implementation of the project have been conducted in collaboration with local communities and Acre state officials to ensure sustainable and beneficial outcomes",
      impact:
        "The project activities are designed to lower the pressure on land and forest resources, resulting in substantial emission reductions",
      projectId: "VCS1112",
      typeDescription:
        "REDD+ carbon credits are generated through activities that reduce emissions from deforestation and forest degradation, as well as through the conservation, sustainable management, and enhancement of forest carbon stocks.",
      detailedDescription:
        "The Russas Project is a pioneering reforestation initiative dedicated to the protection and conservation of tropical forests located on the southern bank of the Valparaiso River in the State of Acre Brazil. By offering payments for ecosystem services, this project aims to significantly reduce deforestation and forest degradation, aligning with the Reducing Emissions from Deforestation and forest Degradation (REDD) framework.",
      registryLink: "https://registry.verra.org/app/projectDetail/VCS/1112",
      purchaseInfo:
        "Your purchase of the Russas Project | VCS1112 ensures that 1 metric ton of CO2 is neutralized through natural, sustainable reforestation practices. These credits have already been retired under the Forevergreen Organization. Upon completing your purchase, you will be awarded a certificate of offset, detailing the specifics of the contribution made towards fighting climate change through your chosen project. You will also receive a personalized certificate from Forevergreen via email.",
      callToAction:
        "Embrace a greener future today with Forevergreen Reforestation Carbon Credits.",
      galleryImages: [r2, r3, r4, r5],
    },
    {
      id: 2,
      name: "Pamona Hydroelectric",
      type: "Hydropower Carbon",
      icon: Droplet,
      iconColor: "text-blue-500",
      image: p1,
      location: "Poso River, Central Sulawesi, Indonesia",
      standards: "UN CERs",
      community:
        "Provides local employment during construction and operation, along with free electricity to improve living standards and support small industries",
      impact:
        "Reduces greenhouse gas emissions by 608,090 tCO2 annually during the first crediting period, while improving air quality",
      projectId: "UN0001",
      typeDescription:
        "Hydropower carbon credits are generated through hydropower projects that produce electricity from the potential energy of water, typically through dams or run-of-river systems.",
      detailedDescription:
        "The Pamona Hydroelectric Project harnesses the power of the Poso River in Central Sulawesi, Indonesia, to generate clean, renewable energy. This initiative provides sustainable electricity while significantly reducing carbon emissions and supporting local communities.",
      registryLink:
        "https://cdm.unfccc.int/Projects/DB/RWTUV1346067853.34/view?cp=1",
      purchaseInfo:
        "Your purchase of the Pamona Hydroelectric Project | UN0001 ensures that 1 metric ton of CO2 is neutralized through clean hydroelectric energy generation. These credits have already been retired under the Forevergreen Organization. Upon completing your purchase, you will be awarded a certificate of offset, detailing the specifics of the contribution made towards fighting climate change through your chosen project. You will also receive a personalized certificate from Forevergreen via email.",
      callToAction:
        "Power a cleaner future with Forevergreen Hydroelectric Carbon Credits.",
      galleryImages: [p2, p3, p4, p5],
    },
    {
      id: 3,
      name: "Quebec Sustainable Community",
      type: "Energy and Waste",
      icon: Zap,
      iconColor: "text-yellow-500",
      image: q1,
      location: "Quebec, Canada",
      standards: "Gold Standard certified",
      community:
        "Supports local communities through improved energy access and reduced pollution",
      impact:
        "Significantly reduces greenhouse gas emissions through improved energy efficiency",
      projectId: "GS0003",
      typeDescription:
        "Energy and waste carbon credits are generated through projects that focus on improving energy efficiency and reducing waste, thereby minimizing greenhouse gas (GHG) emissions.",
      detailedDescription:
        "This energy efficiency initiative focuses on implementing sustainable practices that reduce energy consumption and waste production across multiple sectors, contributing to global climate change mitigation efforts.",
      registryLink: "https://registry.verra.org/app/projectDetail/VCS/929",
      purchaseInfo:
        "Your purchase of the Quebec Sustainable Community | GS0003 ensures that 1 metric ton of CO2 is neutralized through energy efficiency improvements. These credits have already been retired under the Forevergreen Organization. Upon completing your purchase, you will be awarded a certificate of offset, detailing the specifics of the contribution made towards fighting climate change through your chosen project.",
      callToAction:
        "Join the energy efficiency movement with Forevergreen Carbon Credits.",
      galleryImages: [q2, q3, q4, q5],
    },
    {
      id: 4,
      name: "Colombia Biological Corridors",
      type: "Forestry Restoration",
      icon: Sprout,
      iconColor: "text-green-600",
      image: c1,
      location: "Various deforested regions",
      standards: "Verified Carbon Standard (VCS) certified",
      community:
        "Engages local communities in tree planting and forest management activities",
      impact:
        "Captures and stores significant amounts of carbon dioxide through new forest growth",
      projectId: "VCS0004",
      typeDescription:
        "Afforestation and reforestation carbon credits are generated through projects that involve planting trees on non-forested land or replanting trees in deforested areas.",
      detailedDescription:
        "This reforestation initiative focuses on restoring degraded forest areas through systematic tree planting and sustainable forest management, creating carbon sinks while supporting biodiversity and local communities.",
      registryLink: "https://globalcarbontrace.io/projects/22/",
      purchaseInfo:
        "Your purchase of the Biological Corridors | VCS0004 ensures that 1 metric ton of CO2 is neutralized through tree planting and forest restoration. These credits have already been retired under the Forevergreen Organization. Upon completing your purchase, you will be awarded a certificate of offset.",
      callToAction:
        "Grow a greener tomorrow with Forevergreen Reforestation Carbon Credits.",
      galleryImages: [c2, c3, c4, c5],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-32 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold mb-6 text-foreground"
          >
            Our Projects
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            At Forevergreen we hand selected 4 unique projects from all around
            the world that are fighting climate change and reducing or removing
            CO2 from our atmosphere. Explore the different types of credits and
            projects we offers below!
          </motion.p>
        </motion.div>

        {/* Hero Images Collage */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative max-w-6xl mx-auto mt-16 h-96"
        >
          <div className="absolute left-0 top-0 w-1/3 h-64 rounded-2xl overflow-hidden shadow-lg group">
            <img
              src={m1}
              alt="Project 1"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 h-80 rounded-2xl overflow-hidden shadow-xl z-10 group">
            <img
              src={m2}
              alt="Project 2"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          <div className="absolute right-0 top-0 w-1/3 h-64 rounded-2xl overflow-hidden shadow-lg group">
            <img
              src={m3}
              alt="Project 3"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        </motion.div>
      </div>

      {/* Projects Highlights Section */}
      <div className="container mx-auto px-4 pb-32">
        <div className="max-w-7xl mx-auto space-y-24">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
            >
              {/* Project Header with Image */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 md:p-12">
                {/* Left: Info */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <project.icon className={`h-8 w-8 ${project.iconColor}`} />
                    <span className="text-sm font-medium text-primary">
                      {project.type}
                    </span>
                  </div>

                  <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                    {project.name}
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-bold text-foreground mb-2">
                        Location:
                      </h4>
                      <p className="text-muted-foreground">
                        {project.location}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground mb-2">
                        Standards:
                      </h4>
                      <p className="text-muted-foreground">
                        {project.standards}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground mb-2">
                        Community:
                      </h4>
                      <p className="text-muted-foreground">
                        {project.community}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground mb-2">
                        Impact:
                      </h4>
                      <p className="text-muted-foreground">{project.impact}</p>
                    </div>
                  </div>
                </div>

                {/* Right: Image */}
                <div className="rounded-xl overflow-hidden shadow-lg group cursor-pointer">
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-full object-cover min-h-[400px] transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-border"></div>

              {/* Detailed Information */}
              <div className="p-8 md:p-12 space-y-8">
                {/* Gallery */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {project.galleryImages.map((img, imgIndex) => (
                    <div
                      key={imgIndex}
                      className="rounded-xl overflow-hidden h-48 group cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-300"
                    >
                      <img
                        src={img}
                        alt={`${project.name} gallery ${imgIndex + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:rotate-1"
                      />
                    </div>
                  ))}
                </div>

                {/* Description */}
                <p className="text-muted-foreground leading-relaxed">
                  {project.detailedDescription}
                </p>

                {/* Project ID and Registry Link */}
                <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                  <div>
                    <span className="font-bold text-foreground">
                      Project ID:{" "}
                    </span>
                    <span className="text-muted-foreground">
                      {project.projectId}
                    </span>
                  </div>
                  <a
                    href={project.registryLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center gap-2 transition-colors"
                  >
                    View Project Registry
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>

                {/* Purchase Information */}
                <div className="bg-muted/30 rounded-xl p-6 space-y-4">
                  <h4 className="font-bold text-foreground text-lg">
                    Your Purchase:
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {project.purchaseInfo}
                  </p>
                  <p className="text-muted-foreground leading-relaxed italic text-primary">
                    {project.callToAction}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button className="px-8 py-3 bg-green-700 text-white rounded-full hover:bg-green-800 transition-colors duration-300 font-medium">
                    Buy Now
                  </button>
                  <button className="px-8 py-3 border-2 border-green-700 text-green-700 rounded-full hover:bg-green-700 hover:text-white transition-colors duration-300 font-medium">
                    Read More
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;
