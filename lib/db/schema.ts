import {
  pgTable,
  text,
  timestamp,
  serial,
  integer,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ── Enums ─────────────────────────────────────────────────────────────────────

export const bookingStatusEnum = pgEnum("booking_status", [
  "new", "contacted", "converted", "dropped",
]);

export const userRoleEnum = pgEnum("user_role", [
  "student", "parent", "mentor", "admin",
]);

export const sessionStatusEnum = pgEnum("session_status", [
  "scheduled", "completed", "cancelled", "no_show",
]);

export const subscriptionTierEnum = pgEnum("subscription_tier", [
  "spark", "illuminate", "mastery",
]);

export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "active", "paused", "cancelled", "trial",
]);

export const difficultyEnum = pgEnum("difficulty", [
  "foundation", "standard", "advanced",
]);

// ── Users ─────────────────────────────────────────────────────────────────────
// All roles (student, parent, mentor, admin) share this base table.
// Phase 3 will add NextAuth sessions/accounts tables on top of this.

export const users = pgTable("users", {
  id:           serial("id").primaryKey(),
  email:        text("email").notNull().unique(),
  name:         text("name").notNull(),
  passwordHash: text("password_hash"),               // null for OAuth users
  phone:        text("phone"),
  role:         userRoleEnum("role").notNull().default("student"),
  avatarUrl:    text("avatar_url"),
  isActive:     boolean("is_active").notNull().default(true),
  createdAt:    timestamp("created_at").defaultNow().notNull(),
  updatedAt:    timestamp("updated_at").defaultNow().notNull(),
});

// ── Students ──────────────────────────────────────────────────────────────────

export const students = pgTable("students", {
  id:                 serial("id").primaryKey(),
  userId:             integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  parentId:           integer("parent_id").references(() => users.id),       // parent's user.id
  mentorId:           integer("mentor_id").references(() => users.id),       // assigned mentor
  class:              text("class").notNull(),                                 // "Class 9"
  board:              text("board").notNull(),                                 // "CBSE"
  city:               text("city"),
  subjects:           text("subjects").array(),                                // ["Science","Math"]
  subscriptionTier:   subscriptionTierEnum("subscription_tier"),
  subscriptionStatus: subscriptionStatusEnum("subscription_status").default("trial"),
  enrolledAt:         timestamp("enrolled_at").defaultNow().notNull(),
  notes:              text("notes"),                                           // internal mentor notes
});

// ── Sessions ──────────────────────────────────────────────────────────────────

export const sessions = pgTable("sessions", {
  id:              serial("id").primaryKey(),
  studentId:       integer("student_id").notNull().references(() => students.id),
  mentorId:        integer("mentor_id").notNull().references(() => users.id),
  scheduledAt:     timestamp("scheduled_at").notNull(),
  durationMins:    integer("duration_mins").notNull().default(55),
  subjects:        text("subjects").array(),
  status:          sessionStatusEnum("status").notNull().default("scheduled"),
  sessionNotes:    text("session_notes"),                                      // mentor's post-session notes
  nextSessionPlan: text("next_session_plan"),
  whatsappSent:    boolean("whatsapp_sent").default(false),
  createdAt:       timestamp("created_at").defaultNow().notNull(),
});

// ── Concept Blocks ────────────────────────────────────────────────────────────
// The content units — each one is a teachable concept (e.g. "Gravitation")

export const conceptBlocks = pgTable("concept_blocks", {
  id:          serial("id").primaryKey(),
  subject:     text("subject").notNull(),     // "Science"
  topic:       text("topic").notNull(),       // "Gravitation"
  class:       text("class").notNull(),       // "Class 9"
  board:       text("board").notNull(),       // "CBSE"
  title:       text("title").notNull(),       // "Why doesn't the moon fall?"
  contentMd:   text("content_md"),           // full session guide in markdown
  difficulty:  difficultyEnum("difficulty").notNull().default("standard"),
  durationMins: integer("duration_mins").default(55),
  createdBy:   integer("created_by").references(() => users.id),
  isPublished: boolean("is_published").notNull().default(false),
  createdAt:   timestamp("created_at").defaultNow().notNull(),
  updatedAt:   timestamp("updated_at").defaultNow().notNull(),
});

// ── Progress ──────────────────────────────────────────────────────────────────
// One row per student × concept block — tracks understanding over time

export const progress = pgTable("progress", {
  id:                  serial("id").primaryKey(),
  studentId:           integer("student_id").notNull().references(() => students.id),
  conceptBlockId:      integer("concept_block_id").notNull().references(() => conceptBlocks.id),
  sessionId:           integer("session_id").references(() => sessions.id),
  understandingScore:  integer("understanding_score"),   // 1–10
  memorisationScore:   integer("memorisation_score"),    // 1–10
  nodeGreen:           boolean("node_green").default(false), // did student "get it"?
  mentorNotes:         text("mentor_notes"),
  assessedAt:          timestamp("assessed_at").defaultNow().notNull(),
});

// ── Subscriptions ─────────────────────────────────────────────────────────────

export const subscriptions = pgTable("subscriptions", {
  id:                    serial("id").primaryKey(),
  studentId:             integer("student_id").notNull().references(() => students.id),
  tier:                  subscriptionTierEnum("tier").notNull(),
  status:                subscriptionStatusEnum("status").notNull().default("active"),
  amountPaise:           integer("amount_paise").notNull(),  // in paise: 49900 = ₹499
  razorpaySubscriptionId: text("razorpay_subscription_id"),
  razorpayCustomerId:    text("razorpay_customer_id"),
  startedAt:             timestamp("started_at").defaultNow().notNull(),
  renewsAt:              timestamp("renews_at"),
  cancelledAt:           timestamp("cancelled_at"),
  createdAt:             timestamp("created_at").defaultNow().notNull(),
});

// ── Parent Reports ────────────────────────────────────────────────────────────
// Auto-generated weekly report sent to parents every Sunday

export const parentReports = pgTable("parent_reports", {
  id:                 serial("id").primaryKey(),
  studentId:          integer("student_id").notNull().references(() => students.id),
  weekStart:          timestamp("week_start").notNull(),
  weekEnd:            timestamp("week_end").notNull(),
  sessionsCompleted:  integer("sessions_completed").notNull().default(0),
  conceptsCovered:    text("concepts_covered").array(),
  progressSummary:    text("progress_summary"),        // plain-language AI summary
  mentorNote:         text("mentor_note"),             // personal note from mentor
  emailSentAt:        timestamp("email_sent_at"),
  createdAt:          timestamp("created_at").defaultNow().notNull(),
});

// ── Bookings ──────────────────────────────────────────────────────────────────
// Phase 0: free session requests from the landing page

export const bookings = pgTable("bookings", {
  id:            serial("id").primaryKey(),
  parentName:    text("parent_name").notNull(),
  studentName:   text("student_name").notNull(),
  whatsapp:      text("whatsapp").notNull(),
  email:         text("email"),
  class:         text("class").notNull(),
  board:         text("board").notNull(),
  subject:       text("subject"),
  preferredTime: text("preferred_time"),
  concern:       text("concern"),
  status:        bookingStatusEnum("status").default("new").notNull(),
  convertedToStudentId: integer("converted_to_student_id").references(() => students.id),
  source:        text("source").default("website").notNull(),
  createdAt:     timestamp("created_at").defaultNow().notNull(),
});

// ── Relations ─────────────────────────────────────────────────────────────────

export const usersRelations = relations(users, ({ many }) => ({
  studentsAsStudent: many(students, { relationName: "student_user" }),
  studentsAsParent:  many(students, { relationName: "parent_user" }),
  studentsAsMentor:  many(students, { relationName: "mentor_user" }),
  sessionsAsMentor:  many(sessions),
  conceptBlocks:     many(conceptBlocks),
}));

export const studentsRelations = relations(students, ({ one, many }) => ({
  user:          one(users, { fields: [students.userId],   references: [users.id], relationName: "student_user" }),
  parent:        one(users, { fields: [students.parentId], references: [users.id], relationName: "parent_user" }),
  mentor:        one(users, { fields: [students.mentorId], references: [users.id], relationName: "mentor_user" }),
  sessions:      many(sessions),
  progress:      many(progress),
  subscriptions: many(subscriptions),
  parentReports: many(parentReports),
  bookings:      many(bookings),
}));

export const sessionsRelations = relations(sessions, ({ one, many }) => ({
  student:  one(students,    { fields: [sessions.studentId], references: [students.id] }),
  mentor:   one(users,       { fields: [sessions.mentorId],  references: [users.id] }),
  progress: many(progress),
}));

export const conceptBlocksRelations = relations(conceptBlocks, ({ one, many }) => ({
  creator:  one(users,    { fields: [conceptBlocks.createdBy], references: [users.id] }),
  progress: many(progress),
}));

export const progressRelations = relations(progress, ({ one }) => ({
  student:      one(students,      { fields: [progress.studentId],      references: [students.id] }),
  conceptBlock: one(conceptBlocks, { fields: [progress.conceptBlockId], references: [conceptBlocks.id] }),
  session:      one(sessions,      { fields: [progress.sessionId],      references: [sessions.id] }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  student: one(students, { fields: [subscriptions.studentId], references: [students.id] }),
}));

export const parentReportsRelations = relations(parentReports, ({ one }) => ({
  student: one(students, { fields: [parentReports.studentId], references: [students.id] }),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  convertedStudent: one(students, { fields: [bookings.convertedToStudentId], references: [students.id] }),
}));

// ── Types ─────────────────────────────────────────────────────────────────────

export type User           = typeof users.$inferSelect;
export type NewUser        = typeof users.$inferInsert;
export type Student        = typeof students.$inferSelect;
export type NewStudent     = typeof students.$inferInsert;
export type Session        = typeof sessions.$inferSelect;
export type NewSession     = typeof sessions.$inferInsert;
export type ConceptBlock   = typeof conceptBlocks.$inferSelect;
export type NewConceptBlock = typeof conceptBlocks.$inferInsert;
export type Progress       = typeof progress.$inferSelect;
export type NewProgress    = typeof progress.$inferInsert;
export type Subscription   = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;
export type ParentReport   = typeof parentReports.$inferSelect;
export type NewParentReport = typeof parentReports.$inferInsert;
export type Booking        = typeof bookings.$inferSelect;
export type NewBooking     = typeof bookings.$inferInsert;
