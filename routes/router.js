const express = require('express');
const addCurrency = require('../service/addCurrency');
const getClosingRate = require('../service/getClosingRate');
const getAvgRate = require('../service/getAvgRate');

const routes = express.Router();

// adding currency pair route
routes.post('/api/currency-pair',addCurrency) 

// geting closing rate route
routes.get('/api/get-closing/rate', getClosingRate)

// geting average rate route
routes.get('/api/get-avg/rate',getAvgRate)

module.exports = routes