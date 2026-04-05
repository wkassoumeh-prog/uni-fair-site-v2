"use client";

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Copy } from '@/content/copy.en';
import type { Locale } from '@/content/getCopy';

interface ExhibitorRegistrationProps {
  locale: Locale;
  copy: Copy;
}

const ExhibitorRegistration: React.FC<ExhibitorRegistrationProps> = ({ locale, copy }) => {
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
            <h2 className="text-3xl font-bold text-blue-900 mb-4">{copy.registration.success.title}</h2>
            <p className="text-lg text-slate-600 mb-8">
              {copy.registration.success.message}
            </p>
            <button 
              onClick={() => setSuccess(false)}
              className="px-8 py-3 bg-blue-900 text-white font-bold rounded-xl hover:bg-blue-800 transition-colors"
            >
              {copy.registration.success.submitAnother}
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
            <span className="text-amber-600 font-bold tracking-wider uppercase text-base md:text-lg mb-4 block">{copy.registration.badge}</span>
            <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-8 leading-tight">
              {copy.registration.title}
            </h2>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed">
              {copy.registration.description}
            </p>
            
            <h3 className="text-2xl font-bold text-blue-900 mb-6">{copy.registration.whoCanTitle}</h3>
            <ul className="space-y-4 mb-10">
              {copy.registration.whoCanList.map((item, idx) => (
                <li key={idx} className="flex items-center space-x-3 text-slate-700">
                  <div className="h-2 w-2 bg-amber-500 rounded-full"></div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:w-1/2">
            <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
              <h3 className="text-2xl font-bold text-blue-900 mb-8 text-center">{copy.registration.form.title}</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-slate-700 text-sm font-bold mb-2">{copy.registration.form.institutionName}</label>
                  <input name="institution_name" required type="text" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all" placeholder={copy.registration.form.institutionNamePlaceholder} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-slate-700 text-sm font-bold mb-2">{copy.registration.form.contactName}</label>
                    <input name="contact_name" required type="text" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all" placeholder={copy.registration.form.contactNamePlaceholder} />
                  </div>
                  <div>
                    <label className="block text-slate-700 text-sm font-bold mb-2">{copy.registration.form.email}</label>
                    <input name="email" required type="email" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all" placeholder={copy.registration.form.emailPlaceholder} />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 text-sm font-bold mb-2">{copy.registration.form.institutionType}</label>
                  <select name="institution_type" required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all">
                    <option value="">{copy.registration.form.institutionTypePlaceholder}</option>
                    <option value="Local University">{copy.registration.form.institutionTypes.local}</option>
                    <option value="International University">{copy.registration.form.institutionTypes.international}</option>
                    <option value="Online University">{copy.registration.form.institutionTypes.online}</option>
                    <option value="Training Institute">{copy.registration.form.institutionTypes.training}</option>
                    <option value="Other">{copy.registration.form.institutionTypes.other}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 text-sm font-bold mb-2">{copy.registration.form.message}</label>
                  <textarea name="message" rows={3} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all" placeholder={copy.registration.form.messagePlaceholder}></textarea>
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
                  {loading ? copy.registration.form.submitting : copy.registration.form.submit}
                </button>
              </form>
              
              <div className="mt-8 pt-8 border-t border-slate-100">
                <p className="text-sm text-slate-500 text-center">
                  {copy.registration.form.note}
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
