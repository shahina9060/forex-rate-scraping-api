const axios = require('axios');
const cheerio = require('cheerio');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Currency pairs with 'from' and 'to' values---- HARDCOPY
// const currencyPairs = [
//     { from: "USD", to: "EUR" },
//     { from: "EUR", to: "GBP" },
//     { from: "USD", to: "JPY" },
//     { from: "USD", to: "CAD" },
//     { from: "AUD", to: "INR" }
// ];

const  scrapeRates = async(fromCurrencyPair, toCurrencyPair)=> {
    // const {fromCurrencyPair, toCurrencyPair} = req.query;

    console.log("from currency pair",fromCurrencyPair)
    console.log("to currency pair",toCurrencyPair)
    try {
        const url = `https://www.xe.com/currencyconverter/convert/?Amount=1&From=${fromCurrencyPair}&To=${toCurrencyPair}`;
       
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        // Use a more stable selector, such as 'p[data-testid="result__ConvertedText"]' for the rate
        const rateText = $('p[class="sc-423c2a5f-1 gPUWGS"]').text(); // Check this selector in the page's HTML
        console.log("Extracted rate text:", rateText); // Debug to see if it works

        // Use regex to extract the numeric part from the rateText (if it includes text like "1 USD = X EUR")
        const rate = parseFloat(rateText.match(/[\d.]+/)[0]);

        if (isNaN(rate)) {
            throw new Error('Rate could not be extracted correctly.');
        }

        // Get yesterday's date
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        // Save rate in the database using Prisma
        await prisma.forexRate.create({
            data: {
                date: yesterday,
                currencyPair: `${fromCurrencyPair}/${toCurrencyPair}`,
                rate: rate
            }
        });

        console.log(`Saved rate for ${fromCurrencyPair}/${toCurrencyPair}: ${rate}`);
       
    } catch (error) {
        console.error(`Error scraping rates for USD/EUR:`, error.message);
    
    }
}

// Scrape all currency pairs
const scrapeAllRates = async () => {

    // fetching all currency pairs from currencypair model/table
    const currencyPairs = await prisma.currencyPair.findMany()

    for (let pair of currencyPairs) {
        await scrapeRates(pair.from, pair.to);
    }
};

module.exports = scrapeAllRates
