import { DeviceConfiguration, WiFiConfig } from '../../../lib/types/index.js';
import { deviceConfigurationSchema } from '../../../lib/schemas/index.js';
import { randomBytes } from 'crypto';
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import QRCode from 'qrcode';
import ini from 'ini';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class DeviceService {
  private static configPath: string = resolve(__dirname, '../../../../.app_data/device.config');
  private static defaultConfigPath: string = resolve(__dirname, '../../../lib/defaults/device.config');

  private static config: DeviceConfiguration | null = null;

  private static generateDeviceId(deviceFamily: string): string {
    // Generate ID: family (2 chars base36) + timestamp (9 chars base36) + random (2 chars base36)
    // 9 chars in base36 is sufficient for ~1000 years (until year ~3189)
    const timestamp = Date.now().toString(36).padStart(9, '0');

    // Generate 2 random base36 characters (0-1295, which is "zz" in base36)
    const randomNum = randomBytes(2).readUInt16BE(0) % 1296; // 36^2 = 1296
    const random = randomNum.toString(36).padStart(2, '0');

    return `${deviceFamily}${timestamp}${random}`.toUpperCase();
  }

  private static parseIniToConfig(iniData: string): DeviceConfiguration {
    const parsed = ini.parse(iniData);

    // Build the configuration object from INI structure
    const config: Partial<DeviceConfiguration> = {
      deviceFamily: parsed['device']?.['deviceFamily'] || '',
      deviceId: parsed['device']?.['deviceId'] || '',
      status: parsed['device']?.['status'] || 'setup',
      locale: parsed['device']?.['locale'] || 'en',
      courtName: parsed['device']?.['courtName'],
      availableSports: parsed['sports']?.['available'] ? parsed['sports']['available'].split(',').map((s: string) => s.trim()).filter(Boolean) : [],
      theme: {
        default: parsed['theme']?.['default'] || 'light',
        primaryColor: parsed['theme']?.['primaryColor'],
      },
    };

    // Parse venue if present
    if (parsed['venue']?.['name']) {
      config.venue = {
        name: parsed['venue']['name'],
        address: parsed['venue']['address'],
      };
    }

    // Parse network configuration
    if (parsed['network']?.['mode'] === 'ap') {
      config.networkConfig = {
        mode: 'ap',
        ssid: parsed['network']['ssid'] || '',
        password: parsed['network']['password'],
        security: parsed['network']['security'] || 'open',
        ip: parsed['network']['ip'] || '192.168.4.1',
        subnet: parsed['network']['subnet'] || '255.255.255.0',
      };
    } else if (parsed['network']?.['mode'] === 'client') {
      const connectionType = parsed['network']['connectionType'] || 'wifi';

      config.networkConfig = {
        mode: 'client',
        hostname: parsed['network']['hostname'] || '',
        ipConfig: parsed['network']['ipConfigType'] === 'static'
          ? {
              type: 'static',
              ip: parsed['network']['ip'] || '',
              subnet: parsed['network']['subnet'] || '',
              gateway: parsed['network']['gateway'] || '',
              dns: [parsed['network']['dns1'] || '', parsed['network']['dns2'] || ''],
            }
          : { type: 'dhcp' },
        connection: connectionType === 'ethernet'
          ? { type: 'ethernet' }
          : {
              type: 'wifi',
              ssid: parsed['network']['ssid'] || '',
              password: parsed['network']['password'],
              security: parsed['network']['security'] || 'open',
            },
      };
    }

    // Parse guest network if present
    if (parsed['guestNetwork']?.['ssid']) {
      config.guestNetwork = {
        ssid: parsed['guestNetwork']['ssid'],
        password: parsed['guestNetwork']['password'],
        security: parsed['guestNetwork']['security'] || 'open',
      };
    }

    // Parse SMTP config if present
    if (parsed['smtp']?.['host']) {
      config.smtpConfig = {
        host: parsed['smtp']['host'],
        port: parsed['smtp']['port'],
        secure: parsed['smtp']['secure'] === 'true',
        user: parsed['smtp']['user'],
        password: parsed['smtp']['password'],
        fromEmail: parsed['smtp']['fromEmail'],
        fromName: parsed['smtp']['fromName'],
      };
    }

    // Parse credentials if present
    if (parsed['credentials']?.['adminPIN']) {
      config.credentials = {
        adminPIN: parsed['credentials']['adminPIN'],
        staffPIN: parsed['credentials']['staffPIN'],
      };
    }

    return config as DeviceConfiguration;
  }

  private static configToIni(config: DeviceConfiguration): string {
    const iniObj: Record<string, Record<string, string | undefined>> = {
      device: {
        deviceFamily: config.deviceFamily,
        deviceId: config.deviceId,
        status: config.status,
        locale: config.locale,
        courtName: config.courtName,
      },
      sports: {
        available: config.availableSports.join(', '),
      },
      theme: {
        default: config.theme.default,
        primaryColor: config.theme.primaryColor,
      },
    };

    // Add venue if present
    if (config.venue) {
      iniObj['venue'] = {
        name: config.venue.name,
        address: config.venue.address,
      };
    }

    // Add network configuration
    if (config.networkConfig.mode === 'ap') {
      iniObj['network'] = {
        mode: 'ap',
        ssid: config.networkConfig.ssid,
        password: config.networkConfig.password,
        security: config.networkConfig.security,
        ip: config.networkConfig.ip,
        subnet: config.networkConfig.subnet,
      };
    } else {
      const clientConfig = config.networkConfig;
      iniObj['network'] = {
        mode: 'client',
        hostname: clientConfig.hostname,
        ipConfigType: clientConfig.ipConfig.type,
        connectionType: clientConfig.connection.type,
      };

      if (clientConfig.ipConfig.type === 'static') {
        iniObj['network']['ip'] = clientConfig.ipConfig.ip;
        iniObj['network']['subnet'] = clientConfig.ipConfig.subnet;
        iniObj['network']['gateway'] = clientConfig.ipConfig.gateway;
        iniObj['network']['dns1'] = clientConfig.ipConfig.dns[0];
        iniObj['network']['dns2'] = clientConfig.ipConfig.dns[1];
      }

      if (clientConfig.connection.type === 'wifi') {
        iniObj['network']['ssid'] = clientConfig.connection.ssid;
        iniObj['network']['password'] = clientConfig.connection.password;
        iniObj['network']['security'] = clientConfig.connection.security;
      }
    }

    // Add guest network if present
    if (config.guestNetwork) {
      iniObj['guestNetwork'] = {
        ssid: config.guestNetwork.ssid,
        password: config.guestNetwork.password,
        security: config.guestNetwork.security,
      };
    }

    // Add SMTP config if present
    if (config.smtpConfig) {
      iniObj['smtp'] = {
        host: config.smtpConfig.host,
        port: config.smtpConfig.port,
        secure: config.smtpConfig.secure.toString(),
        user: config.smtpConfig.user,
        password: config.smtpConfig.password,
        fromEmail: config.smtpConfig.fromEmail,
        fromName: config.smtpConfig.fromName,
      };
    }

    // Add credentials if present
    if (config.credentials) {
      iniObj['credentials'] = {
        adminPIN: config.credentials.adminPIN,
        staffPIN: config.credentials.staffPIN,
      };
    }

    return ini.stringify(iniObj);
  }

  static async initialize(): Promise<void> {
    try {
      // Ensure .app_data directory exists
      const appDataDir = dirname(this.configPath);
      if (!existsSync(appDataDir)) {
        mkdirSync(appDataDir, { recursive: true });
        console.log('Created .app_data directory');
      }

      // If config file doesn't exist, copy from factory default
      if (!existsSync(this.configPath)) {
        if (!existsSync(this.defaultConfigPath)) {
          throw new Error('Factory default config not found');
        }
        copyFileSync(this.defaultConfigPath, this.configPath);
        console.log('Initialized device config from factory default');
      }

      // Read the device config file
      const configData = readFileSync(this.configPath, 'utf-8');

      // Parse INI format to config object
      const parsedConfig = this.parseIniToConfig(configData);

      // Track if we need to save changes
      let configModified = false;

      // Populate dynamic data BEFORE validation
      // Generate device ID if missing
      if (!parsedConfig.deviceId || parsedConfig.deviceId.trim() === '') {
        parsedConfig.deviceId = this.generateDeviceId(parsedConfig.deviceFamily);
        console.log(`Generated new device ID: ${parsedConfig.deviceId}`);
        configModified = true;
      }

      // Auto-configure SSID if in AP mode and not set
      if (
        parsedConfig.networkConfig?.mode === 'ap' &&
        (!parsedConfig.networkConfig.ssid || parsedConfig.networkConfig.ssid.trim() === '')
      ) {
        parsedConfig.networkConfig.ssid = `CourtController-${parsedConfig.deviceId}`;
        configModified = true;
      }

      // NOW validate the configuration with dynamic data populated
      const validationResult = deviceConfigurationSchema.safeParse(parsedConfig);

      if (!validationResult.success) {
        const errors = validationResult.error.issues
          .map((e) => `${e.path.join('.')}: ${e.message}`)
          .join(', ');
        throw new Error(`Invalid device configuration: ${errors}`);
      }

      const config = validationResult.data as DeviceConfiguration;

      // Save config if it was modified
      if (configModified) {
        const iniData = this.configToIni(config);
        writeFileSync(this.configPath, iniData, 'utf-8');
        console.log('Device config saved to file');
      }

      // Store in memory
      this.config = config;
    } catch (error) {
      throw new Error(`Failed to initialize device: ${error}`);
    }
  }

  static getConfig(): DeviceConfiguration {
    if (!this.config) {
      throw new Error('Device not initialized');
    }
    return this.config;
  }

  private static saveConfig(): void {
    if (!this.config) {
      throw new Error('Device not initialized');
    }

    const iniData = this.configToIni(this.config);
    writeFileSync(this.configPath, iniData, 'utf-8');
  }

  static updateConfig(updates: Partial<DeviceConfiguration>): void {
    if (!this.config) {
      throw new Error('Device not initialized');
    }

    // Prevent deviceId and deviceFamily from being updated
    if ('deviceId' in updates) {
      throw new Error('Device ID cannot be updated');
    }
    if ('deviceFamily' in updates) {
      throw new Error('Device family cannot be updated');
    }

    // Merge updates with current config
    const updatedConfig = { ...this.config, ...updates };

    // Validate the updated configuration
    const validationResult = deviceConfigurationSchema.safeParse(updatedConfig);

    if (!validationResult.success) {
      const errors = validationResult.error.issues
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join(', ');
      throw new Error(`Invalid configuration update: ${errors}`);
    }

    this.config = validationResult.data as DeviceConfiguration;
    this.saveConfig();
  }

  static async generateNetworkQR(): Promise<Buffer> {
    if (!this.config) {
      throw new Error('Device not initialized');
    }

    const networkConfig = this.config.networkConfig;
    let wifiConfig: WiFiConfig;

    if (networkConfig.mode === 'ap') {
      // AP mode: use AP network config
      wifiConfig = {
        ssid: networkConfig.ssid,
        password: networkConfig.password,
        security: networkConfig.security,
      };
    } else {
      // Client mode: prioritize guestNetwork, fallback to networkConfig
      if (this.config.guestNetwork) {
        // Use guest network if available
        wifiConfig = this.config.guestNetwork;
      } else if (networkConfig.connection.type === 'wifi') {
        // Fallback to main network config if WiFi
        wifiConfig = {
          ssid: networkConfig.connection.ssid,
          password: networkConfig.connection.password,
          security: networkConfig.connection.security,
        };
      } else {
        // Ethernet connection - cannot generate WiFi QR
        throw new Error('Cannot generate WiFi QR code for Ethernet connection without guest network');
      }
    }

    // Validate password for secured networks
    if (wifiConfig.security !== 'open' && !wifiConfig.password) {
      throw new Error('Missing password for secured network');
    }

    // WiFi QR code format: WIFI:T:WPA;S:ssid;P:password;;
    // T = authentication type (WPA, WEP, or leave empty for open)
    // S = SSID
    // P = password (omit for open networks)
    // H = hidden (true/false)
    const authType = wifiConfig.security === 'open' ? '' : wifiConfig.security;
    const wifiString =
      wifiConfig.security === 'open'
        ? `WIFI:T:;S:${wifiConfig.ssid};;`
        : `WIFI:T:${authType};S:${wifiConfig.ssid};P:${wifiConfig.password};;`;

    try {
      // Generate QR code as PNG buffer
      const qrBuffer = await QRCode.toBuffer(wifiString, {
        type: 'png',
        width: 300,
        margin: 3,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });

      return qrBuffer;
    } catch (error) {
      throw new Error(`Failed to generate network QR code: ${error}`);
    }
  }
}
