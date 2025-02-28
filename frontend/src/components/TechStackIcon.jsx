import PropTypes from 'prop-types';

const TechStackIcon = ({ TechStackIcon, Language }) => {
  return (
    <div className="group p-4 sm:p-6 rounded-2xl bg-slate-800/50 hover:bg-slate-700/50 transition-all duration-300 ease-in-out flex flex-col items-center justify-center gap-2 sm:gap-3 hover:scale-105 cursor-pointer shadow-lg hover:shadow-xl">
      {/* Responsive padding and gap */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-50 blur transition duration-300"></div>
        <img
          src={TechStackIcon}
          alt={`${Language} icon`}
          className="relative h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 transform transition-transform duration-300"
          // Responsive image size
        />
      </div>
      <span className="text-slate-300 font-semibold text-xs sm:text-sm md:text-base tracking-wide group-hover:text-white transition-colors duration-300">
        {/* Responsive text size */}
        {Language}
      </span>
    </div>
  );
};

TechStackIcon.propTypes = {
  TechStackIcon: PropTypes.string.isRequired,
  Language: PropTypes.string.isRequired,
};

export default TechStackIcon;