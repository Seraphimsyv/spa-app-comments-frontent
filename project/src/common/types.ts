export type Pages = "example" | "table";

export type OrderBy = { column: string; sort: string };

export type AnonumUserType = {
  username: string;
  email: string;
  homePage?: string;
}

export type UserType = AnonumUserType & {
  id: number;
}

export type FileType = {
  id: number;
  filename: string;
  filepath: string;
  uploadAt: string;
}

export type CommentType = {
  id: number;
  text: string;
  file?: FileType;
  parent_id?: CommentType;
  comments?: CommentType[];
  author?: UserType;
  anonymAuthor?: AnonumUserType;
  createdAt: string;
}