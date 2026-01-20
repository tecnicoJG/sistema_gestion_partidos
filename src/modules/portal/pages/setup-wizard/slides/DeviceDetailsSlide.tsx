import { useEffect, useState } from 'react';

import { BaseSlide } from './BaseSlide';

import type { DeviceDetails } from '@/../../lib/types/device.types';

interface DeviceDetailsSlideProps {
  isActive: boolean;
  isPast: boolean;
  initialConfig?: DeviceDetails;
  setValidation: (isValid: boolean) => void;
  setSlideConfig: (data: DeviceDetails | undefined) => void;
}

export const DeviceDetailsSlide = ({
  isActive,
  isPast,
  initialConfig,
  setValidation,
  setSlideConfig,
}: DeviceDetailsSlideProps) => {
  const [data, setData] = useState(initialConfig);

  const checkValidity = () => {
    if (!data) return false;
    if (!data.courtName || data.courtName.trim() === '') return false;
    if (data.venue?.address && (!data.venue.name || data.venue.name.trim() === '')) return false;
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

  return (
    <BaseSlide isActive={isActive} isPast={isPast}>
      <h1 className="text-5xl font-black text-display-text-primary mb-4 uppercase tracking-wider">
        Device Details
      </h1>
      <p className="text-2xl text-display-text-secondary mb-12 uppercase tracking-wide">
        Court and venue information
      </p>

      <div className="space-y-8">
        <div>
          <label className="block text-xl font-bold text-display-text-primary mb-4 uppercase tracking-wider">
            Court Name *
          </label>
          <input
            type="text"
            value={data?.courtName || ''}
            onChange={(e) => {
              setData((prev) => ({ ...prev, courtName: e.target.value }));
            }}
            placeholder="e.g., Court 1, Main Court"
            className="w-full px-6 py-4 text-2xl bg-display-bg-tertiary text-display-text-primary rounded-xl border-2 border-transparent focus:border-display-accent outline-none uppercase tracking-wider placeholder:normal-case placeholder:tracking-normal"
          />
        </div>

        <div>
          <label className="block text-xl font-bold text-display-text-primary mb-4 uppercase tracking-wider">
            Venue Name {data?.venue?.address && '*'}
          </label>
          <input
            type="text"
            value={data?.venue?.name || ''}
            onChange={(e) => {
              setData((prev) => ({
                ...prev,
                venue: {
                  name: e.target.value,
                  address: prev?.venue?.address,
                },
              }));
            }}
            placeholder="e.g., SportCenter Barcelona"
            className="w-full px-6 py-4 text-2xl bg-display-bg-tertiary text-display-text-primary rounded-xl border-2 border-transparent focus:border-display-accent outline-none uppercase tracking-wider placeholder:normal-case placeholder:tracking-normal"
          />
        </div>

        <div>
          <label className="block text-xl font-bold text-display-text-primary mb-4 uppercase tracking-wider">
            Venue Address
          </label>
          <input
            type="text"
            value={data?.venue?.address || ''}
            onChange={(e) => {
              setData((prev) => ({
                ...prev,
                venue: {
                  name: prev?.venue?.name || '',
                  address: e.target.value,
                },
              }));
            }}
            placeholder="e.g., Av. Diagonal 123, Barcelona"
            className="w-full px-6 py-4 text-2xl bg-display-bg-tertiary text-display-text-primary rounded-xl border-2 border-transparent focus:border-display-accent outline-none placeholder:normal-case placeholder:tracking-normal"
          />
        </div>
      </div>
    </BaseSlide>
  );
};
