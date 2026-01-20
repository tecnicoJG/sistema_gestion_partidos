import { useEffect, useState } from 'react';

import { BaseSlide } from './BaseSlide';

import type { DeviceCredentials } from '@/../../lib/types/device.types';

interface CredentialsSlideProps {
  isActive: boolean;
  isPast: boolean;
  initialConfig?: DeviceCredentials;
  setValidation: (isValid: boolean) => void;
  setSlideConfig: (data: DeviceCredentials | undefined) => void;
}

export function CredentialsSlide({
  isActive,
  isPast,
  initialConfig,
  setValidation,
  setSlideConfig,
}: CredentialsSlideProps) {
  const [data, setData] = useState<DeviceCredentials | undefined>(initialConfig);
  const [showAdminPIN, setShowAdminPIN] = useState(false);
  const [showStaffPIN, setShowStaffPIN] = useState(false);

  const checkValidity = () => {
    if (!data) return true;

    if (data.staffPIN && !data.adminPIN) return false;

    if (data.adminPIN && data.adminPIN.length < 6) return false;
    if (data.staffPIN && data.staffPIN.length < 6) return false;

    return true;
  };

  useEffect(() => {
    if (isActive && setValidation && setSlideConfig) {
      setSlideConfig(data);
      setValidation(checkValidity());
    } else {
      setValidation(false);
    }
  }, [data, isActive, setSlideConfig, setValidation]);

  useEffect(() => {
    if (data) {
      // Check if all fields are empty
      const isEmpty =
        (!data.adminPIN || data.adminPIN.trim() === '') &&
        (!data.staffPIN || data.staffPIN.trim() === '');

      if (isEmpty) {
        setData(undefined);
      }
    }
  }, [data]);

  return (
    <BaseSlide isActive={isActive} isPast={isPast}>
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
            Admin PIN {data && data.staffPIN && '*'}
          </label>
          <div className="relative">
            <input
              type={showAdminPIN ? 'text' : 'password'}
              value={data?.adminPIN || ''}
              onChange={(e) => {
                const numericValue = e.target.value.replace(/\D/g, '').slice(0, 6);
                setData((prev) => ({ ...(prev || {}), adminPIN: numericValue }));
              }}
              placeholder="6 digit PIN"
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
        </div>

        {/* Staff PIN */}
        <div>
          <label className="block text-xl font-bold text-display-text-primary mb-4 uppercase tracking-wider">
            Staff PIN
          </label>
          <div className="relative">
            <input
              type={showStaffPIN ? 'text' : 'password'}
              value={data?.staffPIN || ''}
              onChange={(e) => {
                const numericValue = e.target.value.replace(/\D/g, '').slice(0, 6);
                setData((prev) => ({
                  adminPIN: prev?.adminPIN || '',
                  staffPIN: numericValue,
                }));
              }}
              placeholder="6 digit PIN"
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
        </div>
      </div>
    </BaseSlide>
  );
}
