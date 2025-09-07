export interface Post {
  id: number;
  title: string;
  content: string;
  username: string;
  createdAt: string;
}
export interface RawPost {
    id: number;
    title: string;
    content: string;
    created_at: string;
    user?: {
        name: string;
    };
}
export interface PostPayload {
  title: string;
  content: string;
}