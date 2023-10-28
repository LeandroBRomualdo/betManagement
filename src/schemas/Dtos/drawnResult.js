const { z } = require('zod')

const prizeDrawnMessage = z.object({
    id: z.string(),
    hundredDrawn: z.number(),
    animalDrawn: z.string(),
    drawnAt: z.date(),
})

module.exports = prizeDrawnMessage