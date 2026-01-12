type Sports = 'padel';

export type NetworkConfig =
  | {
      mode: 'ap';
      hostname: string;
      ssid: string;
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

export interface DeviceConfiguration {
  deviceId: string;
  status: 'available' | 'occupied' | 'maintenance' | 'setup';
  courtName: string;
  availableSports: Sports[];
  venue: {
    name?: string;
    address?: string;
  };
  network: NetworkConfig;
  locale: 'es' | 'en';
}
