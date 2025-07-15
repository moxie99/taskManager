import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'done';
  extras: {
    tags?: string[];
    due_date?: string;
    priority?: 'low' | 'medium' | 'high';
  };
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface TaskInsight {
  totalTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  completionRate: number;
  mostRecentTask: string | null;
  tasksByMonth: { [key: string]: number };
  priorityDistribution: { [key: string]: number };
}