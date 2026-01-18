interface SetupCompleteScreenProps {
  onContinue: () => void;
}

export function SetupCompleteScreen({ onContinue }: SetupCompleteScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-12 py-12">
      <div className="w-24 h-24 bg-display-accent rounded-full flex items-center justify-center">
        <svg className="w-16 h-16 text-display-bg-primary" viewBox="0 0 16 16">
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M13.7071,4.29289 C14.0976,4.68342 14.0976,5.31658 13.7071,5.70711 L7.70711,11.7071 C7.31658,12.0976 6.68342,12.0976 6.29289,11.7071 L3.29289,8.70711 C2.90237,8.31658 2.90237,7.68342 3.29289,7.29289 C3.68342,6.90237 4.31658,6.90237 4.70711,7.29289 L7,9.58579 L12.2929,4.29289 C12.6834,3.90237 13.3166,3.90237 13.7071,4.29289 Z"
          />
        </svg>
      </div>

      <div className="text-center">
        <h1 className="text-6xl font-bold text-display-text-primary mb-4">Setup Complete!</h1>
        <p className="text-2xl text-display-text-secondary">Your device is ready to use</p>
      </div>

      <button
        onClick={onContinue}
        className="flex items-center justify-center gap-3 py-4 px-8 bg-display-accent text-display-bg-primary text-2xl font-bold rounded-lg hover:opacity-90 transition-opacity uppercase tracking-wider"
      >
        Continue to App
      </button>
    </div>
  );
}
