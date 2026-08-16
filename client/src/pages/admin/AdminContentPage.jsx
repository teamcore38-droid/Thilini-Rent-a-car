import React, { useState, useEffect } from 'react';
import {
  Layers,
  HelpCircle,
  MessageSquareQuote,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Star,
  Info
} from 'lucide-react';
import { contentService } from '../../services/contentService';

export const AdminContentPage = () => {
  const [activeTab, setActiveTab] = useState('faqs'); // 'faqs' | 'services' | 'testimonials'
  const [faqs, setFaqs] = useState([]);
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  // FAQ modal state
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [faqForm, setFaqForm] = useState({ question: '', answer: '', category: 'General' });

  // Testimonial modal state
  const [testimonialModalOpen, setTestimonialModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [testimonialForm, setTestimonialForm] = useState({
    customerName: '',
    locationOrCountry: 'Sri Lanka',
    rating: 5,
    comment: '',
    vehicleRented: '',
    isPlaceholder: false
  });

  const fetchContent = async () => {
    setLoading(true);
    try {
      const [faqsData, servicesData, testData] = await Promise.all([
        contentService.getAdminFAQs(),
        contentService.getAdminServices(),
        contentService.getAdminTestimonials()
      ]);
      setFaqs(faqsData?.faqs || []);
      setServices(servicesData?.services || []);
      setTestimonials(testData?.testimonials || []);
    } catch (err) {
      console.error('Failed to load content:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  // FAQ Handlers
  const handleSaveFaq = async (e) => {
    e.preventDefault();
    try {
      if (editingFaq) {
        await contentService.updateFAQ(editingFaq._id, faqForm);
      } else {
        await contentService.createFAQ(faqForm);
      }
      setFaqModalOpen(false);
      fetchContent();
    } catch (err) {
      alert('Failed to save FAQ');
    }
  };

  const handleDeleteFaq = async (id) => {
    if (!window.confirm('Delete this FAQ?')) return;
    try {
      await contentService.deleteFAQ(id);
      fetchContent();
    } catch (err) {
      alert('Failed to delete FAQ');
    }
  };

  // Testimonial Handlers
  const handleSaveTestimonial = async (e) => {
    e.preventDefault();
    try {
      if (editingTestimonial) {
        await contentService.updateTestimonial(editingTestimonial._id, testimonialForm);
      } else {
        await contentService.createTestimonial(testimonialForm);
      }
      setTestimonialModalOpen(false);
      fetchContent();
    } catch (err) {
      alert('Failed to save review');
    }
  };

  const handleDeleteTestimonial = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await contentService.deleteTestimonial(id);
      fetchContent();
    } catch (err) {
      alert('Failed to delete review');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900">
          Content & FAQ Management
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Update frequently asked questions, services text, and manage verified customer feedback.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200">
        <button
          type="button"
          onClick={() => setActiveTab('faqs')}
          className={`px-5 py-3 font-bold text-xs border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'faqs'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-gray-500 hover:text-charcoal-800'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>FAQs ({faqs.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('testimonials')}
          className={`px-5 py-3 font-bold text-xs border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'testimonials'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-gray-500 hover:text-charcoal-800'
          }`}
        >
          <MessageSquareQuote className="w-4 h-4" />
          <span>Customer Reviews ({testimonials.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('services')}
          className={`px-5 py-3 font-bold text-xs border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'services'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-gray-500 hover:text-charcoal-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Services ({services.length})</span>
        </button>
      </div>

      {/* TAB 1: FAQS */}
      {activeTab === 'faqs' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-card space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-charcoal-900">
              Manage Frequently Asked Questions
            </h2>
            <button
              type="button"
              onClick={() => {
                setEditingFaq(null);
                setFaqForm({ question: '', answer: '', category: 'General' });
                setFaqModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add FAQ</span>
            </button>
          </div>

          <div className="space-y-3">
            {faqs.map((f) => (
              <div
                key={f._id}
                className="p-4 rounded-2xl bg-gray-50/80 border border-gray-100 flex items-start justify-between gap-4"
              >
                <div className="space-y-1 text-xs">
                  <span className="inline-block px-2 py-0.5 rounded bg-brand-100 text-brand-700 font-bold text-[10px]">
                    {f.category}
                  </span>
                  <h4 className="font-bold text-charcoal-900 text-sm">{f.question}</h4>
                  <p className="text-gray-600 leading-relaxed">{f.answer}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingFaq(f);
                      setFaqForm({ question: f.question, answer: f.answer, category: f.category });
                      setFaqModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg hover:bg-gray-200 text-charcoal-700"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteFaq(f._id)}
                    className="p-1.5 rounded-lg hover:bg-red-100 text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: TESTIMONIALS */}
      {activeTab === 'testimonials' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-card space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-charcoal-900">
                Customer Testimonials & Reviews
              </h2>
              <div className="mt-1 inline-flex items-center gap-1 text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                <Info className="w-3.5 h-3.5" />
                <span>Mark reviews as genuine once confirmed by real travellers.</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditingTestimonial(null);
                setTestimonialForm({
                  customerName: '',
                  locationOrCountry: 'Sri Lanka',
                  rating: 5,
                  comment: '',
                  vehicleRented: '',
                  isPlaceholder: false
                });
                setTestimonialModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Verified Review</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testimonials.map((t) => (
              <div
                key={t._id}
                className="p-5 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1">
                      {[...Array(t.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    {t.isPlaceholder ? (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                        Sample Review
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        Genuine Review
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-charcoal-700 italic leading-relaxed">
                    "{t.comment}"
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="font-bold text-charcoal-900 block">{t.customerName}</span>
                    <span className="text-gray-500 text-[10px]">{t.locationOrCountry} • {t.vehicleRented}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingTestimonial(t);
                        setTestimonialForm(t);
                        setTestimonialModalOpen(true);
                      }}
                      className="p-1 rounded hover:bg-gray-200"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteTestimonial(t._id)}
                      className="p-1 rounded hover:bg-red-100 text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SERVICES */}
      {activeTab === 'services' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-card space-y-6">
          <h2 className="text-base font-extrabold text-charcoal-900">
            Configured Rental Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((s) => (
              <div key={s._id} className="p-5 rounded-2xl bg-gray-50 border border-gray-100 space-y-2 text-xs">
                <span className="font-bold text-sm text-charcoal-900 block">{s.title}</span>
                <p className="text-gray-600">{s.shortDescription}</p>
                {s.features && (
                  <ul className="text-gray-500 space-y-1 pt-2">
                    {s.features.map((f, i) => (
                      <li key={i}>• {f}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAQ Modal */}
      {faqModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <h3 className="font-extrabold text-base text-charcoal-900">
                {editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
              </h3>
              <button type="button" onClick={() => setFaqModalOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveFaq} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="block font-bold mb-1">Category</label>
                <select
                  value={faqForm.category}
                  onChange={(e) => setFaqForm({ ...faqForm, category: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5"
                >
                  {['General', 'Documents & Licences', 'Rates & Deposits', 'Mileage & Fuel', 'Airport & Delivery', 'Cancellations'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-bold mb-1">Question</label>
                <input
                  type="text"
                  required
                  value={faqForm.question}
                  onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Answer</label>
                <textarea
                  rows="4"
                  required
                  value={faqForm.answer}
                  onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={() => setFaqModalOpen(false)} className="px-4 py-2 border rounded-xl">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-brand-600 text-white font-bold rounded-xl">
                  Save FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Testimonial Modal */}
      {testimonialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <h3 className="font-extrabold text-base text-charcoal-900">
                {editingTestimonial ? 'Edit Review' : 'Add Customer Review'}
              </h3>
              <button type="button" onClick={() => setTestimonialModalOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveTestimonial} className="space-y-4 pt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Customer Name</label>
                  <input
                    type="text"
                    required
                    value={testimonialForm.customerName}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, customerName: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Location / Country</label>
                  <input
                    type="text"
                    value={testimonialForm.locationOrCountry}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, locationOrCountry: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Vehicle Rented</label>
                  <input
                    type="text"
                    value={testimonialForm.vehicleRented}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, vehicleRented: e.target.value })}
                    placeholder="e.g. Toyota Aqua Hybrid"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Rating (1 to 5 Stars)</label>
                  <select
                    value={testimonialForm.rating}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, rating: parseInt(e.target.value, 10) })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5"
                  >
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r}>{r} Stars</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-bold mb-1">Customer Comment</label>
                <textarea
                  rows="3"
                  required
                  value={testimonialForm.comment}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, comment: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="placeholderCheck"
                  checked={testimonialForm.isPlaceholder}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, isPlaceholder: e.target.checked })}
                  className="w-4 h-4 text-brand-600 rounded"
                />
                <label htmlFor="placeholderCheck" className="text-gray-700 font-medium">
                  Mark as sample/placeholder review (until genuine confirmation)
                </label>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={() => setTestimonialModalOpen(false)} className="px-4 py-2 border rounded-xl">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-brand-600 text-white font-bold rounded-xl">
                  Save Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
