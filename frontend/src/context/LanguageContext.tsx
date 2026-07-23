import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "hi" | "bn" | "te" | "mr" | "ta" | "ur" | "gu" | "kn" | "ml" | "or" | "pa" | "as" | "mai" | "sa";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// English master dictionary for baseline translation (which Google Translate then translates into target languages)
const enTranslations = {
  nav: {
    home: "Home",
    about: "About",
    services: "Services",
    resources: "Resources",
    career: "Career",
    contact: "Contact",
    getStarted: "Get Started"
  },
  hero: {
    title1: "We design and build",
    title2: "software people trust",
    copy: "TechEllixir helps ambitious teams turn ideas into polished web apps, mobile experiences, AI workflows, and cloud platforms that are fast, scalable, and easy to use.",
    startProject: "Start a Project",
    exploreServices: "Explore Services",
    stats: {
      shipped: "projects shipped",
      supported: "clients supported",
      assistance: "launch assistance",
      satisfaction: "Satisfaction"
    }
  },
  about: {
    eyebrow: "About Us",
    title: "Technology that fits the way your business moves",
    copy1: "TechEllixir is a product and engineering partner for teams that need dependable software, thoughtful design, and practical technical guidance from idea to launch.",
    copy2: "We help startups, businesses, and enterprises transform early ideas into scalable digital products with modern stacks, user-focused design, and reliable delivery habits.",
    learnMore: "Learn More",
    metrics: {
      delivered: "Projects Delivered",
      happy: "Happy Clients",
      experience: "Years Experience",
      support: "Customer Support"
    },
    principles: {
      outcome: "Outcome led",
      outcomeDesc: "We start with business goals, then choose the right product and technical path.",
      scale: "Built to scale",
      scaleDesc: "Clean architecture, maintainable code, and cloud-ready foundations come standard.",
      human: "Human centered",
      humanDesc: "Every interface is shaped around the people who will use it every day."
    }
  },
  services: {
    eyebrow: "Our Services",
    title: "Our AI & Data Services",
    copy: "We help businesses transform their data into actionable insights and build intelligent AI-powered solutions that automate workflows, improve decision-making, and accelerate growth.",
    planBtn: "Plan this service",
    viewAll: "View All AI & Data Services",
    categories: {
      ai: "Artificial Intelligence Solutions",
      analytics: "Data Analytics",
      science: "Data Science",
      ml: "Machine Learning & Deep Learning",
      automation: "Business Process Automation",
      engineering: "Data Engineering",
      software: "Software Development",
      cloud: "Cloud & MLOps",
      consulting: "AI Consulting"
    }
  },
  whychoseus: {
    eyebrow: "Why Choose Us",
    title: "A technology partner that stays accountable",
    copy: "We combine thoughtful planning, careful execution, and honest communication so every product decision has a reason behind it.",
    features: {
      endToEnd: "End-to-End AI & Data Solutions",
      endToEndDesc: "Comprehensive delivery from data engineering and cleaning to advanced model training and predictive modeling.",
      customApp: "Custom-Built Business Applications",
      customAppDesc: "Tailored web applications, custom-built AI SaaS platforms, and administrative dashboards shaped around your operational needs.",
      scalableCloud: "Scalable Cloud Architecture",
      scalableCloudDesc: "High-availability deployments on AWS, Google Cloud, and Azure, utilizing Docker and Kubernetes for seamless scalability.",
      secureReliable: "Secure & Reliable Development",
      secureReliableDesc: "Industry-standard security compliance, sandboxing, data encryption, and resilient code structures that protect user data.",
      fastDelivery: "Fast Delivery with Modern Tech",
      fastDeliveryDesc: "Agile iterations combined with state-of-the-art frameworks to deliver fully-functional features within strict timelines.",
      ongoingSupport: "Ongoing Support & Maintenance",
      ongoingSupportDesc: "Continuous system monitoring, cloud optimization, routine updates, and expansion support to keep your software optimized."
    }
  },
  process: {
    eyebrow: "Our Process",
    title: "A calmer path from idea to launch",
    copy: "Our process keeps strategy, design, engineering, and delivery in the same conversation, so projects move quickly without losing clarity.",
    steps: {
      discovery: "Discovery",
      discoveryDesc: "We clarify goals, users, workflows, constraints, and the first version that will create real value.",
      design: "Design",
      designDesc: "We create product flows, interface systems, and prototypes that make decisions visible early.",
      development: "Development",
      developmentDesc: "We build secure, scalable applications with clean handoffs, reviews, and steady progress updates.",
      launch: "Launch & Support",
      launchDesc: "We test, deploy, monitor, and keep improving the product after it reaches real users."
    }
  },
  testimonials: {
    eyebrow: "Testimonials",
    title: "What Our Clients Say",
    copy: "We build long-term relationships by delivering quality software and exceptional customer service."
  },
  contact: {
    eyebrow: "Contact Us",
    title: "Tell us what you want to build",
    copy: "Share your idea, timeline, or current challenge. We will help you shape the next step with clarity.",
    office: "Office Address",
    call: "Call Us",
    email: "Email Address",
    placeholderName: "Full Name",
    placeholderEmail: "Email Address",
    placeholderSubject: "Subject",
    placeholderMsg: "Write your message...",
    sending: "Sending...",
    sendBtn: "Send Message",
    success: "Thanks. Your query has been received and our team will contact you soon.",
    error: "Unable to send your query."
  },
  footer: {
    copy: "Innovative software, web applications, mobile apps, AI solutions, and cloud services for businesses ready to move with confidence.",
    quickLinks: "Quick Links",
    services: "Services",
    contact: "Contact",
    copyright: "All Rights Reserved."
  },
  industries: {
    title: "Delivering AI & Data Value Across Sectors",
    copy: "We customize our models, pipelines, and tools to fit the regulations, datasets, and strategic outcomes of your specific domain. Click on any sector to learn more.",
    eyebrow: "Industries We Serve",
    detailModalTitle: "Industry Solutions",
    closeBtn: "Close",
    inquireBtn: "Inquire Now",
    list: {
      healthcare: "Healthcare",
      healthcareDesc: "Predictive diagnostics, OCR patient reports, and secure cloud pipelines.",
      healthcareDetail: "We build highly secure predictive diagnostics systems, natural language models for reading patient reports, and robust cloud data pipelines that comply with healthcare standards. Our solutions help clinicians automate administrative tasks and identify patient risks early.",
      finance: "Finance",
      financeDesc: "Fraud detection ML, automated portfolio reporting, and risk analytics.",
      financeDetail: "Our custom ML models analyze real-time market data to detect fraudulent transactions, automate wealth management portfolio reports, and perform advanced risk assessment. We help financial institutions make data-backed lending and investment decisions.",
      retail: "Retail & E-commerce",
      retailDesc: "Personalized recommendation engines, churn predictors, and sales dashboards.",
      retailDetail: "We design personalized recommendation engines, customer churn prediction systems, and real-time sales forecasting dashboards. Drive conversions and understand buyer behavior using our custom data analytics models.",
      manufacturing: "Manufacturing",
      manufacturingDesc: "Predictive maintenance forecasting, quality assurance ML, and automated pipelines.",
      manufacturingDetail: "Optimize operations using predictive maintenance models that anticipate machine downtime, ML-driven visual quality inspection systems, and automated supply chain pipelines. Reduce overhead and eliminate bottlenecks.",
      logistics: "Logistics",
      logisticsDesc: "Route scheduling algorithms, demand forecasting, and inventory tracking.",
      logisticsDetail: "We build advanced route scheduling and optimization algorithms, automated demand forecasting tools, and warehouse inventory tracking systems. Improve delivery speeds and reduce fuel consumption.",
      realestate: "Real Estate",
      realestateDesc: "Market pricing models, automated document extraction, and valuation dashboards.",
      realestateDetail: "Leverage predictive valuation models to evaluate property pricing, OCR text extractors to process lease agreements automatically, and unified market trends dashboards for investors.",
      education: "Education",
      educationDesc: "Custom AI tutors, student behavior models, and administrative automations.",
      educationDetail: "We create personalized AI tutoring systems, student retention predictive models, and administrative workflow automations. Enable schools and e-learning platforms to scale education efficiently.",
      marketing: "Marketing",
      marketingDesc: "Sentiment analysis, campaign performance trackers, and customer segmentation.",
      marketingDetail: "Perform natural language sentiment analysis on social media campaigns, automate lead categorization, and execute customer segmentation algorithms to run highly targeted advertisements.",
      hr: "Human Resources",
      hrDesc: "CV parser automations, employee analytics, and organizational charts.",
      hrDetail: "Automate resume parsing and candidate matching with intelligent OCR + AI screeners, build employee performance dashboards, and optimize talent acquisition pipelines.",
      startups: "Startups & Enterprises",
      startupsDesc: "Rapid PoC development, scalable cloud MLOps infrastructure, and AI roadmaps.",
      startupsDetail: "Accelerate product market fit with rapid Proof of Concept (PoC) development, set up scalable MLOps infrastructure, and lay down your enterprise-wide AI and data governance roadmaps."
    }
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("language");
    return (saved as Language) || "en";
  });

  // Inject Google Translate script and anchor container
  useEffect(() => {
    // Sync cookie with saved language immediately on boot
    const savedLang = localStorage.getItem("language") || "en";
    const hostname = window.location.hostname;
    if (savedLang === "en") {
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${hostname}`;
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${hostname}`;
    } else {
      document.cookie = `googtrans=/en/${savedLang}; path=/`;
      document.cookie = `googtrans=/en/${savedLang}; path=/; domain=.${hostname}`;
      document.cookie = `googtrans=/en/${savedLang}; path=/; domain=${hostname}`;
    }

    if (!document.getElementById("google-translate-script")) {
      // Create hidden target element
      const translateDiv = document.createElement("div");
      translateDiv.id = "google_translate_element";
      translateDiv.style.display = "none";
      document.body.appendChild(translateDiv);

      // Create configuration script
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      document.body.appendChild(script);

      // Bind global callback
      (window as any).googleTranslateElementInit = () => {
        new (window as any).google.translate.TranslateElement({
          pageLanguage: "en",
          includedLanguages: "en,hi,bn,te,mr,ta,ur,gu,kn,ml,or,pa,as,mai,sa", // major languages including Indian languages
          layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false
        }, "google_translate_element");
      };
    }
  }, []);

  // Monitor language change and update the Google Translate combo element
  useEffect(() => {
    const triggerTranslation = () => {
      const selectEl = document.querySelector(".goog-te-combo") as HTMLSelectElement;
      if (selectEl) {
        selectEl.value = language;
        selectEl.dispatchEvent(new Event("change"));
        return true;
      }
      return false;
    };

    if (!triggerTranslation()) {
      const interval = setInterval(() => {
        if (triggerTranslation()) {
          clearInterval(interval);
        }
      }, 250);
      return () => clearInterval(interval);
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);

    // Write cookies to force Google Translate on reload
    const hostname = window.location.hostname;
    if (lang === "en") {
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${hostname}`;
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${hostname}`;
    } else {
      document.cookie = `googtrans=/en/${lang}; path=/`;
      document.cookie = `googtrans=/en/${lang}; path=/; domain=.${hostname}`;
      document.cookie = `googtrans=/en/${lang}; path=/; domain=${hostname}`;
    }

    // Reload the page to cleanly switch language translation
    window.location.reload();
  };

  const t = (key: string): string => {
    const keys = key.split(".");
    let current: any = enTranslations;

    for (const k of keys) {
      if (current[k] === undefined) {
        return key;
      }
      current = current[k];
    }

    return current;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
