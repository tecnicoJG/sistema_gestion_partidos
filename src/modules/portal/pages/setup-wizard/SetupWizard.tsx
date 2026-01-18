import type { DeviceConfiguration } from '@/../../lib/types/device.types';
import { useEffect, useState } from 'react';
import { CustomScrollbar } from '../../components/CustomScrollbar';
import { LocalSetupSlides } from './LocalSetupSlides';
import { MasterSetupSlides } from './MasterSetupSlides';
import { SetupCompleteScreen } from './SetupCompleteScreen';
import { SetupWelcomeScreen } from './SetupWelcomeScreen';

type SetupStep = 'welcome' | 'local-setup' | 'master-setup' | 'complete';

export function SetupWizard() {
  const [currentStep, setCurrentStep] = useState<SetupStep>('welcome');
  const [setupData, setSetupData] = useState<DeviceConfiguration | null>(null);
  const [isFetching, setIsFetching] = useState(true); // Start as true since useEffect will fetch immediately
  const [showLoadingSpinner, setShowLoadingSpinner] = useState(false);

  const fetchConfig = async () => {
    setIsFetching(true);

    let spinnerShown = false;
    let spinnerShownAt = 0;

    // Delay showing loading spinner by 0.5s
    const spinnerTimeout = setTimeout(() => {
      setShowLoadingSpinner(true);
      spinnerShown = true;
      spinnerShownAt = Date.now();
    }, 500);

    try {
      const response = await fetch('/api/device/config');
      if (response.ok) {
        const config: DeviceConfiguration = await response.json();
        setSetupData(config);
      } else {
        console.error('Failed to fetch device configuration');
      }
    } catch (error) {
      console.error('Error fetching device configuration:', error);
    } finally {
      clearTimeout(spinnerTimeout);

      // If spinner was shown, ensure it displays for at least 1s
      if (spinnerShown) {
        const spinnerElapsed = Date.now() - spinnerShownAt;
        const remainingTime = Math.max(0, 1000 - spinnerElapsed);
        setTimeout(() => {
          setShowLoadingSpinner(false);
          setIsFetching(false);
        }, remainingTime);
      } else {
        setShowLoadingSpinner(false);
        setIsFetching(false);
      }
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleSetupTypeSelect = (setupType: 'local-setup' | 'master-setup') => {
    setCurrentStep(setupType);
  };

  const handleLocaleChange = (locale: 'en' | 'es') => {
    setSetupData((prev) => (prev ? { ...prev, locale } : null));
  };

  const handleSetupComplete = async (data: Partial<DeviceConfiguration>) => {
    if (!setupData) return;

    const finalData = { ...setupData, ...data };
    setSetupData(finalData);

    // Save configuration to the server
    try {
      const response = await fetch('/api/device/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalData),
      });

      if (response.ok) {
        setCurrentStep('complete');
      } else {
        console.error('Failed to save configuration');
        // TODO: Show error message to user
      }
    } catch (error) {
      console.error('Error saving configuration:', error);
      // TODO: Show error message to user
    }
  };

  const handleBackToWelcome = () => {
    setCurrentStep('welcome');
  };

  const handleContinue = () => {
    window.location.href = '/';
  };

  return (
    <div className="h-screen bg-display-bg-secondary flex flex-col">
      {showLoadingSpinner ? (
        /* Loading spinner - shown after 500ms delay */
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-8">
            {/* Spinner - matching display module style */}
            <div className="w-16 h-16 rounded-full border-t-[0.35rem] border-r-[0.35rem] border-t-display-text-primary border-r-transparent animate-spin"></div>
            <div className="text-3xl font-semibold text-display-text-secondary">Loading...</div>
          </div>
        </div>
      ) : isFetching /* Fetching but spinner not shown yet - blank background */ ? null : !setupData ? (
        /* Error state - failed to fetch configuration */
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-6">
            {/* Connection failure icon */}
            <div className="w-24 h-24 rounded-full bg-display-text-secondary/10 flex items-center justify-center">
              <svg
                className="w-16 h-16 text-display-text-secondary/50"
                viewBox="0 0 52 52"
                fill="currentColor"
              >
                <g>
                  <g>
                    <path d="M18.1,36.9l9.4-9.5l0.7-0.7l8.4-8.4l3.7-3.7l4.1-4.1c0.7-0.6,0.8-1.5,0.3-2l-1.8-1.8    c-0.4-0.4-1.1-0.4-1.7-0.1L6.7,40.9L6.7,41c-0.6,0.6-0.7,1.5-0.3,2l1.8,1.8c0.5,0.5,1.4,0.4,2-0.3l4-4    C14.2,40.6,18.1,36.9,18.1,36.9z" />
                  </g>
                  <path d="M18.4,23.1c-0.5,0-0.8,0.4-1,0.8c-0.1,0.6-0.1,1.2-0.1,1.8c0,0.4,0,0.8,0.1,1.2l3.8-3.8H18.4z" />
                  <path d="M8.3,36l4-4c-2.8-0.6-5-3-5.2-5.8c-0.3-3.8,2.8-6.9,6.5-6.9h9.1c0.7,0,1.4,0.1,2.1,0.4l3.9-3.9   c-0.9-0.5-1.8-1-2.7-1.2c-1-0.3-2.2-0.5-3.2-0.5h-8.7C7.5,14,2.1,18.9,1.9,25.2C1.7,29.9,4.3,34,8.3,36z" />
                  <path d="M43.1,15.3l-4,4c2.9,0.5,5.2,2.9,5.4,5.9c0.3,3.8-2.8,6.9-6.5,6.9H29c-0.8,0-1.6-0.2-2.3-0.4l-3.9,3.9   c0.9,0.6,1.8,1,2.8,1.3c1,0.3,2.2,0.5,3.2,0.5H38c6.6,0.1,11.9-5.4,11.7-12C49.5,20.8,46.8,17.1,43.1,15.3z" />
                  <path d="M30.1,28.3h3c0.5,0,0.8-0.4,1-0.8c0.1-0.6,0.1-1.2,0.1-1.8c0-0.5,0-0.9-0.1-1.4L30.1,28.3z" />
                </g>
              </svg>
            </div>
            <div className="text-center">
              <div className="text-3xl font-semibold text-display-text-primary mb-2">
                Device Unreachable
              </div>
              <div className="text-xl text-display-text-secondary">Unable to connect to device</div>
            </div>
            <button
              onClick={fetchConfig}
              className="mt-4 py-3 px-6 hover:bg-gray-100/20 text-display-text-primary text-xl font-bold rounded-lg transition-all duration-150 uppercase tracking-wider"
            >
              Retry Connection
            </button>
          </div>
        </div>
      ) : (
        /* Setup wizard content */
        <div className="flex-1 relative overflow-hidden">
          {/* Welcome Screen */}
          <div
            className={`absolute inset-0 transition-opacity duration-500 ${
              currentStep === 'welcome' ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <div className="h-full flex justify-center px-4">
              <CustomScrollbar className="w-full max-w-4xl h-full">
                <div className="min-h-full flex items-center py-6">
                  <div className="w-full">
                    <SetupWelcomeScreen
                      onSelectSetupType={handleSetupTypeSelect}
                      onLocaleChange={handleLocaleChange}
                      selectedLocale={setupData.locale}
                    />
                  </div>
                </div>
              </CustomScrollbar>
            </div>
          </div>

          {/* Local Setup */}
          <div
            className={`absolute inset-0 transition-opacity duration-500 ${
              currentStep === 'local-setup' ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <LocalSetupSlides onComplete={handleSetupComplete} onBack={handleBackToWelcome} />
          </div>

          {/* Master Setup */}
          <div
            className={`absolute inset-0 transition-opacity duration-500 ${
              currentStep === 'master-setup' ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <MasterSetupSlides onComplete={handleSetupComplete} onBack={handleBackToWelcome} />
          </div>

          {/* Complete Screen */}
          <div
            className={`absolute inset-0 transition-opacity duration-500 ${
              currentStep === 'complete' ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <div className="h-full flex justify-center px-4">
              <CustomScrollbar className="w-full max-w-4xl h-full">
                <div className="min-h-full flex items-center py-6">
                  <div className="w-full">
                    <SetupCompleteScreen onContinue={handleContinue} />
                  </div>
                </div>
              </CustomScrollbar>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
