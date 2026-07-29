import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useLanguage } from "../context/LanguageContext";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const testimonialsEn = [
  {
    name: "Rahul Sharma",
    company: "ABC Technologies",
    rating: 5,
    review:
      "TechEllixir delivered an outstanding website that exceeded our expectations. Their team was professional, responsive and delivered everything on time.",
  },
  {
    name: "Priya Verma",
    company: "Innovate Solutions",
    rating: 5,
    review:
      "The team was responsive, creative, and delivered our mobile application on time. The experience was smooth from start to finish.",
  },
  {
    name: "David Wilson",
    company: "Global IT",
    rating: 5,
    review:
      "Excellent support and high-quality software development. Highly recommended for startups and enterprises.",
  },
  {
    name: "Anjali Gupta",
    company: "NextGen",
    rating: 5,
    review:
      "Professional team with excellent communication and beautiful UI designs. We loved working with them.",
  },
  {
    name: "Amit Kumar",
    company: "Digital World",
    rating: 5,
    review:
      "Outstanding service from planning to deployment. Great experience and excellent technical support.",
  },
  {
    name: "Sneha Patel",
    company: "TechHub",
    rating: 5,
    review:
      "Amazing developers and excellent post-launch support. We will definitely work together again.",
  },
];

export default function Testimonials() {
  const { t } = useLanguage();
  const [dynamicTestimonials, setDynamicTestimonials] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/testimonials")
      .then((res) => res.json())
      .then((data) => {
        if (data.items && Array.isArray(data.items) && data.items.length > 0) {
          setDynamicTestimonials(data.items);
        }
      })
      .catch((err) => console.warn("Backend testimonials fetch fallback to static list:", err));
  }, []);

  const testimonials = dynamicTestimonials.length > 0 ? dynamicTestimonials : testimonialsEn;

  return (
    <section className="section-shell bg-[#f8fafc] dark:bg-[#0d111a] transition-colors duration-300">
      <div className="container-shell">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 80, damping: 15 }}
          viewport={{ once: true }}
          className="mx-auto mb-14 max-w-3xl text-center"
        >
          <p className="eyebrow justify-center">{t("testimonials.eyebrow")}</p>

          <h2 className="section-title mt-4 text-3xl md:text-4xl">
            {t("testimonials.title")}
          </h2>

          <p className="section-copy mt-5">
            {t("testimonials.copy")}
          </p>
        </motion.div>

        <Swiper
          modules={[ Pagination, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
          }}
          loop
          spaceBetween={30}
          breakpoints={{
            320: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1200: {
              slidesPerView: 3,
            },
          }}
        >
          {testimonials.map((item) => (
            <SwiperSlide key={item.name}>
              <motion.div
                whileHover={{
                  y: -8,
                  scale: 1.02
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20
                }}
                className="rounded-lg border border-gray-200 dark:border-slate-800 bg-white p-7 shadow-md transition-shadow transition-colors duration-300 hover:shadow-xl cursor-grab active:cursor-grabbing"
              >
                {/* Top */}
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-gray-300 dark:border-slate-700 bg-gradient-to-br from-[#FF4D37] to-[#FF8A3D] text-2xl font-bold text-white shrink-0">
                    {item.name.charAt(0)}
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-[#182033] dark:text-white">
                      {item.name}
                    </h3>

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {item.company}
                    </p>

                    <div className="mt-2 flex gap-1">
                      {[...Array(Number(item.rating || 5))].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className="fill-[#ff5b3d] text-[#ff5b3d]"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Review */}
                <p className="mt-6 text-[15px] leading-8 text-gray-600 line-clamp-3">
                  {item.review}
                </p>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}