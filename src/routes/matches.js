import { matches } from "../db/schema.js";
import { createMatchSchema, listMatchesQuerySchema } from "../validations/matches.js";
import { db } from "../db/db.js";
import { Router } from "express";
import { getMatchStatus } from "../utils/match-status.js";
import { desc } from "drizzle-orm";

export const matchesRouter = Router()

const MAX_LIMIT = 100;

matchesRouter.get("/", async (req, res) => {
  const parsed = listMatchesQuerySchema.safeParse(req.query);
  if(!parsed.success) {
    return res.status(400).json({ error: 'query parameters are invalid', details: parsed.error.issues })
  }
  const limit = Math.min(parsed.data.limit ?? 50, MAX_LIMIT) // set a maximum limit to prevent abuse;
  try{ 
    const data = await db.select().from(matches).limit(limit).orderBy((desc(matches.createdAt)));
    res.json({ data })
  } catch(error) {
    return res.status(500).json({ error: 'Failed to retrieve matches' })
  }
});

matchesRouter.post("/", async (req, res) => {
  const parsed = createMatchSchema.safeParse(req.body);
  if(!parsed.success) {
    return res.status(400).json({ error: 'payload is invalid', details: parsed.error.issues })
  }
  const { startTime, endTime, homeScore, awayScore } = parsed.data
  try {
    const [event] = await db.insert(matches).values({
      ...parsed.data,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      homeScore: homeScore ?? 0,
      awayScore: awayScore ?? 0,
      status: getMatchStatus(startTime, endTime)
    }).returning()
    res.status(201).json({ data: event })
  } catch (error) {
    res.status(500).json({ error: 'Failed to create match' })
  }

})

