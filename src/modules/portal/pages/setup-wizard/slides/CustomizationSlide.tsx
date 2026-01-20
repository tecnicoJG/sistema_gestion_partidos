import { useEffect, useState } from 'react';

import { BaseSlide } from './BaseSlide';

import type { DeviceTheme } from '@/../../lib/types/device.types';

interface CustomizationSlideProps {
  isActive: boolean;
  isPast: boolean;
  initialConfig: DeviceTheme;
  setValidation: (isValid: boolean) => void;
  setSlideConfig: (data: DeviceTheme) => void;
}

export function CustomizationSlide({
  isActive,
  isPast,
  initialConfig,
  setValidation,
  setSlideConfig,
}: CustomizationSlideProps) {
  const [data, setData] = useState<DeviceTheme>(initialConfig);
  const [localColor, setLocalColor] = useState<string>(initialConfig.primaryColor || '#FFFFFF');

  const checkValidity = () => {
    if (!data) return false;

    if (!data.default || data.default.trim() === '') return false;

    if (data.primaryColor) {
      const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
      if (!hexColorRegex.test(data.primaryColor)) return false;
    }

    return true;
  };

  // Debounce color updates to data state
  useEffect(() => {
    const timer = setTimeout(() => {
      setData((prev) => ({ ...prev, primaryColor: localColor }));
    }, 150);

    return () => clearTimeout(timer);
  }, [localColor]);

  useEffect(() => {
    if (isActive && setValidation && setSlideConfig) {
      setSlideConfig(data);
      setValidation(checkValidity());
    } else {
      setValidation(false);
    }
  }, [data, isActive, setSlideConfig, setValidation]);

  const handleClearColor = () => {
    setData((prev) => {
      delete prev.primaryColor;
      return prev;
    });
    setLocalColor('#FFFFFF');
  };

  return (
    <BaseSlide isActive={isActive} isPast={isPast}>
      <h1 className="text-5xl font-black text-display-text-primary mb-4 uppercase tracking-wider">
        Customization
      </h1>
      <p className="text-2xl text-display-text-secondary mb-12 uppercase tracking-wide">
        Personalize your controller's color scheme
      </p>

      <div className="space-y-8">
        {/* Theme Selection */}
        <div>
          <label className="block text-xl font-bold text-display-text-primary mb-4 uppercase tracking-wider">
            Default Theme
          </label>
          <div className="flex gap-4">
            <button
              onClick={() => setData((prev) => ({ ...prev, default: 'light' }))}
              className={`flex-1 px-8 py-4 text-xl font-bold rounded-xl uppercase tracking-wider transition-all ${
                data?.default === 'light'
                  ? 'bg-display-accent text-gray-900'
                  : 'bg-display-bg-tertiary text-display-text-secondary'
              }`}
            >
              Light
            </button>
            <button
              onClick={() => setData((prev) => ({ ...prev, default: 'dark' }))}
              className={`flex-1 px-8 py-4 text-xl font-bold rounded-xl uppercase tracking-wider transition-all ${
                data?.default === 'dark'
                  ? 'bg-display-accent text-gray-900'
                  : 'bg-display-bg-tertiary text-display-text-secondary'
              }`}
            >
              Dark
            </button>
          </div>
        </div>

        {/* Custom Color Input */}
        <div>
          <label className="block text-lg font-bold text-display-text-primary mb-3 uppercase tracking-wider">
            Brand Color
          </label>
          <div className="flex gap-4 items-center">
            <input
              type="color"
              value={localColor}
              onChange={(e) => setLocalColor(e.target.value)}
              className="h-16 w-24 rounded-xl cursor-pointer bg-display-bg-tertiary"
            />
            <button
              onClick={handleClearColor}
              className="flex-1 px-8 py-4 text-xl font-bold rounded-xl uppercase tracking-wider transition-all bg-display-bg-tertiary text-display-text-secondary"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </BaseSlide>
  );
}
