import type { DeviceConfiguration } from '@/../../lib/types/device.types';

interface CustomizationSlideProps {
  data: Partial<DeviceConfiguration>;
  updateData: (data: Partial<DeviceConfiguration>) => void;
  onNext: () => void;
}

export function CustomizationSlide({ data, updateData }: CustomizationSlideProps) {
  const presetColors = [
    { name: 'Blue', value: '#1e73be' },
    { name: 'Green', value: '#22c55e' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Purple', value: '#a855f7' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Pink', value: '#ec4899' },
  ];

  return (
    <>
      <h1 className="text-5xl font-black text-display-text-primary mb-4 uppercase tracking-wider">
        Customization
      </h1>
      <p className="text-2xl text-display-text-secondary mb-12 uppercase tracking-wide">
        Personalize your controller display
      </p>

      <div className="space-y-8">
        {/* Theme Selection */}
        <div>
          <label className="block text-xl font-bold text-display-text-primary mb-4 uppercase tracking-wider">
            Display Theme
          </label>
          <div className="flex gap-4">
            <button
              onClick={() =>
                updateData({
                  theme: {
                    ...data.theme!,
                    default: 'light',
                  },
                })
              }
              className={`flex-1 px-8 py-4 text-xl font-bold rounded-xl uppercase tracking-wider transition-all ${
                data.theme?.default === 'light'
                  ? 'bg-display-accent text-gray-900'
                  : 'bg-display-bg-tertiary text-display-text-secondary'
              }`}
            >
              Light
            </button>
            <button
              onClick={() =>
                updateData({
                  theme: {
                    ...data.theme!,
                    default: 'dark',
                  },
                })
              }
              className={`flex-1 px-8 py-4 text-xl font-bold rounded-xl uppercase tracking-wider transition-all ${
                data.theme?.default === 'dark'
                  ? 'bg-display-accent text-gray-900'
                  : 'bg-display-bg-tertiary text-display-text-secondary'
              }`}
            >
              Dark
            </button>
          </div>
        </div>

        {/* Primary Color */}
        <div>
          <label className="block text-xl font-bold text-display-text-primary mb-4 uppercase tracking-wider">
            Primary Color (Optional)
          </label>
          <div className="grid grid-cols-3 gap-4">
            {presetColors.map((color) => (
              <button
                key={color.value}
                onClick={() =>
                  updateData({
                    theme: {
                      ...data.theme!,
                      primaryColor: color.value,
                    },
                  })
                }
                className={`px-6 py-4 text-lg font-bold rounded-xl uppercase tracking-wider transition-all ${
                  data.theme?.primaryColor === color.value
                    ? 'ring-4 ring-display-accent scale-105'
                    : 'hover:scale-105'
                }`}
                style={{
                  backgroundColor: color.value,
                  color: '#ffffff',
                }}
              >
                {color.name}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Color Input */}
        <div>
          <label className="block text-lg font-bold text-display-text-primary mb-3 uppercase tracking-wider">
            Or Enter Custom Color
          </label>
          <div className="flex gap-4 items-center">
            <input
              type="color"
              value={data.theme?.primaryColor || '#1e73be'}
              onChange={(e) =>
                updateData({
                  theme: {
                    ...data.theme!,
                    primaryColor: e.target.value,
                  },
                })
              }
              className="h-16 w-24 rounded-xl cursor-pointer bg-display-bg-tertiary"
            />
            <input
              type="text"
              value={data.theme?.primaryColor || ''}
              onChange={(e) =>
                updateData({
                  theme: {
                    ...data.theme!,
                    primaryColor: e.target.value,
                  },
                })
              }
              placeholder="#1e73be"
              className="flex-1 px-6 py-4 text-xl bg-display-bg-tertiary text-display-text-primary rounded-xl border-2 border-transparent focus:border-display-accent outline-none"
            />
          </div>
        </div>
      </div>
    </>
  );
}
