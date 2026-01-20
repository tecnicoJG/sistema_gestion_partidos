import { z } from 'zod';

// IPv4 regex pattern
const ipv4Regex =
  /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

// WiFi Configuration Schema
const wiFiConfigSchema = z.object({
  ssid: z.string().min(1, 'SSID is required'),
  password: z.string().optional(),
  security: z.enum(['WPA2', 'WPA3', 'open']),
});

// Network Configuration Schema (discriminated union)
const networkConfigSchema = z.discriminatedUnion('mode', [
  z.object({
    mode: z.literal('ap'),
    ip: z.string().regex(ipv4Regex, 'Invalid IPv4 address'),
    subnet: z.string().regex(ipv4Regex, 'Invalid IPv4 subnet'),
    ssid: z.string().min(1, 'SSID is required'),
    password: z.string().optional(),
    security: z.enum(['WPA2', 'WPA3', 'open']),
  }),
  z.object({
    mode: z.literal('client'),
    hostname: z.string().min(1, 'Hostname is required'),
    ipConfig: z.discriminatedUnion('type', [
      z.object({
        type: z.literal('dhcp'),
      }),
      z.object({
        type: z.literal('static'),
        ip: z.string().regex(ipv4Regex, 'Invalid IPv4 address'),
        subnet: z.string().regex(ipv4Regex, 'Invalid IPv4 subnet'),
        gateway: z.string().regex(ipv4Regex, 'Invalid IPv4 gateway'),
        dns: z.union([
          z.tuple([
            z.string().regex(ipv4Regex, 'Invalid IPv4 DNS'),
            z.string().regex(ipv4Regex, 'Invalid IPv4 DNS'),
          ]),
          z.tuple([z.string().regex(ipv4Regex, 'Invalid IPv4 DNS')]),
        ]),
      }),
    ]),
    connection: z.discriminatedUnion('type', [
      z.object({
        type: z.literal('ethernet'),
      }),
      z.object({
        type: z.literal('wifi'),
        ssid: z.string().min(1, 'SSID is required'),
        password: z.string().optional(),
        security: z.enum(['WPA2', 'WPA3', 'open']),
      }),
    ]),
  }),
]);

// SMTP Configuration Schema
const smtpConfigSchema = z.object({
  host: z.string().min(1, 'SMTP host is required'),
  port: z.string(),
  secure: z.boolean(),
  fromEmail: z.string().email('Invalid from email'),
  fromName: z.string(),
  auth: z
    .object({
      user: z.string().min(1, 'SMTP user is required'),
      password: z.string().min(1, 'SMTP password is required'),
    })
    .optional(),
});

// Base Device Configuration Schema (shared fields)
const baseDeviceConfigSchema = z.object({
  deviceFamily: z.string().length(2, 'Device family must be 2 characters'),
  deviceId: z.string().min(1, 'Device ID is required'),
  status: z.enum(['available', 'occupied', 'maintenance', 'setup', 'warning', 'error']),
  courtName: z.string().optional(),
  availableSports: z.array(z.enum(['padel'])),
  venue: z
    .object({
      name: z.string().min(1, 'Venue name is required'),
      address: z.string().optional(),
    })
    .optional(),
  locale: z.enum(['es', 'en']),
  smtpConfig: smtpConfigSchema.optional(),
  theme: z.object({
    primaryColor: z.string().optional(),
    default: z.enum(['light', 'dark']),
  }),
  credentials: z
    .object({
      adminPIN: z.string().length(6, 'Admin PIN must be at 6 characters'),
      staffPIN: z.string().length(6, 'Staff PIN must be at 6 characters').optional(),
    })
    .optional(),
});

// Device Configuration Schema (discriminated union for guest network requirements)
export const deviceConfigurationSchema = z.union([
  // AP mode: guest network CANNOT exist
  baseDeviceConfigSchema.extend({
    networkConfig: networkConfigSchema.refine((config) => config.mode === 'ap', {
      message: 'Network config must be in AP mode',
    }),
  }),
  // Client + WiFi: guest network OPTIONAL
  baseDeviceConfigSchema.extend({
    networkConfig: networkConfigSchema.refine(
      (config) => config.mode === 'client' && config.connection.type === 'wifi',
      {
        message: 'Network config must be client mode with WiFi connection',
      }
    ),
    guestNetwork: wiFiConfigSchema.optional(),
  }),
  // Client + Ethernet: guest network REQUIRED
  baseDeviceConfigSchema.extend({
    networkConfig: networkConfigSchema.refine(
      (config) => config.mode === 'client' && config.connection.type === 'ethernet',
      {
        message: 'Network config must be client mode with Ethernet connection',
      }
    ),
    guestNetwork: wiFiConfigSchema,
  }),
]);

export type DeviceConfigurationValidated = z.infer<typeof deviceConfigurationSchema>;
