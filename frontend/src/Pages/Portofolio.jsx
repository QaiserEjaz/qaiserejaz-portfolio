import { useEffect, useState, useCallback } from "react";
import { db, collection } from "../firebase";
import { getDocs } from "firebase/firestore";
import PropTypes from "prop-types";
import { useSwipeable } from "react-swipeable";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import CardProject from "../components/CardProject";
import TechStackIcon from "../components/TechStackIcon";
import AOS from "aos";
import "aos/dist/aos.css";
import Certificate from "../components/Certificate";
import { Boxes } from "lucide-react";
import { AutoAwesomeOutlined, School, Work, Code as CodeIcon, EmojiEvents } from "@mui/icons-material";
import Education from "../components/Education";
import WorkExperience from "../components/WorkExperience";
import { useRef } from "react";

// ToggleButton Component
const ToggleButton = ({ onClick, isShowingMore }) => (
  <button
    id="toggle-button"
    onClick={onClick}
    className="px-3 py-1.5 text-slate-300 hover:text-white text-sm font-medium transition-all duration-300 ease-in-out flex items-center gap-2 bg-white/5 hover:bg-white/10 rounded-md border border-white/10 hover:border-white/20 backdrop-blur-sm group relative overflow-hidden"
  >
    <span className="relative z-10 flex items-center gap-2">
      {isShowingMore ? "See Less" : "See More"}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`
          transition-transform 
          duration-300 
          ${isShowingMore ? "group-hover:-translate-y-0.5" : "group-hover:translate-y-0.5"}
        `}
      >
        <polyline points={isShowingMore ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}></polyline>
      </svg>
    </span>
    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-500/50 transition-all duration-300 group-hover:w-full"></span>
  </button>
);

ToggleButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  isShowingMore: PropTypes.bool.isRequired,
};

// TabPanel Component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: { xs: 1, sm: 3 } }}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

// Tech Stack Icons
const techStacks = [
  { icon: "html.svg", language: "HTML" },
  { icon: "css.svg", language: "CSS" },
  { icon: "javascript.svg", language: "JavaScript" },
  { icon: "bootstrap.svg", language: "Bootstrap" },
  { icon: "tailwind.svg", language: "Tailwind CSS" },
  { icon: "MUI.svg", language: "Material UI" },
  { icon: "reactjs.svg", language: "ReactJS" },
  { icon: "nodejs.svg", language: "Node JS" },
  { icon: "express.svg", language: "Express JS" },
  { icon: "nextjs.svg", language: "Next JS" },
  { icon: "firebase.svg", language: "Firebase" },
  { icon: "vite.svg", language: "Vite" },
  { icon: "vercel.svg", language: "Vercel" },
  { icon: "SweetAlert.svg", language: "SweetAlert2" },
  { icon: "mongodb.svg", language: "MongoDB" },
  { icon: "mysql.svg", language: "MySQL" },
  { icon: "git.svg", language: "Git" },
  { icon: "github.svg", language: "GitHub" },
  { icon: "npm.svg", language: "npm" },
  { icon: "postman.svg", language: "Postman" },
  { icon: "reactrouter.svg", language: "React Router" },
];

// SwipeableCards Component
const SwipeableCards = ({ children, index, onChangeIndex }) => {
  const handlers = useSwipeable({
    onSwipedLeft: () => onChangeIndex(index + 1),
    onSwipedRight: () => onChangeIndex(index - 1),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  return <div {...handlers}>{children}</div>;
};

SwipeableCards.propTypes = {
  children: PropTypes.node.isRequired,
  index: PropTypes.number.isRequired,
  onChangeIndex: PropTypes.func.isRequired,
};

export default function FullWidthTabs() {
  const theme = useTheme();
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAllCertificates, setShowAllCertificates] = useState(false);
  const [firebaseError, setFirebaseError] = useState(null); // Added state for Firebase errors
  const isMobile = window.innerWidth < 768;
  const initialItems = isMobile ? 4 : 6; // Responsive initial items

  useEffect(() => {
    AOS.init({ once: false });
  }, []);

  // Fetch data from Firestore with enhanced error handling and user feedback
  const fetchData = useCallback(async () => {
    try {
      const projectCollection = collection(db, "projects");
      const certificateCollection = collection(db, "certificates");

      const [projectSnapshot, certificateSnapshot] = await Promise.all([
        getDocs(projectCollection),
        getDocs(certificateCollection),
      ]);

      const projectData = projectSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        TechStack: doc.data().TechStack || [],
      }));

      const certificateData = certificateSnapshot.docs.map((doc) => doc.data());

      setProjects(projectData);
      setCertificates(certificateData);

      localStorage.setItem("projects", JSON.stringify(projectData));
      localStorage.setItem("certificates", JSON.stringify(certificateData));
      setFirebaseError(null); // Clear any previous errors on success
    } catch (error) {
      console.error("Error fetching data from Firestore:", error);
      setFirebaseError("Failed to load portfolio data. Displaying cached content if available."); // Enhanced user feedback
      const cachedProjects = JSON.parse(localStorage.getItem("projects") || "[]");
      const cachedCertificates = JSON.parse(localStorage.getItem("certificates") || "[]");
      setProjects(cachedProjects);
      setCertificates(cachedCertificates);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Toggle visibility of additional items
  const toggleShowMore = useCallback((type) => {
    if (type === "projects") {
      setShowAllProjects((prev) => !prev);
    } else {
      setShowAllCertificates((prev) => !prev);
    }
  }, []);

  const displayedProjects = showAllProjects ? projects : projects.slice(0, initialItems);
  const displayedCertificates = showAllCertificates ? certificates : certificates.slice(0, initialItems);

  const [value, setValue] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchCurrentX, setTouchCurrentX] = useState(null);
  const tabsContainerRef = useRef(null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Touch handlers (unchanged)
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchCurrentX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchCurrentX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null || touchCurrentX === null) return;

    const deltaX = touchStartX - touchCurrentX;
    const swipeThreshold = 50;

    if (Math.abs(deltaX) > swipeThreshold) {
      if (deltaX > 0 && value < 4) {
        setValue((prev) => prev + 1);
      } else if (deltaX < 0 && value > 0) {
        setValue((prev) => prev - 1);
      }
    }

    setTouchStartX(null);
    setTouchCurrentX(null);
  };

  return (
    <div className="md:px-[10%] px-[5%] w-full sm:mt-0 mt-[3rem] bg-[#030014] overflow-hidden" id="Portofolio">
      {/* Main container with responsive padding and top margin */}
      <div className="text-center pb-10" data-aos="fade-up" data-aos-duration="1000">
        <h2 className="inline-block text-3xl md:text-5xl font-bold text-center mx-auto text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]">
          {/* Portfolio title with gradient text */}
          <span style={{ color: "#6366f1", backgroundImage: "linear-gradient(45deg, #6366f1 10%, #a855f7 93%)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Portfolio Showcase
          </span>
        </h2>
        <div className="mt-2 text-gray-400 max-w-2xl mx-auto text-base sm:text-md flex items-center justify-center gap-2" data-aos="zoom-in-up" data-aos-duration="800">
          {/* Subtext with responsive size and animation */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-full blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative px-3 sm:px-4 py-2 rounded-full bg-black/40 backdrop-blur-xl border border-white/10">
              {/* Subtext container with backdrop blur */}
              <span className="bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-transparent bg-clip-text sm:text-sm text-[0.7rem] font-medium flex items-center">
                <AutoAwesomeOutlined className="w-5 h-5 mr-2 text-purple-400" />
                Explore my journey through projects, certifications, and technical expertise. Each section represents a milestone in my continuous learning path.
                <AutoAwesomeOutlined className="w-5 h-5 ml-2 text-purple-400" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Display Firebase error if fetch fails */}
      {firebaseError && (
        <div className="text-center text-red-400 mb-4 text-sm sm:text-base" data-aos="fade-up">
          {/* Responsive error message */}
          {firebaseError}
        </div>
      )}

      <Box sx={{ width: "100%" }}>
        {/* AppBar (Unchanged) */}
        <AppBar
          position="static"
          elevation={0}
          sx={{
            bgcolor: "transparent",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "20px",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "linear-gradient(180deg, rgba(139, 92, 246, 0.03) 0%, rgba(59, 130, 246, 0.03) 100%)",
              backdropFilter: "blur(10px)",
              zIndex: 0,
            },
          }}
          className="px-4"
        >
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="secondary"
            indicatorColor="secondary"
            variant={isMobile ? "scrollable" : "fullWidth"}
            scrollButtons={isMobile ? "auto" : false}
            sx={{
              minHeight: "70px",
              "& .MuiTab-root": {
                fontSize: { xs: "0.8rem", md: "1rem" },
                fontWeight: "600",
                color: "#94a3b8",
                textTransform: "none",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                padding: { xs: "15px 10px", md: "20px 0" },
                zIndex: 1,
                margin: "8px",
                borderRadius: "12px",
                minWidth: { xs: "auto", md: "160px" },
                "&:hover": {
                  color: "#ffffff",
                  backgroundColor: "rgba(139, 92, 246, 0.1)",
                  transform: "translateY(-2px)",
                  "& .lucide": { transform: "scale(1.1) rotate(5deg)" },
                },
                "&.Mui-selected": {
                  color: "#fff",
                  background: "linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2))",
                  boxShadow: "0 4px 15px -3px rgba(139, 92, 246, 0.2)",
                  "& .lucide": { color: "#a78bfa" },
                },
              },
              "& .MuiTabs-indicator": { height: 0 },
              "& .MuiTabs-flexContainer": {
                justifyContent: isMobile ? "flex-start" : "center",
                gap: "8px",
              },
              "& .MuiTabs-scroller": {
                overflowX: isMobile ? "auto" : "visible",
                WebkitOverflowScrolling: "touch",
              },
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            ref={tabsContainerRef}
          >
            <Tab icon={<Work className="mb-2 w-5 h-5 transition-all duration-300" />} label="Work Experience" />
            <Tab icon={<CodeIcon className="mb-2 w-5 h-5 transition-all duration-300" />} label="Projects" />
            <Tab icon={<EmojiEvents className="mb-2 w-5 h-5 transition-all duration-300" />} label="Certificates" />
            <Tab icon={<School className="mb-2 w-5 h-5 transition-all duration-300" />} label="Education" />
            <Tab icon={<Boxes className="mb-2 w-5 h-5 transition-all duration-300" />} label="Tech Stack" />
          </Tabs>
        </AppBar>

        {/* SwipeableCards (Unchanged) */}
        <SwipeableCards index={value} onChangeIndex={setValue}>
          <TabPanel value={value} index={0} dir={theme.direction}>
            <WorkExperience />
          </TabPanel>
          <TabPanel value={value} index={1} dir={theme.direction}>
            <div className="container mx-auto flex justify-center items-center overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-5">
                {displayedProjects.map((project, index) => (
                  <div
                    key={project.id || index}
                    data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"}
                    data-aos-duration={index % 3 === 0 ? "1000" : index % 3 === 1 ? "1200" : "1000"}
                  >
                    <CardProject Img={project.Img} Title={project.Title} Description={project.Description} Link={project.Link} id={project.id} />
                  </div>
                ))}
              </div>
            </div>
            {projects.length > initialItems && (
              <div className="mt-6 w-full flex justify-start">
                <ToggleButton onClick={() => toggleShowMore("projects")} isShowingMore={showAllProjects} />
              </div>
            )}
          </TabPanel>
          <TabPanel value={value} index={2} dir={theme.direction}>
            <div className="container mx-auto flex justify-center items-center overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-3 md:gap-5 gap-4">
                {displayedCertificates.map((certificate, index) => (
                  <div
                    key={index}
                    data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"}
                    data-aos-duration={index % 3 === 0 ? "1000" : index % 3 === 1 ? "1200" : "1000"}
                  >
                    <Certificate ImgCertif={certificate.Img} />
                  </div>
                ))}
              </div>
            </div>
            {certificates.length > initialItems && (
              <div className="mt-6 w-full flex justify-start">
                <ToggleButton onClick={() => toggleShowMore("certificates")} isShowingMore={showAllCertificates} />
              </div>
            )}
          </TabPanel>
          <TabPanel value={value} index={3} dir={theme.direction}>
            <Education />
          </TabPanel>
          <TabPanel value={value} index={4} dir={theme.direction}>
            <div className="container mx-auto flex justify-center items-center overflow-hidden pb-[5%]">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 lg:gap-8 gap-5">
                {techStacks.map((stack, index) => (
                  <div
                    key={index}
                    data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"}
                    data-aos-duration={index % 3 === 0 ? "1000" : index % 3 === 1 ? "1200" : "1000"}
                  >
                    <TechStackIcon TechStackIcon={stack.icon} Language={stack.language} />
                  </div>
                ))}
              </div>
            </div>
          </TabPanel>
        </SwipeableCards>
      </Box>
    </div>
  );
}


