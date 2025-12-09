const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  is_completed: boolean;
  created_at: string;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
}

export async function createTask(data: CreateTaskDto): Promise<Task> {
  const response = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create task');
  }

  return response.json();
}

export async function getRecentTasks(): Promise<Task[]> {
  const response = await fetch(`${API_URL}/tasks`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }

  return response.json();
}

export async function markTaskComplete(id: string): Promise<Task> {
  const response = await fetch(`${API_URL}/tasks/${id}/complete`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to mark task as complete');
  }

  return response.json();
}

export async function markTasksComplete(ids: string[]): Promise<Task[]> {
  const promises = ids.map(id => markTaskComplete(id));
  return Promise.all(promises);
}

