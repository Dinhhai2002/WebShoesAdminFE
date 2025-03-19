export interface Promotion {
  id: number;
  point: number;
  promotion_type: number;
  promotion_value: number;
  description: string;
  status: number;
  created_at?: string;
  updated_at?: string;
}
