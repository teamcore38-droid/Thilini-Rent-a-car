import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';
import { WhatsAppIcon } from '../components/common/WhatsAppIcon';
import { useSettings } from '../context/SettingsContext';

export const ContactPage = () => {
  const { settings, getWhatsAppUrl } = useSettings();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Open WhatsApp directly with the message for immediate conversion
    const encoded = encodeURIComponent(
      `*New Enquiry from Website Contact Page*\n` +
      `👤 *Name:* ${name}\n` +
      `📞 *Phone:* ${phone}\n` +
      (email ? `✉️ *Email:* ${email}\n` : '') +
      `💬 *Message:* ${message}`
    );

    const waUrl = getWhatsAppUrl(encoded);
    window.open(waUrl, '_blank');

    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-black uppercase tracking-widest text-brand-600 bg-brand-50 px-3 py-1 rounded-md">
            Get in Touch
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-charcoal-900 mt-3">
            Contact Thilini Rent A Car
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Reach out via WhatsApp, direct telephone, or visit our Katunayake & Colombo offices.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16">
          {/* Contact Details Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* WhatsApp Card */}
            <a
              href={getWhatsAppUrl('Hello Thilini Rent A Car! I would like to get in touch with you.')}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-emerald-50 border border-emerald-200 rounded-3xl p-6 hover:bg-emerald-100/60 transition-colors shadow-subtle"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                  <WhatsAppIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-emerald-950">WhatsApp (Recommended)</h3>
                  <span className="text-xs font-bold text-emerald-700">Instant Replies</span>
                </div>
              </div>
              <p className="text-sm font-bold text-emerald-900 mt-2">{settings.whatsapp}</p>
              <span className="text-xs text-emerald-700 block mt-1">Tap to start chat in WhatsApp</span>
            </a>

            {/* Direct Phone Card */}
            <a
              href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
              className="block bg-white border border-gray-200 rounded-3xl p-6 hover:bg-gray-50 transition-colors shadow-subtle"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-charcoal-900">Direct Phone</h3>
                  <span className="text-xs text-gray-500">24/7 Hotline</span>
                </div>
              </div>
              <p className="text-sm font-bold text-charcoal-900 mt-2">{settings.phone}</p>
              <span className="text-xs text-gray-500 block mt-1">Tap to dial hotline</span>
            </a>

            {/* Email & Address Card */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-subtle space-y-4 text-xs sm:text-sm text-charcoal-700">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-brand-600 shrink-0 mt-1" />
                <div>
                  <span className="text-gray-500 block text-xs">Email Address</span>
                  <a href={`mailto:${settings.email}`} className="font-bold text-charcoal-900 hover:text-brand-600">
                    {settings.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-gray-100">
                <MapPin className="w-4 h-4 text-brand-600 shrink-0 mt-1" />
                <div>
                  <span className="text-gray-500 block text-xs">Main Office Location</span>
                  <p className="font-bold text-charcoal-900">{settings.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-gray-100">
                <Clock className="w-4 h-4 text-gold-500 shrink-0 mt-1" />
                <div>
                  <span className="text-gray-500 block text-xs">Operating Hours</span>
                  <p className="font-bold text-charcoal-900">{settings.businessHours}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Contact Form Column (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-card">
              <h2 className="text-xl font-extrabold text-charcoal-900 mb-2">
                Send an Online Message
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mb-6">
                Have a specific question or custom travel itinerary? Send us your message and we'll respond promptly.
              </p>

              {submitted ? (
                <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h3 className="text-lg font-bold text-emerald-950">Thank You for Your Message!</h3>
                  <p className="text-xs sm:text-sm text-emerald-800">
                    Your enquiry has been dispatched. Our team will contact you on WhatsApp or phone shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ruwan Wickramasinghe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-brand-600 min-h-[48px]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-1.5">
                        Phone / WhatsApp Number *
                      </label>
                      <input
                        type="tel"
                        placeholder="+94 77 123 4567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-brand-600 min-h-[48px]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-1.5">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        placeholder="ruwan@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-brand-600 min-h-[48px]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-1.5">
                      Your Message or Requirements *
                    </label>
                    <textarea
                      rows="4"
                      placeholder="e.g. Looking for a 7-seater SUV for a 10-day tour from Colombo to Kandy and Ella."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-brand-600"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white rounded-xl font-bold text-sm shadow-md transition-all min-h-[48px]"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message & Open WhatsApp</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Interactive Google Map Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-subtle overflow-hidden">
          <h2 className="text-lg font-extrabold text-charcoal-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-brand-600" />
            <span>Find Our Service Center (Katunayake & Colombo)</span>
          </h2>
          <div className="w-full h-80 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 relative">
            <iframe
              title="Thilini Rent A Car Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63321.46467362947!2d79.84587637832032!3d7.173873499999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2ee9c6a1e8093%3A0xb695e1975e5fb405!2sBandaranaike%20International%20Airport!5e0!3m2!1sen!2slk!4v1700000000000!5m2!1sen!2slk"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
