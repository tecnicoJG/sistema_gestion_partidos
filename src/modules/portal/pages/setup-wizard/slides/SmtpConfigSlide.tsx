import type { DeviceConfiguration } from '@/../../lib/types/device.types';
import { useState } from 'react';

interface SmtpConfigSlideProps {
  data: Partial<DeviceConfiguration>;
  updateData: (data: Partial<DeviceConfiguration>) => void;
  onNext: () => void;
  onSkip?: () => void;
}

export function SmtpConfigSlide({ data, updateData }: SmtpConfigSlideProps) {
  const [enabled, setEnabled] = useState(!!data.smtpConfig);

  const handleToggle = (enable: boolean) => {
    setEnabled(enable);
    if (!enable) {
      updateData({ smtpConfig: undefined });
    } else {
      updateData({
        smtpConfig: {
          host: '',
          port: '587',
          secure: false,
          user: '',
          password: '',
          fromEmail: '',
          fromName: '',
        },
      });
    }
  };

  return (
    <>
      <h1 className="text-5xl font-black text-display-text-primary mb-4 uppercase tracking-wider">
        Email Configuration
      </h1>
      <p className="text-2xl text-display-text-secondary mb-12 uppercase tracking-wide">
        SMTP settings for email notifications
      </p>

      <div className="space-y-8">
        <div>
          <label className="block text-xl font-bold text-display-text-primary mb-4 uppercase tracking-wider">
            Configure Email
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
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-lg font-bold text-display-text-primary mb-3 uppercase tracking-wider">
                  SMTP Host
                </label>
                <input
                  type="text"
                  value={data.smtpConfig?.host || ''}
                  onChange={(e) =>
                    updateData({
                      smtpConfig: {
                        ...data.smtpConfig!,
                        host: e.target.value,
                      },
                    })
                  }
                  placeholder="smtp.gmail.com"
                  className="w-full px-6 py-4 text-xl bg-display-bg-tertiary text-display-text-primary rounded-xl border-2 border-transparent focus:border-display-accent outline-none placeholder:normal-case"
                />
              </div>

              <div>
                <label className="block text-lg font-bold text-display-text-primary mb-3 uppercase tracking-wider">
                  Port
                </label>
                <input
                  type="text"
                  value={data.smtpConfig?.port || ''}
                  onChange={(e) =>
                    updateData({
                      smtpConfig: {
                        ...data.smtpConfig!,
                        port: e.target.value,
                      },
                    })
                  }
                  placeholder="587"
                  className="w-full px-6 py-4 text-xl bg-display-bg-tertiary text-display-text-primary rounded-xl border-2 border-transparent focus:border-display-accent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-lg font-bold text-display-text-primary mb-3 uppercase tracking-wider">
                Username / Email
              </label>
              <input
                type="text"
                value={data.smtpConfig?.user || ''}
                onChange={(e) =>
                  updateData({
                    smtpConfig: {
                      ...data.smtpConfig!,
                      user: e.target.value,
                    },
                  })
                }
                placeholder="your-email@example.com"
                className="w-full px-6 py-4 text-xl bg-display-bg-tertiary text-display-text-primary rounded-xl border-2 border-transparent focus:border-display-accent outline-none placeholder:normal-case"
              />
            </div>

            <div>
              <label className="block text-lg font-bold text-display-text-primary mb-3 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                value={data.smtpConfig?.password || ''}
                onChange={(e) =>
                  updateData({
                    smtpConfig: {
                      ...data.smtpConfig!,
                      password: e.target.value,
                    },
                  })
                }
                placeholder="App password or SMTP password"
                className="w-full px-6 py-4 text-xl bg-display-bg-tertiary text-display-text-primary rounded-xl border-2 border-transparent focus:border-display-accent outline-none placeholder:normal-case"
              />
            </div>

            <div>
              <label className="block text-lg font-bold text-display-text-primary mb-3 uppercase tracking-wider">
                From Name
              </label>
              <input
                type="text"
                value={data.smtpConfig?.fromName || ''}
                onChange={(e) =>
                  updateData({
                    smtpConfig: {
                      ...data.smtpConfig!,
                      fromName: e.target.value,
                    },
                  })
                }
                placeholder="Court Controller"
                className="w-full px-6 py-4 text-xl bg-display-bg-tertiary text-display-text-primary rounded-xl border-2 border-transparent focus:border-display-accent outline-none placeholder:normal-case"
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
