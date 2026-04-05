import {
  pgTable,
  text,
  timestamp,
  serial,
  pgEnum,
} from "drizzle-orm/pg-core";

// ── Enums ────────────────────────────────────────
export const bookingStatusEnum = pgEnum("booking_status", [
  "new",
  "contacted",
  "converted",
  "dropped",
]);

// ── Bookings ─────────────────────────────────────
// Phase 0: captures free session requests from the landing page
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  parentName: text("parent_name").notNull(),
  studentName: text("student_name").notNull(),
  whatsapp: text("whatsapp").notNull(),
  email: text("email"),
  class: text("class").notNull(),
  board: text("board").notNull(),
  subject: text("subject"),
  preferredTime: text("preferred_time"),
  concern: text("concern"),
  status: bookingStatusEnum("status").default("new").notNull(),
  source: text("source").default("website").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;

// ── Placeholders for Phase 1 ──────────────────────
// users, students, sessions, concept_blocks, progress,
// subscriptions, parent_reports — added in Phase 1
