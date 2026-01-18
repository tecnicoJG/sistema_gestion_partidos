import type { DeviceConfiguration } from '@/../../lib/types/device.types';
import { useState } from 'react';

interface CompletionSlideProps {
  data: Partial<DeviceConfiguration>;
  updateData: (data: Partial<DeviceConfiguration>) => void;
  onNext: () => void;
}

export function CompletionSlide({ data }: CompletionSlideProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleComplete = async () => {
    setIsSaving(true);
    setSaveError('');

    try {
      const response = await fetch('/api/device/config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to save configuration');
      }

      setSaveSuccess(true);

      // Redirect to main portal after 2 seconds
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  return !saveSuccess ? (
    <>
      <div className="mb-8">
        <div className="w-32 h-32 mx-auto mb-6 bg-display-accent rounded-full flex items-center justify-center">
          <svg
            className="w-16 h-16 text-gray-900"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-6xl font-black text-display-text-primary mb-4 uppercase tracking-wider">
          Ready to Go!
        </h1>
        <p className="text-2xl text-display-text-secondary uppercase tracking-wide">
          Setup complete. Click finish to save your configuration.
        </p>
      </div>

      {/* Configuration Summary */}
      <div className="bg-display-bg-tertiary bg-opacity-30 rounded-xl p-8 mb-8 text-left max-h-96 overflow-y-auto">
        <h2 className="text-2xl font-bold text-display-text-primary mb-6 uppercase tracking-wider text-center">
          Configuration Summary
        </h2>
        <div className="space-y-4 text-display-text-secondary">
          {data.courtName && (
            <div>
              <span className="font-bold text-display-text-primary uppercase tracking-wide">
                Court:
              </span>{' '}
              <span className="uppercase">{data.courtName}</span>
            </div>
          )}
          {data.venue?.name && (
            <div>
              <span className="font-bold text-display-text-primary uppercase tracking-wide">
                Venue:
              </span>{' '}
              <span className="uppercase">{data.venue.name}</span>
            </div>
          )}
          {data.locale && (
            <div>
              <span className="font-bold text-display-text-primary uppercase tracking-wide">
                Language:
              </span>{' '}
              <span className="uppercase">{data.locale === 'en' ? 'English' : 'Español'}</span>
            </div>
          )}
          {data.networkConfig && (
            <div>
              <span className="font-bold text-display-text-primary uppercase tracking-wide">
                Network:
              </span>{' '}
              <span className="uppercase">
                {data.networkConfig.mode === 'ap' ? 'Access Point' : 'Client'} Mode
              </span>
            </div>
          )}
          {data.theme && (
            <div>
              <span className="font-bold text-display-text-primary uppercase tracking-wide">
                Theme:
              </span>{' '}
              <span className="uppercase">{data.theme.default}</span>
            </div>
          )}
        </div>
      </div>

      {saveError && (
        <div className="bg-red-500 bg-opacity-20 border-2 border-red-500 rounded-xl px-6 py-4 mb-8">
          <p className="text-xl text-red-200 uppercase tracking-wide">{saveError}</p>
        </div>
      )}

      <button
        onClick={handleComplete}
        disabled={isSaving}
        className="px-16 py-6 bg-display-accent text-gray-900 text-3xl font-bold rounded-xl hover:opacity-90 transition-opacity uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSaving ? 'Saving...' : 'Finish Setup'}
      </button>
    </>
  ) : (
    <div className="py-12">
      <div className="w-32 h-32 mx-auto mb-8 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
        <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="text-6xl font-black text-green-400 mb-4 uppercase tracking-wider">Success!</h1>
      <p className="text-2xl text-display-text-secondary uppercase tracking-wide">
        Redirecting to control panel...
      </p>
    </div>
  );
}
