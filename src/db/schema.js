import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core"

export const tAppRole = sqliteTable("T_APP_ROLE", {
    aproId: integer("APRO_ID").primaryKey(),
    aproLabel: integer("APRO_LABEL").notNull(),
});

export const tUser = sqliteTable("T_USER", {
    userId: integer("USER_ID").primaryKey(),
    userName: text("USER_NAME").notNull(),
    userFirstname: text("USER_FIRSTNAME").notNull(),
    userMail: text("USER_MAIL").notNull(),
    userPass: text("USER_PASS").notNull(),
    userStatus: text("USER_STATUS").notNull(),
    aproId: integer("APRO_ID").notNull().references(() => tAppRole.aproId),
});

export const tCollection = sqliteTable("T_COLLECTION", {
    collId: integer("COLL_ID").primaryKey(),
    collTitle: text("COLL_TITLE").notNull(),
    collDesc: text("COLL_DESC").notNull(),
    collVisibility: text("COLL_VISIBILITY").notNull(),
    userId: integer("USER_ID").notNull().references(() => tUser.userId),
});

export const tFlashCard = sqliteTable("T_FLASH_CARD", {
    flcaId: integer("FLCA_ID").primaryKey(),
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
    reviId: integer("REVI_ID").primaryKey(),
    reviLastDate: integer("REVI_LAST_DATE").notNull(),
    userId: integer("USER_ID").notNull().references(() => tUser.userId),
    flcaId: integer("FLCA_ID").notNull().references(() => tFlashCard.flcaId),
    leveId: integer("LEVE_ID").notNull().references(() => tLevel.leveId),
});

