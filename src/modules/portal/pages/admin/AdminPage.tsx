import { useEffect, useState } from 'react';

interface UpdateInfo {
  currentVersion: string;
  latestVersion: string;
  targetVersion: string;
  updateAvailable: boolean;
  isLatestCompatible: boolean;
  releaseName: string;
  releaseNotes: string;
  downloaded: boolean;
  downloadedVersion: string | null;
}

export function AdminPage() {
  const [isRestarting, setIsRestarting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Update state
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const handleRestart = async () => {
    if (isRestarting) return;

    setIsRestarting(true);

    try {
      const response = await fetch('/api/device/restart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        // Server is restarting, show message
        alert('Device is restarting...');
      } else {
        alert('Failed to restart device');
        setIsRestarting(false);
      }
    } catch (error) {
      console.error('Error restarting device:', error);
      alert('Error restarting device');
      setIsRestarting(false);
    }
  };

  const handleFactoryReset = async () => {
    if (isResetting) return;

    setIsResetting(true);
    setShowResetConfirm(false);

    try {
      const response = await fetch('/api/device/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        // Device is resetting and restarting
        alert('Factory reset completed. Device is restarting...');
      } else {
        alert('Failed to perform factory reset');
        setIsResetting(false);
      }
    } catch (error) {
      console.error('Error performing factory reset:', error);
      alert('Error performing factory reset');
      setIsResetting(false);
    }
  };

  const checkForUpdates = async () => {
    setIsChecking(true);
    setUpdateError(null);

    try {
      const response = await fetch('/api/updater/check');
      if (response.ok) {
        const data = await response.json();
        setUpdateInfo(data);
      } else {
        const error = await response.json();
        setUpdateError(error.error || 'Failed to check for updates');
      }
    } catch (error) {
      console.error('Error checking for updates:', error);
      setUpdateError('Error checking for updates');
    } finally {
      setIsChecking(false);
    }
  };

  const downloadUpdate = async () => {
    setIsDownloading(true);
    setUpdateError(null);

    try {
      const response = await fetch('/api/updater/download', { method: 'POST' });
      if (response.ok) {
        await checkForUpdates(); // Refresh update info
      } else {
        const error = await response.json();
        setUpdateError(error.error || 'Failed to download update');
      }
    } catch (error) {
      console.error('Error downloading update:', error);
      setUpdateError('Error downloading update');
    } finally {
      setIsDownloading(false);
    }
  };

  const installUpdate = async () => {
    setIsInstalling(true);
    setUpdateError(null);

    try {
      const response = await fetch('/api/updater/install', { method: 'POST' });
      if (response.ok) {
        alert('Update installed successfully. Device is restarting...');
      } else {
        const error = await response.json();
        setUpdateError(error.error || 'Failed to install update');
        setIsInstalling(false);
      }
    } catch (error) {
      console.error('Error installing update:', error);
      setUpdateError('Error installing update');
      setIsInstalling(false);
    }
  };

  // Check for updates on mount
  useEffect(() => {
    checkForUpdates();
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-display-text-primary mb-2 uppercase tracking-wider">
        Admin Panel
      </h1>
      <p className="text-xl text-display-text-secondary mb-12 uppercase tracking-wide">
        Device configuration and settings
      </p>

      <div className="space-y-8">
        {/* Software Updates Section */}
        <div className="bg-display-bg-tertiary rounded-xl p-6 border-2 border-display-bg-primary">
          <h2 className="text-2xl font-bold text-display-text-primary mb-4 uppercase tracking-wider">
            Software Updates
          </h2>

          {updateError && (
            <div className="mb-4 bg-red-500 bg-opacity-20 border-2 border-red-500 rounded-lg px-4 py-3">
              <p className="text-red-200">{updateError}</p>
            </div>
          )}

          {updateInfo && (
            <div className="space-y-4">
              {/* Current Version Info */}
              <div className="p-4 bg-display-bg-secondary rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-display-text-secondary uppercase tracking-wide">
                      Current Version
                    </p>
                    <p className="text-xl font-bold text-display-text-primary">
                      v{updateInfo.currentVersion}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-display-text-secondary uppercase tracking-wide">
                      Latest Version
                    </p>
                    <p className="text-xl font-bold text-display-text-primary">
                      v{updateInfo.latestVersion}
                    </p>
                  </div>
                </div>
              </div>

              {/* Update Available */}
              {updateInfo.updateAvailable ? (
                <div className="p-4 bg-blue-500 bg-opacity-10 border-2 border-blue-500 rounded-lg">
                  <h3 className="text-lg font-bold text-blue-400 mb-2 uppercase tracking-wide">
                    {updateInfo.releaseName}
                  </h3>
                  <p className="text-sm text-display-text-secondary mb-2">
                    Version {updateInfo.targetVersion} is available
                  </p>
                  {!updateInfo.isLatestCompatible && (
                    <p className="text-sm text-yellow-400 mb-2">
                      Note: Intermediate update required. Latest version ({updateInfo.latestVersion}
                      ) will be available after this update.
                    </p>
                  )}
                  {updateInfo.releaseNotes && (
                    <div className="mt-4 p-3 bg-display-bg-secondary rounded text-sm text-display-text-primary">
                      <p className="font-bold mb-2 uppercase tracking-wide">Release Notes:</p>
                      <p className="whitespace-pre-wrap">{updateInfo.releaseNotes}</p>
                    </div>
                  )}

                  <div className="mt-4 flex gap-4">
                    {!updateInfo.downloaded ? (
                      <button
                        onClick={downloadUpdate}
                        disabled={isDownloading}
                        className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isDownloading ? 'Downloading...' : 'Download Update'}
                      </button>
                    ) : (
                      <button
                        onClick={installUpdate}
                        disabled={isInstalling}
                        className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isInstalling ? 'Installing...' : 'Install Update'}
                      </button>
                    )}
                    <button
                      onClick={checkForUpdates}
                      disabled={isChecking}
                      className="px-6 py-3 bg-display-bg-tertiary text-display-text-primary font-bold rounded-lg hover:bg-display-bg-primary transition-colors uppercase tracking-wide disabled:opacity-50"
                    >
                      {isChecking ? 'Checking...' : 'Refresh'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-green-500 bg-opacity-10 border-2 border-green-500 rounded-lg">
                  <p className="text-green-400 font-bold uppercase tracking-wide">
                    ✓ Your software is up to date
                  </p>
                  <button
                    onClick={checkForUpdates}
                    disabled={isChecking}
                    className="mt-4 px-6 py-3 bg-display-bg-tertiary text-display-text-primary font-bold rounded-lg hover:bg-display-bg-primary transition-colors uppercase tracking-wide disabled:opacity-50"
                  >
                    {isChecking ? 'Checking...' : 'Check for Updates'}
                  </button>
                </div>
              )}
            </div>
          )}

          {!updateInfo && !isChecking && (
            <button
              onClick={checkForUpdates}
              className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors uppercase tracking-wide"
            >
              Check for Updates
            </button>
          )}

          {isChecking && !updateInfo && (
            <div className="text-center py-8">
              <p className="text-display-text-secondary uppercase tracking-wide">
                Checking for updates...
              </p>
            </div>
          )}
        </div>

        {/* Device Management Section */}
        <div className="bg-display-bg-tertiary rounded-xl p-6 border-2 border-display-bg-primary">
          <h2 className="text-2xl font-bold text-display-text-primary mb-4 uppercase tracking-wider">
            Device Management
          </h2>

          <div className="space-y-4">
            {/* Restart Device */}
            <div className="flex items-center justify-between p-4 bg-display-bg-secondary rounded-lg">
              <div>
                <h3 className="text-lg font-bold text-display-text-primary uppercase tracking-wide">
                  Restart Device
                </h3>
                <p className="text-sm text-display-text-secondary mt-1">
                  Restart the device to apply updates or resolve issues
                </p>
              </div>
              <button
                onClick={handleRestart}
                disabled={isRestarting}
                className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRestarting ? 'Restarting...' : 'Restart'}
              </button>
            </div>

            {/* Factory Reset */}
            <div className="flex items-center justify-between p-4 bg-display-bg-secondary rounded-lg border-2 border-red-500/20">
              <div>
                <h3 className="text-lg font-bold text-red-500 uppercase tracking-wide">
                  Factory Reset
                </h3>
                <p className="text-sm text-display-text-secondary mt-1">
                  Reset device to factory defaults. This will erase all settings and configuration.
                </p>
              </div>
              <button
                onClick={() => setShowResetConfirm(true)}
                disabled={isResetting}
                className="px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isResetting ? 'Resetting...' : 'Factory Reset'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Factory Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-display-bg-secondary rounded-xl p-8 max-w-md mx-4 border-2 border-red-500">
            <h3 className="text-2xl font-bold text-red-500 mb-4 uppercase tracking-wider">
              Confirm Factory Reset
            </h3>
            <p className="text-display-text-primary mb-6">
              Are you sure you want to reset the device to factory defaults? This action cannot be
              undone and will erase all settings, network configuration, and credentials.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 px-6 py-3 bg-display-bg-tertiary text-display-text-primary font-bold rounded-lg hover:bg-display-bg-primary transition-colors uppercase tracking-wide"
              >
                Cancel
              </button>
              <button
                onClick={handleFactoryReset}
                className="flex-1 px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors uppercase tracking-wide"
              >
                Reset Device
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
