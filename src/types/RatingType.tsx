export interface RatingType {
  id: number;
  post_id: number;
  user_id: number;
  point: number;
  created_at?: string;
  updated_at?: string;
}
