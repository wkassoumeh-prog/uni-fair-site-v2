
import React from 'react';

const FeaturedUniversities: React.FC = () => {
  const unis = [
    { name: 'University of Oxford', country: 'United Kingdom', img: 'https://picsum.photos/seed/ox/400/250' },
    { name: 'Stanford University', country: 'United States', img: 'https://picsum.photos/seed/st/400/250' },
    { name: 'ETH Zurich', country: 'Switzerland', img: 'https://picsum.photos/seed/eth/400/250' },
    { name: 'University of Toronto', country: 'Canada', img: 'https://picsum.photos/seed/to/400/250' },
    { name: 'Tsinghua University', country: 'China', img: 'https://picsum.photos/seed/ts/400/250' },
    { name: 'Sorbonne University', country: 'France', img: 'https://picsum.photos/seed/so/400/250' },
  ];

  return (
    <section id="universities" className="py-24 bg-slate-50">
      <div className="container mx-auto px-6 text-center">
        <span className="text-amber-600 font-bold tracking-wider uppercase text-sm mb-4 block">Participating Institutions</span>
        <h2 className="text-4xl font-bold text-blue-900 mb-16">Explore World-Class Universities</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {unis.map((uni, idx) => (
            <div key={idx} className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={uni.img} 
                  alt={uni.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-blue-900">
                  {uni.country}
                </div>
              </div>
              <div className="p-6 text-left">
                <h3 className="text-xl font-bold text-blue-900 mb-2">{uni.name}</h3>
                <p className="text-slate-500 text-sm mb-4 italic">Top tier global ranking • Leading Research Hub</p>
                <button className="text-blue-900 font-bold text-sm flex items-center group-hover:text-amber-500 transition-colors">
                  Learn More
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <button className="mt-16 px-12 py-4 border-2 border-blue-900 text-blue-900 font-bold rounded-full hover:bg-blue-900 hover:text-white transition-all">
          View All 150+ Universities
        </button>
      </div>
    </section>
  );
};

export default FeaturedUniversities;
