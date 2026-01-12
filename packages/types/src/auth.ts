interface BaseAuthContext {
  role: 'guest' | 'player' | 'staff' | 'admin';
  authToken: string;
}

interface SessionAuthContext extends BaseAuthContext {
  type: 'session';
  role: 'guest' | 'player';
  sessionToken: string;
}

interface DeviceAuthContext extends BaseAuthContext {
  type: 'device';
  deviceId: string;
}

export type AuthContext = SessionAuthContext | DeviceAuthContext;
