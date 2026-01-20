import { useEffect, useState } from 'react';

import { BaseSlide } from './BaseSlide';

interface MasterConnectionSlideProps {
  isActive: boolean;
  isPast: boolean;
  setValidation: (isValid: boolean) => void;
  setSlideConfig: (data: undefined) => void;
}

export function MasterConnectionSlide({
  isActive,
  isPast,
  setValidation,
  setSlideConfig,
}: MasterConnectionSlideProps) {
  const [masterPIN, setMasterPIN] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState('');

  // This slide is always valid (it's optional - can be skipped)
  useEffect(() => {
    if (isActive && setValidation && setSlideConfig) {
      setSlideConfig(undefined);
      setValidation(true);
    }
  }, [isActive, setValidation, setSlideConfig]);

  const handleConnect = async () => {
    if (!masterPIN) {
      setConnectionError('Please enter the Master Admin PIN');
      return;
    }

    setIsConnecting(true);
    setConnectionError('');

    // TODO: Implement master connection logic
    // 1. Connect to network (WiFi/Ethernet)
    // 2. Scan for master device
    // 3. Authenticate with PIN
    // 4. Import settings

    setTimeout(() => {
      setIsConnecting(false);
      setConnectionError('Master device not found on network');
    }, 2000);
  };

  return (
    <BaseSlide isActive={isActive} isPast={isPast}>
      <h1 className="text-5xl font-black text-display-text-primary mb-4 uppercase tracking-wider">
        Master Connection
      </h1>
      <p className="text-2xl text-display-text-secondary mb-12 uppercase tracking-wide">
        Optional: Connect to master device to import settings
      </p>

      <div className="space-y-8">
        <div>
          <label className="block text-xl font-bold text-display-text-primary mb-4 uppercase tracking-wider">
            Master Admin PIN
          </label>
          <input
            type="password"
            value={masterPIN}
            onChange={(e) => setMasterPIN(e.target.value)}
            placeholder="Enter 4-6 digit PIN"
            className="w-full px-6 py-4 text-2xl bg-display-bg-tertiary text-display-text-primary rounded-xl border-2 border-transparent focus:border-display-accent outline-none uppercase tracking-wider"
            maxLength={6}
          />
        </div>

        {connectionError && (
          <div className="bg-red-500 bg-opacity-20 border-2 border-red-500 rounded-xl px-6 py-4">
            <p className="text-xl text-red-200 uppercase tracking-wide">{connectionError}</p>
          </div>
        )}

        <button
          onClick={handleConnect}
          disabled={isConnecting}
          className="w-full px-8 py-6 bg-display-accent text-gray-900 text-2xl font-bold rounded-xl hover:opacity-90 transition-opacity uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isConnecting ? 'Connecting...' : 'Connect to Master'}
        </button>

        <div className="text-center">
          <p className="text-lg text-display-text-secondary uppercase tracking-wide">
            Skip this step to configure manually
          </p>
        </div>
      </div>
    </BaseSlide>
  );
}
