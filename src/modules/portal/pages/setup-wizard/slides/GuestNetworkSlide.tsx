import type { DeviceConfiguration } from '@/../../lib/types/device.types';
import { useState } from 'react';

interface GuestNetworkSlideProps {
  data: Partial<DeviceConfiguration>;
  updateData: (data: Partial<DeviceConfiguration>) => void;
  onNext: () => void;
  onSkip?: () => void;
}

export function GuestNetworkSlide({ data, updateData }: GuestNetworkSlideProps) {
  const [enabled, setEnabled] = useState(!!data.guestNetwork);

  const handleToggle = (enable: boolean) => {
    setEnabled(enable);
    if (!enable) {
      updateData({ guestNetwork: undefined });
    } else {
      updateData({
        guestNetwork: {
          ssid: '',
          password: '',
          security: 'WPA2',
        },
      });
    }
  };

  return (
    <>
      <h1 className="text-5xl font-black text-display-text-primary mb-4 uppercase tracking-wider">
        Guest Network
      </h1>
      <p className="text-2xl text-display-text-secondary mb-12 uppercase tracking-wide">
        WiFi network for venue guests
      </p>

      <div className="space-y-8">
        <div>
          <label className="block text-xl font-bold text-display-text-primary mb-4 uppercase tracking-wider">
            Enable Guest Network
          </label>
          <div className="flex gap-4">
            <button
              onClick={() => handleToggle(true)}
              className={`flex-1 px-8 py-4 text-xl font-bold rounded-xl uppercase tracking-wider transition-all ${
                enabled
                  ? 'bg-display-accent text-gray-900'
                  : 'bg-display-bg-tertiary text-display-text-secondary'
              }`}
            >
              Yes
            </button>
            <button
              onClick={() => handleToggle(false)}
              className={`flex-1 px-8 py-4 text-xl font-bold rounded-xl uppercase tracking-wider transition-all ${
                !enabled
                  ? 'bg-display-accent text-gray-900'
                  : 'bg-display-bg-tertiary text-display-text-secondary'
              }`}
            >
              No
            </button>
          </div>
        </div>

        {enabled && (
          <>
            <div>
              <label className="block text-lg font-bold text-display-text-primary mb-3 uppercase tracking-wider">
                Network Name (SSID)
              </label>
              <input
                type="text"
                value={data.guestNetwork?.ssid || ''}
                onChange={(e) =>
                  updateData({
                    guestNetwork: {
                      ...data.guestNetwork!,
                      ssid: e.target.value,
                    },
                  })
                }
                placeholder="Guest WiFi"
                className="w-full px-6 py-4 text-xl bg-display-bg-tertiary text-display-text-primary rounded-xl border-2 border-transparent focus:border-display-accent outline-none placeholder:normal-case"
              />
            </div>

            <div>
              <label className="block text-lg font-bold text-display-text-primary mb-3 uppercase tracking-wider">
                Password (Optional)
              </label>
              <input
                type="password"
                value={data.guestNetwork?.password || ''}
                onChange={(e) =>
                  updateData({
                    guestNetwork: {
                      ...data.guestNetwork!,
                      password: e.target.value,
                    },
                  })
                }
                placeholder="Leave empty for open network"
                className="w-full px-6 py-4 text-xl bg-display-bg-tertiary text-display-text-primary rounded-xl border-2 border-transparent focus:border-display-accent outline-none placeholder:normal-case"
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}
