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

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/career" element={<Career/>}/>
        <Route path="/admin" element={<Admin />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
