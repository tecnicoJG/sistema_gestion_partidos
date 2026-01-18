import type { DeviceConfiguration } from '@/../../lib/types/device.types';
import { useState } from 'react';

interface CredentialsSlideProps {
  data: Partial<DeviceConfiguration>;
  updateData: (data: Partial<DeviceConfiguration>) => void;
  onNext: () => void;
}

export function CredentialsSlide({ data, updateData }: CredentialsSlideProps) {
  const [showAdminPIN, setShowAdminPIN] = useState(false);
  const [showStaffPIN, setShowStaffPIN] = useState(false);

  return (
    <>
      <h1 className="text-5xl font-black text-display-text-primary mb-4 uppercase tracking-wider">
        Security
      </h1>
      <p className="text-2xl text-display-text-secondary mb-12 uppercase tracking-wide">
        Set up access credentials
      </p>

      <div className="space-y-8">
        {/* Admin PIN */}
        <div>
          <label className="block text-xl font-bold text-display-text-primary mb-4 uppercase tracking-wider">
            Admin PIN (Required)
          </label>
          <div className="relative">
            <input
              type={showAdminPIN ? 'text' : 'password'}
              value={data.credentials?.adminPIN || ''}
              onChange={(e) =>
                updateData({
                  credentials: {
                    ...data.credentials,
                    adminPIN: e.target.value,
                    staffPIN: data.credentials?.staffPIN,
                  },
                })
              }
              placeholder="4-6 digit PIN"
              maxLength={6}
              className="w-full px-6 py-4 text-2xl bg-display-bg-tertiary text-display-text-primary rounded-xl border-2 border-transparent focus:border-display-accent outline-none tracking-widest"
            />
            <button
              type="button"
              onClick={() => setShowAdminPIN(!showAdminPIN)}
              className="absolute right-4 top-1/2 -translate-y-1/2 px-4 py-2 text-sm font-bold text-display-text-secondary hover:text-display-text-primary uppercase"
            >
              {showAdminPIN ? 'Hide' : 'Show'}
            </button>
          </div>
          <p className="mt-2 text-sm text-display-text-secondary uppercase tracking-wide">
            Used for device configuration and admin access
          </p>
        </div>

        {/* Staff PIN */}
        <div>
          <label className="block text-xl font-bold text-display-text-primary mb-4 uppercase tracking-wider">
            Staff PIN (Optional)
          </label>
          <div className="relative">
            <input
              type={showStaffPIN ? 'text' : 'password'}
              value={data.credentials?.staffPIN || ''}
              onChange={(e) =>
                updateData({
                  credentials: {
                    adminPIN: data.credentials?.adminPIN || '',
                    staffPIN: e.target.value,
                  },
                })
              }
              placeholder="4-6 digit PIN"
              maxLength={6}
              className="w-full px-6 py-4 text-2xl bg-display-bg-tertiary text-display-text-primary rounded-xl border-2 border-transparent focus:border-display-accent outline-none tracking-widest"
            />
            <button
              type="button"
              onClick={() => setShowStaffPIN(!showStaffPIN)}
              className="absolute right-4 top-1/2 -translate-y-1/2 px-4 py-2 text-sm font-bold text-display-text-secondary hover:text-display-text-primary uppercase"
            >
              {showStaffPIN ? 'Hide' : 'Show'}
            </button>
          </div>
          <p className="mt-2 text-sm text-display-text-secondary uppercase tracking-wide">
            Used for basic game control operations
          </p>
        </div>

        {/* PIN Requirements */}
        <div className="bg-display-bg-tertiary bg-opacity-30 rounded-xl p-6">
          <h3 className="text-lg font-bold text-display-text-primary mb-3 uppercase tracking-wider">
            PIN Requirements
          </h3>
          <ul className="space-y-2 text-display-text-secondary uppercase tracking-wide">
            <li className="flex items-center gap-2">
              <span className="text-display-accent">•</span>
              <span>4 to 6 digits</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-display-accent">•</span>
              <span>Numbers only</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-display-accent">•</span>
              <span>Admin and staff PINs must be different</span>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
