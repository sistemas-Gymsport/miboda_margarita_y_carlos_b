const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const corsOptions = require('./config/cors');
const { apiLimiter } = require('./middleware/rateLimit');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const routes = require('./routes');

const app = express();

// Render (y la mayoria de PaaS) estan detras de un proxy: necesario para IPs reales y cookies secure.
app.set('trust proxy', 1);
app.disable('x-powered-by');
app.set('etag', false);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false, // API JSON: no sirve HTML
  })
);
app.use(cors(corsOptions));
app.use(express.json({ limit: '200kb' }));
app.use(cookieParser());

app.get('/', (req, res) => res.json({ ok: true, service: 'wedding-invitation-api' }));
app.use('/api', apiLimiter, routes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
