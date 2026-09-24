export type BriefPriority =
  | 'low'
  | 'medium'
  | 'high';

export type Brief = {
  id: string;

  title: string;
  summary: string;

  key_points: string[];
  actions: string[];
  tags: string[];

  priority: BriefPriority;

  due_date?: string | null;
  created_at: string;
};