import type { DeviceConfiguration, NetworkConfig } from '@/../../lib/types/device.types';
import { useState } from 'react';

interface NetworkConfigSlideProps {
  data: Partial<DeviceConfiguration>;
  updateData: (data: Partial<DeviceConfiguration>) => void;
  onNext: () => void;
}

export function NetworkConfigSlide({ data, updateData }: NetworkConfigSlideProps) {
  const [mode, setMode] = useState<'ap' | 'client'>(data.networkConfig?.mode || 'ap');
  const [connectionType, setConnectionType] = useState<'wifi' | 'ethernet'>('wifi');
  const [ipConfigType, setIpConfigType] = useState<'dhcp' | 'static'>('dhcp');

  const handleModeChange = (newMode: 'ap' | 'client') => {
    setMode(newMode);
    if (newMode === 'ap') {
      updateData({
        networkConfig: {
          mode: 'ap',
          ssid: '',
          password: '',
          security: 'WPA2',
          ip: '192.168.4.1',
          subnet: '255.255.255.0',
        } as NetworkConfig,
      });
    } else {
      updateData({
        networkConfig: {
          mode: 'client',
          hostname: '',
          ipConfig: { type: 'dhcp' },
          connection: { type: 'wifi', ssid: '', password: '', security: 'WPA2' },
        } as NetworkConfig,
      });
    }
  };

  return (
    <>
      <h1 className="text-5xl font-black text-display-text-primary mb-4 uppercase tracking-wider">
        Network Configuration
      </h1>
      <p className="text-2xl text-display-text-secondary mb-12 uppercase tracking-wide">
        Configure network settings
      </p>

      {/* Mode Selection */}
      <div className="mb-8">
        <label className="block text-xl font-bold text-display-text-primary mb-4 uppercase tracking-wider">
          Network Mode
        </label>
        <div className="flex gap-4">
          <button
            onClick={() => handleModeChange('ap')}
            className={`flex-1 px-8 py-4 text-xl font-bold rounded-xl uppercase tracking-wider transition-all ${
              mode === 'ap'
                ? 'bg-display-accent text-gray-900'
                : 'bg-display-bg-tertiary text-display-text-secondary'
            }`}
          >
            Access Point
          </button>
          <button
            onClick={() => handleModeChange('client')}
            className={`flex-1 px-8 py-4 text-xl font-bold rounded-xl uppercase tracking-wider transition-all ${
              mode === 'client'
                ? 'bg-display-accent text-gray-900'
                : 'bg-display-bg-tertiary text-display-text-secondary'
            }`}
          >
            Client
          </button>
        </div>
      </div>

      {/* AP Mode Configuration */}
      {mode === 'ap' && (
        <div className="space-y-6">
          <div>
            <label className="block text-lg font-bold text-display-text-primary mb-3 uppercase tracking-wider">
              Network Name (SSID)
            </label>
            <input
              type="text"
              value={data.networkConfig?.mode === 'ap' ? data.networkConfig.ssid : ''}
              onChange={(e) =>
                updateData({
                  networkConfig: {
                    ...data.networkConfig,
                    ssid: e.target.value,
                  } as NetworkConfig,
                })
              }
              placeholder="CourtController-XXXX"
              className="w-full px-6 py-4 text-xl bg-display-bg-tertiary text-display-text-primary rounded-xl border-2 border-transparent focus:border-display-accent outline-none"
            />
          </div>

          <div>
            <label className="block text-lg font-bold text-display-text-primary mb-3 uppercase tracking-wider">
              Password (Optional)
            </label>
            <input
              type="password"
              value={data.networkConfig?.mode === 'ap' ? data.networkConfig.password || '' : ''}
              onChange={(e) =>
                updateData({
                  networkConfig: {
                    ...data.networkConfig,
                    password: e.target.value,
                  } as NetworkConfig,
                })
              }
              placeholder="Leave empty for open network"
              className="w-full px-6 py-4 text-xl bg-display-bg-tertiary text-display-text-primary rounded-xl border-2 border-transparent focus:border-display-accent outline-none"
            />
          </div>
        </div>
      )}

      {/* Client Mode Configuration */}
      {mode === 'client' && (
        <div className="space-y-6">
          {/* Connection Type */}
          <div>
            <label className="block text-lg font-bold text-display-text-primary mb-3 uppercase tracking-wider">
              Connection Type
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => setConnectionType('wifi')}
                className={`flex-1 px-6 py-3 text-lg font-bold rounded-lg uppercase tracking-wider ${
                  connectionType === 'wifi'
                    ? 'bg-display-accent text-gray-900'
                    : 'bg-display-bg-tertiary text-display-text-secondary'
                }`}
              >
                WiFi
              </button>
              <button
                onClick={() => setConnectionType('ethernet')}
                className={`flex-1 px-6 py-3 text-lg font-bold rounded-lg uppercase tracking-wider ${
                  connectionType === 'ethernet'
                    ? 'bg-display-accent text-gray-900'
                    : 'bg-display-bg-tertiary text-display-text-secondary'
                }`}
              >
                Ethernet
              </button>
            </div>
          </div>

          {/* WiFi Settings */}
          {connectionType === 'wifi' && (
            <>
              <div>
                <label className="block text-lg font-bold text-display-text-primary mb-3 uppercase tracking-wider">
                  Network Name (SSID)
                </label>
                <input
                  type="text"
                  placeholder="Your WiFi Network"
                  className="w-full px-6 py-4 text-xl bg-display-bg-tertiary text-display-text-primary rounded-xl border-2 border-transparent focus:border-display-accent outline-none"
                />
              </div>

              <div>
                <label className="block text-lg font-bold text-display-text-primary mb-3 uppercase tracking-wider">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="WiFi Password"
                  className="w-full px-6 py-4 text-xl bg-display-bg-tertiary text-display-text-primary rounded-xl border-2 border-transparent focus:border-display-accent outline-none"
                />
              </div>
            </>
          )}

          {/* IP Configuration */}
          <div>
            <label className="block text-lg font-bold text-display-text-primary mb-3 uppercase tracking-wider">
              IP Configuration
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => setIpConfigType('dhcp')}
                className={`flex-1 px-6 py-3 text-lg font-bold rounded-lg uppercase tracking-wider ${
                  ipConfigType === 'dhcp'
                    ? 'bg-display-accent text-gray-900'
                    : 'bg-display-bg-tertiary text-display-text-secondary'
                }`}
              >
                DHCP (Automatic)
              </button>
              <button
                onClick={() => setIpConfigType('static')}
                className={`flex-1 px-6 py-3 text-lg font-bold rounded-lg uppercase tracking-wider ${
                  ipConfigType === 'static'
                    ? 'bg-display-accent text-gray-900'
                    : 'bg-display-bg-tertiary text-display-text-secondary'
                }`}
              >
                Static
              </button>
            </div>
          </div>

          {/* Static IP Fields */}
          {ipConfigType === 'static' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-display-text-primary mb-2 uppercase">
                  IP Address
                </label>
                <input
                  type="text"
                  placeholder="192.168.1.100"
                  className="w-full px-4 py-3 text-lg bg-display-bg-tertiary text-display-text-primary rounded-lg border-2 border-transparent focus:border-display-accent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-display-text-primary mb-2 uppercase">
                  Subnet Mask
                </label>
                <input
                  type="text"
                  placeholder="255.255.255.0"
                  className="w-full px-4 py-3 text-lg bg-display-bg-tertiary text-display-text-primary rounded-lg border-2 border-transparent focus:border-display-accent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-display-text-primary mb-2 uppercase">
                  Gateway
                </label>
                <input
                  type="text"
                  placeholder="192.168.1.1"
                  className="w-full px-4 py-3 text-lg bg-display-bg-tertiary text-display-text-primary rounded-lg border-2 border-transparent focus:border-display-accent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-display-text-primary mb-2 uppercase">
                  DNS Server
                </label>
                <input
                  type="text"
                  placeholder="8.8.8.8"
                  className="w-full px-4 py-3 text-lg bg-display-bg-tertiary text-display-text-primary rounded-lg border-2 border-transparent focus:border-display-accent outline-none"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
