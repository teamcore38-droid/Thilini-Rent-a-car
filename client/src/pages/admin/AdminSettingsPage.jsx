import React, { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle2, AlertCircle, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { WhatsAppIcon } from '../../components/common/WhatsAppIcon';
import { useSettings } from '../../context/SettingsContext';

export const AdminSettingsPage = () => {
  const { settings, updateSettings, refreshSettings } = useSettings();
  const [formData, setFormData] = useState({ ...settings });
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setFormData({ ...settings });
  }, [settings]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      await updateSettings(formData);
      setSuccessMsg('Business settings updated successfully and applied sitewide!');
      await refreshSettings();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg('Failed to update business settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900">
          Site & Business Configuration
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Centralized management for contact numbers, WhatsApp, office addresses, business hours, and policies.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-xs text-emerald-800">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-xs text-red-800">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-card space-y-8 text-xs">
        {/* Section 1: Business Identity */}
        <div>
          <h2 className="text-sm font-extrabold text-charcoal-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
            1. Brand Identity & Taglines
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold mb-1">Business Name</label>
              <input
                type="text"
                required
                value={formData.businessName || ''}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold mb-1">Primary Tagline</label>
              <input
                type="text"
                value={formData.tagline || ''}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 font-medium"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold mb-1">Supporting Sentence</label>
              <input
                type="text"
                value={formData.supportingText || ''}
                onChange={(e) => setFormData({ ...formData, supportingText: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Contact Numbers & WhatsApp */}
        <div>
          <h2 className="text-sm font-extrabold text-charcoal-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
            2. Customer Contact & Direct Conversion Channels
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-brand-600" />
                <span>Primary Telephone Number</span>
              </label>
              <input
                type="text"
                required
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+94 77 123 4567"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold mb-1 flex items-center gap-1">
                <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp Number</span>
              </label>
              <input
                type="text"
                required
                value={formData.whatsapp || ''}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                placeholder="+94 77 123 4567"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold mb-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-brand-600" />
                <span>Business Email</span>
              </label>
              <input
                type="email"
                required
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="info@thilinirentacar.com"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Office Address & Operating Hours */}
        <div>
          <h2 className="text-sm font-extrabold text-charcoal-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
            3. Office Location & Service Hours
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-brand-600" />
                <span>Physical Office Address</span>
              </label>
              <input
                type="text"
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-gold-500" />
                <span>Business & Airport Support Hours</span>
              </label>
              <input
                type="text"
                value={formData.businessHours || ''}
                onChange={(e) => setFormData({ ...formData, businessHours: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3.5 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white rounded-xl font-bold shadow-md transition-all min-h-[48px]"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Changes...' : 'Save Business Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
