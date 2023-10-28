const { z } = require('zod')

const placeABetRequestDto = z.object({
    userId: z.string(),
    betNumber: z.number(),
    bettingPoints: z.number(),
})

module.exports = placeABetRequestDto