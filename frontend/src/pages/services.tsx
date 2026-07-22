import Services from "../components/services";
import Process from "../components/process";
import WhyChooseUs from "../components/whychoseus";
import Testimonials from "../components/testimonial";
import Contact from "../components/contact";
import AiDataServices from "../components/aiDataServices";
const OurServices = () => {
  return (
    <main className="pt-16">
      <Services />
      <AiDataServices />
      <Process />
      <WhyChooseUs />
      <Testimonials />
      <Contact />
    </main>
  );
};

export default OurServices;
