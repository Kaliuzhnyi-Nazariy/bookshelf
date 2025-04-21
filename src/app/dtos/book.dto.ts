export interface Book {
  _id: string;
  title: string;
  author: string;
  descripionAndOpinion: string;
  favorite: boolean;
  imageUrl: string;
  owner: string;
}

export interface AddBook {
  title: string;
  author: string;
  descripionAndOpinion?: string;
  imageUrl?: string;
}
