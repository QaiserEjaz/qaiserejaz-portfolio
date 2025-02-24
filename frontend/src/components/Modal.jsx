import { useState, useEffect } from 'react';
import { ArrowRight, ExternalLink, X, Home, User, Briefcase, Mail } from 'lucide-react';
import PropTypes from 'prop-types';

const ProjectCardModal = ({ title, description, link }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <button id='modal-button'
        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/90 transition-colors duration-200"
        onClick={() => setIsOpen(true)}
        aria-expanded={isOpen}
        aria-controls="modal"
      >
        <span className="text-sm">Details</span>
        <ArrowRight className="w-4 h-4" />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in"
          onClick={() => setIsOpen(false)}
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-md rounded-lg bg-gray-900 p-4 text-white shadow-lg animate-slide-up sm:p-6"
            onClick={(e) => e.stopPropagation()}
            id="modal"
          >
            <button id='modal-close'
              className="absolute top-4 right-4 rounded-md p-1 hover:bg-gray-800 transition-colors duration-200"
              onClick={() => setIsOpen(false)}
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="mb-2 text-2xl font-bold" id="modal-title">{title}</h2>
            <p className="mb-4 text-gray-400">{description}</p>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-1">
                <Home className="h-5 w-5" />
                <span>Home</span>
              </div>
              <div className="flex items-center space-x-1">
                <User className="h-5 w-5" />
                <span>About</span>
              </div>
              <div className="flex items-center space-x-1">
                <Briefcase className="h-5 w-5" />
                <span>Portfolio</span>
              </div>
              <div className="flex items-center space-x-1">
                <Mail className="h-5 w-5" />
                <span>Contact</span>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md bg-blue-600 px-3 py-1.5 font-medium hover:bg-blue-700 transition-colors duration-200"
              >
                Live Demo <ExternalLink className="ml-1 inline-block h-5 w-5" />
              </a>
              <button id='modal-close'
                className="rounded-md bg-gray-800 px-3 py-1.5 font-medium hover:bg-gray-700 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

ProjectCardModal.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
};

export default ProjectCardModal;