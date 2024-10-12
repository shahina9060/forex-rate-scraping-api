const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get closing conversion rate
const getClosingRate = async (req, res) => {
    const { currencyPair, date } = req.query;

    if (!currencyPair || !date) {
        return res.status(400).json({
            message: 'Currency pair and date are required.',
            success: false
        });
    }

    try {
        // Parse the date from the query parameter
        const parsedDate = new Date(date);
        // console.log("parsedDate",parsedDate)

        // Check if the date is valid
        if (isNaN(parsedDate.getTime())) {
            return res.status(400).json({
                message: 'Invalid date format. Use YYYY-MM-DD.',
                success: false
            });
        }

        const startOftheDay = new Date(parsedDate.setHours(0, 0, 0, 0))
        console.log("startOfTheDay", startOftheDay)

        const endOftheDay = new Date(parsedDate.setHours(23, 59, 59, 999))
        console.log("endOftheDay", endOftheDay)

        // Fetch the closing rate for the specified currency pair and date
        const closingRate = await prisma.forexRate.findFirst({
            where: {
                currencyPair: currencyPair,
                date: {
                    gte: startOftheDay, // start of the day
                    lt: endOftheDay // end of the day
                }
            },
            orderBy: {
                createdAt: 'desc' // Get the latest entry for that day
            }
        });

        if (!closingRate) {
            return res.status(404).json({
                message: 'No closing rate found for the specified currency pair and date.',
                success: false
            });
        }

        return res.status(200).json({
            currencyPair: closingRate.currencyPair,
            date: closingRate.date,
            rate: closingRate.rate,
            success: true,
            createdAt:closingRate.createdAt 
        });
    } catch (error) {
        console.error('Error fetching closing rate:', error);
        return res.status(500).json({
            message: 'Server error',
            success: false
        });
    }
}

module.exports = getClosingRate;
