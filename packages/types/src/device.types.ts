type Sports = 'padel';

export type NetworkConfig =
  | {
      mode: 'ap';
      ssid: string;
      password?: string;
      security: 'WPA2' | 'open';
      ip: string;
      subnet: string;
    }
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
        | {
            type: 'wifi';
            ssid: string;
            password?: string;
            security: 'WPA2' | 'WPA3' | 'open';
          };
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
