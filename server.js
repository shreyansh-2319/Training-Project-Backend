require('dotenv').config();
const express = require('express');
const appRouter = require('./app'); // Import the router from app.js

const app = express();
const PORT = 3000;

