export interface commentResponse {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  accountId: string;
  name: string;
  replies: commentResponse[];
}

export interface commentCreateRequest {
  content: string;
  parentCommentId: number | null;
}

export interface commentUpdateRequest {
  content: string;
}
