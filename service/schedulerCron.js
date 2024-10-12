const cron = require('node-cron');
const scrapeAllRates = require('./forexRateScraping');

// Schedule the scraping job to run every day at 6 AM
// Add { scheduled: true } to make sure it runs immediately
const jobScheduler = cron.schedule('0 6 * * *', async () => {
    console.log('Starting daily forex rate scraping...');
    await scrapeAllRates();
    console.log('Finished scraping for the day');
}, {
    scheduled: true // Ensures the cron job is automatically started
});

// Log that the cron job has been scheduled
console.log("Cron job has been scheduled");

module.exports = jobScheduler;
