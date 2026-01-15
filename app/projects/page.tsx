'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import testIds from '@app/utils/test-ids';
import { useState, useEffect, useRef } from 'react';
import { projectsService, ProjectItem, ProjectResponse } from '@services';

const ITEMS_PER_PAGE = 9;

async function getProjectsPageData(page: number) {
  try {
    const response: ProjectResponse = await projectsService.getProjects(
      page - 1,
      ITEMS_PER_PAGE
    );

    return {
      total: response.totalElements,
      pageItems: response.content,
      currentPage: page,
      totalPages: response.totalPages,
    };
  } catch (err) {
    console.error('Erro ao buscar projetos:', err);
    throw new Error('Falha ao carregar projetos');
  }
}

export default function Projects() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialPage = (() => {
    const p = parseInt(String(searchParams.get('page') || '1'), 10);
    return isNaN(p) || p < 1 ? 1 : p;
  })();

  const [page, setPage] = useState(initialPage);
  const [items, setItems] = useState<ProjectItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Controle para evitar chamadas duplicadas
  const isFetchingRef = useRef(false);

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  // Sincroniza quando a query string muda (ex.: back/forward)
  useEffect(() => {
    const p = parseInt(String(searchParams.get('page') || '1'), 10);
    const normalized = isNaN(p) || p < 1 ? 1 : p;
    if (normalized !== page) {
      setPage(normalized);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    if (isFetchingRef.current) return;

    isFetchingRef.current = true;
    setIsLoading(true);
    setError(null);

    getProjectsPageData(page)
      .then(({ total, pageItems }) => {
        setTotalItems(total);
        setItems(pageItems);
      })
      .catch((err) => setError(err.message))
      .finally(() => {
        setIsLoading(false);
        isFetchingRef.current = false;
      });
  }, [page]);

  function goToPage(n: number) {
    const normalized = Math.max(1, Math.min(totalPages || 1, n));
    // Atualiza URL para deep-link e histórico
    router.push(`/projects?page=${normalized}`);
    // atualiza estado local (a leitura do searchParams também sincroniza)
    setPage(normalized);
  }

  return (
    <div className="relative">
      <div className="w-full h-[400px] relative">
        <Image
          src="https://i.imgur.com/c9pi1XC.jpeg"
          alt="projects"
          fill
          style={{ objectFit: 'cover' }}
          unoptimized
        />
      </div>

      <div className="max-w-7xl mx-auto mt-[-120px] relative bg-white px-8 sm:px-20">
        <h1
          className="text-center py-8 font-site"
          data-testid={testIds.PROJECTS_PAGE.HEADER}
        >
          Nossos Projetos
        </h1>
        <p className="pt-6 max-w-3xl text-slate-500 text-sm text-center mx-auto">
          Conheça as iniciativas da nossa ONG voltadas para o acolhimento,
          informação e conscientização sobre esclerose múltipla. Trabalhamos
          para promover qualidade de vida, inclusão e apoio a pacientes e
          familiares.
        </p>

        {/* Erro */}
        {error && (
          <div className="text-red-500 text-center mt-6">⚠️ {error}</div>
        )}

        {/* Carregando */}
        {isLoading && (
          <div className="text-center mt-10 text-slate-400">Carregando...</div>
        )}

        {/* Lista de projetos */}
        {!isLoading && !error && (
          <div
            className="grid grid-cols-1 sm:grid-cols-3 gap-5 grid-flow-row mt-10"
            data-testid={testIds.PROJECTS_PAGE.PROJECT_LIST}
          >
            {items.map((item) => (
              <div
                key={item.id}
                className="p-4 relative"
                data-testid={testIds.PROJECTS_PAGE.PROJECT_ITEM_CONTAINER}
              >
                <div className="sm:w-[370px] h-[320px] relative">
                  <Image
                    src={item.cover || ''}
                    alt={item.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    unoptimized
                  />
                </div>

                <div className="bg-white sm:mt-[-50px] border-t-4 relative mx-6 px-2 pt-3 border-orange-500 text-center">
                  <h2 className="mb-10 font-site">{item.title}</h2>
                  <p className="text-sm text-slate-500 mb-6">
                    {item.shortDescription}
                  </p>
                  <Link
                    data-testid={testIds.PROJECTS_PAGE.PROJECT_ITEM_CTA}
                    href={
                      item.slug
                        ? `/projects/${item.slug}`
                        : `/projects/${item.id}`
                    }
                    className="text-slate-500 py-6 font-site"
                  >
                    Clique aqui
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Paginação */}
        {!isLoading && !error && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 bg-slate-200 rounded disabled:opacity-50 hover:bg-slate-300 transition-colors"
            >
              Anterior
            </button>
            <span>
              Página {page} de {totalPages || 1}
            </span>
            <button
              onClick={() => goToPage(page + 1)}
              disabled={page === totalPages || totalPages === 0}
              className="px-4 py-2 bg-slate-200 rounded disabled:opacity-50 hover:bg-slate-300 transition-colors"
            >
              Próxima
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
