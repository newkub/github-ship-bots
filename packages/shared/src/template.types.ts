export interface CommentTemplate {
  id: string;
  userId: string;
  repoFullName?: string;
  name: string;
  body: string;
  createdAt: string;
}

export interface CardComment {
  id: string;
  cardId: string;
  userId: string;
  templateId?: string;
  body: string;
  postedToGitHub: boolean;
  createdAt: string;
}
