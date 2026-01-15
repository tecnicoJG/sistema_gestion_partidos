import { DeviceConfiguration, WiFiConfig } from '@controller/types';
import { randomBytes } from 'crypto';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import QRCode from 'qrcode';

export class DeviceService {
  private static configPath: string = resolve(__dirname, '../../../../config/device/config.json');

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

  static async initialize(): Promise<void> {
    try {
      // Read the device config file
      const configData = readFileSync(this.configPath, 'utf-8');
      const config: DeviceConfiguration = JSON.parse(configData);

      // Validate deviceFamily exists
      if (!config.deviceFamily || config.deviceFamily.trim() === '') {
        throw new Error('Device family is required in config');
      }

      // Check if device ID exists and is valid
      if (config.deviceId && config.deviceId.trim() !== '') {
        this.config = config;
      } else {
        // Generate a new short ID for this device using the device family from config
        config.deviceId = this.generateDeviceId(config.deviceFamily);
        console.log(`Generated new device ID: ${config.deviceId}`);

        // Auto-configure based on deviceId
        // Set SSID if in AP mode and not set
        if (config.networkConfig.mode === 'ap' && !config.networkConfig.ssid) {
          config.networkConfig.ssid = `CourtController-${config.deviceId}`;
        }

        // Save updated config to file and store in memory
        writeFileSync(this.configPath, JSON.stringify(config, null, 2), 'utf-8');
        this.config = config;
        console.log(`Device Config saved to file`);
      }
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

    this.config = { ...this.config, ...updates };
    writeFileSync(this.configPath, JSON.stringify(this.config, null, 2), 'utf-8');
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
