import React from 'react';
import { FileText, ShieldAlert, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export const TermsPage = () => {
  const { settings, formatCurrency } = useSettings();

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12">
          <span className="text-xs font-black uppercase tracking-widest text-brand-600 bg-brand-50 px-3 py-1 rounded-md">
            Rental Agreement
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal-900 mt-2">
            Rental Terms & Conditions
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Last Updated: 2026 • Thilini Rent A Car (Sri Lanka)
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-card space-y-8 text-sm text-charcoal-700 leading-relaxed">
          {/* Section 1: Eligibility */}
          <section className="space-y-2">
            <h2 className="text-base font-extrabold text-charcoal-900 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-brand-600" />
              <span>1. Driver Eligibility & Documents</span>
            </h2>
            <p>
              To rent a self-drive vehicle, the driver must be at least 21 years of age with a minimum of 1 year of driving experience.
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-xs text-gray-600">
              <li><strong>Sri Lankan Residents:</strong> Valid Sri Lankan National Identity Card (NIC) or Passport, valid Sri Lankan Driving Licence, and utility proof of residence.</li>
              <li><strong>Foreign Nationals & Tourists:</strong> Valid Passport with entry visa, home country Driving Licence, and an International Driving Permit (IDP) or AA Sri Lanka temporary driving licence endorsement.</li>
            </ul>
          </section>

          {/* Section 2: Security Deposit */}
          <section className="space-y-2 pt-4 border-t border-gray-100">
            <h2 className="text-base font-extrabold text-charcoal-900 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-brand-600" />
              <span>2. Refundable Security Deposit</span>
            </h2>
            <p>
              A refundable security deposit (standard amount typically {formatCurrency(settings.standardDeposit || 25000)}) is collected upon vehicle handover. This deposit is promptly refunded in full upon safe return of the vehicle, subject to fuel policy adherence and excess mileage deduction if applicable.
            </p>
          </section>

          {/* Section 3: Mileage Allowance & Excess */}
          <section className="space-y-2 pt-4 border-t border-gray-100">
            <h2 className="text-base font-extrabold text-charcoal-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-600" />
              <span>3. Mileage Allowance & Excess Usage</span>
            </h2>
            <p>
              Standard daily rentals include {settings.includedMileagePerDay || 100} km per day calculated cumulatively across the full hire duration. Any extra mileage beyond this cumulative allowance will be billed at the agreed excess rate per kilometer (typically {formatCurrency(settings.excessMileageRate || 75)}/km).
            </p>
          </section>

          {/* Section 4: Fuel Policy */}
          <section className="space-y-2 pt-4 border-t border-gray-100">
            <h2 className="text-base font-extrabold text-charcoal-900 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-brand-600" />
              <span>4. Fuel Policy (Same-to-Same)</span>
            </h2>
            <p>
              Vehicles are handed over with a recorded fuel gauge level and must be returned with the equivalent fuel level. If returned with less fuel, the cost of refueling plus a standard refilling charge will be deducted from the security deposit.
            </p>
          </section>

          {/* Section 5: Cancellations & Amendments */}
          <section className="space-y-2 pt-4 border-t border-gray-100">
            <h2 className="text-base font-extrabold text-charcoal-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-brand-600" />
              <span>5. Booking Amendments & Cancellation</span>
            </h2>
            <p>
              Booking requests submitted online remain in <em>Pending</em> status until confirmed. Customers may cancel or modify their reservation request without penalty by informing us via WhatsApp or telephone at least 48 hours prior to the scheduled pickup time.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
