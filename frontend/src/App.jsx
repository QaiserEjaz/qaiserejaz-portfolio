// /* eslint-disable react/prop-types */
// import { useState } from 'react';
// import { createBrowserRouter, RouterProvider } from 'react-router-dom';
// import "./index.css";
// import { AnimatePresence } from 'framer-motion';
// import PropTypes from 'prop-types';
// import { SpeedInsights } from "@vercel/speed-insights/react";
// import { Analytics } from "@vercel/analytics/react"

// import Home from "./Pages/Home";
// import About from "./Pages/About";
// import AnimatedBackground from "./components/Background";
// import Navbar from "./components/Navbar";
// import Portofolio from "./Pages/Portofolio";
// import ContactPage from "./Pages/Contact";
// import ProjectDetails from "./components/ProjectDetail";
// import WelcomeScreen from "./Pages/WelcomeScreen";
// import ThankYou from "./Pages/ThankYou";

// const LandingPage = ({ showWelcome, setShowWelcome }) => {
//   return (
//     <>
//       {showWelcome ? (
//       <AnimatePresence mode="wait">
//         {showWelcome && (
//           <WelcomeScreen onLoadingComplete={() => setShowWelcome(false)} key = "welcome"/>
//         )}
//       </AnimatePresence>
//       ) : (
//         <div key="main-content" className="relative z-10">
//           <Navbar />
//           <AnimatedBackground />
//           <Home />
//           <About />
//           <Portofolio />
//           <ContactPage />
//           <footer className="text-center">
//             <hr className="my-3 border-gray-400 opacity-15 sm:mx-auto lg:my-6" />
//             <span className="block text-sm pb-4 text-gray-500 dark:text-gray-400">
//               © 2025{" "}
//               <a href="https://flowbite.com/" className="hover:underline">
//                 QaiserEjaz™
//               </a>
//               . All Rights Reserved.
//             </span>
//           </footer>
//         </div>
//       )}
//     </>
//   );
// };

// LandingPage.propTypes = {
//   showWelcome: PropTypes.bool.isRequired,
//   setShowWelcome: PropTypes.func.isRequired,
// };

// const ProjectPageLayout = () => (
//   <div key="project-page">
//     <AnimatedBackground />
//     <Navbar />
//     <ProjectDetails />
//   </div>
// );

// function App() {
//   const [showWelcome, setShowWelcome] = useState(true);

//   const router = createBrowserRouter(
//     [
//       {
//         path: "/",
//         element: <LandingPage showWelcome={showWelcome} setShowWelcome={setShowWelcome} />,
//       },
//       {
//         path: "/project/:id",
//         element: <ProjectPageLayout />,
//       },
//       {
//         path: "/thank-you", // Add route for ThankYouPage
//         element: <ThankYou />,
//       },

//     ],
//     {
//       future: {
//         v7_startTransition: true,
//         v7_relativeSplatPath: true,
//         v7_fetcherPersist: true,
//         v7_normalizeFormMethod: true,
//         v7_partialHydration: true,
//         v7_skipActionErrorRevalidation: true
//       }
//     }
//   );

//   return (
//     <>
//       <RouterProvider router={router} />
//        <SpeedInsights />
//        <Analytics />
//     </>
//   )
// }

// export default App;


/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import "./index.css";
import { AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";

import Home from "./Pages/Home";
import About from "./Pages/About";
import AnimatedBackground from "./components/Background";
import Navbar from "./components/Navbar";
import Portofolio from "./Pages/Portofolio";
import ContactPage from "./Pages/Contact";
import ProjectDetails from "./components/ProjectDetail";
import WelcomeScreen from "./Pages/WelcomeScreen";
import ThankYou from "./Pages/ThankYou";

const LandingPage = ({ showWelcome, setShowWelcome }) => {
  return (
    <>
      {showWelcome ? (
        <AnimatePresence mode="wait">
          {showWelcome && (
            <WelcomeScreen onLoadingComplete={() => setShowWelcome(false)} key="welcome" />
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
            <span className="block text-sm pb-4 text-gray-300 dark:text-gray-200">
              {/* Contrast fix: text-gray-500 to text-gray-300, dark:text-gray-400 to dark:text-gray-200 */}
              © 2025{" "}
              <a
                href="https://flowbite.com/"
                className="hover:underline text-gray-300 hover:text-gray-100 dark:text-gray-200 dark:hover:text-white"
              >
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

  // Set CSP meta tag with allowances for WASM, Firebase, Lottie, and Analytics
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.httpEquiv = "Content-Security-Policy";
    meta.content = `
      default-src 'self';
      script-src 'self' 'unsafe-eval' https://*.vercel.app https://*.firebaseio.com https://*.firebasedatabase.app https://www.googletagmanager.com;
      connect-src 'self' wss://*.firebasedatabase.app https://*.firebaseio.com https://firestore.googleapis.com https://firebaseinstallations.googleapis.com https://cdn.jsdelivr.net https://unpkg.com https://www.google-analytics.com;
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https://www.google.com;
      font-src 'self';
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      worker-src 'self';
    `.replace(/\n/g, ' ').trim(); // Added 'unsafe-eval' for WASM, google-analytics.com for Analytics
    document.head.appendChild(meta);
    return () => document.head.removeChild(meta); // Cleanup on unmount
  }, []);

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

  return (
    <>
      <RouterProvider router={router} />
      <SpeedInsights />
      <Analytics />
    </>
  );
}

export default App;