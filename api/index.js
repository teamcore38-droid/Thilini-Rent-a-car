import app from '../server/src/server.js';

export default async function handler(req, res) {
  try {
    return app(req, res);
  } catch (error) {
    console.error('[Serverless Handler Fatal Error]:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error'
    });
  }
}
