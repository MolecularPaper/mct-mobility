import {
  defineJob,
  scheduleJob,
  cancelJob,
  repeatJob,
} from "../services/scheduler.js";

export function registerSmsJob() {
  defineJob<{ notificationId: string }>({
    name: "send-sms-notification",
    handler: async (job) => {
      const { notificationId } = job.attrs.data;
      console.log(`${notificationId} Test...`);
      // SMS 발송 로직
    },
  });
}

// 스케줄 등록
export async function scheduleSms(notificationId: string, scheduledAt: Date) {
  await scheduleJob("send-sms-notification", scheduledAt, { notificationId });
}

// 취소
export async function cancelSms(notificationId: string) {
  await cancelJob({
    name: "send-sms-notification",
    "data.notificationId": notificationId,
  });
}

export async function test(notificationId: string, scheduledAt: Date) {
  await repeatJob("send-sms-notification", "5 second", { notificationId });
}
