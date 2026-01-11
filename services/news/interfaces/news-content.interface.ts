import { NewsItem } from './news-item.interface';

export interface NewsContentResponse {
  id: number;
  noticia: NewsItem;
  longDescription: string;
  createdAt: string;
  updatedAt: string;
}
