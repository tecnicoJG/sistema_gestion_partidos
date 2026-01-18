import { spawn } from 'child_process';
import { Request, Response } from 'express';
import { DeviceService } from '~/modules/device/index.js';

export class DeviceController {
  static getConfig(_req: Request, res: Response) {
    try {
      const config = DeviceService.getConfig();
      return res.json(config);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to get device config' });
    }
  }

  static updateConfig(req: Request, res: Response) {
    try {
      const config = req.body;
      DeviceService.updateConfig(config);
      return res.json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update device config' });
    }
  }

  static async getAPQRCode(_req: Request, res: Response) {
    try {
      const qrBuffer = await DeviceService.generateNetworkQR();

      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Content-Length', qrBuffer.length);
      return res.send(qrBuffer);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to generate AP QR code' });
    }
  }

  static restart(_req: Request, res: Response) {
    res.json({ message: 'Server restarting...' });

    setTimeout(() => {
      // Determine the correct command to restart
      // If running via ts-node or similar, we need to preserve that
      const args = process.argv.slice(1);
      const command = process.execPath;

      console.log('Restarting with:', command, args);

      // Spawn a new instance of the server
      const child = spawn(command, args, {
        detached: true,
        stdio: 'ignore',
        cwd: process.cwd(),
        env: process.env,
      });

      // Detach the child process so it continues after parent exits
      child.unref();

      // Exit current process
      process.exit(0);
    }, 500);
  }
}
