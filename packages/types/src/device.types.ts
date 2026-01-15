type Sports = 'padel';

export interface WiFiConfig {
  ssid: string;
  password?: string;
  security: 'WPA2' | 'WPA3' | 'open';
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
            dns: [string, string];
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
  user: string;
  password: string;
  fromEmail: string;
  fromName: string;
}

export interface DeviceConfiguration {
  deviceFamily: string; // Base36 2 digit code
  deviceId: string;
  status: 'available' | 'occupied' | 'maintenance' | 'setup' | 'warning' | 'error';
  courtName?: string;
  availableSports: Sports[];
  venue?: {
    name: string;
    address?: string;
  };
  networkConfig: NetworkConfig;
  guestNetwork?: WiFiConfig;
  locale: 'es' | 'en';
  smtpConfig?: SMTPConfig;
  theme: {
    primaryColor?: string;
    default: 'light' | 'dark';
  };
  credentials?: {
    adminPIN: string;
    staffPIN?: string;
  };
}
