import { z } from "zod";

// Constants
export const MATCH_STATUS = {
  SCHEDULED: "scheduled",
  LIVE: "live",
  FINISHED: "finished",
};

// Query Schemas
export const listMatchesQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).optional(),
});

// Param Schemas
export const matchIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});



// Match Schemas
export const createMatchSchema = z
  .object({
    sport: z.string().min(1, "Sport cannot be empty"),
    homeTeam: z.string().min(1, "Home team cannot be empty"),
    awayTeam: z.string().min(1, "Away team cannot be empty"),
    startTime: z.iso.datetime(),
    endTime: z.iso.datetime(),
    homeScore: z.coerce.number().int().nonnegative().optional(),
    awayScore: z.coerce.number().int().nonnegative().optional(),
  })
  .superRefine((data, ctx) => {
    const start= new Date(data.startTime);
    const end= new Date(data.endTime);

    if (end <= start) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endTime"],
        message: "End time must be chronologically after start time",
      });
    }
  });

export const updateScoreSchema = z.object({
  homeScore: z.coerce.number().int().nonnegative(),
  awayScore: z.coerce.number().int().nonnegative(),
});
