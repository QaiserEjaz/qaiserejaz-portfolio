import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { GraduationCap, School, Calendar, MapPin } from "lucide-react"; // Import icons

const WorkExperience = () => {
    const educationData = [
        {
            level: 'University',
            animation: 'fade-right', // Animation type for AOS
            name: 'Dawood University of Engineering and Technology',
            duration: '2019 - 2023',
            degree: 'Bachelor of Engineering (B.E) in Computer Systems Engineering',
            city: 'Karachi, Sindh, Pakistan',
        },
        {
            level: 'College',
            animation: 'fade-up', // Animation type for AOS
            name: 'Government Delhi College',
            duration: '2017 - 2019',
            degree: 'Higher Secondary Certificate (HSC) in Pre-Engineering',
            city: 'Karachi, Sindh, Pakistan',
        },
        {
            level: 'School',
            animation: 'fade-left', // Animation type for AOS
            name: 'Islamia English Model School',
            duration: '2004 - 2017',
            degree: 'Secondary School Certificate (SSC) in Science',
            city: 'Karachi, Sindh, Pakistan',
        },
    ];


    useEffect(() => {
        AOS.init({
            once: false,
            duration: 1000,
        });
    }, []);

    return (
        <div className="container mx-auto p-6 relative overflow-hidden">
            <h2
                data-aos="fade-down"
                className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-center mb-12"
            >
                Education History
            </h2>

            {/* Grid layout for education cards */}
            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-7">
                {/* Loop through each education level and display a card */}
                {educationData.map((edu, index) => (
                    <div
                        key={index}
                        data-aos="fade-up"
                        data-aos-delay={index * 100}
                        className="relative group pl-15 mb-8 h-full"
                    >
                        {/* Education Card */}
                        <div className="relative bg-gray-900/50 backdrop-blur-lg p-6 rounded-xl border border-white/10 overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl group-hover:border-[#6366f1]/50 flex flex-col h-full">

                            {/* Gradient background for hover effect */}
                            <div className={`absolute -z-10 inset-0 bg-gradient-to-br from-[#6366f1] to-[#a855f7] opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>

                            {/* Institution Name and Icon */}
                            <div className="flex items-center gap-3 mb-4"
                                data-aos="fade-up-left"
                                data-aos-duration="1500"
                                data-aos-anchor-placement="top-bottom"
                            >
                                <School className="w-7 h-7 text-[#6366f1] flex-shrink-0" />
                                <h3 className="text-xl font-semibold text-[#6366f1]">{edu.name}</h3>
                            </div>

                            {/* Content Wrapper (Expands to Fill Space) */}
                            {/* Education Details */}
                            <div className="space-y-6 flex-grow">
                                {/* Duration */}
                                <div className="flex items-center ps-1 gap-3.5"
                                    data-aos="fade-up-right"
                                    data-aos-duration="1500"
                                    data-aos-anchor-placement="top-bottom"
                                >
                                    <Calendar className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                    <span className="text-sm text-gray-500">{edu.duration}</span>
                                </div>

                                {/* Degree */}
                                <div className="flex items-center ps-1 gap-3.5"
                                    data-aos="fade-up-right"
                                    data-aos-duration="2500"
                                    data-aos-anchor-placement="top-bottom"
                                >
                                    <GraduationCap className="w-5 h-5 text-gray-300 flex-shrink-0" />
                                    <div className="text-md text-gray-300">{edu.degree}</div>
                                </div>

                                {/* Location */}
                                <div className="flex items-center ps-1 gap-3.5"
                                    data-aos="fade-up-right"
                                    data-aos-duration="3000"
                                    data-aos-anchor-placement="top-bottom"
                                >
                                    <MapPin className="w-5 h-5 text-gray-300 flex-shrink-0" />
                                    <span className="text-md text-gray-300">{edu.city}</span>
                                </div>
                            </div>
                    
                            {/* Gradient Bottom Line */}
                            <div className="absolute bottom-0 left-0 w-full h-0 bg-gradient-to-r from-[#6366f1] to-[#a855f7] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                    </div>

                ))}
            </div>
        </div>
    );
};

export default WorkExperience;