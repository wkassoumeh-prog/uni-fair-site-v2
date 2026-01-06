
import React from 'react';

const ExhibitorRegistration: React.FC = () => {
  return (
    <section id="registration" className="py-24 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="lg:w-1/2">
            <span className="text-amber-600 font-bold tracking-wider uppercase text-sm mb-4 block">Registration</span>
            <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-8 leading-tight">
              Exhibitor Registration
            </h2>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed">
              We invite universities, institutes, training centers, and e-learning platforms to participate in CAREER EXPO SYRIA and benefit from direct engagement with a broad base of motivated students.
            </p>
            
            <h3 className="text-2xl font-bold text-blue-900 mb-6">Who Can Exhibit?</h3>
            <ul className="space-y-4 mb-10">
              {[
                "Local and international universities",
                "Online universities",
                "Training institutes and centers",
                "Language centers",
                "E-learning platforms"
              ].map((item, idx) => (
                <li key={idx} className="flex items-center space-x-3 text-slate-700">
                  <div className="h-2 w-2 bg-amber-500 rounded-full"></div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:w-1/2">
            <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
              <h3 className="text-2xl font-bold text-blue-900 mb-8 text-center">Registration Process</h3>
              <div className="space-y-12">
                {[
                  {
                    step: "1",
                    title: "Complete the form",
                    desc: "Complete the exhibitor registration form with your institution's details."
                  },
                  {
                    step: "2",
                    title: "Application review",
                    desc: "Our exhibition team will review your application for eligibility and space availability."
                  },
                  {
                    step: "3",
                    title: "Direct follow-up",
                    desc: "We will contact you directly to confirm participation and discuss packages."
                  }
                ].map((proc, idx) => (
                  <div key={idx} className="flex gap-6 relative">
                    {idx !== 2 && (
                      <div className="absolute top-12 left-6 bottom-0 w-0.5 bg-slate-100 -mb-12"></div>
                    )}
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-xl z-10">
                      {proc.step}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-blue-900 mb-2">{proc.title}</h4>
                      <p className="text-slate-600">{proc.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-12 pt-8 border-t border-slate-100">
                <p className="text-sm text-slate-500 text-center mb-6">
                  Participation is paid and subject to the exhibition’s terms and packages.
                </p>
                <button className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-blue-900 font-bold rounded-xl transition-colors shadow-lg shadow-amber-200">
                  Register Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExhibitorRegistration;

