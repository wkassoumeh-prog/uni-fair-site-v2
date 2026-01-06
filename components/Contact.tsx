"use client";

import React, { useState } from 'react';
import { sendContactEmail } from '@/app/actions/contact';

const Contact: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await sendContactEmail(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-blue-900 text-white relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-amber-500 font-bold tracking-wider uppercase text-sm mb-4 block">Get In Touch</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-8">Contact Us</h2>
            <p className="text-xl text-blue-100 mb-12 max-w-lg">
              The CAREER EXPO SYRIA team is ready to assist you with all your inquiries.
            </p>
            
            <div className="space-y-8">
              <div className="flex items-start space-x-6">
                <div className="bg-blue-800 p-4 rounded-xl text-amber-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Phone Numbers</h4>
                  <p className="text-blue-200">(To be added)</p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="bg-blue-800 p-4 rounded-xl text-amber-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Email Address</h4>
                  <p className="text-blue-200">(To be added)</p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="bg-blue-800 p-4 rounded-xl text-amber-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Facebook</h4>
                  <p className="text-blue-200">(Page link)</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-10 shadow-2xl">
            {success ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-blue-900 mb-2">Message Sent!</h3>
                <p className="text-slate-600 mb-8">We have received your message and will get back to you soon.</p>
                <button 
                  onClick={() => setSuccess(false)}
                  className="text-blue-900 font-bold hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-blue-900 mb-8">Send us a Message</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-slate-700 text-sm font-bold mb-2">Name</label>
                      <input name="name" required type="text" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all" placeholder="Your Name" />
                    </div>
                    <div>
                      <label className="block text-slate-700 text-sm font-bold mb-2">Email</label>
                      <input name="email" required type="email" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all" placeholder="your@email.com" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-700 text-sm font-bold mb-2">Subject</label>
                    <input name="subject" required type="text" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all" placeholder="Inquiry about..." />
                  </div>
                  <div>
                    <label className="block text-slate-700 text-sm font-bold mb-2">Message</label>
                    <textarea name="message" required rows={4} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all" placeholder="How can we help you?"></textarea>
                  </div>
                  
                  {error && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium">
                      {error}
                    </div>
                  )}

                  <button 
                    disabled={loading}
                    type="submit"
                    className={`w-full py-4 bg-amber-500 hover:bg-amber-600 text-blue-900 font-bold rounded-xl transition-all shadow-lg shadow-amber-200 active:scale-[0.98] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 -mt-24 -mr-24 w-96 h-96 bg-blue-800 rounded-full opacity-20"></div>
      <div className="absolute bottom-0 left-0 -mb-24 -ml-24 w-64 h-64 bg-amber-500 rounded-full opacity-10"></div>
    </section>
  );
};

export default Contact;
