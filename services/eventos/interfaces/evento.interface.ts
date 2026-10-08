export interface Evento {
  id: number | string;
  slug?: string;
  titulo?: string;
  title?: string;
  descricao?: string;
  description?: string;
  descricaoResumida?: string;
  shortDescription?: string;
  resumo?: string;
  imagem?: string;
  image?: string;
  cover?: string;
  local?: string;
  location?: string;
  dataEvento?: string;
  dataInicio?: string;
  dataFim?: string;
  inicioInscricoes?: string;
  fimInscricoes?: string;
  limiteInscricoes?: number | null;
  inscricoesAbertas?: boolean;
}

export interface EventosResponse {
  content: Evento[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  empty?: boolean;
}
