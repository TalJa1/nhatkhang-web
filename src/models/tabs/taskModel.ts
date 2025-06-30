export interface Task {
  data: TaskData[]
  pagination: Pagination
  filters: Filters
}

export interface TaskData {
  task_id: number
  subject: string
  due_date: string
  status: string
  updated_at: string
  user_id: number
  description?: string
  title: string
  priority: number
  created_at: string
}

export interface Pagination {
  total_count: number
  total_pages: number
  current_page: number
  per_page: number
  has_next: boolean
  has_previous: boolean
}

export interface Filters {
  subject: string
  priority: string
  status: string
}

export interface TaskAdd {
  user_id: number;
  title: string;
  subject: string;
  due_date: string; // ISO 8601 format
  priority: number;
  status: string;
  description: string;
}