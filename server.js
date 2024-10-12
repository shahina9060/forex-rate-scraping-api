const express = require('express')
const dotenv = require('dotenv');
const routes = require('./routes/router');

// const scrapeAllRates = require('./service/forexRateScraping');

// imported to start the cron job 
const jobScheduler = require('./service/schedulerCron');
// const scrapeAllRates = require('./service/forexRateScraping');

const app = express();
dotenv.config();
// scrapeAllRates()
// jobScheduler.start();

// middleware
app.use(express.json())
app.use(express.urlencoded({extended:true}))

// routes
app.use(routes)


// server url
app.listen(process.env.SERVER_PORT,()=>{
    console.log(`server is running on ${process.env.SERVER_PORT}`);
})