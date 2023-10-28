const { z } = require('zod')

const bet = z.object({
    id: z.number(),
    userId: z.string(),
    number: z.string(),
    points: z.number(),
    date: z.date(),
    verified: z.boolean(),
})

module.exports = bet