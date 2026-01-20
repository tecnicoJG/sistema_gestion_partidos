import { useEffect, useState } from 'react';

import { BaseSlide } from './BaseSlide';

import type { WiFiConfig } from '@/../../lib/types/device.types';

interface GuestNetworkSlideProps {
  isActive: boolean;
  isPast: boolean;
  initialConfig?: WiFiConfig;
  required: boolean;
  setValidation: (isValid: boolean) => void;
  setSlideConfig: (data: WiFiConfig | undefined) => void;
}

export const GuestNetworkSlide = ({
  isActive,
  isPast,
  initialConfig,
  required,
  setValidation,
  setSlideConfig,
}: GuestNetworkSlideProps) => {
  const [data, setData] = useState<WiFiConfig | undefined>(initialConfig);

  const checkValidity = () => {
    if (!data) return !required;

    if (!data.ssid || data.ssid.trim() === '') return false;

    // If security is not open, password must be at least 8 characters
    if (data.security !== 'open') {
      if (!data.password || data.password.length < 8) return false;
    }

    return true;
  };

  useEffect(() => {
    if (isActive && setValidation && setSlideConfig) {
      setSlideConfig(data);
      setValidation(checkValidity());
    } else {
      setValidation(false);
    }
  }, [data, isActive, required, setSlideConfig, setValidation]);

  useEffect(() => {
    if (data) {
      // Check if all fields are empty
      const isEmpty =
        (!data.ssid || data.ssid.trim() === '') && (!data.password || data.password.trim() === '');

      if (isEmpty) {
        setData(undefined);
      }
    }
  }, [data]);

  const handleSSIDChange = (value: string) => {
    setData((prev) => ({
      ssid: value,
      password: prev?.password,
      security: prev?.security || 'WPA2',
    }));
  };

  const handlePasswordChange = (value: string) => {
    setData((prev) => ({
      ssid: prev?.ssid || '',
      password: value,
      security: prev?.security || 'WPA2',
    }));
  };

  const handleSecurityChange = (value: 'WPA2' | 'WPA3' | 'open') => {
    setData((prev) => ({
      ssid: prev?.ssid || '',
      password: value !== 'open' ? prev?.password || '' : '',
      security: value,
    }));
  };

  return (
    <BaseSlide isActive={isActive} isPast={isPast}>
      <h1 className="text-5xl font-black text-display-text-primary mb-4 uppercase tracking-wider">
        Public Network
      </h1>
      <p className="text-2xl text-display-text-secondary mb-12 uppercase tracking-wide">
        WiFi network for players
      </p>

      <div className="space-y-8">
        <div>
          <label className="block text-xl font-bold text-display-text-primary mb-4 uppercase tracking-wider">
            Network Name (SSID) {(data || required) && '*'}
          </label>
          <input
            type="text"
            value={data?.ssid || ''}
            onChange={(e) => handleSSIDChange(e.target.value)}
            placeholder="Guest WiFi"
            className="w-full px-6 py-4 text-2xl bg-display-bg-tertiary text-display-text-primary rounded-xl border-2 border-transparent focus:border-display-accent outline-none uppercase tracking-wider placeholder:normal-case placeholder:tracking-normal"
          />
        </div>

        <div>
          <label className="block text-xl font-bold text-display-text-primary mb-4 uppercase tracking-wider">
            Security Type
          </label>
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => handleSecurityChange('WPA2')}
              className={`px-6 py-4 text-xl font-bold rounded-xl uppercase tracking-wider transition-all ${
                !data || data?.security === 'WPA2'
                  ? 'bg-display-accent text-gray-900'
                  : 'bg-display-bg-tertiary text-display-text-secondary'
              }`}
            >
              WPA2
            </button>
            <button
              onClick={() => handleSecurityChange('WPA3')}
              className={`px-6 py-4 text-xl font-bold rounded-xl uppercase tracking-wider transition-all ${
                data?.security === 'WPA3'
                  ? 'bg-display-accent text-gray-900'
                  : 'bg-display-bg-tertiary text-display-text-secondary'
              }`}
            >
              WPA3
            </button>
            <button
              onClick={() => handleSecurityChange('open')}
              className={`px-6 py-4 text-xl font-bold rounded-xl uppercase tracking-wider transition-all ${
                data?.security === 'open'
                  ? 'bg-display-accent text-gray-900'
                  : 'bg-display-bg-tertiary text-display-text-secondary'
              }`}
            >
              Open
            </button>
          </div>
        </div>

        {data?.security !== 'open' && (
          <div>
            <label className="block text-xl font-bold text-display-text-primary mb-4 uppercase tracking-wider">
              Password {(data || required) && '*'}
            </label>
            <input
              type="password"
              value={data?.password || ''}
              onChange={(e) => handlePasswordChange(e.target.value)}
              placeholder="Minimum 8 characters"
              className="w-full px-6 py-4 text-2xl bg-display-bg-tertiary text-display-text-primary rounded-xl border-2 border-transparent focus:border-display-accent outline-none tracking-wider placeholder:normal-case placeholder:tracking-normal"
            />
            {data?.password && data.password.length < 8 && (
              <p className="mt-2 text-sm text-red-500">Password must be at least 8 characters</p>
            )}
          </div>
        )}
      </div>
    </BaseSlide>
  );
};
