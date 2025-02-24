import { useEffect, useState, useCallback } from "react";
import { db, collection } from "../firebase";
import { getDocs } from "firebase/firestore";
import PropTypes from "prop-types";
import { useSwipeable } from "react-swipeable";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
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

// Separate ShowMore/ShowLess button component
const ToggleButton = ({ onClick, isShowingMore }) => (
  <button id="toggle-button"
    onClick={onClick}
    className=" px-3 py-1.5 text-slate-300 hover:text-white text-sm font-medium transition-all duration-300 ease-in-out flex items-center gap-2 bg-white/5 hover:bg-white/10 rounded-md border border-white/10 hover:border-white/20 backdrop-blur-sm group relative overflow-hidden "
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
          ${isShowingMore
            ? "group-hover:-translate-y-0.5"
            : "group-hover:translate-y-0.5"
          }
        `}
      >
        <polyline
          points={isShowingMore ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}
        ></polyline>
      </svg>
    </span>
    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-500/50 transition-all duration-300 group-hover:w-full"></span>
  </button>
);

ToggleButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  isShowingMore: PropTypes.bool.isRequired,
};

// Component for handling individual tab panels
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
          <Typography>{children}</Typography>
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

// Accessibility props for tabs
// function a11yProps(index) {
//   return {
//     id: `full-width-tab-${index}`,
//     "aria-controls": `full-width-tabpanel-${index}`,
//   };
// }

// List of tech stack icons used in the portfolio
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
  // { icon: "figma.svg", language: "Figma" },
  { icon: "reactrouter.svg", language: "React Router" },
];

// SwipeableViews replacement
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
  // const [value, setValue] = useState(0);
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAllCertificates, setShowAllCertificates] = useState(false);
  const isMobile = window.innerWidth < 768;
  const initialItems = isMobile ? 4 : 6;

  useEffect(() => {
    // Initialize AOS once
    AOS.init({
      once: false, // This will make animations occur only once
    });
  }, []);

  
  // Function to fetch projects and certificates data from Firebase
  const fetchData = useCallback(async () => {
    try {
      const projectCollection = collection(db, "projects");
      const certificateCollection = collection(db, "certificates");

      // Fetch project and certificate data concurrently
      const [projectSnapshot, certificateSnapshot] = await Promise.all([
        getDocs(projectCollection),
        getDocs(certificateCollection),

      ]);

      // Extract project data
      const projectData = projectSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        TechStack: doc.data().TechStack || [],
      }));

      // Extract certificate data
      const certificateData = certificateSnapshot.docs.map((doc) => doc.data());

      console.log("Projects:", projectData);
      console.log("Certificates:", certificateData);

      // Set state for projects and certificates
      setProjects(projectData);
      setCertificates(certificateData);

      // Store data in local storage for caching
      localStorage.setItem("projects", JSON.stringify(projectData));
      localStorage.setItem("certificates", JSON.stringify(certificateData));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  //fetch data on initial render / component mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Function to handle tab change
  // const handleChange = (event, newValue) => {
  //   setValue(newValue);
  // };

  // Function to toggle show more/less for projects and certificates
  const toggleShowMore = useCallback((type) => {
    if (type === "projects") {
      setShowAllProjects((prev) => !prev);
    } else {
      setShowAllCertificates((prev) => !prev);
    }
  }, []);

  // Display only a subset of projects and certificates
  const displayedProjects = showAllProjects
    ? projects
    : projects.slice(0, initialItems);
    
  const displayedCertificates = showAllCertificates
    ? certificates
    : certificates.slice(0, initialItems);

  
  const [value, setValue] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  const tabsContainerRef = useRef(null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX - touchEndX > 50) {
      // Swipe left
      setValue((prev) => (prev < 4 ? prev + 1 : prev));
    } else if (touchEndX - touchStartX > 50) {
      // Swipe right
      setValue((prev) => (prev > 0 ? prev - 1 : prev));
    }
  };


  return (
    // Main container for the portfolio section
    // This section contains the header, tabs, and tab panels
    // <div
    //   className="md:px-[10%] px-[5%] w-full sm:mt-0 mt-[3rem] bg-[#030014] overflow-hidden"
    //   id="Portofolio"
    // >
    <div
      className="md:px-[10%] px-[5%] w-full sm:mt-0 mt-[3rem] bg-[#030014] overflow-hidden"
      id="Portofolio"
    >
      {/* Header section - unchanged */}
      <div
        className="text-center pb-10"
        data-aos="fade-up"
        data-aos-duration="1000"
      >
        <h2 className="inline-block text-3xl md:text-5xl font-bold text-center mx-auto text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]">
          <span
            style={{
              color: "#6366f1",
              backgroundImage:
                "linear-gradient(45deg, #6366f1 10%, #a855f7 93%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Portfolio Showcase
          </span>
        </h2>
        <div
          className="mt-2 text-gray-400 max-w-2xl mx-auto text-base sm:text-md flex items-center justify-center gap-2"
          data-aos="zoom-in-up"
          data-aos-duration="800"
        >
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-full blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative px-3 sm:px-4 py-2 rounded-full bg-black/40 backdrop-blur-xl border border-white/10">
              <span className="bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-transparent bg-clip-text sm:text-sm text-[0.7rem] font-medium flex items-center">
                <AutoAwesomeOutlined className="w-5 h-5 mr-2 text-purple-400" />
                Explore my journey through projects, certifications, and technical
                expertise. Each section represents a milestone in my continuous
                learning path.
                <AutoAwesomeOutlined className="w-5 h-5 ml-2 text-purple-400" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main container for tabs and tab panels */}
      <Box sx={{ width: "100%" }}>

        {/* AppBar and Tabs section - unchanged */}
        {/* <AppBar
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
              background:
                "linear-gradient(180deg, rgba(139, 92, 246, 0.03) 0%, rgba(59, 130, 246, 0.03) 100%)",
              backdropFilter: "blur(10px)",
              zIndex: 0,
            },
          }}
          className="md:px-4"
        >
         
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="secondary"
            indicatorColor="secondary"
            variant="fullWidth"
            sx={{
              // Existing styles remain unchanged
              minHeight: "70px",
              "& .MuiTab-root": {
                fontSize: { xs: "0.9rem", md: "1rem" },
                fontWeight: "600",
                color: "#94a3b8",
                textTransform: "none",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                padding: "20px 0",
                zIndex: 1,
                margin: "8px",
                borderRadius: "12px",
                "&:hover": {
                  color: "#ffffff",
                  backgroundColor: "rgba(139, 92, 246, 0.1)",
                  transform: "translateY(-2px)",
                  "& .lucide": {
                    transform: "scale(1.1) rotate(5deg)",
                  },
                },
                "&.Mui-selected": {
                  color: "#fff",
                  background:
                    "linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2))",
                  boxShadow: "0 4px 15px -3px rgba(139, 92, 246, 0.2)",
                  "& .lucide": {
                    color: "#a78bfa",
                  },
                },
              },
              "& .MuiTabs-indicator": {
                height: 0,
              },
              "& .MuiTabs-flexContainer": {
                gap: "8px",
              },
            }}
          >
            <Tab
              icon={
                <Work className="mb-2 w-5 h-5 transition-all duration-300" />
              }
              label="Work Experience"
              {...a11yProps(0)}
            />
            <Tab
              icon={
                <CodeIcon className="mb-2 w-5 h-5 transition-all duration-300" />
              }
              label="Projects"
              {...a11yProps(1)}
            />
            <Tab
              icon={
                <EmojiEvents className="mb-2 w-5 h-5 transition-all duration-300" />
              }
              label="Certificates"
              {...a11yProps(2)}
            />
            <Tab
              icon={
                <School className="mb-2 w-5 h-5 transition-all duration-300" />
              }
              label="Education"
              {...a11yProps(3)}
            />
            <Tab
              icon={
                <Boxes className="mb-2 w-5 h-5 transition-all duration-300" />
              }
              label="Tech Stack"
              {...a11yProps(4)}
            />
          </Tabs>
        </AppBar> */}


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
              background:
                "linear-gradient(180deg, rgba(139, 92, 246, 0.03) 0%, rgba(59, 130, 246, 0.03) 100%)",
              backdropFilter: "blur(10px)",
              zIndex: 0,
            },
          }}
          className="md:px-4"
        >
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="secondary"
            indicatorColor="secondary"
            variant="fullWidth"
            sx={{
              minHeight: "70px",
              "& .MuiTab-root": {
                fontSize: { xs: "0.9rem", md: "1rem" },
                fontWeight: "600",
                color: "#94a3b8",
                textTransform: "none",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                padding: "20px 0",
                zIndex: 1,
                margin: "8px",
                borderRadius: "12px",
                "&:hover": {
                  color: "#ffffff",
                  backgroundColor: "rgba(139, 92, 246, 0.1)",
                  transform: "translateY(-2px)",
                  "& .lucide": {
                    transform: "scale(1.1) rotate(5deg)",
                  },
                },
                "&.Mui-selected": {
                  color: "#fff",
                  background:
                    "linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2))",
                  boxShadow: "0 4px 15px -3px rgba(139, 92, 246, 0.2)",
                  "& .lucide": {
                    color: "#a78bfa",
                  },
                },
              },
              "& .MuiTabs-indicator": {
                height: 0,
              },
              "& .MuiTabs-flexContainer": {
                gap: "8px",
              },
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            ref={tabsContainerRef}
          >
            <Tab
              icon={<Work className="mb-2 w-5 h-5 transition-all duration-300" />}
              label="Work Experience"
            />
            <Tab
              icon={<CodeIcon className="mb-2 w-5 h-5 transition-all duration-300" />}
              label="Projects"
            />
            <Tab
              icon={<EmojiEvents className="mb-2 w-5 h-5 transition-all duration-300" />}
              label="Certificates"
            />
            <Tab
              icon={<School className="mb-2 w-5 h-5 transition-all duration-300" />}
              label="Education"
            />
            <Tab
              icon={<Boxes className="mb-2 w-5 h-5 transition-all duration-300" />}
              label="Tech Stack"
            />
          </Tabs>
        </AppBar>




        {/* Tab panels section */}
        <SwipeableCards
          index={value}
          onChangeIndex={setValue}
        >
          <TabPanel value={value} index={0} dir={theme.direction}>
            <WorkExperience />
          </TabPanel>

          <TabPanel value={value} index={1} dir={theme.direction}>
            <div className="container mx-auto flex justify-center items-center overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-5">
                {displayedProjects.map((project, index) => (
                  <div
                    key={project.id || index}
                    data-aos={
                      index % 3 === 0
                        ? "fade-up-right"
                        : index % 3 === 1
                          ? "fade-up"
                          : "fade-up-left"
                    }
                    data-aos-duration={
                      index % 3 === 0
                        ? "1000"
                        : index % 3 === 1
                          ? "1200"
                          : "1000"
                    }
                  >
                    <CardProject
                      Img={project.Img}
                      Title={project.Title}
                      Description={project.Description}
                      Link={project.Link}
                      id={project.id}
                    />
                  </div>
                ))}
              </div>
            </div>
            {projects.length > initialItems && (
              <div className="mt-6 w-full flex justify-start">
                <ToggleButton
                  onClick={() => toggleShowMore("projects")}
                  isShowingMore={showAllProjects}
                />
              </div>
            )}
          </TabPanel>

          <TabPanel value={value} index={2} dir={theme.direction}>
            <div className="container mx-auto flex justify-center items-center overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-3 md:gap-5 gap-4">
                {displayedCertificates.map((certificate, index) => (
                  <div
                    key={index}
                    data-aos={
                      index % 3 === 0
                        ? "fade-up-right"
                        : index % 3 === 1
                          ? "fade-up"
                          : "fade-up-left"
                    }
                    data-aos-duration={
                      index % 3 === 0
                        ? "1000"
                        : index % 3 === 1
                          ? "1200"
                          : "1000"
                    }
                  >
                    <Certificate ImgCertif={certificate.Img} />
                  </div>
                ))}
              </div>
            </div>
            {certificates.length > initialItems && (
              <div className="mt-6 w-full flex justify-start">
                <ToggleButton
                  onClick={() => toggleShowMore("certificates")}
                  isShowingMore={showAllCertificates}
                />
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
                    data-aos={
                      index % 3 === 0
                        ? "fade-up-right"
                        : index % 3 === 1
                          ? "fade-up"
                          : "fade-up-left"
                    }
                    data-aos-duration={
                      index % 3 === 0
                        ? "1000"
                        : index % 3 === 1
                          ? "1200"
                          : "1000"
                    }
                  >
                    <TechStackIcon
                      TechStackIcon={stack.icon}
                      Language={stack.language}
                    />
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
