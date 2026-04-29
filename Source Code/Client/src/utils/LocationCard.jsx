import React from 'react';

const LocationCard = ({locName, locType, onClick}) => {
  return (
      <div className="relative group cursor-pointer"
      onClick={onClick}
      >
        {/* Main Card */}
        <div className="relative w-80 h-48 bg-gradient-to-br from-blue-500 via-blue-600 to-green-400 rounded-2xl shadow-2xl transform transition-all duration-500 hover:scale-105 hover:shadow-blue-500/25 overflow-hidden">
          
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm">
            <div className="absolute top-0 left-0 w-full h-full opacity-20">
              <div className="absolute top-4 left-4 w-16 h-16 border border-white/30 rounded-full animate-pulse"></div>
              <div className="absolute top-8 right-8 w-12 h-12 border border-white/20 rounded-full animate-pulse delay-300"></div>
              <div className="absolute bottom-6 left-8 w-8 h-8 border border-white/25 rounded-full animate-pulse delay-700"></div>
            </div>
          </div>

          {/* Animated Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-100/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>

          {/* Content */}
          <div className="relative z-10 flex items-center justify-center h-full p-6">
            <div className="text-center">
              {/* Location Name */}
              <h2 className="text-3xl font-bold text-white mb-2 transform transition-all duration-300 group-hover:scale-110 group-hover:text-green-100 pointer-events-none">
                {locName}
              </h2>
              
              {/* Subtitle */}
              <p className="text-white/80 text-sm font-medium tracking-wide transform transition-all duration-300 group-hover:text-green-50 pointer-events-none">
                This Is {locType}
              </p>
              
              {/* Decorative Line */}
              <div className="w-16 h-0.5 bg-white/60 mx-auto mt-3 transform transition-all duration-500 group-hover:w-24 group-hover:bg-green-200 pointer-events-none"></div>
            </div>
          </div>

          {/* Corner Accents */}
          <div className="absolute top-0 left-0 w-0 h-0 border-l-[20px] border-l-white/20 border-b-[20px] border-b-transparent transition-all duration-300 group-hover:border-l-green-300/50"></div>
          <div className="absolute bottom-0 right-0 w-0 h-0 border-r-[20px] border-r-white/20 border-t-[20px] border-t-transparent transition-all duration-300 group-hover:border-r-green-300/50"></div>
        </div>

        {/* Glow Effect */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-500 via-blue-600 to-green-400 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
        
        {/* Floating Particles */}
        <div className="absolute -top-2 -left-2 w-4 h-4 bg-green-300 rounded-full animate-bounce delay-0 opacity-70"></div>
        <div className="absolute -top-1 -right-3 w-3 h-3 bg-green-200 rounded-full animate-bounce delay-500 opacity-70"></div>
        <div className="absolute -bottom-2 -left-3 w-2 h-2 bg-green-100 rounded-full animate-bounce delay-1000 opacity-70"></div>
        <div className="absolute -bottom-1 -right-2 w-3 h-3 bg-blue-200 rounded-full animate-bounce delay-700 opacity-70"></div>
      </div>
  );
};

export default LocationCard;