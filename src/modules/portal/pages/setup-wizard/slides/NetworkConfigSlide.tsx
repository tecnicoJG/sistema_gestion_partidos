import { useEffect, useState } from 'react';

import { BaseSlide } from './BaseSlide';

import type { NetworkConfig, WiFiSecurityTypes } from '@/../../lib/types/device.types';

interface NetworkConfigSlideProps {
  isActive: boolean;
  isPast: boolean;
  initialConfig?: NetworkConfig;
  setValidation: (isValid: boolean) => void;
  setSlideConfig: (data: NetworkConfig | undefined) => void;
  allowApMode?: boolean;
}

export const NetworkConfigSlide = ({
  isActive,
  isPast,
  initialConfig,
  setValidation,
  setSlideConfig,
  allowApMode = true,
}: NetworkConfigSlideProps) => {
  const [data, setData] = useState(initialConfig);

  const isValidIP = (ip: string): boolean => {
    const ipRegex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const match = ip.match(ipRegex);
    if (!match) return false;
    return match.slice(1).every((octet) => parseInt(octet) >= 0 && parseInt(octet) <= 255);
  };

  const isValidHostname = (hostname: string): boolean => {
    // Split into labels and validate each one
    const labels = hostname.split('.');
    if (labels.length === 0 || hostname.length > 253) return false;

    for (const label of labels) {
      // Each label: 1-63 chars, start/end with alphanumeric, hyphens only in middle
      if (label.length === 0 || label.length > 63) return false;
      if (!/^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/.test(label)) return false;
    }

    return true;
  };

  const checkValidity = () => {
    if (!data) return false;

    if (data.mode === 'ap') {
      // AP mode validation
      if (!data.ip || data.ip.trim() === '' || !isValidIP(data.ip)) return false;
      if (!data.subnet || data.subnet.trim() === '' || !isValidIP(data.subnet)) return false;
      if (!data.ssid || data.ssid.trim() === '') return false;
      if (data.security !== 'open' && (!data.password || data.password.trim().length < 8))
        return false;
      return true;
    } else {
      // Client mode validation
      if (!data.hostname || data.hostname.trim() === '' || !isValidHostname(data.hostname))
        return false;

      // Validate connection
      if (data.connection.type === 'wifi') {
        if (!data.connection.ssid || data.connection.ssid.trim() === '') return false;
        if (
          data.connection.security !== 'open' &&
          (!data.connection.password || data.connection.password.trim().length < 8)
        )
          return false;
      }

      // Validate IP config
      if (data.ipConfig.type === 'static') {
        if (!data.ipConfig.ip || data.ipConfig.ip.trim() === '' || !isValidIP(data.ipConfig.ip))
          return false;
        if (
          !data.ipConfig.subnet ||
          data.ipConfig.subnet.trim() === '' ||
          !isValidIP(data.ipConfig.subnet)
        )
          return false;
        if (
          !data.ipConfig.gateway ||
          data.ipConfig.gateway.trim() === '' ||
          !isValidIP(data.ipConfig.gateway)
        )
          return false;
        if (!data.ipConfig.dns) return false;
        if (
          !data.ipConfig.dns[0] ||
          data.ipConfig.dns[0].trim() === '' ||
          !isValidIP(data.ipConfig.dns[0])
        )
          return false;
        // Secondary DNS is optional
        if (
          data.ipConfig.dns.length === 2 &&
          data.ipConfig.dns[1] &&
          data.ipConfig.dns[1].trim() !== '' &&
          !isValidIP(data.ipConfig.dns[1])
        )
          return false;
      }

      return true;
    }
  };

  useEffect(() => {
    if (isActive && setValidation && setSlideConfig) {
      setSlideConfig(data);
      setValidation(checkValidity());
    }
  }, [data, isActive, setSlideConfig, setValidation]);

  const handleModeChange = (newMode: 'ap' | 'client') => {
    if (newMode === 'ap') {
      const initialApConfig = initialConfig?.mode === 'ap' ? initialConfig : null;
      setData({
        mode: 'ap',
        ip: data?.mode === 'ap' ? data.ip : initialApConfig?.ip || '',
        subnet: data?.mode === 'ap' ? data.subnet : initialApConfig?.subnet || '',
        ssid: data?.mode === 'ap' ? data.ssid : initialApConfig?.ssid || '',
        security: data?.mode === 'ap' ? data.security : initialApConfig?.security || 'open',
        password: data?.mode === 'ap' ? data.password : initialApConfig?.password,
      });
    } else {
      const initialClientConfig = initialConfig?.mode === 'client' ? initialConfig : null;
      setData({
        mode: 'client',
        hostname: data?.mode === 'client' ? data.hostname : initialClientConfig?.hostname || '',
        ipConfig:
          data?.mode === 'client'
            ? data.ipConfig
            : initialClientConfig?.ipConfig || { type: 'dhcp' },
        connection:
          data?.mode === 'client'
            ? data.connection
            : initialClientConfig?.connection || { type: 'wifi', ssid: '', security: 'open' },
      });
    }
  };

  const handleConnectionTypeChange = (newConnectionType: 'wifi' | 'ethernet') => {
    if (data?.mode !== 'client') return;

    const initialClientConfig = initialConfig?.mode === 'client' ? initialConfig : null;
    const initialWifiConnection =
      initialClientConfig?.connection?.type === 'wifi' ? initialClientConfig.connection : null;

    setData({
      ...data,
      connection:
        newConnectionType === 'wifi'
          ? {
              type: 'wifi',
              ssid:
                data.connection?.type === 'wifi'
                  ? data.connection.ssid
                  : initialWifiConnection?.ssid || '',
              security:
                data.connection?.type === 'wifi'
                  ? data.connection.security
                  : initialWifiConnection?.security || 'open',
              password:
                data.connection?.type === 'wifi'
                  ? data.connection.password
                  : initialWifiConnection?.password,
            }
          : { type: 'ethernet' },
    });
  };

  const handleIpConfigTypeChange = (newIpConfigType: 'dhcp' | 'static') => {
    if (data?.mode !== 'client') return;

    const initialClientConfig = initialConfig?.mode === 'client' ? initialConfig : null;
    const initialStaticConfig =
      initialClientConfig?.ipConfig?.type === 'static' ? initialClientConfig.ipConfig : null;

    setData({
      ...data,
      ipConfig:
        newIpConfigType === 'dhcp'
          ? { type: 'dhcp' }
          : {
              type: 'static',
              ip:
                data.ipConfig?.type === 'static' ? data.ipConfig.ip : initialStaticConfig?.ip || '',
              subnet:
                data.ipConfig?.type === 'static'
                  ? data.ipConfig.subnet
                  : initialStaticConfig?.subnet || '',
              gateway:
                data.ipConfig?.type === 'static'
                  ? data.ipConfig.gateway
                  : initialStaticConfig?.gateway || '',
              dns:
                data.ipConfig?.type === 'static'
                  ? data.ipConfig.dns
                  : initialStaticConfig?.dns || [''],
            },
    });
  };

  const formatIpInput = (value: string, currentValue: string): string => {
    // Remove all non-digits and dots
    let cleaned = value.replace(/[^0-9.]/g, '');

    // Don't allow starting with dot
    if (cleaned.startsWith('.')) {
      cleaned = cleaned.slice(1);
    }

    // Don't allow consecutive dots
    cleaned = cleaned.replace(/\.{2,}/g, '.');

    // Split by dots
    const parts = cleaned.split('.');

    // Limit to 4 octets (max 3 dots)
    if (parts.length > 4) {
      parts.length = 4;
    }

    // Check if user is adding characters (not deleting)
    const isAdding = value.length > currentValue.length;

    // Process each octet: if it has more than 3 digits, move the excess to the next octet
    const processedParts: string[] = [];

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i] || '';

      if (part.length > 3 && processedParts.length < 3) {
        // Move excess digits to next octet
        let octet = part.slice(0, 3);
        // Cap at 255
        if (parseInt(octet) > 255) {
          octet = '255';
        }
        processedParts.push(octet);
        const excess = part.slice(3);
        if (i + 1 < parts.length) {
          parts[i + 1] = excess + (parts[i + 1] || '');
        } else {
          parts.push(excess);
        }
      } else {
        let octet = part.slice(0, 3);
        // Cap at 255
        if (octet && parseInt(octet) > 255) {
          octet = '255';
        }
        processedParts.push(octet);
      }
    }

    // Auto-add dot after 3 digits in the last octet (only when typing, not deleting)
    if (isAdding && processedParts.length > 0 && processedParts.length < 4) {
      const lastPart = processedParts[processedParts.length - 1];
      if (lastPart && lastPart.length === 3 && !value.endsWith('.')) {
        processedParts.push('');
      }
    }

    return processedParts.join('.');
  };

  const handleIpChange = (value: string) => {
    if (data?.mode !== 'client' || data.ipConfig.type !== 'static') return;
    const formatted = formatIpInput(value, data.ipConfig.ip);
    setData({ ...data, ipConfig: { ...data.ipConfig, ip: formatted } });
  };

  const handleSubnetChange = (value: string) => {
    if (data?.mode !== 'client' || data.ipConfig.type !== 'static') return;
    const formatted = formatIpInput(value, data.ipConfig.subnet);
    setData({ ...data, ipConfig: { ...data.ipConfig, subnet: formatted } });
  };

  const handleGatewayChange = (value: string) => {
    if (data?.mode !== 'client' || data.ipConfig.type !== 'static') return;
    const formatted = formatIpInput(value, data.ipConfig.gateway);
    setData({ ...data, ipConfig: { ...data.ipConfig, gateway: formatted } });
  };

  const handleDnsChange = (value: string, index: 0 | 1) => {
    if (data?.mode !== 'client' || data.ipConfig.type !== 'static') return;
    const currentDns = data.ipConfig.dns[index] || '';
    const formatted = formatIpInput(value, currentDns);

    if (index === 0) {
      // Primary DNS is required
      const newDns: [string, string] | [string] =
        data.ipConfig.dns.length === 2 ? [formatted, data.ipConfig.dns[1]] : [formatted];
      setData({ ...data, ipConfig: { ...data.ipConfig, dns: newDns } });
    } else {
      // Secondary DNS is optional
      if (formatted.trim() === '') {
        // Remove secondary DNS if empty
        const newDns: [string] = [data.ipConfig.dns[0]];
        setData({ ...data, ipConfig: { ...data.ipConfig, dns: newDns } });
      } else {
        // Add or update secondary DNS
        const newDns: [string, string] = [data.ipConfig.dns[0], formatted];
        setData({ ...data, ipConfig: { ...data.ipConfig, dns: newDns } });
      }
    }
  };

  const handleHostnameChange = (value: string) => {
    if (data?.mode !== 'client') return;

    // Only allow alphanumeric, hyphens, and dots
    let cleaned = value.replace(/[^a-zA-Z0-9.-]/g, '');

    // Don't allow starting with hyphen or dot
    cleaned = cleaned.replace(/^[-.]/, '');

    // Don't allow consecutive dots
    cleaned = cleaned.replace(/\.{2,}/g, '.');

    // Don't allow hyphen right after dot or right before dot (between labels)
    cleaned = cleaned.replace(/\.-/g, '.');
    cleaned = cleaned.replace(/-\./g, '.');

    setData({ ...data, hostname: cleaned });
  };

  return (
    <BaseSlide isActive={isActive} isPast={isPast}>
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
          {allowApMode && (
            <button
              onClick={() => handleModeChange('ap')}
              className={`flex-1 px-8 py-4 text-xl font-bold rounded-xl uppercase tracking-wider transition-all ${
                data?.mode === 'ap'
                  ? 'bg-display-accent text-gray-900'
                  : 'bg-display-bg-tertiary text-display-text-secondary'
              }`}
            >
              Access Point
            </button>
          )}
          <button
            onClick={() => handleModeChange('client')}
            className={`flex-1 px-8 py-4 text-xl font-bold rounded-xl uppercase tracking-wider transition-all ${
              data?.mode === 'client'
                ? 'bg-display-accent text-gray-900'
                : 'bg-display-bg-tertiary text-display-text-secondary'
            }`}
          >
            Client
          </button>
        </div>
      </div>

      {/* AP Mode Configuration */}
      {data?.mode === 'ap' && (
        <div className="space-y-6">
          <div>
            <label className="block text-lg font-bold text-display-text-primary mb-3 uppercase tracking-wider">
              Network Name (SSID) *
            </label>
            <input
              type="text"
              value={data?.mode === 'ap' ? data?.ssid : ''}
              onChange={(e) => {
                if (data?.mode === 'ap') {
                  setData({ ...data, ssid: e.target.value });
                }
              }}
              placeholder="CourtController-XXXX"
              maxLength={32}
              className="w-full px-6 py-4 text-xl bg-display-bg-tertiary text-display-text-primary rounded-xl border-2 border-transparent focus:border-display-accent outline-none"
            />
          </div>

          <div>
            <label className="block text-lg font-bold text-display-text-primary mb-3 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              value={data?.mode === 'ap' ? data.password || '' : ''}
              onChange={(e) => {
                if (data?.mode === 'ap') {
                  setData({ ...data, password: e.target.value || undefined });
                }
              }}
              placeholder="Leave empty for open network"
              maxLength={63}
              minLength={8}
              className="w-full px-6 py-4 text-xl bg-display-bg-tertiary text-display-text-primary rounded-xl border-2 border-transparent focus:border-display-accent outline-none"
            />
          </div>
        </div>
      )}

      {/* Client Mode Configuration */}
      {data?.mode === 'client' && (
        <div className="space-y-6">
          {/* Hostname */}
          <div>
            <label className="block text-lg font-bold text-display-text-primary mb-3 uppercase tracking-wider">
              Hostname *
            </label>
            <input
              type="text"
              value={data.hostname}
              onChange={(e) => handleHostnameChange(e.target.value)}
              placeholder="court-controller"
              maxLength={253}
              className="w-full px-6 py-4 text-xl bg-display-bg-tertiary text-display-text-primary rounded-xl border-2 border-transparent focus:border-display-accent outline-none"
            />
          </div>

          {/* Connection Type */}
          <div>
            <label className="block text-lg font-bold text-display-text-primary mb-3 uppercase tracking-wider">
              Connection Type
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => handleConnectionTypeChange('wifi')}
                className={`flex-1 px-6 py-3 text-lg font-bold rounded-lg uppercase tracking-wider ${
                  data?.connection?.type === 'wifi'
                    ? 'bg-display-accent text-gray-900'
                    : 'bg-display-bg-tertiary text-display-text-secondary'
                }`}
              >
                WiFi
              </button>
              <button
                onClick={() => handleConnectionTypeChange('ethernet')}
                className={`flex-1 px-6 py-3 text-lg font-bold rounded-lg uppercase tracking-wider ${
                  data?.connection?.type === 'ethernet'
                    ? 'bg-display-accent text-gray-900'
                    : 'bg-display-bg-tertiary text-display-text-secondary'
                }`}
              >
                Ethernet
              </button>
            </div>
          </div>

          {/* WiFi Settings */}
          {data?.connection?.type === 'wifi' && (
            <>
              <div>
                <label className="block text-lg font-bold text-display-text-primary mb-3 uppercase tracking-wider">
                  Network Name (SSID) *
                </label>
                <input
                  type="text"
                  value={data.connection.ssid}
                  onChange={(e) => {
                    if (data?.mode === 'client' && data.connection.type === 'wifi') {
                      setData({
                        ...data,
                        connection: { ...data.connection, ssid: e.target.value },
                      });
                    }
                  }}
                  placeholder="Your WiFi Network"
                  maxLength={32}
                  className="w-full px-6 py-4 text-xl bg-display-bg-tertiary text-display-text-primary rounded-xl border-2 border-transparent focus:border-display-accent outline-none"
                />
              </div>

              <div>
                <label className="block text-lg font-bold text-display-text-primary mb-3 uppercase tracking-wider">
                  Security
                </label>
                <select
                  value={data.connection.security}
                  onChange={(e) => {
                    if (data?.mode === 'client' && data.connection.type === 'wifi') {
                      const newSecurity = e.target.value as WiFiSecurityTypes;
                      setData({
                        ...data,
                        connection: {
                          ...data.connection,
                          security: newSecurity,
                          password: newSecurity === 'open' ? undefined : data.connection.password,
                        },
                      });
                    }
                  }}
                  className="w-full px-6 py-4 text-xl bg-display-bg-tertiary text-display-text-primary rounded-xl border-2 border-transparent focus:border-display-accent outline-none"
                >
                  <option value="open">Open (No Password)</option>
                  <option value="WPA2">WPA2</option>
                  <option value="WPA3">WPA3</option>
                </select>
              </div>

              {data.connection.security !== 'open' && (
                <div>
                  <label className="block text-lg font-bold text-display-text-primary mb-3 uppercase tracking-wider">
                    Password *
                  </label>
                  <input
                    type="password"
                    value={data.connection.password || ''}
                    onChange={(e) => {
                      if (data?.mode === 'client' && data.connection.type === 'wifi') {
                        setData({
                          ...data,
                          connection: {
                            ...data.connection,
                            password: e.target.value || undefined,
                          },
                        });
                      }
                    }}
                    placeholder="Password"
                    maxLength={63}
                    minLength={8}
                    className="w-full px-6 py-4 text-xl bg-display-bg-tertiary text-display-text-primary rounded-xl border-2 border-transparent focus:border-display-accent outline-none"
                  />
                </div>
              )}
            </>
          )}

          {/* IP Configuration */}
          <div>
            <label className="block text-lg font-bold text-display-text-primary mb-3 uppercase tracking-wider">
              IP Configuration
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => handleIpConfigTypeChange('dhcp')}
                className={`flex-1 px-6 py-3 text-lg font-bold rounded-lg uppercase tracking-wider ${
                  data?.ipConfig?.type === 'dhcp'
                    ? 'bg-display-accent text-gray-900'
                    : 'bg-display-bg-tertiary text-display-text-secondary'
                }`}
              >
                DHCP
              </button>
              <button
                onClick={() => handleIpConfigTypeChange('static')}
                className={`flex-1 px-6 py-3 text-lg font-bold rounded-lg uppercase tracking-wider ${
                  data?.ipConfig?.type === 'static'
                    ? 'bg-display-accent text-gray-900'
                    : 'bg-display-bg-tertiary text-display-text-secondary'
                }`}
              >
                Static
              </button>
            </div>
          </div>

          {/* Static IP Fields */}
          {data?.ipConfig?.type === 'static' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-display-text-primary mb-2 uppercase">
                  IP Address *
                </label>
                <input
                  type="text"
                  value={data.ipConfig.ip}
                  onChange={(e) => handleIpChange(e.target.value)}
                  placeholder="192.168.1.100"
                  className="w-full px-4 py-3 text-lg bg-display-bg-tertiary text-display-text-primary rounded-lg border-2 border-transparent focus:border-display-accent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-display-text-primary mb-2 uppercase">
                  Subnet Mask *
                </label>
                <input
                  type="text"
                  value={data.ipConfig.subnet}
                  onChange={(e) => handleSubnetChange(e.target.value)}
                  placeholder="255.255.255.0"
                  className="w-full px-4 py-3 text-lg bg-display-bg-tertiary text-display-text-primary rounded-lg border-2 border-transparent focus:border-display-accent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-display-text-primary mb-2 uppercase">
                  Gateway *
                </label>
                <input
                  type="text"
                  value={data.ipConfig.gateway}
                  onChange={(e) => handleGatewayChange(e.target.value)}
                  placeholder="192.168.1.1"
                  className="w-full px-4 py-3 text-lg bg-display-bg-tertiary text-display-text-primary rounded-lg border-2 border-transparent focus:border-display-accent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-display-text-primary mb-2 uppercase">
                  Primary DNS *
                </label>
                <input
                  type="text"
                  value={data.ipConfig.dns[0]}
                  onChange={(e) => handleDnsChange(e.target.value, 0)}
                  placeholder="8.8.8.8"
                  className="w-full px-4 py-3 text-lg bg-display-bg-tertiary text-display-text-primary rounded-lg border-2 border-transparent focus:border-display-accent outline-none"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-bold text-display-text-primary mb-2 uppercase">
                  Secondary DNS
                </label>
                <input
                  type="text"
                  value={data.ipConfig.dns.length === 2 ? data.ipConfig.dns[1] : ''}
                  onChange={(e) => handleDnsChange(e.target.value, 1)}
                  placeholder="1.1.1.1"
                  className="w-full px-4 py-3 text-lg bg-display-bg-tertiary text-display-text-primary rounded-lg border-2 border-transparent focus:border-display-accent outline-none"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </BaseSlide>
  );
};
