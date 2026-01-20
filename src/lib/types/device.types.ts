type Sports = 'padel';

export type WiFiSecurityTypes = 'WPA2' | 'WPA3' | 'open';

export interface WiFiConfig {
  ssid: string;
  password?: string;
  security: WiFiSecurityTypes;
}

export type NetworkConfig =
  | ({
      mode: 'ap';
      ip: string;
      subnet: string;
    } & WiFiConfig)
  | {
      mode: 'client';
      hostname: string;
      ipConfig:
        | {
            type: 'dhcp';
          }
        | {
            type: 'static';
            ip: string;
            subnet: string;
            gateway: string;
            dns: [string, string] | [string];
          };
      connection:
        | {
            type: 'ethernet';
          }
        | ({
            type: 'wifi';
          } & WiFiConfig);
    };

export interface SMTPConfig {
  host: string;
  port: string;
  secure: boolean;
  fromEmail: string;
  fromName: string;
  auth?: {
    user: string;
    password: string;
  };
}

export interface DeviceDetails {
  courtName?: string;
  venue?: {
    name: string;
    address?: string;
  };
}

export interface DeviceTheme {
  primaryColor?: string;
  default: 'light' | 'dark';
}

export interface DeviceCredentials {
  adminPIN: string;
  staffPIN?: string;
}

type BaseDeviceConfiguration = {
  deviceFamily: string; // Base36 2 digit code
  deviceId: string;
  status: 'available' | 'occupied' | 'maintenance' | 'setup' | 'warning' | 'error';
  availableSports: Sports[];
  locale: 'es' | 'en';
  smtpConfig?: SMTPConfig;
  theme: DeviceTheme;
  credentials?: DeviceCredentials;
} & DeviceDetails;

export type DeviceConfiguration =
  | (BaseDeviceConfiguration & {
      networkConfig: NetworkConfig & { mode: 'ap' };
    })
  | (BaseDeviceConfiguration & {
      networkConfig: NetworkConfig & { mode: 'client'; connection: { type: 'wifi' } };
      guestNetwork?: WiFiConfig; // Guest network optional with WiFi
    })
  | (BaseDeviceConfiguration & {
      networkConfig: NetworkConfig & { mode: 'client'; connection: { type: 'ethernet' } };
      guestNetwork: WiFiConfig; // Guest network required with Ethernet
    });
