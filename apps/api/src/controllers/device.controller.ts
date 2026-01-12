import { Request, Response } from 'express';
import { DeviceService } from '../services';

export class DeviceController {
  static getConfig(_req: Request, res: Response) {
    try {
      const config = DeviceService.getConfig();
      return res.json(config);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to get device config' });
    }
  }

  static async getQRCode(_req: Request, res: Response) {
    try {
      const qrBuffer = await DeviceService.generateDeviceQR();

      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Content-Length', qrBuffer.length);
      return res.send(qrBuffer);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to generate QR code' });
    }
  }
}
