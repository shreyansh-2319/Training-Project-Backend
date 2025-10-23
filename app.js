const express = require('express');
const app = express();

console.log('App module loaded');

const analyticsRoutes = require('./src/routes/analytics-routes');

app.use(express.json());
app.use('/api/analytics', analyticsRoutes);

module.exports = app;