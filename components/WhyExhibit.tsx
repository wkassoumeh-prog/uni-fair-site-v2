
import React from 'react';

const WhyExhibit: React.FC = () => {
  return (
    <section id="why-exhibit" className="py-24 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <span className="text-amber-600 font-bold tracking-wider uppercase text-sm mb-4 block">For Institutions</span>
          <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-8">Why Exhibit at CAREER EXPO SYRIA?</h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            CAREER EXPO SYRIA provides universities, institutes, and educational centers with a valuable opportunity to reach a highly targeted audience of students who are actively seeking educational enrollment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {[
            {
              title: "Targeted Audience",
              desc: "Direct access to a large and relevant student audience actively seeking education.",
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              )
            },
            {
              title: "Brand Presence",
              desc: "Strengthening institutional presence and brand awareness in the Syrian educational market.",
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              )
            },
            {
              title: "Direct Enrollment",
              desc: "Direct communication and on-site registration opportunities with prospective students.",
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )
            },
            {
              title: "Professional Showcase",
              desc: "Professional presentation of academic and training programs to a motivated crowd.",
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              )
            },
            {
              title: "Trusted Environment",
              desc: "Participation in a trusted educational environment gathering leading institutions.",
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.952 11.952 0 01-7.618 3.04M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )
            },
            {
              title: "Strategic Platform",
              desc: "A strategic platform that places your institution at the center of educational decision-making.",
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              )
            }
          ].map((benefit, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-slate-100">
              <div className="text-amber-600 mb-6 bg-amber-50 w-16 h-16 flex items-center justify-center rounded-xl">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-4">{benefit.title}</h3>
              <p className="text-slate-600 leading-relaxed">
                {benefit.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-blue-900 rounded-3xl p-12 text-white overflow-hidden relative">
          <div className="relative z-10 lg:flex items-center justify-between gap-12">
            <div className="lg:w-2/3">
              <h3 className="text-3xl font-bold mb-6">Participating Institutions</h3>
              <p className="text-blue-100 text-lg mb-8">
                CAREER EXPO SYRIA hosts a distinguished group of educational institutions, including Damascus University and Syrian Virtual University, in addition to a wide range of:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-blue-50">
                <li className="flex items-center space-x-3">
                  <div className="h-2 w-2 bg-amber-500 rounded-full"></div>
                  <span>Private universities</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="h-2 w-2 bg-amber-500 rounded-full"></div>
                  <span>International universities</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="h-2 w-2 bg-amber-500 rounded-full"></div>
                  <span>Online universities</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="h-2 w-2 bg-amber-500 rounded-full"></div>
                  <span>Training institutes and centers</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="h-2 w-2 bg-amber-500 rounded-full"></div>
                  <span>Language centers</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="h-2 w-2 bg-amber-500 rounded-full"></div>
                  <span>E-learning platforms</span>
                </li>
              </ul>
              <p className="mt-8 text-blue-300 italic">
                The list of participants is continuously updated.
              </p>
            </div>
            <div className="lg:w-1/3 mt-10 lg:mt-0 text-center lg:text-right">
              <a href="#registration" className="bg-amber-500 hover:bg-amber-600 text-blue-900 font-bold px-8 py-4 rounded-full transition-colors inline-block whitespace-nowrap">
                Join as Exhibitor
              </a>
            </div>
          </div>
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-blue-800 rounded-full opacity-50"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-48 h-48 bg-blue-800 rounded-full opacity-50"></div>
        </div>
      </div>
    </section>
  );
};

export default WhyExhibit;

