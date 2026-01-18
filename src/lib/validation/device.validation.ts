import { z } from 'zod';
import { deviceConfigurationSchema } from '../schemas/index.js';

// Route: GET /api/device/config
export const getDeviceConfigSchema = z.object({});

// Route: POST /api/device/config
export const updateDeviceConfigSchema = z.object({
  body: deviceConfigurationSchema.partial().refine(
    (data) => {
      // Prevent deviceId and deviceFamily from being updated
      return !('deviceId' in data) && !('deviceFamily' in data);
    },
    {
      message: 'Device ID and Device Family cannot be updated',
    }
  ),
});

// Route: GET /api/device/ap-qr
export const getAPQRCodeSchema = z.object({});

// Route: POST /api/device/restart
export const restartDeviceSchema = z.object({});

// ============================================================================
// EXPORTED TYPES (Inferred from Zod schemas)
// ============================================================================

export type UpdateDeviceConfigInput = z.infer<typeof updateDeviceConfigSchema>;
