import { teamMembers, teamContent } from "../../../data/teamData";

export default function OurTeams() {
    return (
        <div className="relative z-10 bg-[#202d2d] py-16 px-4 md:pb-24 md:pt-8">
            <div className="max-w-7xl mx-auto">
                {/* Sticky Header Section */}
                <div className=" top-4 z-30 text-center mb-12 md:mb-8 bg-[#202d2d] backdrop-blur-sm py-8 rounded-lg">
                    <div className="inline-flex items-center gap-2 bg-green-500/20 px-4 py-2 rounded-full mb-6">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-green-400 text-sm font-medium uppercase tracking-wide">
                            {teamContent.badge}
                        </span>
                    </div>

                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2">
                        {teamContent.title}
                    </h2>

                    <p className="text-gray-400 text-lg md:text-xl max-w-md mx-auto">
                        {teamContent.subtitle}
                    </p>
                </div>

                {/* Team Grid - Fixed to show all 4 cards horizontally on large screens */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {teamMembers.map((member, index) => (
                        <TeamMemberCard key={member.id} member={member} index={index} />
                    ))}
                </div>
            </div>
        </div>
    );
}

// Team Member Card Component - Removed the problematic grid positioning
function TeamMemberCard({ member, index }) {
    return (
        <div className="group">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 aspect-square">
                {/* Background Pattern */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-gray-300/50 to-transparent transform rotate-45 translate-x-16 -translate-y-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-gray-400/30 to-transparent transform -rotate-45 -translate-x-12 translate-y-12"></div>
                </div>

                {/* Member Image */}
                <div className="relative z-10 h-full flex items-end justify-center p-6">
                    <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover object-center rounded-xl transition-transform duration-300 group-hover:scale-105"
                    />
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-center justify-center z-20">
                    <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-blue-300 transition-colors duration-200"
                    >
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                    </a>
                </div>
            </div>

            {/* Member Info */}
            <div className="mt-6 text-center">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                    {member.name}
                </h3>
                <p className="text-gray-400 text-sm md:text-base">
                    {member.position}
                </p>

                {/* LinkedIn Link */}
                <div className="mt-4">
                    <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-gray-400 hover:text-white transition-colors duration-200"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    );
}
