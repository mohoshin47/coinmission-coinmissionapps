export interface Task {
  _id: string;
  title: string;
  description: string;

  type:
    | "telegram_bot"
    | "telegram_channel"
    | "telegram_group"
    | "rewarded_popup"
    | "watch_ads";

  url: string;

  reward: number;

  cooldownHours: number;

  available: boolean;

  completed: boolean;

  lastCompletedAt: string | null;

  nextAvailableAt: string | null;

  remainingSeconds: number;
}