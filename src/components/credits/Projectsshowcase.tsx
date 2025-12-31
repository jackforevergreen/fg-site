import h1 from "@/assets/h1.png";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";

type Project = {
  id: number;
  name: string;
  description: string;
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
};

const ProjectsShowcase = () => {
  const projects: Project[] = useMemo(
    () => [
      {
        id: 1,
        name: "The Russas Project",
        description:
          "The Russas Project is a REDD initiative in Acre, Brazil, aiming to protect tropical forests by reducing deforestation through payments for ecosystem services, verified by VCS and CCBS standards.",
        position: "top-left",
      },
      {
        id: 2,
        name: "Pamona 2 Hydroelectric Power Plant Project",
        description:
          "Located on the Poso River in Indonesia, the Pamona 2 Hydroelectric Power Plant is a 195 MW run-of-river project supplying zero-emission power to Sulawesi, displacing fossil fuel generation and reducing CO2 emissions by 608,090 tCO2 annually.",
        position: "top-right",
      },
      {
        id: 3,
        name: "Quebec Sustainable Community Project",
        description:
          "This project enhances energy efficiency and solid waste diversion across facilities in Quebec, Canada, aiming to reduce emissions by grouping up to 10,000 facilities and achieving significant CO2 reductions, certified by VCS and CCBS standards.",
        position: "bottom-left",
      },
      {
        id: 4,
        name: "Forestry Restoration in Eastern Plains of Colombia",
        description:
          "This project restores natural forests and creates biological corridors in Colombia's High Orinoco region, shifting land use from cattle ranching to sustainable forestry, achieving significant CO2 reductions and supporting local communities.",
        position: "bottom-right",
      },
    ],
    []
  );

  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  const toggle = (id: number) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const leftColumn = projects.filter(
    (p) => p.position === "top-left" || p.position === "bottom-left"
  );
  const rightColumn = projects.filter(
    (p) => p.position === "top-right" || p.position === "bottom-right"
  );

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Layout: left projects / center badge / right projects */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-14 items-center">
            {/* LEFT COLUMN */}
            <div className="space-y-16">
              {leftColumn.map((project, idx) => (
                <ProjectBlock
                  key={project.id}
                  project={project}
                  isExpanded={!!expanded[project.id]}
                  onToggle={() => toggle(project.id)}
                  align="center"
                  delay={idx * 0.08}
                />
              ))}
            </div>

            {/* CENTER BADGE */}
            <div className="relative flex items-center justify-center py-10 lg:py-0">
              {/* Badge */}
              <motion.div
                initial={{ scale: 0.85, opacity: 0, rotate: -6 }}
                whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, type: "spring" }}
                className="relative z-10"
              >
                <img
                  src={h1}
                  alt="Carbon Credit Badge"
                  className="w-[300px] h-[300px] md:w-[360px] md:h-[360px] object-contain"
                />
              </motion.div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-16">
              {rightColumn.map((project, idx) => (
                <ProjectBlock
                  key={project.id}
                  project={project}
                  isExpanded={!!expanded[project.id]}
                  onToggle={() => toggle(project.id)}
                  align="center"
                  delay={idx * 0.08}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

function ProjectBlock({
  project,
  isExpanded,
  onToggle,
  align,
  delay,
}: {
  project: Project;
  isExpanded: boolean;
  onToggle: () => void;
  align: "center" | "left" | "right";
  delay: number;
}) {
  const maxChars = 180;

  const text =
    isExpanded || project.description.length <= maxChars
      ? project.description
      : project.description.slice(0, maxChars).trimEnd() + "...";

  const alignment =
    align === "center"
      ? "text-center items-center"
      : align === "left"
      ? "text-left items-start"
      : "text-right items-end";

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay }}
      className={`flex flex-col ${alignment}`}
    >
      <h3 className="font-medium text-2xl md:text-3xl text-foreground">
        {project.name}
      </h3>

      <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed max-w-md">
        {text}
      </p>

      <button
        onClick={onToggle}
        className="mt-4 text-sm underline text-muted-foreground hover:text-foreground transition-colors"
      >
        {isExpanded ? "Show Less" : "Show More"}
      </button>
    </motion.div>
  );
}

export default ProjectsShowcase;
