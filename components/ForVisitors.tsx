
import React from 'react';

const ForVisitors: React.FC = () => {
  return (
    <section id="for-visitors" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          <div className="lg:w-1/2">
            <span className="text-amber-600 font-bold tracking-wider uppercase text-sm mb-4 block">For Visitors</span>
            <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-8 leading-tight">
              Who Should Visit?
            </h2>
            <div className="space-y-4">
              {[
                "High school students",
                "University students",
                "Graduates seeking postgraduate studies",
                "Parents",
                "Individuals interested in online education and professional development"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center space-x-4 p-4 rounded-xl bg-slate-50 hover:bg-blue-50 transition-colors group">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-900 group-hover:bg-blue-900 group-hover:text-white transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-slate-700 font-medium text-lg">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:w-1/2">
            <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-8 leading-tight">
              What Will You Gain?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                {
                  title: "Direct Intro",
                  desc: "Direct introduction to universities and educational programs."
                },
                {
                  title: "Comparison",
                  desc: "The ability to compare multiple educational options in one place."
                },
                {
                  title: "Face-to-Face",
                  desc: "Face-to-face communication with official representatives."
                },
                {
                  title: "Informed Decisions",
                  desc: "Accurate information to support informed academic decisions."
                }
              ].map((gain, idx) => (
                <div key={idx} className="p-6 border border-slate-100 rounded-2xl bg-white shadow-sm">
                  <h3 className="text-xl font-bold text-blue-900 mb-3">{gain.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{gain.desc}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-12 p-8 bg-amber-50 rounded-2xl border-l-4 border-amber-500">
              <p className="text-amber-900 text-xl font-bold italic">
                "One visit can save you years of searching."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForVisitors;

