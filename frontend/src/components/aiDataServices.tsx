import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import {
  FaBrain,
  FaChartLine,
  FaChartBar,
  FaMicrochip,
  FaBolt,
  FaDatabase,
  FaLaptopCode,
  FaCloud,
  FaBullseye,
} from "react-icons/fa";

type Category = {
  icon: ReactNode;
  title: string;
  items: string[];
};

const categories: Category[] = [
  {
    icon: <FaBrain size={26} />,
    title: "Artificial Intelligence Solutions",
    items: [
      "Custom AI Application Development",
      "Generative AI Solutions",
      "AI Chatbots & Virtual Assistants",
      "AI Agents & Business Automation",
      "Large Language Model (LLM) Integration",
      "Retrieval-Augmented Generation (RAG)",
      "AI API Integration",
      "Intelligent Document Processing (OCR + AI)",
    ],
  },
  {
    icon: <FaChartBar size={26} />,
    title: "Data Analytics",
    items: [
      "Business Intelligence Dashboards",
      "Data Cleaning & Preparation",
      "Exploratory Data Analysis (EDA)",
      "KPI & Performance Reporting",
      "Sales & Marketing Analytics",
      "Financial Analytics",
      "Customer Behavior Analysis",
      "SQL Data Analysis",
      "Power BI & Tableau Dashboards",
    ],
  },
  {
    icon: <FaChartLine size={26} />,
    title: "Data Science",
    items: [
      "Predictive Analytics",
      "Machine Learning Models",
      "Time Series Forecasting",
      "Customer Segmentation",
      "Recommendation Systems",
      "Churn Prediction",
      "Fraud Detection",
      "Statistical Analysis",
      "A/B Testing",
    ],
  },
  {
    icon: <FaMicrochip size={26} />,
    title: "Machine Learning & Deep Learning",
    items: [
      "Custom ML Model Development",
      "Model Training & Optimization",
      "Computer Vision Solutions",
      "Natural Language Processing (NLP)",
      "Image Classification",
      "Object Detection",
      "Sentiment Analysis",
      "Recommendation Engines",
      "Model Deployment (MLOps)",
    ],
  },
  {
    icon: <FaBolt size={26} />,
    title: "Business Process Automation",
    items: [
      "AI Workflow Automation",
      "CRM Automation",
      "Email Automation",
      "Document Automation",
      "Invoice Processing",
      "PDF Data Extraction",
      "API Integrations",
      "No-Code Automation (n8n, Make, Zapier)",
    ],
  },
  {
    icon: <FaDatabase size={26} />,
    title: "Data Engineering",
    items: [
      "ETL/ELT Pipelines",
      "Data Warehousing",
      "Database Design",
      "Cloud Data Migration",
      "Big Data Processing",
      "Data Integration",
      "SQL Optimization",
      "Data Pipeline Automation",
    ],
  },
  {
    icon: <FaLaptopCode size={26} />,
    title: "Software Development",
    items: [
      "Custom Web Applications",
      "AI SaaS Development",
      "Admin Dashboards",
      "REST API Development",
      "Backend Development",
      "Cloud Deployment",
      "Enterprise Software Solutions",
      "System Integration",
    ],
  },
  {
    icon: <FaCloud size={26} />,
    title: "Cloud & MLOps",
    items: [
      "AWS, Azure & Google Cloud",
      "Docker & Kubernetes",
      "CI/CD Pipelines",
      "Model Monitoring",
      "AI Infrastructure",
      "Scalable Deployment",
    ],
  },
  {
    icon: <FaBullseye size={26} />,
    title: "AI Consulting",
    items: [
      "AI Strategy & Roadmap",
      "Data Strategy",
      "AI Readiness Assessment",
      "Digital Transformation",
      "Technology Consulting",
      "Proof of Concept (PoC)",
    ],
  },
];

const industries = [
  "Healthcare",
  "Finance",
  "Retail & E-commerce",
  "Manufacturing",
  "Logistics",
  "Real Estate",
  "Education",
  "Marketing",
  "Human Resources",
  "Startups & Enterprises",
];

const AiDataServices = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="section-shell bg-white">
      <div className="container-shell">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="eyebrow justify-center">Our AI &amp; Data Services</p>
          <h2 className="section-title mt-4 text-3xl md:text-4xl">
            Turn raw data into intelligent, automated growth
          </h2>
          <p className="section-copy mt-6">
            We help businesses transform their data into actionable insights
            and build intelligent AI-powered solutions that automate
            workflows, improve decision-making, and accelerate growth.
          </p>
        </motion.div>

        <div className="mx-auto mt-14 max-w-4xl space-y-4">
          {categories.map((category, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.04 }}
                viewport={{ once: true }}
                className="soft-card overflow-hidden rounded-2xl"
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-5 px-6 py-5 text-left"
                >
                  <span className="icon-tile !h-14 !w-14 shrink-0">
                    {category.icon}
                  </span>
                  <span className="flex-1">
                    <span className="block text-lg font-black text-[#182033] md:text-xl">
                      {category.title}
                    </span>
                    <span className="mt-1 block text-sm text-[var(--muted)]">
                      {category.items.length} services
                    </span>
                  </span>
                  <ChevronDown
                    size={22}
                    className={`shrink-0 text-[var(--brand)] transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="grid gap-x-6 gap-y-3 border-t border-[var(--line)] px-6 py-6 sm:grid-cols-2">
                        {category.items.map((item) => (
                          <div
                            key={item}
                            className="flex items-start gap-3 text-sm text-[var(--muted)]"
                          >
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand)]" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mx-auto mt-20 max-w-3xl text-center"
        >
          <p className="eyebrow justify-center">Industries We Serve</p>
          <h3 className="section-title mt-4 text-2xl md:text-3xl">
            Built around how your industry actually works
          </h3>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-3"
        >
          {industries.map((industry) => (
            <span
              key={industry}
              className="rounded-full border border-[var(--line)] bg-[#fffaf7] px-5 py-2.5 text-sm font-bold text-[#182033] transition hover:border-[rgba(255,77,55,0.4)] hover:text-[var(--brand-dark)]"
            >
              {industry}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AiDataServices;
