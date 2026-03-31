import { pgEnum, pgTable, serial, text, timestamp, integer,jsonb } from "drizzle-orm/pg-core";

export const matchStatusEnum = pgEnum("match_status", ["scheduled", "live", "finished"])

export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  sport: text("sport").notNull(),
  homeTeam: text("home_team").notNull(),
  awayTeam: text("away_team").notNull(),
  status: matchStatusEnum('status').notNull().default("scheduled"),
  startTime: timestamp("start_time"),
  endTime: timestamp("end_time"),
  homeScore: text("home_score").notNull(),
  awayScore: text("away_score").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const commentary = pgTable("commentary", {
  id: serial("id").primaryKey(),
  matchId: serial("match_id").notNull().references(() => matches.id),
  minute: integer("minute"),
  seconds: integer("seconds"),
  period: integer("period"),
  eventType: text("event_type"),
  actor: text("actor"),
  team: text("team"),
  message: text("message").notNull(),
  metadata: jsonb("metadata"),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").notNull().defaultNow(), 
})