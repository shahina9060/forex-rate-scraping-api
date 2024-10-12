const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Route to add a new currency pair for tracking
const addCurrency = async (req, res) => {
    const { from, to } = req.body;

    // Check if both from and to values are not provided
    if (!from || !to) {
        return res.status(400).json({
            success: false,
            message: "Both 'from' and 'to' fields are required."
        });
    }

    try {
        // Add the new currency pair to the database
        const newCurrencyPair = await prisma.currencyPair.create({
            data: {
                from,
                to
            }
        });

        return res.status(201).json({
            success: true,
            message: 'Currency pair added successfully',
            currencyPair: newCurrencyPair
        });
    } catch (error) {
        console.error('Error adding currency pair:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Error adding currency pair',
            error: error.message
        });
    }
}

module.exports = addCurrency

