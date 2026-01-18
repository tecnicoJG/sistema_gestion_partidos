import type { DeviceConfiguration } from '@/../../lib/types/device.types';
import { useState } from 'react';
import { CustomScrollbar } from '../../components/CustomScrollbar';
import { CourtDetailsSlide } from './slides/CourtDetailsSlide';
import { CredentialsSlide } from './slides/CredentialsSlide';
import { CustomizationSlide } from './slides/CustomizationSlide';
import { GuestNetworkSlide } from './slides/GuestNetworkSlide';
import { NetworkConfigSlide } from './slides/NetworkConfigSlide';
import { SmtpConfigSlide } from './slides/SmtpConfigSlide';

interface LocalSetupSlidesProps {
  onComplete: (data: Partial<DeviceConfiguration>) => void;
  onBack: () => void;
}

export function LocalSetupSlides({ onComplete, onBack }: LocalSetupSlidesProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [setupData, setSetupData] = useState<Partial<DeviceConfiguration>>({});

  const updateData = (data: Partial<DeviceConfiguration>) => {
    setSetupData((prev) => ({ ...prev, ...data }));
  };

  const slides = [
    { component: CourtDetailsSlide, canSkip: false },
    { component: NetworkConfigSlide, canSkip: false },
    { component: GuestNetworkSlide, canSkip: true },
    { component: SmtpConfigSlide, canSkip: true },
    { component: CustomizationSlide, canSkip: false },
    { component: CredentialsSlide, canSkip: false },
  ];

  const canSkip = slides[currentSlide]?.canSkip || false;

  const goNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete(setupData);
    }
  };

  const goBack = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    } else {
      onBack();
    }
  };

  const skip = () => {
    if (canSkip) {
      goNext();
    }
  };

  return (
    <div className="h-screen bg-display-bg-secondary flex flex-col">
      {/* Navigation Page Indicators */}
      <div className="flex justify-center items-center gap-2 border-b border-display-bg-primary bg-display-bg-secondary p-6">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`h-3 rounded-full transition-all ${
              currentSlide < index
                ? 'w-3 bg-display-text-secondary opacity-50'
                : currentSlide > index
                  ? 'w-3 bg-display-accent'
                  : 'w-8 bg-display-accent'
            }`}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden px-4">
        <div className="h-full max-w-4xl mx-auto relative">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-300 ease-in-out ${
                index === currentSlide
                  ? 'opacity-100 translate-x-0'
                  : index < currentSlide
                    ? 'opacity-0 -translate-x-full pointer-events-none'
                    : 'opacity-0 translate-x-full pointer-events-none'
              }`}
            >
              <CustomScrollbar className="h-full">
                <div className="min-h-full flex items-center py-6">
                  <div className="w-full">
                    <slide.component data={setupData} updateData={updateData} onNext={goNext} />
                  </div>
                </div>
              </CustomScrollbar>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-center p-4 border-t border-display-bg-primary">
        <div className="max-w-4xl w-full flex justify-between ">
          <div>
            <button
              onClick={goBack}
              className="flex items-center justify-center gap-2 py-3 px-4 hover:bg-gray-100/20 text-display-text-primary text-xl font-bold rounded-lg transition-all duration-150 uppercase tracking-wider"
            >
              <svg className="h-6 w-6" viewBox="0 0 16 16">
                <path
                  fill="currentcolor"
                  fillRule="evenodd"
                  d="M10.707085,3.70711 C11.097605,3.31658 11.097605,2.68342 10.707085,2.29289 C10.316555,1.90237 9.683395,1.90237 9.292865,2.29289 L4.292875,7.29289 C3.902375,7.68342 3.902375,8.31658 4.292875,8.70711 L9.292865,13.7071 C9.683395,14.0976 10.316555,14.0976 10.707085,13.7071 C11.097605,13.3166 11.097605,12.6834 10.707085,12.2929 L6.414185,8 L10.707085,3.70711 Z"
                />
              </svg>
              Back
            </button>
          </div>

          <div className="flex gap-4">
            {canSkip && currentSlide < slides.length - 1 && (
              <button
                onClick={skip}
                className="flex items-center justify-center gap-2 py-3 px-4 hover:bg-gray-100/20 text-display-text-primary/40 hover:text-display-text-primary text-xl font-bold rounded-lg transition-all duration-150 uppercase tracking-wider"
              >
                Skip
                <svg className="h-6 w-6" viewBox="0 0 16 16">
                  <path
                    fill="currentcolor"
                    d="M3.70711,2.29289 L8.70711,7.29289 C9.09763,7.68342 9.09763,8.31658 8.70711,8.70711 L3.70711,13.7071 C3.31658,14.0976 2.68342,14.0976 2.29289,13.7071 C1.90237,13.3166 1.90237,12.6834 2.29289,12.2929 L6.58579,8 L2.29289,3.70711 C1.90237,3.31658 1.90237,2.68342 2.29289,2.29289 C2.68342,1.90237 3.31658,1.90237 3.70711,2.29289 Z M8.70711,2.29289 L13.7071,7.29289 C14.0976,7.68342 14.0976,8.31658 13.7071,8.70711 L8.70711,13.7071 C8.31658,14.0976 7.68342,14.0976 7.29289,13.7071 C6.90237,13.3166 6.90237,12.6834 7.29289,12.2929 L11.5858,8 L7.29289,3.70711 C6.90237,3.31658 6.90237,2.68342 7.29289,2.29289 C7.68342,1.90237 8.31658,1.90237 8.70711,2.29289 Z"
                  />
                </svg>
              </button>
            )}
            <button
              onClick={goNext}
              className="flex items-center justify-center gap-2 py-3 px-4 hover:bg-gray-100/20 text-display-text-primary text-xl font-bold rounded-lg transition-all duration-150 uppercase tracking-wider"
            >
              {currentSlide === slides.length - 1 ? 'Complete' : 'Next'}
              <svg className="h-6 w-6" viewBox="0 0 16 16">
                <path
                  fill="currentcolor"
                  fillRule="evenodd"
                  d="M5.29289,3.70711 C4.90237,3.31658 4.90237,2.68342 5.29289,2.29289 C5.68342,1.90237 6.31658,1.90237 6.70711,2.29289 L11.7071,7.29289 C12.0976,7.68342 12.0976,8.31658 11.7071,8.70711 L6.70711,13.7071 C6.31658,14.0976 5.68342,14.0976 5.29289,13.7071 C4.90237,13.3166 4.90237,12.6834 5.29289,12.2929 L9.58579,8 L5.29289,3.70711 Z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
