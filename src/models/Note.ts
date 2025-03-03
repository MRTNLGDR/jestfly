
export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  links: string[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  isPinned: boolean;
  isArchived: boolean;
}
