export interface GlobalConfig {
  newuser_bonus: number;
  refer_reward: number;
  paywith_crypto: boolean;
  baseRate: number;
  baseMultiplier: number;
  boostMultiplier: number;
  network_fee: number;
  refer_reward_self: number;
  refer_target: number;
  refer_target_reward: number;
  creator_reward: number;
  forecast_reward: number;
  forecast_duration: number;
  starter_point: number;
  pro_point: number;
  elite_point: number;
  ultimate_point: number;
  bot_link: string;
  min_withdrawal: number;
  daily:Daily;
  adSettings: adSettings;
  contractus: string;
  creator: creator;
}

export interface Daily{
  daily_task_target:number;
  daily_checkin:number;
  daily_link:string;
}

export interface adSettings{
  enabled: boolean;
}

export interface creator{
minimumreward : number;
minimumtask : number;
}