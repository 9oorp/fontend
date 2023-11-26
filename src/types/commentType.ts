export interface commentResponse {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  memberId: string;
  accountId: string;
  replies: commentResponse[];
}

export interface commentRequest {
  content: string;
  parentCommentId: number | null;
}
