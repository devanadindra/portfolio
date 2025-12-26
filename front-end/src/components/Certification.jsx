import React, { useRef } from "react";
import { useEffect, useState } from 'react';
import ReactSwipe from "react-swipe";
import CertifWaveUP from "../waves/CertifWaveUP";
import { API_BASE } from "../utils/constants";
import ProjectWaveUP from "../waves/ProjectWaveUP";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

export function Certification() {
  const [certifData, setCertifData] = useState(null);
  const [error, setError] = useState(false);
  const reactSwipeEl = useRef(null);

  const sectionRef = useRef(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !fetchedRef.current) {
          fetchedRef.current = true;

          fetch(`${API_BASE}/certif/`)
            .then((res) => {
              if (!res.ok) throw new Error("Error");
              return res.json();
            })
            .then((res) => {
              setCertifData(res.data?.data ?? []);
            })
            .catch(() => setError(true));
        }
      },
      {
        threshold: 0.3,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);


  if (error) {
    return (
      <div className="text-center text-red-500">
        <h4
          className="font-bold uppercase text-white text-xl text-center md:text-2xl lg:text-4xl"
          data-aos="fade-down"
          data-aos-delay="500"
          data-aos-duration="800"
          data-aos-offset="500"
        >
          Certification
        </h4>
      </div>
    );
  }

  return (
    <section ref={sectionRef} className="min-h-screen">
      <CertifWaveUP />
      <div className="pb-10 bg-[#8c2b7a]">
        <div>
          <div className="flex flex-wrap">
            <div className="w-full">
              <h4
                className="font-bold uppercase text-white text-xl text-center md:text-2xl lg:text-4xl"
                data-aos="fade-down"
                data-aos-delay="500"
                data-aos-duration="800"
                data-aos-offset="500"
              >
                Certification
              </h4>
              {certifData && certifData.length > 0 && (
                <div className="relative">
                  <ReactSwipe
                    key={certifData.length}
                    className="carousel"
                    ref={reactSwipeEl}
                  >
                    {certifData?.map((certificate, index) => (
                      <div className="flex justify-center pt-10" key={index}>
                        {/* UKURAN GAMBAR: diubah dari w-[100%] ke w-[85%] agar lebih kecil di mobile */}
                        <div
                          className="w-[85%] sm:w-[70%] md:w-[70%] lg:w-[50%]"
                          data-aos="zoom-in"
                          data-aos-delay="500"
                          data-aos-duration="800"
                          data-aos-offset="300"
                        >
                          {certificate.certif_link ? (
                            <a
                              href={certificate.certif_link}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <img
                                className="certif_img w-full rounded-2xl bg-contain cursor-pointer hover:scale-105 transition-transform duration-300"
                                src={`${API_BASE}${certificate.img_url}`}
                                alt={certificate.name}
                              />
                            </a>
                          ) : (
                            <img
                              className="w-full rounded-2xl bg-contain cursor-default"
                              src={`${API_BASE}${certificate.img_url}`}
                              alt={certificate.name}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </ReactSwipe>

                  {/* Panah Kiri */}
                  <div
                    onClick={() => reactSwipeEl.current.prev()}
                    className="hidden md:flex absolute left-5 top-1/2 -translate-y-1/2 cursor-pointer w-14 h-14"
                  >
                    <FaArrowLeft className="text-white w-full h-full hover:scale-110 transition-transform" />
                  </div>

                  {/* Panah Kanan */}
                  <div
                    onClick={() => reactSwipeEl.current.next()}
                    className="hidden md:flex absolute right-5 top-1/2 -translate-y-1/2 cursor-pointer w-14 h-14"
                  >
                    <FaArrowRight className="text-white w-full h-full hover:scale-110 transition-transform" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ProjectWaveUP />
    </section>
  );
}
