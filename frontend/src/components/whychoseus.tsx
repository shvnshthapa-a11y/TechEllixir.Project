import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Code2,
  Cloud,
  ShieldCheck,
  Zap,
  Headphones,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

const defaultFeatureIcons = [<Brain size={30} />, <Code2 size={30} />, <Cloud size={30} />, <ShieldCheck size={30} />, <Zap size={30} />, <Headphones size={30} />];

const WhyChooseUs = () => {
  const { t } = useLanguage();
  const [dynamicFeatures, setDynamicFeatures] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/cms/whychoseus")
      .then((res) => res.json())
      .then((data) => {
        if (data.items && Array.isArray(data.items) && data.items.length > 0) {
          setDynamicFeatures(data.items);
        }
      })
      .catch((err) => console.warn("Backend whychoseus fetch fallback:", err));
  }, []);

  const fallbackFeatures = [
    { icon: <Brain size={30} />, title: t("whychoseus.features.endToEnd"), description: t("whychoseus.features.endToEndDesc") },
    { icon: <Code2 size={30} />, title: t("whychoseus.features.customApp"), description: t("whychoseus.features.customAppDesc") },
    { icon: <Cloud size={30} />, title: t("whychoseus.features.scalableCloud"), description: t("whychoseus.features.scalableCloudDesc") },
    { icon: <ShieldCheck size={30} />, title: t("whychoseus.features.secureReliable"), description: t("whychoseus.features.secureReliableDesc") },
    { icon: <Zap size={30} />, title: t("whychoseus.features.fastDelivery"), description: t("whychoseus.features.fastDeliveryDesc") },
    { icon: <Headphones size={30} />, title: t("whychoseus.features.ongoingSupport"), description: t("whychoseus.features.ongoingSupportDesc") },
  ];

  const features = dynamicFeatures.length > 0
    ? dynamicFeatures.map((item, idx) => ({
        icon: defaultFeatureIcons[idx % defaultFeatureIcons.length],
        title: item.title,
        description: item.description,
      }))
    : fallbackFeatures;

  return (
    <section className="section-shell bg-[#fffaf7] dark:bg-[#131924] transition-colors duration-300">
      <div className="container-shell">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 80, damping: 15 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="eyebrow justify-center">{t("whychoseus.eyebrow")}</p>
          <h2 className="section-title mt-4 text-3xl md:text-4xl">
            {t("whychoseus.title")}
          </h2>
          <p className="section-copy mt-5">
            {t("whychoseus.copy")}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => (
            <motion.article
              key={feature.title}
              variants={cardVariants}
              whileHover={{ y: -7, scale: 1.02 }}
              className="soft-card rounded-3xl p-7 cursor-pointer transition-shadow transition-colors duration-300 hover:shadow-xl"
            >
              <div className="icon-tile">{feature.icon}</div>
              <h3 className="mt-6 text-xl font-black text-[#182033] dark:text-white">
                {feature.title}
              </h3>
              <p className="section-copy mt-3 text-sm">{feature.description}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
