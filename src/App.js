import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Location from "./pages/Location";
import Translator from "./pages/Translator";
import QA from "./pages/QA";
import Footer from "./components/Footer";

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/location" element={<Location />} />
        <Route path="/translator" element={<Translator />} />
        <Route path="/qa" element={<QA />} />
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;
