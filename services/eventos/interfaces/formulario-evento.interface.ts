export type TipoCampoEvento =
  | 'TEXT'
  | 'TEXTAREA'
  | 'EMAIL'
  | 'PHONE'
  | 'CPF'
  | 'DATE'
  | 'NUMBER'
  | 'SELECT'
  | 'RADIO'
  | 'CHECKBOX';

export interface OpcaoCampoEvento {
  label: string;
  valor: string;
  ordem?: number;
}

export interface CampoFormularioEvento {
  id: number;
  label: string;
  chave: string;
  tipo: TipoCampoEvento;
  obrigatorio?: boolean;
  unico?: boolean;
  ordem?: number;
  placeholder?: string;
  textoAjuda?: string;
  ativo?: boolean;
  opcoes?: OpcaoCampoEvento[];
}

export interface FormularioEvento {
  id?: number;
  eventoId?: number | string;
  titulo?: string;
  descricao?: string;
  campos: CampoFormularioEvento[];
  evento?: {
    id: number | string;
    slug?: string;
    titulo?: string;
    inscricoesAbertas?: boolean;
  };
  inscricoesAbertas?: boolean;
}

export interface CriarInscricaoPayload {
  respostas: Array<{
    campoId: number;
    valor: string | string[];
  }>;
}

export interface InscricaoEvento {
  id?: number | string;
  numero?: string;
  numeroInscricao?: string;
  protocolo?: string;
  dataInscricao?: string;
  createdAt?: string;
  respostas?: Array<{
    campoId?: number;
    chave?: string;
    label?: string;
    valor?: string | string[];
  }>;
}
