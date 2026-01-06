"use client";

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';

const ExhibitorRegistration: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      institution_name: formData.get('institution_name'),
      contact_name: formData.get('contact_name'),
      email: formData.get('email'),
      institution_type: formData.get('institution_type'),
      message: formData.get('message'),
    };

    try {
      const { error: sbError } = await supabase
        .from('registrations')
        .insert([data]);

      if (sbError) throw sbError;
      setSuccess(true);
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <section id="registration" className="py-24 bg-slate-50">
        <div className="container mx-auto px-6 text-center">
          <div className="bg-white p-12 rounded-3xl shadow-xl max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-blue-900 mb-4">Registration Submitted!</h2>
            <p className="text-lg text-slate-600 mb-8">
              Thank you for your interest in CAREER EXPO SYRIA. Our team will review your application and contact you shortly.
            </p>
            <button 
              onClick={() => setSuccess(false)}
              className="px-8 py-3 bg-blue-900 text-white font-bold rounded-xl hover:bg-blue-800 transition-colors"
            >
              Submit Another
            </button>
          </div>
        </div>
      </section>
    );
  }

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
              <h3 className="text-2xl font-bold text-blue-900 mb-8 text-center">Register Your Institution</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-slate-700 text-sm font-bold mb-2">Institution Name</label>
                  <input name="institution_name" required type="text" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all" placeholder="University/Institute Name" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-slate-700 text-sm font-bold mb-2">Contact Name</label>
                    <input name="contact_name" required type="text" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all" placeholder="Full Name" />
                  </div>
                  <div>
                    <label className="block text-slate-700 text-sm font-bold mb-2">Email Address</label>
                    <input name="email" required type="email" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all" placeholder="email@institution.edu" />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 text-sm font-bold mb-2">Institution Type</label>
                  <select name="institution_type" required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all">
                    <option value="">Select Type</option>
                    <option value="Local University">Local University</option>
                    <option value="International University">International University</option>
                    <option value="Online University">Online University</option>
                    <option value="Training Institute">Training Institute</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 text-sm font-bold mb-2">Message (Optional)</label>
                  <textarea name="message" rows={3} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all" placeholder="Any specific requirements?"></textarea>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium">
                    {error}
                  </div>
                )}

                <button 
                  disabled={loading}
                  type="submit"
                  className={`w-full py-4 bg-amber-500 hover:bg-amber-600 text-blue-900 font-bold rounded-xl transition-colors shadow-lg shadow-amber-200 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Submitting...' : 'Register Now'}
                </button>
              </form>
              
              <div className="mt-8 pt-8 border-t border-slate-100">
                <p className="text-sm text-slate-500 text-center">
                  Participation is paid and subject to the exhibition’s terms and packages.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExhibitorRegistration;
