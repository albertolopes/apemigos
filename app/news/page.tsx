import { newsService } from '@services';
import { NewsContent } from './NewsContent';

const ITEMS_PER_PAGE = 12;

interface Props {
  searchParams?: Promise<{
    keyword?: string | string[];
  }>;
}

function normalizeKeyword(keyword?: string | string[]) {
  if (Array.isArray(keyword)) {
    return keyword[0] || '';
  }

  return keyword || '';
}

export default async function NewsPage({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;
  const keyword = normalizeKeyword(resolvedSearchParams?.keyword).trim();

  try {
    const response = await newsService.getNews(
      0,
      ITEMS_PER_PAGE,
      keyword || undefined
    );

    return (
      <NewsContent
        initialHasMore={response.totalPages > 1}
        initialItems={response.content}
        initialKeyword={keyword}
      />
    );
  } catch (error) {
    console.error('Erro ao carregar notícias iniciais:', error);

    return (
      <NewsContent
        initialHasMore={false}
        initialItems={[]}
        initialKeyword={keyword}
      />
    );
  }
}
