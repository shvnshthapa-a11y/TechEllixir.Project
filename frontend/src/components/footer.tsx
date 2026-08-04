import { Mail, MapPin, Phone } from "lucide-react";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

const socialLinks = [
  [
    "Facebook",
    "https://www.facebook.com/share/1G7wLf1ava/",
    <FaFacebookF size={18} />,
  ],
  [
    "LinkedIn",
    "https://www.linkedin.com/company/101979344/admin/dashboard/",
    <FaLinkedinIn size={18} />,
  ],
  [
    "Instagram",
    "https://www.instagram.com/techellixir_official?igsh=MWFqYTh4OHJlenl2eg==",
    <FaInstagram size={18} />,
  ],
  [
    "YouTube",
    "https://youtube.com/@techellixir?si=CiEG8jfJLO3oaOCh",
    <FaYoutube size={18} />,
  ],
];

const Footer = () => {
  const { t } = useLanguage();

  const quickLinks = [
    [t("nav.home"), "/"],
    [t("about.eyebrow"), "/about"],
    [t("nav.services"), "/services"],
    [t("nav.career"), "/career"],
    [t("nav.contact"), "/contact"],
    ["Admin Portal", "/admin"],
  ];

  const servicesList = [
    t("services.categories.ai"),
    t("services.categories.analytics"),
    t("services.categories.science"),
    t("services.categories.ml"),
    t("services.categories.automation"),
  ];

  return (
    <footer className="bg-[#141A27] text-white border-t border-white/5">
      <div className="container-shell py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.35fr_0.75fr_0.85fr_1fr]">
          <div>
            <h2 className="text-3xl font-black tracking-tight">
              <span className="text-[#FF4D37]">Tech</span>Ellixir
            </h2>
            <p className="mt-6 max-w-sm leading-8 text-gray-300 text-sm">
              {t("footer.copy")}
            </p>
            <div className="mt-8 flex gap-3">
              {socialLinks.map(([label, url, icon]) => (
                <a
                  key={label as string}
                  href={url as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label as string}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/8 text-white transition hover:bg-[#FF4D37] cursor-pointer"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-6 text-lg font-black">{t("footer.quickLinks")}</h3>
            <ul className="space-y-4 text-gray-300 text-sm font-semibold">
              {quickLinks.map(([label, path]) => (
                <li key={path}>
                  <NavLink to={path} className="transition hover:text-[#FF7A45]">
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-lg font-black">{t("footer.services")}</h3>
            <ul className="space-y-4 text-gray-300 text-sm font-semibold">
              {servicesList.map((service) => (
                <li key={service}>{service}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-lg font-black">{t("footer.contact")}</h3>
            <div className="space-y-5 text-sm font-semibold">
              <div className="flex gap-3">
                <MapPin className="mt-1 flex-none text-[#FF7A45]" size={20} />
                <span className="text-gray-300">15th Floor, The Iconic Corenthum, Block A, Industrial Area, Sector 62, Noida, Uttar Pradesh 201301</span>
              </div>
              <div className="flex gap-3">
                <Phone className="flex-none text-[#FF7A45]" size={20} />
                <span className="text-gray-300">+91 99175 29504</span>
              </div>
              <div className="flex gap-3">
                <Mail className="flex-none text-[#FF7A45]" size={20} />
                <span className="text-gray-300">info@techellixir.com</span>
              </div>
              <div className="flex gap-3">
                <Mail className="flex-none text-[#FF7A45]" size={20} />
                <span className="text-gray-300">internship@techellixir.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-shell flex flex-col items-center justify-between gap-4 py-6 md:flex-row">
          <p className="text-center text-sm text-gray-400">
            Copyright {new Date().getFullYear()} TechEllixir. {t("footer.copyright")}
          </p>
          <p className="text-center text-sm text-gray-500">
            Built for reliable, human-centered digital products.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
