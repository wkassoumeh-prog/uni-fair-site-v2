
import React from 'react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <div className="relative">
              <img 
                src="https://picsum.photos/seed/edu/800/600" 
                alt="Students interacting" 
                className="rounded-2xl shadow-2xl z-10 relative"
              />
              <div className="absolute -bottom-6 -right-6 w-full h-full bg-blue-900 rounded-2xl -z-0"></div>
            </div>
          </div>
          
          <div className="lg:w-1/2">
            <span className="text-amber-600 font-bold tracking-wider uppercase text-sm mb-4 block">About the Event</span>
            <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-8 leading-tight">
              Where Dreams Meet Global <br />Opportunities
            </h2>
            <div className="space-y-6 text-slate-600 leading-relaxed text-lg">
              <p>
                The Global University Fair 2026 is the premier international education exhibition, bringing together over 150 top-ranked universities from across the globe. Our mission is to empower students with the information and connections they need to embark on their international academic journeys.
              </p>
              <p>
                Founded in 2001, the fair has helped over 500,000 students discover degree programs, scholarships, and career paths that align with their passions. Whether you're interested in STEM, Humanities, Business, or the Arts, you'll find specialized advisors ready to guide you.
              </p>
              <p>
                This year, we are introducing interactive workshops, live application reviews, and exclusive networking sessions with alumni from Ivy League, Russell Group, and other prestigious international cohorts.
              </p>
            </div>
            
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-3 rounded-lg text-blue-900">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-blue-900">1-on-1 Advising</h4>
                  <p className="text-sm text-slate-500">Meet admissions officers directly.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-amber-100 p-3 rounded-lg text-amber-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-blue-900">Scholarship Hub</h4>
                  <p className="text-sm text-slate-500">Access exclusive funding opportunities.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
