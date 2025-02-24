import { useState, useEffect, useCallback, memo } from "react";
import PropTypes from 'prop-types';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Facebook, GitHub, LinkedIn, Instagram, AutoAwesomeOutlined, } from "@mui/icons-material";

// Memoized Components
const StatusBadge = memo(() => (
  <div className="mt-5 inline-block animate-float lg:mx-0" data-aos="zoom-in" data-aos-delay="400">
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-full blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
      <div className="relative px-3 sm:px-4 py-2 rounded-full bg-black/40 backdrop-blur-xl border border-white/10">
        <span className="bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-transparent bg-clip-text sm:text-sm text-[0.7rem] font-medium flex items-center">
          <AutoAwesomeOutlined className="sm:w-4 sm:h-4 w-3 h-3 mr-2 text-blue-400" />
          
          Ready to Innovate
        </span>
      </div>
    </div>
  </div>
));
StatusBadge.displayName = 'StatusBadge';

const MainTitle = memo(() => (
  <div className="space-y-2" data-aos="fade-up" data-aos-delay="600">
    <h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-5xl xl:text-6xl font-bold tracking-tight">
      <span className="relative inline-block">
        <span className="absolute -inset-2 bg-gradient-to-r from-[#6366f1] to-[#a855f7] blur-2xl opacity-20"></span>
        <span className="relative bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
          Full Stack
        </span>
      </span>
      <br />
      <span className="relative inline-block mt-2">
        <span className="absolute -inset-2 bg-gradient-to-r from-[#6366f1] to-[#a855f7] blur-2xl opacity-20"></span>
        <span className="relative bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">
          Developer
        </span>
      </span>
    </h1>
  </div>
));
MainTitle.displayName = 'MainTitle';

const TechStack = memo(({ tech }) => (
  <div className="px-4 py-2 hidden sm:block rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-xs text-gray-300 hover:bg-white/10 transition-colors">
    {tech}
  </div>
));
TechStack.displayName = 'TechStack';
TechStack.propTypes = {
  tech: PropTypes.string.isRequired,
};

// const CTAButton = memo(({ href, text, icon: Icon }) => (
//   <a href={href}>
//     <button className="group relative w-[160px]">
//       <div className="absolute -inset-0.5 bg-gradient-to-r from-[#4f52c9] to-[#8644c5] rounded-xl opacity-50 blur-md group-hover:opacity-90 transition-all duration-700"></div>
//       <div className="relative h-11 bg-[#030014] backdrop-blur-xl rounded-lg border border-white/10 leading-none overflow-hidden">
//         <div className="absolute inset-0 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 bg-gradient-to-r from-[#4f52c9]/20 to-[#8644c5]/20"></div>
//         <span className="absolute inset-0 flex items-center justify-center gap-2 text-xs group-hover:gap-3 transition-all duration-300">
//           <span className="bg-gradient-to-r from-gray-200 to-white bg-clip-text text-transparent font-medium z-10">
//             {text}
//           </span>
//           <Icon className={`w-4 h-4 text-gray-200 ${text === 'Contact' ? 'group-hover:translate-x-1' : 'group-hover:rotate-45'} transform transition-all duration-300 z-10`} />
//         </span>
//       </div>
//     </button>
//   </a>
// ));
// CTAButton.displayName = 'CTAButton';
// CTAButton.propTypes = {
//   href: PropTypes.string.isRequired,
//   text: PropTypes.string.isRequired,
//   icon: PropTypes.elementType.isRequired,
// };

const SocialLink = memo(({ icon: Icon, link }) => (
  <a href={link} target="_blank" rel="noopener noreferrer">
    <button id="social-button" className="group relative p-3">
      <div className="absolute inset-0 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
      <div className="relative rounded-xl bg-black/50 backdrop-blur-xl p-2 flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-all duration-300">
        <Icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
      </div>
    </button>
  </a>
));
SocialLink.displayName = 'SocialLink';
SocialLink.propTypes = {
  icon: PropTypes.elementType.isRequired,
  link: PropTypes.string.isRequired,
};

// Constants
const TYPING_SPEED = 100;
const ERASING_SPEED = 50;
const PAUSE_DURATION = 2000;
const WORDS = ["Computer Systems Engineer", "Tech Enthusiast"];
const TECH_STACK = ["Javascript", "React", "Node.js", "Tailwind", "Bootstrap", "MongoDB", "Express.js", "Git", "REST API", "Firebase", "Vercel"];
const SOCIAL_LINKS = [
  { icon: GitHub, link: "https://github.com/QaiserEjaz" },
  { icon: LinkedIn, link: "https://www.linkedin.com/in/qaiserejaz1/" },
  { icon: Instagram, link: "https://www.instagram.com/qaiser_ejaz1/?hl=id" },
  // { icon: Mail, link: "mailto:qaiserejaz125@gmail.com" },
  { icon: Facebook, link: "https://www.facebook.com/qaiser.ejaz.18" },

];

const Home = () => {
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Optimize AOS initialization
  useEffect(() => {
    const initAOS = () => {
      AOS.init({ once: true, offset: 10,});
    };

    initAOS();
    window.addEventListener('resize', initAOS);
    return () => window.removeEventListener('resize', initAOS);
  }, []);

  useEffect(() => {
    setIsLoaded(true);
    return () => setIsLoaded(false);
  }, []);

  // Optimize typing effect
  const handleTyping = useCallback(() => {
    if (isTyping) {
      if (charIndex < WORDS[wordIndex].length) {
        setText(prev => prev + WORDS[wordIndex][charIndex]);
        setCharIndex(prev => prev + 1);
      } else {
        setTimeout(() => setIsTyping(false), PAUSE_DURATION);
      }
    } else {
      if (charIndex > 0) {
        setText(prev => prev.slice(0, -1));
        setCharIndex(prev => prev - 1);
      } else {
        setWordIndex(prev => (prev + 1) % WORDS.length);
        setIsTyping(true);
      }
    }
  }, [charIndex, isTyping, wordIndex]);

  useEffect(() => {
    const timeout = setTimeout(
      handleTyping,
      isTyping ? TYPING_SPEED : ERASING_SPEED
    );
    return () => clearTimeout(timeout);
  }, [handleTyping, isTyping]);

  // Lottie configuration
  const lottieOptions = {
    // src: "https://lottie.host/58753882-bb6a-49f5-a2c0-950eda1e135a/NLbpVqGegK.lottie",
    // src:"/Coding.json",
    src:"/Coding4.lottie",
    // src :"https://lottie.host/314f2f76-1eee-4e9c-8a4a-9c533fe7568e/y5BCzVhs1I.lottie",
    // src:"https://lottie.host/f694b36f-85d3-4714-8552-59871431c8e8/29mWnfzAk9.lottie",
    // src:"https://lottie.host/628ba23e-5ce5-40c9-8e8c-3e3e4c9a07f5/iVSLArzs25.lottie",
    // src:"https://lottie.host/039341ab-3be5-4372-bd57-a9051e3d257e/nbLzHoiZ0r.lottie",
    loop: true,
    autoplay: true,
    style: { width: "100%", height: "100%" },
    className: `w-full h-full transition-all duration-500 ${isHovering
      ? "scale-[180%] sm:scale-[160%] lg:scale-[175%] xl:scale-[180%] 2xl:scale-[135%] rotate-1"
      : "scale-[175%] sm:scale-[155%] lg:scale-[170%] xl:scale-[175%] 2xl:scale-[130%] rotate-0"
      }`
  };

  return (
    <div className="min-h-screen bg-[#030014] overflow-hidden" id="Home">
      <div className={`relative z-10 transition-all duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
        <div className="container mx-auto px-[5%]  sm:px-6 md:px-[5%] lg:px-[9%] xl:px-[4%] 2xl:px-[8%] min-h-screen">
          <div className="flex flex-col lg:flex-row items-center justify-center h-screen md:justify-between gap-0 sm:gap-12 lg:gap-20">
            {/* Left Column */}
            <div className="w-full lg:w-1/2 space-y-6 sm:space-y-8 text-left lg:text-left order-1 lg:order-1 lg:mt-0"
              data-aos="fade-right"
              data-aos-delay="200">
              <div className="space-y-4 sm:space-y-6 ">
                <StatusBadge />
                <MainTitle />

                {/* Typing Effect */}
                <div className="h-3 flex items-center" data-aos="fade-up" data-aos-delay="800">
                  <span className="text-lg md:text-xl bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent font-light">
                    {text}
                  </span>
                  <span className="w-[3px] h-6 bg-gradient-to-t from-[#6366f1] to-[#a855f7] ml-1 animate-blink"></span>
                </div>

                {/* Description */}
                <p className="text-sm md:text-base text-gray-400 max-w-xl leading-relaxed font-light"
                  data-aos="fade-up"
                  data-aos-delay="1000">
                  Creating Innovative, Functional, and User-Friendly Websites for Digital Solutions.
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-3 justify-start" data-aos="fade-up" data-aos-delay="1200">
                  {TECH_STACK.map((tech, index) => (
                    <TechStack key={index} tech={tech} />
                  ))}
                </div>

                {/* Social Links */}
                <div className="hidden sm:flex gap-4 justify-start" data-aos="fade-up" data-aos-delay="1600">
                  {SOCIAL_LINKS.map((social, index) => (
                    <SocialLink key={index} {...social} />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Optimized Lottie Animation */}
            <div className="w-full py-[10%] sm:py-0 lg:w-1/2 h-auto lg:h-[600px] xl:h-[750px] relative flex flex-col items-center justify-center order-2 lg:order-2 mt-8 lg:mt-0 px-4 sm:px-6 lg:px-8"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              data-aos="fade-left"
              data-aos-delay="600">
              <div className="relative w-full opacity-90">
                <div className={`absolute inset-0 bg-gradient-to-r from-[#6366f1]/10 to-[#a855f7]/10 rounded-3xl blur-3xl transition-all duration-700 ease-in-out ${isHovering ? "opacity-50 scale-105" : "opacity-20 scale-100"
                  }`}>
                </div>

                <div className={`relative z-10 w-full opacity-90 transform transition-transform duration-500 ${isHovering ? "scale-105" : "scale-100"
                  }`}>
                  <DotLottieReact {...lottieOptions} />
                </div>

                <div className={`absolute inset-0 pointer-events-none transition-all duration-700 ${isHovering ? "opacity-50" : "opacity-20"
                  }`}>
                  <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-indigo-500/10 to-purple-500/10 blur-3xl animate-[pulse_6s_cubic-bezier(0.4,0,0.6,1)_infinite] transition-all duration-700 ${isHovering ? "scale-110" : "scale-100"
                    }`}>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              {/* <div className="absolute bottom-24 right-0 flex m-5 flex-row gap-3 w-full justify-center mt-4"
                data-aos="fade-up" data-aos-delay="1400">
                <CTAButton href="#Portofolio" text="Projects" icon={ExternalLink} />
                <CTAButton href="#Contact" text="Contact" icon={Mail} />
              </div> */}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Home);

