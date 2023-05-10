import { prisma } from "~/lib/db.server";

type NameCache = Map<number, string>;
let nameCache: NameCache;

declare global {
  var __nameCache__: NameCache | undefined;
}

// This is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
// In production, we'll have a single connection to the DB.
if (process.env.NODE_ENV === "production") {
  nameCache = new Map();
} else {
  if (!global.__nameCache__) {
    global.__nameCache__ = new Map();
  }
  nameCache = global.__nameCache__;
  prisma.$connect();
}

export { nameCache };
