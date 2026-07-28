import { Routes, Route } from "react-router-dom";

import Navbar from "./components/nav";
import Footer from "./components/footer";

import Home from "./pages/home";
import About from "./pages/about";
import Services from "./pages/services";
import Resources from "./pages/resources";
import Contact from "./pages/contact";
import Career from "./pages/career";
import Admin from "./pages/admin";
import Auth from "./pages/auth";
import Profile from "./pages/profile";
import ServiceDetail from "./pages/service-detail";
import ResourceDetail from "./pages/resource-detail";
import BlogDetail from "./pages/blog-detail";
import ApplyInternship from "./pages/apply-internship";
import IndustryDetail from "./pages/industry-detail";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/detail" element={<ServiceDetail />} />
        <Route path="/services/:id" element={<ServiceDetail />} />
        <Route path="/industry/:slug" element={<IndustryDetail />} />
        <Route path="/industries/:slug" element={<IndustryDetail />} />
        <Route path="/industry" element={<IndustryDetail />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/resources/detail" element={<ResourceDetail />} />
        <Route path="/resources/:id" element={<ResourceDetail />} />
        <Route path="/blogs/:id" element={<BlogDetail />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/news/:id" element={<ResourceDetail />} />
        <Route path="/events/:id" element={<ResourceDetail />} />
        <Route path="/event/:id" element={<ResourceDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/career" element={<Career/>}/>
        <Route path="/register-internship" element={<ApplyInternship />} />
        <Route path="/apply-internship" element={<ApplyInternship />} />
        <Route path="/career/apply" element={<ApplyInternship />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
