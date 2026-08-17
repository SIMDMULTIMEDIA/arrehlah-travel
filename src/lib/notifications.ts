// Notification Provider Abstraction (Email / SMS)

export type NotificationChannel = 'EMAIL' | 'SMS';

export interface NotificationPayload {
  to: string;
  subject?: string;
  message: string;
  channel: NotificationChannel;
}

export class NotificationService {
  static async send(payload: NotificationPayload): Promise<boolean> {
    if (payload.channel === 'EMAIL') {
      console.log(`[EMAIL] Sending to ${payload.to}: ${payload.subject}`);
      console.log(`[EMAIL] Body: ${payload.message}`);
      return true;
    } else if (payload.channel === 'SMS') {
      console.log(`[SMS] Sending to ${payload.to}: ${payload.message}`);
      return true;
    }
    return false;
  }
}
