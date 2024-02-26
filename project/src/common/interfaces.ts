import { CommentType } from "./types";

export interface IWsGetCommentsResponse {
  comments: CommentType[];
  currentPage: number;
  pages: number;
}
