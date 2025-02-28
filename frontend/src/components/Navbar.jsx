import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("Home");

  const navItems = [
    { href: "#Home", label: "Home" },
    { href: "#About", label: "About" },
    { href: "#Portofolio", label: "Portofolio" },
    { href: "#Contact", label: "Contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      const sections = navItems
        .map((item) => {
          const section = document.querySelector(item.href);
          if (section) {
            return {
              id: item.href.replace("#", ""),
              offset: section.offsetTop - 100,
              height: section.offsetHeight,
            };
          }
          return null;
        })
        .filter(Boolean);

      const currentPosition = window.scrollY;
      const active = sections.find(
        (section) =>
          currentPosition >= section.offset &&
          currentPosition < section.offset + section.height
      );
      if (active) setActiveSection(active.id);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navItems]);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("no-scroll");
    } else {
      if (!document.body.classList.contains("modal-open")) {
        document.body.classList.remove("no-scroll");
      }
    }

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [isOpen]);

  const scrollToSection = (e, href) => {
    e.preventDefault();
    const section = document.querySelector(href);
    if (section) {
      const top = section.offsetTop - 64;
      window.scrollTo({ top, behavior: "smooth" });
    }
    setIsOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed w-full top-0 z-[100] transition-all duration-500 max-w-[100vw] overflow-x-hidden box-border ${
          isOpen
            ? "bg-[#030014] opacity-100"
            : scrolled
            ? "bg-[#030014]/50 backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 max-w-[100%] overflow-x-hidden">
            {/* Logo */}
            <div className="flex-shrink-0 max-w-[60%] sm:max-w-[70%]">
              <a
                href="#Home"
                onClick={(e) => scrollToSection(e, "#Home")}
                className="flex items-center text-base sm:text-xl font-bold bg-gradient-to-r from-[#a855f7] to-[#6366f1] bg-clip-text text-transparent truncate"
              >
                Qaiser Ejaz
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-8 flex items-center space-x-6">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={(e) => scrollToSection(e, item.href)}
                    className="group relative px-1 py-2 text-sm font-medium"
                  >
                    <span
                      className={`relative z-10 transition-colors duration-300 ${
                        activeSection === item.href.substring(1)
                          ? "bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent font-semibold"
                          : "text-[#e2d3fd] group-hover:text-white"
                      }`}
                    >
                      {item.label}
                    </span>
                    <span
                      className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] transform origin-left transition-transform duration-300 ${
                        activeSection === item.href.substring(1)
                          ? "scale-x-100"
                          : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                  </a>
                ))}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex-shrink-0">
              <button
                id="mobile-menu-button"
                onClick={() => setIsOpen(!isOpen)}
                className={`p-1 sm:p-2 text-[#e2d3fd] hover:text-white transition-transform duration-300 ${
                  isOpen ? "rotate-90 scale-125" : "rotate-0 scale-100"
                }`}
                aria-label={isOpen ? "Close mobile menu" : "Open mobile menu"}
              >
                {isOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`md:hidden fixed inset-x-0 top-[64px] bg-[#030014] transition-all duration-300 ease-in-out max-w-[100vw] overflow-x-hidden z-[99] ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-[-100%] pointer-events-none"
        }`}
      >
        <div className="px-4 py-6 space-y-4">
          {navItems.map((item, index) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => scrollToSection(e, item.href)}
              className={`block px-4 py-3 text-lg font-medium transition-all duration-300 ${
                activeSection === item.href.substring(1)
                  ? "bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent font-semibold"
                  : "text-[#e2d3fd] hover:text-white"
              }`}
              style={{
                transitionDelay: `${index * 100}ms`,
                transform: isOpen ? "translateX(0)" : "translateX(50px)",
                opacity: isOpen ? 1 : 0,
              }}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>

      {/* Global CSS for overflow management */}
      <style>{`
        body.no-scroll {
          overflow: hidden;
        }
        body.modal-open {
          overflow: hidden;
        }
      `}</style>
    </>
  );
};

export default Navbar;