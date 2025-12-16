import { useEffect, useState } from "react";
import { FaGithub, FaLinkedin, FaInstagram, FaEnvelope } from "react-icons/fa";
import { API_BASE } from "../utils/constants";

export function About({ personalData }) {
  const [isLargeScreen, setIsLargeScreen] = useState(true);
  const educationSteps = [
    { label: "SD Al Furqan Jember", date: "2011 - 2017", status: "completed" },
    { label: "MTS Negeri Madiun", date: "2017 - 2020", status: "completed" },
    { label: "SMK negeri 1 Madiun", date: "2020 - 2023", status: "completed" },
    {
      label: "Bina Nusantara University",
      date: "2023 - Present",
      status: "in-progress",
    },
  ];
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 700) {
        setIsLargeScreen(true);
      } else {
        setIsLargeScreen(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    // Clean up event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section
      id="About"
      className="pt-4 About-container h-screen mx-auto max-w-screen-xl"
    >
      <div className="max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="flex flex-col md:flex-row gap-[200px]">
          {/* About Me */}
          <div className="md:w-1/2">
            <h2
              className="text-3xl font-bold sm:text-4xl text-[#8c2b7a]"
              data-aos="fade-down-right"
              data-aos-delay="600"
              data-aos-duration="800"
              data-aos-offset="100"
            >
              About Me 📌
            </h2>
            <p
              className="mt-4 text-gray-600 text-justify"
              data-aos="fade-right"
              data-aos-delay="800"
              data-aos-duration="800"
            >
              {personalData?.Biography}
            </p>
          </div>

          {/* Stay Connect */}
          <div className="md:w-1/2">
            <h2
              className="text-3xl font-bold sm:text-4xl text-[#8c2b7a]"
              data-aos="fade-down-left"
              data-aos-delay="600"
              data-aos-duration="800"
              data-aos-offset="100"
            >
              Stay Connect
            </h2>
            <p
              className="mt-4 text-gray-600 text-justify"
              data-aos="fade-left"
              data-aos-delay="800"
              data-aos-duration="800"
            >
              Join me on social media to explore the exciting world of fullstack
              development, from crafting seamless user experiences on the
              frontend to building robust backend systems. Let’s connect and
              share knowledge to grow and inspire each other in this
              ever-evolving tech landscape.
            </p>

            {/* Social media icons */}
            <div
              className="flex gap-4 mt-6 text-3xl text-[#8c2b7a]"
              data-aos="fade-up"
              data-aos-delay="1000"
              data-aos-duration="800"
            >
              <a
                href="https://github.com/devanadindra"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub />
              </a>
              <a
                href="https://www.linkedin.com/in/deva-nadindra-pramudya-2a6b202b8/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedin />
              </a>
              <a
                href="https://instagram.com/devanadindra_"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram />
              </a>
              <a href="mailto:devanadindra.p@gmail.com">
                <FaEnvelope />
              </a>
            </div>
          </div>
        </div>
        <span
          className="flex items-center"
          data-aos="zoom-in"
          data-aos-delay="600"
          data-aos-duration="800"
          data-aos-offset="100"
        >
          <span className="h-px flex-1 bg-gray-300 mt-[60px]"></span>
        </span>
        <div className="p-6 mt-6 rounded-lg">
          <h2
            className="text-3xl font-bold sm:text-4xl text-[#8c2b7a] text-center mb-[50px]"
            data-aos="zoom-in"
            data-aos-delay="600"
            data-aos-duration="800"
            data-aos-offset="100"
          >
            Education Timeline 🎓
          </h2>
          {isLargeScreen ? (
            <div
              className="flex justify-between items-center relative"
              data-aos="zoom-in"
              data-aos-delay="600"
              data-aos-duration="800"
              data-aos-offset="100"
            >
              {educationSteps.map((step, index) => (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center text-center relative"
                >
                  {/* Line between steps */}
                  {educationSteps.length > 1 && (
                    <>
                      {/* Right line */}
                      {index !== educationSteps.length - 1 && (
                        <div
                          className={`absolute top-4 left-[50%] w-[100%] h-1 z-0 ${
                            educationSteps[index + 1]?.status === "completed"
                              ? "bg-[#8c2b7a]"
                              : "bg-yellow-400"
                          }`}
                        />
                      )}
                    </>
                  )}
                  {/* Circle step indicator */}
                  <div
                    className={`w-8 h-8 rounded-full z-10 flex items-center justify-center ${
                      step.status === "completed"
                        ? "bg-[#8c2b7a] text-white"
                        : step.status === "in-progress"
                        ? "bg-yellow-400 text-black"
                        : "bg-gray-300 text-white"
                    }`}
                  >
                    {step.status === "completed" ? (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : step.status === "in-progress" ? (
                      <svg
                        className="w-4 h-4 animate-spin"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        />
                      </svg>
                    ) : null}
                  </div>

                  {/* Text info */}
                  <p
                    className={`mt-2 text-sm ${
                      step.status === "completed"
                        ? "text-white"
                        : "text-gray-500"
                    }`}
                  >
                    {step.label}
                    <br />
                    <span className="text-xs">{step.date}</span>
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="flex flex-col relative gap-3 ml-[50px]"
              data-aos="zoom-in"
              data-aos-delay="600"
              data-aos-duration="800"
              data-aos-offset="100"
            >
              {educationSteps.map((step, index) => (
                <div
                  key={index}
                  className="flex text-start relative mb-4 sm:mb-0 gap-5"
                >
                  {/* Line between steps (vertical) */}
                  {educationSteps.length > 1 && (
                    <>
                      {/* Bottom line */}
                      {index !== educationSteps.length - 1 && (
                        <div
                          className={`absolute left-[14px] top-[60%] w-1 h-[100%] z-0 ${
                            educationSteps[index + 1]?.status === "completed"
                              ? "bg-[#8c2b7a]"
                              : "bg-yellow-400"
                          }`}
                        />
                      )}
                    </>
                  )}
                  {/* Circle step indicator */}
                  <div
                    className={`w-8 h-8 rounded-full z-10 flex items-center justify-center ${
                      step.status === "completed"
                        ? "bg-[#8c2b7a] text-white"
                        : step.status === "in-progress"
                        ? "bg-yellow-400 text-black"
                        : "bg-gray-300 text-white"
                    }`}
                  >
                    {step.status === "completed" ? (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : step.status === "in-progress" ? (
                      <svg
                        className="w-4 h-4 animate-spin"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        />
                      </svg>
                    ) : null}
                  </div>

                  {/* Text info */}
                  <p
                    className={`mt-2 text-sm max-w-[200px] break-words ${
                      step.status === "completed"
                        ? "text-white"
                        : "text-gray-500"
                    }`}
                  >
                    {step.label}
                    <br />
                    <span className="text-xs">{step.date}</span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
        <span className="flex items-center"
                    data-aos="zoom-in"
                    data-aos-delay="600"
                    data-aos-duration="800"
                    data-aos-offset="100">
          <span className="h-px flex-1 bg-gray-300 mt-[60px]"></span>
        </span>
        <h2
          className="text-3xl font-bold sm:text-4xl text-[#8c2b7a] mt-[100px] text-center"
          data-aos="fade-down-right"
          data-aos-delay="600"
          data-aos-duration="800"
          data-aos-offset="100"
        >
          Skills 🛠️
        </h2>
        <div
          className="mt-8"
          data-aos="zoom-in"
          data-aos-delay="1000"
          data-aos-duration="800"
        >
          <div className="skill-set__flex">
            {personalData?.Skills?.map((skill, idx) => (
              <ul className="skill-set__list" key={idx}>
                <li className="skill-set__item">
                  <div className="skill-set__icon">
                    <img
                      src={`${API_BASE}${skill.ImgUrl}`}
                      alt={skill.Name}
                    />
                  </div>
                  <div className="skill-set__detail">
                    <div className="skill-set__meta">
                      <div className="skill-set__name">
                        <h4 className="small-title small-title--skill">
                          {skill.Name}
                        </h4>
                        <p className="skill-set__year">
                          {skill.Experience}
                          {skill.Period}
                        </p>
                      </div>
                      <p className="small-title small-title--skill skill-set__high">
                        {skill.Ratio}
                        <span className="skill-set__ratio">%</span>
                      </p>
                    </div>
                    <div
                      className={`skill-set__bar p${skill.Ratio} js-scroll`}
                    ></div>
                  </div>
                </li>
              </ul>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
