export type Brief = {
  id: string;
  title: string;
  summary: string;
  key_points: string[];
  actions: string[];
  tags: string[];
  priority: 'low' | 'medium' | 'high';
  due_date?: string | null;
  created_at: string;
};
