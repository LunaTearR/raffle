const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export interface Student {
  _id: string;
  studentId: string;
  name: string;
  receivedAward: boolean;
}

export interface RaffleItem {
  _id: string;
  name: string;
  quantity: number;
  itemPic?: string;
}

export interface RaffleLog {
  studentId: string;
  item: {
    _id: string;
    name: string;
    itemPic?: string;
  };
  timestamp: string;
}

export interface RaffleWinner {
  studentId: string;
  name: string;
  item: {
    _id: string;
    name: string;
    itemPic?: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  statusCode: number;
}

// Register student
export const registerStudent = async (std_id: string): Promise<ApiResponse<Student>> => {
  const response = await fetch(`${API_BASE_URL}/regis`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ std_id }),
  });
  return response.json();
};

// Get all students
export const getAllStudents = async (): Promise<ApiResponse<Student[]>> => {
  const response = await fetch(`${API_BASE_URL}/students`);
  return response.json();
};

// Get all raffle items
export const getAllRaffleItems = async (): Promise<ApiResponse<RaffleItem[]>> => {
  const response = await fetch(`${API_BASE_URL}/raffle_items`);
  return response.json();
};

// Perform raffle
export const performRaffle = async (n: number = 1): Promise<ApiResponse<RaffleWinner[]>> => {
  const response = await fetch(`${API_BASE_URL}/raffle?n=${n}`);
  return response.json();
};

// Get raffle logs
export const getRaffleLogs = async (): Promise<ApiResponse<RaffleLog[]>> => {
  const response = await fetch(`${API_BASE_URL}/logs`);
  return response.json();
};

// System State APIs
export const getSystemState = async (): Promise<ApiResponse<{ state: string }>> => {
  const response = await fetch(`${API_BASE_URL}/system/state`);
  return response.json();
};

export const startRaffle = async (): Promise<ApiResponse<{ state: string }>> => {
  const response = await fetch(`${API_BASE_URL}/system/start`, { method: 'POST' });
  return response.json();
};

export const endRaffle = async (): Promise<ApiResponse<{ state: string }>> => {
  const response = await fetch(`${API_BASE_URL}/system/end`, { method: 'POST' });
  return response.json();
};

export const resetSystem = async (): Promise<ApiResponse<{ state: string }>> => {
  const response = await fetch(`${API_BASE_URL}/system/reset`, { method: 'POST' });
  return response.json();
};

export const importItems = async (file: File): Promise<ApiResponse<any>> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`${API_BASE_URL}/raffle_items/import`, {
    method: 'POST',
    body: formData,
  });
  return response.json();
};

export const createRaffleItem = async (data: { name: string; quantity: number; itemPic?: string }): Promise<ApiResponse<RaffleItem>> => {
  const response = await fetch(`${API_BASE_URL}/raffle_items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const updateRaffleItem = async (id: string, data: { name?: string; quantity?: number; itemPic?: string }): Promise<ApiResponse<RaffleItem>> => {
  const response = await fetch(`${API_BASE_URL}/raffle_items/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const deleteRaffleItem = async (id: string): Promise<ApiResponse<void>> => {
  const response = await fetch(`${API_BASE_URL}/raffle_items/${id}`, {
    method: 'DELETE',
  });
  return response.json();
};