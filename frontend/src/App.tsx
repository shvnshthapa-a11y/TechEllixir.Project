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
        <Route path="/resources" element={<Resources />} />
        <Route path="/resources/detail" element={<ResourceDetail />} />
        <Route path="/resources/:id" element={<ResourceDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/career" element={<Career/>}/>
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
