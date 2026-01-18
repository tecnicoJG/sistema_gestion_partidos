import type { DeviceConfiguration } from '@/../../lib/types/device.types';

interface CourtDetailsSlideProps {
  data: Partial<DeviceConfiguration>;
  updateData: (data: Partial<DeviceConfiguration>) => void;
  onNext: () => void;
}

export function CourtDetailsSlide({ data, updateData }: CourtDetailsSlideProps) {
  return (
    <>
      <h1 className="text-5xl font-black text-display-text-primary mb-4 uppercase tracking-wider">
        Court Details
      </h1>
      <p className="text-2xl text-display-text-secondary mb-12 uppercase tracking-wide">
        Configure your court and venue information
      </p>

      <div className="space-y-8">
        <div>
          <label className="block text-xl font-bold text-display-text-primary mb-4 uppercase tracking-wider">
            Court Name
          </label>
          <input
            type="text"
            value={data.courtName || ''}
            onChange={(e) => updateData({ courtName: e.target.value })}
            placeholder="e.g., Court 1, Main Court"
            className="w-full px-6 py-4 text-2xl bg-display-bg-tertiary text-display-text-primary rounded-xl border-2 border-transparent focus:border-display-accent outline-none uppercase tracking-wider placeholder:normal-case placeholder:tracking-normal"
          />
        </div>

        <div>
          <label className="block text-xl font-bold text-display-text-primary mb-4 uppercase tracking-wider">
            Venue Name
          </label>
          <input
            type="text"
            value={data.venue?.name || ''}
            onChange={(e) =>
              updateData({
                venue: {
                  name: e.target.value,
                  address: data.venue?.address,
                },
              })
            }
            placeholder="e.g., SportCenter Barcelona"
            className="w-full px-6 py-4 text-2xl bg-display-bg-tertiary text-display-text-primary rounded-xl border-2 border-transparent focus:border-display-accent outline-none uppercase tracking-wider placeholder:normal-case placeholder:tracking-normal"
          />
        </div>

        <div>
          <label className="block text-xl font-bold text-display-text-primary mb-4 uppercase tracking-wider">
            Venue Address (Optional)
          </label>
          <input
            type="text"
            value={data.venue?.address || ''}
            onChange={(e) =>
              updateData({
                venue: {
                  name: data.venue?.name || '',
                  address: e.target.value,
                },
              })
            }
            placeholder="e.g., Av. Diagonal 123, Barcelona"
            className="w-full px-6 py-4 text-2xl bg-display-bg-tertiary text-display-text-primary rounded-xl border-2 border-transparent focus:border-display-accent outline-none placeholder:normal-case placeholder:tracking-normal"
          />
        </div>
      </div>
    </>
  );
}
