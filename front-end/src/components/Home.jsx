import "animate.css";
import { API_BASE } from "../utils/constants";

function Home({ personalData }) {
  const handleMouseEnter = (e) => {
    e.currentTarget.style.transform = "rotate(-10deg)";
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = "rotate(0deg)";
  };

  return (
    <section id="Home" className="pt-10 h-screen">
      <div className="mt-4 mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
          <div
            className="animate__animated animate__fadeInTopRight lg:order-last h-full flex items-center justify-center"
            style={{ animationDelay: "400ms" }}
          >
            <img
              alt=""
              src={`${API_BASE}${personalData?.ImgUrl}`}
              className="rounded-3xl w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl max-h-full object-contain transition-transform duration-300 ease-in-out"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              style={{ transform: "rotate(0deg)" }}
            />
          </div>

          <div
            className="animate__animated animate__lightSpeedInLeft lg:py-24"
            style={{ animationDelay: " 400ms" }}
          >
            <h2 className="text-xl sm:text-2xl font-bold text-[#8c2b7a]">
              Hi Everyone 👋🏻, I'm
            </h2>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#8c2b7a]">
              {personalData?.Name}
            </h2>
            <p className="mt-4 text-sm sm:text-base text-gray-600 text-justify">
              am a passionate and aspiring Junior Full Stack Developer who is
              still in the early stages of my journey. I am actively learning to
              build and maintain both frontend and backend systems, and
              continuously exploring new technologies to improve my skills and
              grow as a developer.
            </p>
            <span className="pt-4 pb-4 flex items-center">
              <span className="pr-6 text-[#8c2b7a]">
                Studying at Bina Nusantara University
              </span>
              <span className="garis h-px flex-1 bg-black"></span>
            </span>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              NIM : {personalData?.Nim} <br />
              Major : {personalData?.Major} <br />
              Faculty : {personalData?.Faculty}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home;
