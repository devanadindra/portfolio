import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import { Certification } from './components/Certification';
import ContactForm from "./components/ContactForm"
import Footer from './components/Footer';
import './style/index.css';
import AOS from 'aos';
import 'aos/dist/aos.css';


function App() {
  const [loading, setLoading] = useState(true); // Status loading untuk spinner
  const [error, setError] = useState(false); // Status error untuk koneksi
  const [personalData, setPersonalData] = useState(null); // State untuk data personal

  useEffect(() => {
    // Mencoba untuk terhubung ke API
    fetch("https://backend-porto-production.up.railway.app/api/personal")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Not Found"); // Jika response tidak ok, throw error
        }
        return res.json(); // Jika berhasil, lanjutkan ke data JSON (meskipun kita tidak mengambil data)
      })
      .then((data) => {
        setPersonalData(data); // Set personalData jika berhasil
        setLoading(false); // Set loading false jika berhasil
      })
      .catch(() => {
        setError(true); // Jika terjadi error, set error true
        setLoading(false); // Set loading false setelah error
      });
          AOS.init({
            duration: 1000,
            easing: 'ease-in-out',
          });
  }, []);

  if (loading) {
    // Menampilkan spinner selama loading
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-[#8c2b7a]"></div>
      </div>
    );
  }

  if (error) {
    // Menampilkan pesan error jika API tidak ditemukan
    return (
      <div className="text-center text-red-500">
        <p>Not Found</p>
      </div>
    );
  }

  return (
    <div className="m-0 p-0">
      <Navbar />
      {/* Mengirimkan personalData ke komponen Home sebagai prop */}
      <Home personalData={personalData} />
      <About personalData={personalData} />
      <Certification personalData={personalData}/>
      <ContactForm />
      <Footer />
    </div>
  );
}

export default App;
