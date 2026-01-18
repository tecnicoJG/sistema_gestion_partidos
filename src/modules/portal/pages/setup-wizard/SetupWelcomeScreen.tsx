interface SetupWelcomeScreenProps {
  onSelectSetupType: (setupType: 'local-setup' | 'master-setup') => void;
  onLocaleChange: (locale: 'en' | 'es') => void;
  selectedLocale: 'en' | 'es';
}

export function SetupWelcomeScreen({
  onSelectSetupType,
  onLocaleChange,
  selectedLocale,
}: SetupWelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-12">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-display-text-primary mb-4">Welcome</h1>
        <p className="text-2xl text-display-text-secondary">Let's set up your device</p>
      </div>

      {/* Locale Selector */}
      <div className="w-full max-w-md">
        <label className="block text-display-text-primary text-xl font-semibold mb-3">
          Language
        </label>
        <select
          value={selectedLocale}
          onChange={(e) => onLocaleChange(e.target.value as 'en' | 'es')}
          className="w-full px-6 py-4 text-xl bg-display-bg-primary text-display-text-primary rounded-lg border-2 border-display-bg-tertiary focus:border-display-accent focus:outline-none transition-colors"
        >
          <option value="en">English</option>
          <option value="es">Español</option>
        </select>
      </div>

      {/* Setup Type Selection */}
      <div className="flex flex-col gap-6 w-full max-w-2xl">
        <button
          onClick={() => onSelectSetupType('local-setup')}
          className="group p-8 bg-display-bg-primary hover:bg-display-bg-tertiary border-2 border-display-bg-tertiary hover:border-display-accent rounded-lg transition-all duration-150"
        >
          <div className="flex items-center gap-6">
            <div className="flex-shrink-0 w-16 h-16 bg-display-accent rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-display-bg-primary"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <div className="text-left flex-1">
              <h2 className="text-3xl font-bold text-display-text-primary mb-2">Local Setup</h2>
              <p className="text-lg text-display-text-secondary">
                Configure this device as a standalone unit
              </p>
            </div>
            <svg
              className="w-8 h-8 text-display-text-secondary group-hover:text-display-accent transition-colors"
              viewBox="0 0 16 16"
            >
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="M5.29289,3.70711 C4.90237,3.31658 4.90237,2.68342 5.29289,2.29289 C5.68342,1.90237 6.31658,1.90237 6.70711,2.29289 L11.7071,7.29289 C12.0976,7.68342 12.0976,8.31658 11.7071,8.70711 L6.70711,13.7071 C6.31658,14.0976 5.68342,14.0976 5.29289,13.7071 C4.90237,13.3166 4.90237,12.6834 5.29289,12.2929 L9.58579,8 L5.29289,3.70711 Z"
              />
            </svg>
          </div>
        </button>

        <button
          onClick={() => onSelectSetupType('master-setup')}
          className="group p-8 bg-display-bg-primary hover:bg-display-bg-tertiary border-2 border-display-bg-tertiary hover:border-display-accent rounded-lg transition-all duration-150"
        >
          <div className="flex items-center gap-6">
            <div className="flex-shrink-0 w-16 h-16 bg-display-accent rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-display-bg-primary"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v6m0 6v6m8.66-9.66l-3 3m-3 3l-3 3m11.32 2.34l-3-3m-3-3l-3-3m2.34 11.32l3-3m3-3l3-3m-11.32 2.34l3 3m3 3l3 3" />
              </svg>
            </div>
            <div className="text-left flex-1">
              <h2 className="text-3xl font-bold text-display-text-primary mb-2">
                Setup Through Master
              </h2>
              <p className="text-lg text-display-text-secondary">
                Connect to a master device for centralized configuration
              </p>
            </div>
            <svg
              className="w-8 h-8 text-display-text-secondary group-hover:text-display-accent transition-colors"
              viewBox="0 0 16 16"
            >
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="M5.29289,3.70711 C4.90237,3.31658 4.90237,2.68342 5.29289,2.29289 C5.68342,1.90237 6.31658,1.90237 6.70711,2.29289 L11.7071,7.29289 C12.0976,7.68342 12.0976,8.31658 11.7071,8.70711 L6.70711,13.7071 C6.31658,14.0976 5.68342,14.0976 5.29289,13.7071 C4.90237,13.3166 4.90237,12.6834 5.29289,12.2929 L9.58579,8 L5.29289,3.70711 Z"
              />
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
}
