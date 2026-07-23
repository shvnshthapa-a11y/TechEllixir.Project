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
  
      </Routes>

      <Footer />
    </>
  );
}

export default App;
