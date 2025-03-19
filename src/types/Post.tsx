import { RatingType } from "./RatingType";

export interface Post {
  id: number;
  title: string;
  description: string;
  content: string;
  author_id: number;
  author_name?: string;
  author_avatar?: string;
  category_blog_id: number;
  category_blog_name?: string;
  banner: string;
  status: string;
  is_rating: number;
  point_avg: number;
  count_rating: number;
  rating: RatingType;
  created_at?: string;
  updated_at?: string;
}
