import { useEffect, useState } from 'react';
import React, { useRef } from "react";
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import { Certification } from './components/Certification';
import ContactForm from "./components/ContactForm"
import Footer from './components/Footer';
import './style/index.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { API_BASE } from "./utils/constants";


function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [personalData, setPersonalData] = useState(null);

  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    fetch(`${API_BASE}/user/about`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Not Found");
        }
        return res.json();
      })
      .then((data) => {
        setPersonalData(data.data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
    });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-[#8c2b7a]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        <p>Not Found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden m-0 p-0">
      <Navbar />
      <Home personalData={personalData} />
      <About personalData={personalData} />
      <Certification />
      <ContactForm />
      <Footer />
    </div>
  );
}

export default App;
