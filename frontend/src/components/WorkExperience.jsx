import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Briefcase, Calendar, MapPin, Building } from "lucide-react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import {
  SiJavascript,
  SiReact,
  SiReactrouter,
  SiBootstrap,
  SiTailwindcss,
  SiAxios,
  SiPostman,
  SiFirebase,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiHtml5,
  SiCss3,
  SiVercel,
  SiNetlify,
  SiGit,
  SiGithub,
} from "react-icons/si";
import { FaNetworkWired, FaTools } from "react-icons/fa";
import { RiCalendarEventLine } from "react-icons/ri";

const techIcons = {
  JavaScript: <SiJavascript className="w-5 h-5 text-yellow-400" title="JavaScript" />,
  "React js": <SiReact className="w-5 h-5 text-blue-400" title="React js" />,
  "React Router": <SiReactrouter className="w-5 h-5 text-pink-600" title="React Router" />,
  "Context API": <SiReact className="w-5 h-5 text-blue-400" title="Context API" />,
  Bootstrap: <SiBootstrap className="w-5 h-5 text-purple-500" title="Bootstrap" />,
  Tailwind: <SiTailwindcss className="w-5 h-5 text-blue-400" title="Tailwind CSS" />,
  "React Date Picker": <RiCalendarEventLine className="w-5 h-5 text-orange-400" title="React Date Picker" />,
  Axios: <SiAxios className="w-5 h-5 text-indigo-400" title="Axios" />,
  Postman: <SiPostman className="w-5 h-5 text-orange-500" title="Postman" />,
  "Firebase Realtime Database": <SiFirebase className="w-5 h-5 text-yellow-500" title="Firebase Realtime Database" />,
  "REST APIs": <SiReact className="w-5 h-5 text-green-400" title="REST APIs" />,
  "Node.js": <SiNodedotjs className="w-5 h-5 text-green-600" title="Node.js" />,
  "Express.js": <SiExpress className="w-5 h-5 text-gray-400" title="Express.js" />,
  Networking: <FaNetworkWired className="w-5 h-5 text-gray-400" title="Networking" />,
  "IT Support": <FaTools className="w-5 h-5 text-gray-500" title="IT Support" />,
  Troubleshooting: <FaTools className="w-5 h-5 text-gray-600" title="Troubleshooting" />,
  MongoDB: <SiMongodb className="w-5 h-5 text-green-500" title="MongoDB" />,
  "Firebase Authentication": <SiFirebase className="w-5 h-5 text-yellow-500" title="Firebase Authentication" />,
  HTML: <SiHtml5 className="w-5 h-5 text-orange-500" title="HTML" />,
  CSS: <SiCss3 className="w-5 h-5 text-blue-500" title="CSS" />,
  "Tailwind CSS": <SiTailwindcss className="w-5 h-5 text-blue-400" title="Tailwind CSS" />,
  Vercel: <SiVercel className="w-5 h-5 text-black" title="Vercel" />,
  Netlify: <SiNetlify className="w-5 h-5 text-blue-400" title="Netlify" />,
  Git: <SiGit className="w-5 h-5 text-red-500" title="Git" />,
  GitHub: <SiGithub className="w-5 h-5 text-gray-800" title="GitHub" />,
};

const WorkExperience = () => {
  const [certificateUrl, setCertificateUrl] = useState(null);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);

  const workData = [
    {
      position: "Junior Web Developer",
      company: "GENZ CRAFTERS, KARACHI",
      duration: "OCT 24 - PRESENT",
      description: "Developed frontend applications in React, focusing on user experience and responsive design. Integrated REST APIs to enhance web functionality and streamline data handling across the application.",
      project: "Fix-Ot",
      projectDescription: "Developed core features using React for a platform that connects users with domestic workers across various services, including cleaning, plumbing, electrical work, carpentry, and painting. Integrated REST APIs and Firebase Realtime Database for real-time data handling, enhancing service accessibility and user engagement.",
      tech: ["JavaScript", "React js", "React Router", "Context API", "Bootstrap", "Tailwind", "React Date Picker", "Axios", "Postman", "Firebase Realtime Database", "REST APIs", "Node.js", "Express.js"],
      location: "Remote",
      hasCertificate: false,
    },
    {
      position: "Web Developer Intern (Frontend)",
      company: "GENZ CRAFTERS, KARACHI",
      duration: "JUL 24 - SEP 24",
      description: "Assisted in developing and optimizing user interfaces for web applications, ensuring a smooth user experience. Focused on seamless UI interactions and responsive design implementation.",
      project: "WashersHub Web Portal",
      projectDescription: "Developed and optimized the user interface for a booking platform focused on scheduling washing services, including car washes and similar services. Prioritized seamless user interactions and efficient data retrieval for a smooth booking experience.",
      tech: ["JavaScript", "React js", "React Router", "Context API", "Bootstrap", "React Date Picker", "Axios", "Postman"],
      location: "Remote",
      hasCertificate: true,
    },
    {
      position: "Freelance Web Developer",
      company: "Self-Employed",
      duration: "Jan 24 - Present",
      description: "Worked on various freelance projects, building websites and web applications for clients.",
      tech: ["JavaScript", "React js", "Bootstrap", "Node.js", "Express.js", "MongoDB", "REST APIs", "Firebase Realtime Database", "Firebase Authentication", "HTML", "CSS", "Tailwind CSS", "Bootstrap", "Vercel", "Netlify", "Git", "GitHub", "Postman"],
      location: "Remote",
      hasCertificate: false,
    },
    {
      position: "IT and Network Intern",
      company: "ARTISTIC MILLINERS, KARACHI",
      duration: "SEP 23 - DEC 23",
      description: "Collaborated with the IT team to troubleshoot and resolve hardware and software issues for end-users. Assisted in the installation and configuration of networking equipment, including routers and switches.",
      tech: ["Networking", "IT Support", "Troubleshooting"],
      location: "Karachi, Pakistan",
      hasCertificate: true,
    },
  ];

  const fetchCertificate = async (position) => {
    try {
      console.log("Fetching certificate for position:", position);
      const q = query(collection(db, "internshipCertificates"), where("position", "==", position));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const certificateData = querySnapshot.docs[0].data();
        console.log("Certificate URL:", certificateData.Img);
        setCertificateUrl(certificateData.Img);
        setIsCertificateModalOpen(true);
      } else {
        console.log("No certificate found for the position:", position);
      }
    } catch (error) {
      console.error("Error fetching certificate:", error);
    }
  };

  useEffect(() => {
    AOS.init({ once: false, duration: 1000 });
  }, []);

  return (
    <div className="w-full sm:container sm:mx-auto sm:p-6 overflow-hidden">
      <h2 data-aos="fade-down" className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-center mb-12">
        Work Experience
      </h2>
      <div className="relative">
        <div
          className="hidden md:block absolute left-0 top-6 w-1 bg-gradient-to-b from-[#6366f1] to-[#a855f7] transform translate-x-1/2"
          style={{ height: `calc(${(workData.length - 1) * 100}% - ${(workData.length - 1) * 72.5}%)` }}
        ></div>

        {workData.map((work, index) => (
          <div key={index} data-aos="fade-up" data-aos-delay={index * 100} className="relative group sm:pl-8 md:pl-14 mb-8 last:mb-2">
            <div className="hidden md:block absolute left-1 -translate-x-1/2 top-6 w-4 h-4 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-full border-2 border-white/20"></div>
            <div className="relative bg-gray-900/50 backdrop-blur-lg p-6 rounded-xl border border-white/10 overflow-hidden transition-all duration-300 hover:scale-100 hover:shadow-md group-hover:border-[#6366f1]/50">
              <div className="absolute -z-10 inset-0 bg-gradient-to-br from-[#6366f1] to-[#a855f7] opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-4">
                  <Briefcase className="w-5 h-5 md:w-6 md:h-6 text-[#6366f1]" />
                  <h3 className="text-sm md:text-base font-semibold text-white">{work.position}</h3>
                </div>
                <div className="flex items-center gap-2 text-xs md:text-sm text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>{work.duration}</span>
                </div>
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-400 mb-4">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  <span>{work.company}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{work.location}</span>
                </div>
              </div>
              <div className="text-xs md:text-sm text-gray-300 mb-4">{work.description}</div>
              {work.project && (
                <>
                  <span className="text-white font-semibold mt-2 text-xs md:text-sm">Project: {work.project}</span>
                  <span className="text-xs md:text-sm text-gray-300">{work.projectDescription}</span>
                </>
              )}
              <div className="flex flex-wrap gap-3 mt-4">
                {work.tech.map((tech, i) => (
                  <div key={i} className="flex items-center gap-1 bg-gray-800 p-2 rounded-lg hover:bg-gray-700" title={tech}>
                    {techIcons[tech] || <SiReact className="w-5 h-5 text-blue-400" />}
                    <span className="text-gray-400 text-xs md:text-sm">{tech}</span>
                  </div>
                ))}
              </div>
              {work.hasCertificate && (
                <button
                  id="view-certificate"
                  onClick={() => fetchCertificate(work.position)}
                  className="mt-4 px-4 py-2 bg-[#6366f1] text-white rounded-lg hover:bg-[#4f46e5] transition-all duration-300"
                >
                  View Certificate
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {isCertificateModalOpen && certificateUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
          <div className="p-4 top-6 rounded-lg relative w-3/4 md:w-1/2">
            <button
              id="close-modal"
              onClick={() => setIsCertificateModalOpen(false)}
              className="absolute top-5 right-5 text-white bg-gray-600 rounded-full p-1 hover:bg-gray-800 transition-all duration-300 h-9 w-9 flex items-center justify-center"
            >
              X
            </button>
            <img src={certificateUrl} alt="Certificate" className="max-w-full max-h-[80vh] rounded-lg mx-auto" />
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkExperience;