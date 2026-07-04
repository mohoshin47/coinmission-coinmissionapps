export interface User {
  _id: string;
  telegramId: number | 6249158607;
  username: string | null;
  Name: string;
  photoUrl: string;
  balance: number;
  adcredit: number;
  completedTasks: string[];
  referrals: number;
  totalreferralsincome: number;
  totaltaskscompleted: number;
  referredBy: number | null;
  accountStatus: "active" | "inactive" | "banned";
}