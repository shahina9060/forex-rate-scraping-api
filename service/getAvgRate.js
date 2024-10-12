const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAvgRate = async(req,res)=>{
    const {currencyPair,startDate,endDate} = req.query;

    if(!currencyPair || !startDate || !endDate){
        return res.status(401).json({
            message: "Invalid inputes",
            success: false
        })
    }

    try {
        // Parse the date from the query parameter
        const parsedStartDate = new Date(startDate);
        // console.log("start date",parsedStartDate)

        const parsedEndDate = new Date(endDate);
        // console.log("end date",parsedEndDate)

        // Check if the date is valid
        if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
            return res.status(400).json({
                message: 'Invalid date format. Use YYYY-MM-DD.',
                success: false
            });
        }

        // Fetch the closing rate for the specified currency pair and date
        const averageRateResult = await prisma.forexRate.aggregate({
            where: {
                currencyPair: currencyPair,
                date: {
                    gte: new Date(parsedStartDate.setHours(0, 0, 0, 0)),  // Start date (inclusive)
                    lte: new Date(parsedEndDate.setHours(23, 59, 59, 999)) // End date (inclusive)
                }
            },
            _avg:{
                rate: true
            }
        });

        // Check if there is a valid average rate
        if (!averageRateResult._avg.rate) {
            return res.status(404).json({
                message: 'No rates found for the specified currency pair and date range.',
                success: false
            });
        }


        // Return the average rate as a response
        return res.status(200).json({
            currencyPair: currencyPair,
            startDate: parsedStartDate,
            endDate: parsedEndDate,
            averageRate: averageRateResult._avg.rate,
            success: true
        });

    } catch (error) {
        console.error('Error fetching closing rate:', error);
        return res.status(500).json({
            message: 'Server error',
            success: false
        });
    }
}

module.exports = getAvgRate