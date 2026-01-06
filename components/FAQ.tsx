
import React, { useState } from 'react';

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Is the exhibition only for students?",
      answer: "The exhibition is open to students, parents, and anyone interested in education and academic development."
    },
    {
      question: "Is participation paid?",
      answer: "Participation for educational institutions is paid. Visitor entry details will be announced later."
    },
    {
      question: "Can students register with universities during the exhibition?",
      answer: "Yes, direct communication and preliminary registration will be available with many participating institutions."
    },
    {
      question: "Are international and online universities participating?",
      answer: "Yes, the exhibition includes international universities, online universities, and e-learning platforms."
    },
    {
      question: "What are the visiting hours?",
      answer: "Detailed visiting hours will be announced prior to the exhibition."
    }
  ];

  return (
    <section id="faq" className="py-24 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-amber-600 font-bold tracking-wider uppercase text-sm mb-4 block">Help Center</span>
          <h2 className="text-4xl font-bold text-blue-900 mb-6">Frequently Asked Questions</h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
              <button
                className="w-full px-8 py-6 text-left flex items-center justify-between focus:outline-none"
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              >
                <span className="text-lg font-bold text-blue-900">{faq.question}</span>
                <span className={`transform transition-transform duration-300 ${openIndex === idx ? 'rotate-180' : ''}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              <div 
                className={`px-8 overflow-hidden transition-all duration-300 ease-in-out ${openIndex === idx ? 'max-h-40 pb-6' : 'max-h-0'}`}
              >
                <p className="text-slate-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;

