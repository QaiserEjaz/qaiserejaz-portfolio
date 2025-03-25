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
          <Portofolio /> {/* Images from Google Photos loaded here */}
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

  // Set CSP meta tag with expanded img-src for Google Photos, Imgur, WASM, Firebase, and Analytics
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.httpEquiv = "Content-Security-Policy";
    meta.content = `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.vercel.app https://*.firebaseio.com https://*.firebasedatabase.app https://www.googletagmanager.com https://*.google.com https://*.googlesyndication.com https://*.doubleclick.net;
      connect-src 'self' wss://*.firebasedatabase.app https://*.firebaseio.com https://firestore.googleapis.com https://firebaseinstallations.googleapis.com https://cdn.jsdelivr.net https://unpkg.com https://www.google-analytics.com https://formsubmit.co https://formsubmit.com https://*.google.com https://*.googlesyndication.com https://*.doubleclick.net https://adservice.google.com https://*.adtrafficquality.google;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      img-src 'self' data: https://www.google.com https://i.imgur.com https://photos.google.com https://*.googlesyndication.com https://*.doubleclick.net;
      font-src 'self' https://fonts.gstatic.com;
      frame-src 'self' https://*.doubleclick.net https://*.google.com;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      worker-src 'self' blob:;
    `.replace(/\n/g, ' ').trim();
    document.head.appendChild(meta);
    return () => document.head.removeChild(meta);
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