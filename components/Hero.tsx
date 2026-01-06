
import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url('/images/flags banner.png')`,
        }}
      >
        <div className="absolute inset-0 bg-blue-900/60 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/40 via-transparent to-white/10"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10 text-center text-white">
        <h2 className="text-amber-400 text-lg md:text-xl font-bold tracking-widest uppercase mb-4 animate-fade-in">
          Unlock Your Future
        </h2>
        <h1 className="text-5xl md:text-8xl font-bold mb-6 leading-tight drop-shadow-2xl">
          Global University <br />
          <span className="text-amber-500">Fair 2026</span>
        </h1>
        <p className="max-w-2xl mx-auto text-lg md:text-xl mb-10 text-slate-100 font-light leading-relaxed">
          Connect with world-class institutions, explore diverse programs, and find your perfect academic path at the largest education event of the year.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <button className="px-10 py-4 bg-amber-500 text-blue-900 font-bold rounded-full text-lg hover:bg-amber-400 transition-all transform hover:scale-105 shadow-xl">
            Register to Attend
          </button>
          <button className="px-10 py-4 border-2 border-white text-white font-bold rounded-full text-lg hover:bg-white hover:text-blue-900 transition-all">
            View Schedule
          </button>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
