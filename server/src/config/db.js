import mongoose from './mongoose.js';

const CONNECTION_STATES = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting'
};

const connectionOptions = {
  dbName: 'thilini_rent_a_car',
  serverSelectionTimeoutMS: 2500,
  connectTimeoutMS: 4000
};

const safeConnectionLog = (level, event) => {
  if (process.env.NODE_ENV === 'test') return;
  const writer = level === 'error' ? console.error : level === 'warn' ? console.warn : console.info;
  writer(JSON.stringify({
    type: 'database_connection',
    event,
    timestamp: new Date().toISOString()
  }));
};

export const getDatabaseState = (connection = mongoose.connection) =>
  CONNECTION_STATES[connection.readyState] || 'unknown';

export const createConnectionManager = ({
  mongooseClient = mongoose,
  getUri = () => process.env.MONGODB_URI,
  options = connectionOptions,
  installListeners = true
} = {}) => {
  let pendingConnection = null;
  const connection = mongooseClient.connection;

  if (installListeners && !connection.__trcListenersInstalled) {
    Object.defineProperty(connection, '__trcListenersInstalled', {
      value: true,
      configurable: false,
      enumerable: false,
      writable: false
    });

    connection.on('connected', () => safeConnectionLog('info', 'connected'));
    connection.on('reconnected', () => safeConnectionLog('info', 'reconnected'));
    connection.on('disconnected', () => {
      safeConnectionLog('warn', 'disconnected');
    });
    connection.on('error', () => safeConnectionLog('error', 'error'));
  }

  const connect = async () => {
    if (connection.readyState === 1) {
      return connection;
    }

    if (pendingConnection) {
      return pendingConnection;
    }

    const uri = getUri();
    if (!uri) {
      const error = new Error('Database configuration is unavailable.');
      error.code = 'DATABASE_CONFIGURATION_MISSING';
      throw error;
    }

    const attempt = Promise.resolve()
      .then(() => mongooseClient.connect(uri, options))
      .then(() => connection);

    pendingConnection = attempt;

    try {
      return await attempt;
    } finally {
      // A completed promise must not prevent reconnection after a later drop.
      if (pendingConnection === attempt) {
        pendingConnection = null;
      }
    }
  };

  return {
    connect,
    getState: () => getDatabaseState(connection),
    hasPendingConnection: () => pendingConnection !== null,
    clearPendingConnection: () => {
      pendingConnection = null;
    }
  };
};

const defaultConnectionManager = createConnectionManager();

export const connectDB = () => defaultConnectionManager.connect();
export const hasPendingConnection = () => defaultConnectionManager.hasPendingConnection();

export const closeDB = async () => {
  defaultConnectionManager.clearPendingConnection();
  await mongoose.disconnect();
};
