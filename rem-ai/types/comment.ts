export interface Comment {
  id: string;
  user_id: string;
  manga_id: string;
  content: string;
  username: string;
  avatar_url: string;
  image_url?: string | null;
  parent_id?: string | null;
  reply_to_username?: string | null;
  created_at: string;
}