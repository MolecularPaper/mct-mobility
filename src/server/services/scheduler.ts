import { Agenda, Job } from "agenda";
import { MongoBackend } from "@agendajs/mongo-backend";
import { connectToDatabase } from "../db/db";

type JobHandler<T = Record<string, unknown>> = (job: Job<T>) => Promise<void>;
interface JobDefinition<T = Record<string, unknown>> {
  name: string;
  handler: JobHandler<T>;
  options?: {
    concurrency?: number;
    lockLimit?: number;
    priority?: number;
  };
}

let agenda: Agenda;

export function getAgenda(): Agenda {
  if (!agenda) throw new Error("The scheduler has not been initialized.");
  return agenda;
}

export function defineJob<T = Record<string, unknown>>(def: JobDefinition<T>) {
  getAgenda().define(def.name, def.handler as JobHandler, def.options);
}

export async function scheduleJob<T = Record<string, unknown>>(
  name: string,
  scheduledAt: Date,
  data?: T,
) {
  await getAgenda().schedule(scheduledAt, name, data ?? {});
}

export async function repeatJob<T = Record<string, unknown>>(
  name: string,
  interval: string,
  data?: T,
) {
  await getAgenda().every(interval, name, data ?? {});
}

export async function runJobNow<T = Record<string, unknown>>(
  name: string,
  data?: T,
) {
  await getAgenda().now(name, data ?? {});
}

export async function cancelJob(query: Record<string, unknown>) {
  await getAgenda().cancel(query);
}

export async function startScheduler() {
  const { db } = await connectToDatabase(process.env.DB_ADMIN_URI);
  const backend = new MongoBackend({ mongo: db, collection: "AgendaJobs" });
  agenda = new Agenda({ backend, processEvery: "30 seconds" });
  await agenda.start();
  console.log("Agenda scheduler started.");
}

process.on("SIGTERM", async () => await getAgenda().stop());
process.on("SIGINT", async () => await getAgenda().stop());
