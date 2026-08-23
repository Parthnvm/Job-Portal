import React, { useState } from 'react';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const ContactPage = () => {
  const { addToast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    addToast("Message sent successfully! Our CareerAI support team will contact you.", "success");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Get in Touch</h1>
            <p className="text-xs text-slate-400 mt-2">Have questions about CareerAI or need assistance with your career preparation?</p>

            <div className="mt-8 space-y-4 text-xs text-slate-300">
              <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
                <Mail className="w-5 h-5 text-brand-400" />
                <span>support@careerai.app</span>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
                <Phone className="w-5 h-5 text-emerald-400" />
                <span>+91 (80) 4567-8900</span>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
                <MapPin className="w-5 h-5 text-purple-400" />
                <span>Tech Park, Outer Ring Road, Bengaluru, India</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl glass-card border border-slate-800">
            {submitted ? (
              <div className="text-center py-12 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h3 className="text-lg font-bold text-white">Thank You!</h3>
                <p className="text-xs text-slate-300">Your message has been received by our engineering team.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-slate-300">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Sumit Kumar"
                    className="w-full mt-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="sumit@example.com"
                    className="w-full mt-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300">Message</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="How can we help you?"
                    className="w-full mt-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white resize-none"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all shadow-lg flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
