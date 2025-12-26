import React, { useRef } from "react";
import { useEffect, useState } from 'react';
import ReactSwipe from "react-swipe";
import { API_BASE } from "../utils/constants";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

export function Project() {
  const [projectData, setProjectData] = useState(null);
  const [error, setError] = useState(false);
  const reactSwipeEl = useRef(null);

  const sectionRef = useRef(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !fetchedRef.current) {
          fetchedRef.current = true;

          fetch(`${API_BASE}/project/all`)
            .then((res) => {
              if (!res.ok) throw new Error("Error");
              return res.json();
            })
            .then((res) => {
              setProjectData(res.data?.data ?? []);
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
        <h4 className="font-bold text-[#8c2b7a] text-xl top-10 text-center md:text-2xl lg:text-4xl aos-init" data-aos="fade-down" data-aos-delay="300" data-aos-duration="600" data-aos-offset="300">My Projects</h4>
        <p>Failed to load projects. Please try again later.</p>
      </div>
    );
  }

  return (
    <section ref={sectionRef} id="projects" className="relative min-h-screen">
      <div className="pb-10">
        <div>
          <div className="flex flex-wrap">
            <div className="w-full">
              <h4 className="font-bold text-[#8c2b7a] text-xl top-10 text-center md:text-2xl lg:text-4xl aos-init" data-aos="fade-down" data-aos-delay="300" data-aos-duration="600" data-aos-offset="300">My Projects</h4>
              {projectData && projectData.length > 0 && (
                <>
                  <ReactSwipe
                    key={projectData.length}
                    className="carousel"
                    ref={reactSwipeEl}
                  >
                    {projectData?.map((certificate, index) => (
                      <div className="flex justify-center pt-10" key={index}>
                        <div
                          className="lg:w-[50%] w-[100%] md:w-[70%] sm:w-[70%] xs:w-[70%]"
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
                                className="certif_img rounded-2xl bg-contain cursor-pointer hover:scale-105 transition-transform duration-300"
                                src={`${API_BASE}${certificate.img_url}`}
                                alt={certificate.name}
                              />
                            </a>
                          ) : (
                            <img
                              className="rounded-2xl bg-contain cursor-default"
                              src={`${API_BASE}${certificate.img_url}`}
                              alt={certificate.name}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </ReactSwipe>
                  <div className="relative">
                    <div
                      onClick={() => reactSwipeEl.current.prev()}
                      className="lg:mt-20 lg:ml-[150px] md:mt-[75px] md:ml-[50px] sm:mt-[1px] sm:ml-[35px] xs:mt-[10px] xs:ml-[20px] inline-block w-8 h-8 lg:w-14 lg:h-14 absolute cursor-pointer -top-44 left-2 md:left-5 md:-top-80 lg:top-[-26rem] lg:left-10"
                      data-aos="fade-right"
                      data-aos-delay="800"
                      data-aos-duration="800"
                    >
                      <FaArrowLeft className="text-white w-full h-full" />
                    </div>
                    <div
                      onClick={() => reactSwipeEl.current.next()}
                      className="lg:mt-20 lg:mr-[150px] md:mt-[75px] md:mr-[50px] sm:mt-[1px] sm:mr-[35px] xs:mt-[5px] xs:mr-[20px] inline-block w-8 h-8 lg:w-14 lg:h-14 absolute cursor-pointer -top-44 right-2 md:right-5 md:-top-80 lg:top-[-26rem] lg:right-10"
                      data-aos="fade-left"
                      data-aos-delay="800"
                      data-aos-duration="1000"
                    >
                      <FaArrowRight className="text-white w-full h-full" />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
