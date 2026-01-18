import type { DeviceConfiguration } from '@/../../lib/types/device.types';

interface WelcomeSlideProps {
  data: Partial<DeviceConfiguration>;
  updateData: (data: Partial<DeviceConfiguration>) => void;
  onNext: () => void;
}

export function WelcomeSlide({ data, updateData, onNext }: WelcomeSlideProps) {
  const handleLanguageChange = (locale: 'en' | 'es') => {
    updateData({ locale });
  };

  return (
    <>
      <h1 className="text-6xl font-black text-display-text-primary mb-8 uppercase tracking-wider">
        Welcome
      </h1>
      <p className="text-3xl text-display-text-secondary mb-12 uppercase tracking-wide">
        Let's set up your court controller
      </p>

      <div className="mt-16">
        <label className="block text-2xl font-bold text-display-text-primary mb-6 uppercase tracking-wider">
          Select Language
        </label>
        <div className="flex gap-6 justify-center">
          <button
            onClick={() => handleLanguageChange('en')}
            className={`px-12 py-6 text-2xl font-bold rounded-xl uppercase tracking-wider transition-all ${
              data.locale === 'en'
                ? 'bg-display-accent text-gray-900 scale-110'
                : 'bg-display-bg-tertiary text-display-text-secondary hover:scale-105'
            }`}
          >
            English
          </button>
          <button
            onClick={() => handleLanguageChange('es')}
            className={`px-12 py-6 text-2xl font-bold rounded-xl uppercase tracking-wider transition-all ${
              data.locale === 'es'
                ? 'bg-display-accent text-gray-900 scale-110'
                : 'bg-display-bg-tertiary text-display-text-secondary hover:scale-105'
            }`}
          >
            Español
          </button>
        </div>
      </div>
    </>
  );
}
