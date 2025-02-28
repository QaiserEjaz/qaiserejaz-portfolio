import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { GraduationCap, School, Calendar, MapPin } from "lucide-react";

const Education = () => {
  const educationData = [
    {
      level: 'University',
      animation: 'fade-right',
      name: 'Dawood University of Engineering and Technology',
      duration: '2019 - 2023',
      degree: 'Bachelor of Engineering (B.E) in Computer Systems Engineering',
      city: 'Karachi, Sindh, Pakistan',
    },
    {
      level: 'College',
      animation: 'fade-up',
      name: 'Government Delhi College',
      duration: '2017 - 2019',
      degree: 'Higher Secondary Certificate (HSC) in Pre-Engineering',
      city: 'Karachi, Sindh, Pakistan',
    },
    {
      level: 'School',
      animation: 'fade-left',
      name: 'Islamia English Model School',
      duration: '2004 - 2017',
      degree: 'Secondary School Certificate (SSC) in Science',
      city: 'Karachi, Sindh, Pakistan',
    },
  ];

  useEffect(() => {
    AOS.init({
      once: false,
      duration: 1000,
    });
  }, []);

  return (
    <div className="w-full px-2 sm:px-4 md:px-6 lg:container lg:mx-auto lg:p-6 relative overflow-hidden">
      {/* Responsive padding and container width */}
      <h2
        data-aos="fade-down"
        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-center mb-8 sm:mb-12"
      >
        {/* Responsive heading size */}
        Education History
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-7">
        {/* Responsive grid: 1 col on mobile, 2 on sm, 3 on lg+ */}
        {educationData.map((edu, index) => (
          <div
            key={index}
            data-aos={edu.animation}
            data-aos-delay={index * 100}
            className="relative group mb-6 sm:mb-8 h-full"
          >
            <div className="relative bg-gray-900/50 backdrop-blur-lg p-4 sm:p-6 rounded-xl border border-white/10 overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl group-hover:border-[#6366f1]/50 flex flex-col h-full">
              {/* Responsive padding */}
              <div className="absolute -z-10 inset-0 bg-gradient-to-br from-[#6366f1] to-[#a855f7] opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>

              {/* Institution Name and Icon */}
              <div
                className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4"
                data-aos="fade-up-left"
                data-aos-duration="1500"
                data-aos-anchor-placement="top-bottom"
              >
                <School className="w-5 h-5 sm:w-7 sm:h-7 text-[#6366f1] flex-shrink-0" />
                {/* Responsive icon size */}
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-[#6366f1]">{edu.name}</h3>
                {/* Responsive text size */}
              </div>

              {/* Content Wrapper */}
              <div className="space-y-4 sm:space-y-6 flex-grow">
                {/* Responsive spacing */}
                <div
                  className="flex items-center ps-1 gap-2 sm:gap-3.5"
                  data-aos="fade-up-right"
                  data-aos-duration="1500"
                  data-aos-anchor-placement="top-bottom"
                >
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm md:text-md text-gray-500">{edu.duration}</span>
                </div>

                <div
                  className="flex items-center ps-1 gap-2 sm:gap-3.5"
                  data-aos="fade-up-right"
                  data-aos-duration="2500"
                  data-aos-anchor-placement="top-bottom"
                >
                  <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300 flex-shrink-0" />
                  <div className="text-xs sm:text-sm md:text-md text-gray-300">{edu.degree}</div>
                </div>

                <div
                  className="flex items-center ps-1 gap-2 sm:gap-3.5"
                  data-aos="fade-up-right"
                  data-aos-duration="3000"
                  data-aos-anchor-placement="top-bottom"
                >
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300 flex-shrink-0" />
                  <span className="text-xs sm:text-sm md:text-md text-gray-300">{edu.city}</span>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 w-full h-0 bg-gradient-to-r from-[#6366f1] to-[#a855f7] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Education;