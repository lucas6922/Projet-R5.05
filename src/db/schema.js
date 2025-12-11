import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core"
import { randomUUID } from 'crypto'
import { timestamp } from "drizzle-orm/gel-core";

export const tAppRole = sqliteTable("T_APP_ROLE", {
    aproId: integer("APRO_ID").primaryKey(),
    aproLabel: integer("APRO_LABEL").notNull(),
});

export const tUser = sqliteTable("T_USER", {
    userId: text("USER_ID").primaryKey().$defaultFn(() => randomUUID()),
    userName: text("USER_NAME").notNull(),
    userFirstname: text("USER_FIRSTNAME").notNull(),
    userMail: text("USER_MAIL").notNull(),
    userPass: text("USER_PASS").notNull(),
    userStatus: text("USER_STATUS").notNull(),
    aproId: integer("APRO_ID").notNull().references(() => tAppRole.aproId),
});

export const tCollection = sqliteTable("T_COLLECTION", {
    collId: text("COLL_ID").primaryKey().$defaultFn(() => randomUUID()),
    collTitle: text("COLL_TITLE").notNull(),
    collDesc: text("COLL_DESC").notNull(),
    collVisibility: text("COLL_VISIBILITY").notNull(),
    userId: integer("USER_ID").notNull().references(() => tUser.userId),
});

export const tFlashCard = sqliteTable("T_FLASH_CARD", {
    flcaId: text("FLCA_ID").primaryKey().$defaultFn(() => randomUUID()),
    flcaRecto: text("FLCA_RECTO").notNull(),
    flcaVerso: text("FLCA_VERSO").notNull(),
    flcaUrlRecto: text("FLCA_URL_RECTO").notNull(),
    flcaUrlVerso: text("FLCA_URL_VERSO").notNull(),
    collId: integer("COLL_ID").notNull().references(() => tCollection.collId),
});

export const tLevel = sqliteTable("T_LEVEL", {
    leveId: integer("LEVE_ID").primaryKey(),
    leveCooldown: integer("LEVE_COOLDOWN").notNull(),
});

export const tRevision = sqliteTable("T_REVISION", {
    reviId: text("REVI_ID").primaryKey().$defaultFn(() => randomUUID()),
    reviLastDate: integer("REVI_LAST_DATE", {mode: 'timestamp'}).notNull(),
    userId: text("USER_ID").notNull().references(() => tUser.userId),
    flcaId: text("FLCA_ID").notNull().references(() => tFlashCard.flcaId),
    leveId: integer("LEVE_ID").notNull().references(() => tLevel.leveId),
});

