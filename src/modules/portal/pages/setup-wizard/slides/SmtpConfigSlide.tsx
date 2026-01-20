import { useEffect, useState } from 'react';

import { SMTPConfig } from '../../../../../lib/types/device.types';

import { BaseSlide } from './BaseSlide';

interface SmtpConfigSlideProps {
  isActive: boolean;
  isPast: boolean;
  initialConfig?: SMTPConfig;
  setValidation: (isValid: boolean) => void;
  setSlideConfig: (data: SMTPConfig | undefined) => void;
}

export function SmtpConfigSlide({
  isActive,
  isPast,
  initialConfig,
  setValidation,
  setSlideConfig,
}: SmtpConfigSlideProps) {
  const [data, setData] = useState<SMTPConfig | undefined>(initialConfig);

  const blankConfig = {
    host: '',
    port: '',
    secure: false,
    fromEmail: '',
    fromName: '',
  };

  const blankAuth = {
    user: '',
    password: '',
  };

  const checkValidity = () => {
    if (!data) return true;

    if (!data.host || data.host.trim() === '') return false;
    if (!data.port || data.port.trim() === '') return false;
    if (!data.fromEmail || data.fromEmail.trim() === '') return false;
    if (!data.fromName || data.fromName.trim() === '') return false;

    const portNum = parseInt(data.port, 10);
    if (isNaN(portNum) || portNum < 1 || portNum > 65535) return false;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.fromEmail)) return false;

    if (data.auth) {
      if (!data.auth.user || data.auth.user.trim() === '') return false;
      if (!data.auth.password || data.auth.password.trim() === '') return false;
    }

    return true;
  };

  useEffect(() => {
    if (isActive && setValidation && setSlideConfig) {
      setSlideConfig(data);
      setValidation(checkValidity());
    } else {
      setValidation(false);
    }
  }, [data, isActive, setSlideConfig, setValidation]);

  useEffect(() => {
    if (data) {
      // Check if all fields are empty
      const isEmpty =
        (!data.host || data.host.trim() === '') &&
        (!data.port || data.port.trim() === '') &&
        (!data.fromEmail || data.fromEmail.trim() === '') &&
        (!data.fromName || data.fromName.trim() === '') &&
        (!data.auth ||
          ((!data.auth.user || data.auth.user.trim() === '') &&
            (!data.auth.password || data.auth.password.trim() === '')));

      if (isEmpty) {
        setData(undefined);
      }
    }
  }, [data]);

  return (
    <BaseSlide isActive={isActive} isPast={isPast}>
      <h1 className="text-5xl font-black text-display-text-primary mb-4 uppercase tracking-wider">
        Email Configuration
      </h1>
      <p className="text-2xl text-display-text-secondary mb-12 uppercase tracking-wide">
        SMTP settings for email notifications
      </p>

      <div className="space-y-8">
        {true && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-lg font-bold text-display-text-primary mb-3 uppercase tracking-wider">
                  Host {data && '*'}
                </label>
                <input
                  type="text"
                  value={data?.host || ''}
                  onChange={(e) =>
                    setData((prev) => ({ ...(prev || blankConfig), host: e.target.value }))
                  }
                  placeholder="smtp.domain.com"
                  className="w-full px-6 py-4 text-xl bg-display-bg-tertiary text-display-text-primary rounded-xl border-2 border-transparent focus:border-display-accent outline-none placeholder:normal-case"
                />
              </div>

              <div>
                <label className="block text-lg font-bold text-display-text-primary mb-3 uppercase tracking-wider">
                  Port {data && '*'}
                </label>
                <input
                  type="number"
                  value={data?.port || ''}
                  min={0}
                  max={65535}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...(prev || blankConfig),
                      port: e.target.value.slice(0, 5),
                    }))
                  }
                  placeholder="587"
                  className="w-full px-6 py-4 text-xl bg-display-bg-tertiary text-display-text-primary rounded-xl border-2 border-transparent focus:border-display-accent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-lg font-bold text-display-text-primary mb-3 uppercase tracking-wider">
                From Email {data && '*'}
              </label>
              <input
                type="text"
                value={data?.fromEmail || ''}
                onChange={(e) =>
                  setData((prev) => ({ ...(prev || blankConfig), fromEmail: e.target.value }))
                }
                placeholder="no-reply@domain.com"
                className="w-full px-6 py-4 text-xl bg-display-bg-tertiary text-display-text-primary rounded-xl border-2 border-transparent focus:border-display-accent outline-none placeholder:normal-case"
              />
            </div>

            <div>
              <label className="block text-lg font-bold text-display-text-primary mb-3 uppercase tracking-wider">
                From Name {data && '*'}
              </label>
              <input
                type="text"
                value={data?.fromName || ''}
                onChange={(e) =>
                  setData((prev) => ({ ...(prev || blankConfig), fromName: e.target.value }))
                }
                placeholder="Court Controller Email Service"
                className="w-full px-6 py-4 text-xl bg-display-bg-tertiary text-display-text-primary rounded-xl border-2 border-transparent focus:border-display-accent outline-none placeholder:normal-case"
              />
            </div>

            <div>
              <label className="block text-lg font-bold text-display-text-primary mb-3 uppercase tracking-wider">
                User {data?.auth?.password && '*'}
              </label>
              <input
                type="text"
                value={data?.auth?.user || ''}
                onChange={(e) =>
                  setData((prev) => ({
                    ...(prev || blankConfig),
                    auth: { ...(prev?.auth || blankAuth), user: e.target.value },
                  }))
                }
                placeholder="SMTP user"
                className="w-full px-6 py-4 text-xl bg-display-bg-tertiary text-display-text-primary rounded-xl border-2 border-transparent focus:border-display-accent outline-none placeholder:normal-case"
              />
            </div>

            <div>
              <label className="block text-lg font-bold text-display-text-primary mb-3 uppercase tracking-wider">
                Password {data?.auth?.user && '*'}
              </label>
              <input
                type="password"
                value={data?.auth?.password || ''}
                onChange={(e) =>
                  setData((prev) => ({
                    ...(prev || blankConfig),
                    auth: { ...(prev?.auth || blankAuth), password: e.target.value },
                  }))
                }
                placeholder="SMTP password"
                className="w-full px-6 py-4 text-xl bg-display-bg-tertiary text-display-text-primary rounded-xl border-2 border-transparent focus:border-display-accent outline-none placeholder:normal-case"
              />
            </div>
          </div>
        )}
      </div>
    </BaseSlide>
  );
}
