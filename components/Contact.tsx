"use client";

import React, { useState } from 'react';
import { Instagram } from 'lucide-react';
import { sendContactEmail } from '@/app/actions/contact';
import type { Copy } from '@/content/copy.en';
import PhoneNumber from './PhoneNumber';

const CONTACT_INSTAGRAM_URL = 'https://www.instagram.com/careerexpo_syria/';
const CONTACT_WHATSAPP_URL = 'https://wa.me/963113344805';

interface ContactProps {
  copy: Copy;
}

const Contact: React.FC<ContactProps> = ({ copy }) => {
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
            <span className="text-amber-500 font-bold tracking-wider uppercase text-base md:text-lg mb-4 block">{copy.contact.badge}</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-8">{copy.contact.title}</h2>
            <p className="text-xl text-blue-100 mb-12 max-w-lg">
              {copy.contact.description}
            </p>
            
            <div className="space-y-8">
              <button
                type="button"
                className="flex items-start space-x-6 group hover:no-underline focus:no-underline cursor-pointer relative"
                onClick={async () => {
                  await navigator.clipboard.writeText(copy.contact.phone.number);
                  const btn = document.getElementById('copy-phone-btn');
                  if (btn) {
                    const msg = document.createElement('span');
                    msg.textContent = copy.contact.phone.copied;
                    msg.className = 'absolute top-0 left-full ml-2 bg-blue-800 text-amber-400 text-xs px-2 py-1 rounded shadow-lg animate-fade-in-out z-20';
                    btn.appendChild(msg);
                    setTimeout(() => {
                      btn.removeChild(msg);
                    }, 1300);
                  }
                }}
                id="copy-phone-btn"
                title="Click to copy phone number"
              >
                  <div className="bg-blue-800 p-4 rounded-xl text-amber-500 group-hover:bg-amber-500 group-hover:text-blue-800 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1 group-hover:text-amber-500 transition-colors">{copy.contact.phone.title}</h4>
                    <p className="text-blue-200 group-hover:text-amber-500 transition-colors">
                      <PhoneNumber value={copy.contact.phone.number} />
                    </p>
                  </div>
                </button>

              <a
                href={`mailto:${copy.contact.email.address}`}
                className="flex items-start space-x-6 group hover:no-underline focus:no-underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="bg-blue-800 p-4 rounded-xl text-amber-500 group-hover:bg-amber-500 group-hover:text-blue-800 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1 group-hover:text-amber-500 transition-colors">{copy.contact.email.title}</h4>
                  <p className="text-blue-200 group-hover:text-amber-500 transition-colors">{copy.contact.email.address}</p>
                </div>
              </a>

              <a
                href="https://www.facebook.com/profile.php?id=61586545665487"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start space-x-6 group hover:no-underline focus:no-underline"
              >
                <div className="bg-blue-800 p-4 rounded-xl text-amber-500 group-hover:bg-amber-500 group-hover:text-blue-800 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1 group-hover:text-amber-500 transition-colors">{copy.contact.facebook.title}</h4>
                  <p className="text-blue-200 group-hover:text-amber-500 transition-colors">{copy.contact.facebook.text}</p>
                </div>
              </a>

              <a
                href={CONTACT_INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start space-x-6 group hover:no-underline focus:no-underline"
              >
                <div className="bg-blue-800 p-4 rounded-xl text-amber-500 group-hover:bg-amber-500 group-hover:text-blue-800 transition-colors">
                  <Instagram className="h-6 w-6" strokeWidth={2} aria-hidden />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1 group-hover:text-amber-500 transition-colors">{copy.contact.instagram.title}</h4>
                  <p className="text-blue-200 group-hover:text-amber-500 transition-colors">{copy.contact.instagram.text}</p>
                </div>
              </a>

              <a
                href={CONTACT_WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start space-x-6 group hover:no-underline focus:no-underline"
              >
                <div className="bg-blue-800 p-4 rounded-xl text-amber-500 group-hover:bg-amber-500 group-hover:text-blue-800 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1 group-hover:text-amber-500 transition-colors">{copy.contact.whatsapp.title}</h4>
                  <p className="text-blue-200 group-hover:text-amber-500 transition-colors">{copy.contact.whatsapp.text}</p>
                </div>
              </a>
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
                <h3 className="text-2xl font-bold text-blue-900 mb-2">{copy.contact.success.title}</h3>
                <p className="text-slate-600 mb-8">{copy.contact.success.message}</p>
                <button 
                  onClick={() => setSuccess(false)}
                  className="text-blue-900 font-bold hover:underline"
                >
                  {copy.contact.success.sendAnother}
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-blue-900 mb-8">{copy.contact.form.title}</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-slate-700 text-sm font-bold mb-2">{copy.contact.form.name}</label>
                      <input name="name" required type="text" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all" placeholder={copy.contact.form.namePlaceholder} />
                    </div>
                    <div>
                      <label className="block text-slate-700 text-sm font-bold mb-2">{copy.contact.form.email}</label>
                      <input name="email" required type="email" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all" placeholder={copy.contact.form.emailPlaceholder} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-700 text-sm font-bold mb-2">{copy.contact.form.subject}</label>
                    <input name="subject" required type="text" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all" placeholder={copy.contact.form.subjectPlaceholder} />
                  </div>
                  <div>
                    <label className="block text-slate-700 text-sm font-bold mb-2">{copy.contact.form.message}</label>
                    <textarea name="message" required rows={4} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all" placeholder={copy.contact.form.messagePlaceholder}></textarea>
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
                    {loading ? copy.contact.form.sending : copy.contact.form.submit}
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
