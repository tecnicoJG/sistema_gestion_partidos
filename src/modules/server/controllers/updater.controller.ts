import { createRequire } from 'module';
import { Request, Response } from 'express';

// Load CommonJS Updater module
const require = createRequire(import.meta.url);
// @ts-ignore - JavaScript CommonJS module
const Updater = require('~/modules/updater/index.js');

export class UpdaterController {
  static check(_req: Request, res: Response): void {
    const updater = Updater.getInstance();

    if (!updater) {
      res.status(500).json({ error: 'Updater not initialized' });
      return;
    }

    updater.check((error: Error | null, result: any) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      return res.json(result);
    });
  }

  static download(_req: Request, res: Response): void {
    const updater = Updater.getInstance();

    if (!updater) {
      res.status(500).json({ error: 'Updater not initialized' });
      return;
    }

    updater.download((error: Error | null, result: any) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      return res.json(result);
    });
  }

  static install(_req: Request, res: Response): void {
    const updater = Updater.getInstance();

    if (!updater) {
      res.status(500).json({ error: 'Updater not initialized' });
      return;
    }

    updater.install((error: Error | null, result: any): void => {
      if (error) {
        res.status(500).json({ error: error.message });
        return;
      }

      // Send response before restart
      res.json(result);

      // Restart server after successful install
      setTimeout(() => {
        console.log('Restarting server after update installation...');
        process.exit(0);
      }, 1000);
    });
  }

  static getState(_req: Request, res: Response) {
    const updater = Updater.getInstance();

    if (!updater) {
      return res.status(500).json({ error: 'Updater not initialized' });
    }

    const state = updater.getState();
    return res.json(state);
  }

  static clearDownloads(_req: Request, res: Response): void {
    const updater = Updater.getInstance();

    if (!updater) {
      res.status(500).json({ error: 'Updater not initialized' });
      return;
    }

    updater.clearDownloads((error: Error | null, result: any) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      return res.json(result);
    });
  }

  static rollback(_req: Request, res: Response): void {
    const updater = Updater.getInstance();

    if (!updater) {
      res.status(500).json({ error: 'Updater not initialized' });
      return;
    }

    updater.rollback((error: Error | null, result: any): void => {
      if (error) {
        res.status(500).json({ error: error.message });
        return;
      }

      // Send response before restart
      res.json(result);

      // Restart server after successful rollback
      setTimeout(() => {
        console.log('Restarting server after rollback...');
        process.exit(0);
      }, 1000);
    });
  }

  static getRollbackInfo(_req: Request, res: Response) {
    const updater = Updater.getInstance();

    if (!updater) {
      return res.status(500).json({ error: 'Updater not initialized' });
    }

    const rollbackInfo = updater.getRollbackInfo();
    return res.json(rollbackInfo || { available: false });
  }

  static clearBackups(_req: Request, res: Response): void {
    const updater = Updater.getInstance();

    if (!updater) {
      res.status(500).json({ error: 'Updater not initialized' });
      return;
    }

    updater.clearBackups((error: Error | null, result: any) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      return res.json(result);
    });
  }
}
