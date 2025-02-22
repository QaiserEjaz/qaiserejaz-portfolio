/* eslint-disable react/prop-types */
import { useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import "./index.css";
import { AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';


import Home from "./Pages/Home";
import About from "./Pages/About";
import AnimatedBackground from "./components/Background";
import Navbar from "./components/Navbar";
import Portofolio from "./Pages/Portofolio";
import ContactPage from "./Pages/Contact";
import ProjectDetails from "./components/ProjectDetail";
import WelcomeScreen from "./Pages/WelcomeScreen";
// import ContactPage from "./Pages/Contact";
import ThankYou from "./Pages/ThankYou";

const LandingPage = ({ showWelcome, setShowWelcome }) => {
  return (
    <>
      {showWelcome ? (
      <AnimatePresence mode="wait">
        {showWelcome && (
          <WelcomeScreen onLoadingComplete={() => setShowWelcome(false)} key = "welcome"/>
        )}
      </AnimatePresence>
      ) : (
        <div key="main-content" className="relative z-10">
          <Navbar />
          <AnimatedBackground />
          <Home />
          <About />
          <Portofolio />
          <ContactPage />
          <footer className="text-center">
            <hr className="my-3 border-gray-400 opacity-15 sm:mx-auto lg:my-6" />
            <span className="block text-sm pb-4 text-gray-500 dark:text-gray-400">
              © 2025{" "}
              <a href="https://flowbite.com/" className="hover:underline">
                QaiserEjaz™
              </a>
              . All Rights Reserved.
            </span>
          </footer>
        </div>
      )}
    </>
  );
};

LandingPage.propTypes = {
  showWelcome: PropTypes.bool.isRequired,
  setShowWelcome: PropTypes.func.isRequired,
};

const ProjectPageLayout = () => (
  <div key="project-page">
    <AnimatedBackground />
    <Navbar />
    <ProjectDetails />
  </div>
);

function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  // return (
  //   <BrowserRouter>
  //     <Routes>
  //       <Route path="/" element={<LandingPage showWelcome={showWelcome} setShowWelcome={setShowWelcome} />} />
  //       <Route path="/project/:id" element={<ProjectPageLayout />} />
  //     </Routes>
  //   </BrowserRouter>
  // );


  const router = createBrowserRouter(
    [
      {
        path: "/",
        element: <LandingPage showWelcome={showWelcome} setShowWelcome={setShowWelcome} />,
      },
      {
        path: "/project/:id",
        element: <ProjectPageLayout />,
      },
      // {
      //   path: "/contact",
      //   element: <ContactPage />,
      // },
      {
        path: "/thank-you", // Add route for ThankYouPage
        element: <ThankYou />,
      },

    ],
    {
      future: {
        v7_startTransition: true,
        v7_relativeSplatPath: true,
        v7_fetcherPersist: true,
        v7_normalizeFormMethod: true,
        v7_partialHydration: true,
        v7_skipActionErrorRevalidation: true
      }
    }
  );

  return <RouterProvider router={router} />;

}

export default App;


