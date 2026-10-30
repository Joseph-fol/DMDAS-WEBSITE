const dns = require('node:dns');

const checkInternetConnection = (req, res, next) => {
    if (process.env.NODE_ENV === 'production') {
        dns.lookup('google.com', (err) => {
            if (err && (err.code === 'ENOTFOUND' || err.code === 'EAI_AGAIN')) {
                return res.status(503).json({ message: 'No internet connection on the server. Please try again later.' });
            }
            next();
        });
    } else {
        // In development, just proceed without checking
        next();
    }
};

module.exports = { checkInternetConnection };