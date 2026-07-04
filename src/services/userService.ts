import axios from 'axios';

// const API_URL = 'https://minitaskapi.onrender.com';
const API_URL = 'http://localhost:3000';
export const getUser = async (telegramId: number) => {
  const response = await axios.get(`${API_URL}/api/user/getuser/${telegramId}`);
  return response.data.data;
};

export const applyPromo = async (telegramId: number, code: string) => {
  const response = await axios.post(`${API_URL}/api/user/apply`, {
    telegramId,
    code,
  });
  return response.data;
};

export const getGlobalConfig = async () => {
  const response = await axios.get(`${API_URL}/api/globalconfig`);
  return response.data.data;
};

export const getMyReferrals = async (telegramId: number) => {
  const response = await axios.get(`${API_URL}/api/user/myreferrals/${telegramId}`);
  return response.data;
};

export const requestWithdraw = async (telegramId: number, amount: number, walletAddress: string) => {
  const response = await axios.post(`${API_URL}/api/withdrawal/request`, {
    telegramId,
    amount,
    walletAddress,
  });
  return response.data;
};

export const getWithdrawHistory = async (telegramId: number) => {
  const response = await axios.get(`${API_URL}/api/withdrawal/history/${telegramId}`);
  return response.data.data;
};

export const getTasks = async () => {
  const response = await axios.get(`${API_URL}/api/task`);
  return response.data.data;
};

export async function getuserTasks(telegramId: number) {
  const { data } = await axios.get(`${API_URL}/api/task/available/${telegramId}`);
  return data;
}

export const claimDailyReward = async (telegramId: number) => {
  const { data } = await axios.post(`${API_URL}/api/user/dailyclaim`, {
    telegramId,
  });
  return data;
};

export async function createTask(data: { type: string; url: string; reward: number; createdBy: number; maxComplete: number }) {
  const res = await axios.post(`${API_URL}/api/task/create`, data);
  return res.data;
}

export async function getCreatedHistory(telegramId: number) {
  const { data } = await axios.get(
    `${API_URL}/api/task/created-history/${telegramId}`
  );
  return data;
}

export async function pauseTask(taskId: string, telegramId: number, active: boolean) {
  const { data } = await axios.patch(`${API_URL}/api/task/pause/${taskId}`, {
    telegramId,
    active,
  });
  return data;
}

export async function deleteTask(taskId: string, telegramId: number) {
  const { data } = await axios.delete(`${API_URL}/api/task/delete/${taskId}`, {
    data: { telegramId },
  });
  return data;
}

export async function completeTask(taskId: string, telegramId: number) {
  const { data } = await axios.post(`${API_URL}/api/task/complete`, {
    telegramId,
    taskId,
  });
  return data;
}
