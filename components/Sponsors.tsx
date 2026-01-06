
import React from 'react';

const Sponsors: React.FC = () => {
  return (
    <section id="sponsors" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-amber-600 font-bold tracking-wider uppercase text-sm mb-4 block">Our Partners</span>
          <h2 className="text-4xl font-bold text-blue-900 mb-6">Sponsors & Media Partners</h2>
          <p className="text-lg text-slate-600">
            CAREER EXPO SYRIA proudly collaborates with a group of sponsors and media partners who contribute to the success of this educational event.
          </p>
        </div>

        <div className="bg-slate-50 rounded-3xl p-12 border-2 border-dashed border-slate-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 items-center opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Placeholder logos */}
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="flex justify-center">
                <div className="h-16 w-32 bg-slate-300 rounded-lg animate-pulse"></div>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <p className="text-slate-500 italic">Sponsors’ and media partners’ logos will be displayed in this section.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Sponsors;

