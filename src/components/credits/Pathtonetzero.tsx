import Colombia from "@/assets/afforestation-credit.png";
import Quebec from "@/assets/energy-waste-credit.png";
import Pamona from "@/assets/hydroelectric.png";
import Russas from "@/assets/reforest-credit.png";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const PathToNetZero = () => {
  const navigate = useNavigate();

  const projects = [
    {
      id: 1,
      name: "Colombian Reforestation",
      image: Colombia,
      link: "/projects#colombia",
    },
    {
      id: 2,
      name: "Pamona Hydroelectric",
      image: Pamona,
      link: "/projects#pamona",
    },
    {
      id: 3,
      name: "Canadian Energy and Waste",
      image: Quebec,
      link: "/projects#canada",
    },
    {
      id: 4,
      name: "The Russas Project",
      image: Russas,
      link: "/projects#russas",
    },
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
                Your Path to Net Zero Starts Here.
              </h2>

              <div className="border-t-2 border-foreground w-24 mb-6"></div>

              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Carbon Credits allow you to balance out your negative impact on
                the world while supporting green initiatives. Purchasing carbon
                credits through Forevergreen boosts verified environmental
                projects that actively reduce, remove, and prevent CO2
                emissions. Become Net Zero with Forevergreen and transform your
                environmental impact into a planet-positive legacy.
              </p>

              <button
                onClick={() => navigate("/about")}
                className="px-8 py-3 rounded-full border-2 border-foreground text-foreground hover:bg-foreground hover:text-background transition-all duration-300 font-medium"
              >
                Read More
              </button>
            </motion.div>

            {/* Right: Project Grid */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 gap-10"
            >
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.08 }}
                  onClick={() => navigate(project.link)}
                  className="cursor-pointer group flex flex-col items-center"
                >
                  {/* Icon only — no card */}
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-28 h-28 md:w-32 md:h-32 object-contain transition-transform duration-300"
                  />

                  {/* Label */}
                  <p className="mt-3 text-sm md:text-base font-medium text-foreground text-center group-hover:text-primary transition-colors">
                    {project.name}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PathToNetZero;
