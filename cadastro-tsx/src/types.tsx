// Definição do tipo Client
export interface Client {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  latitude: string; // Ou number, dependendo do backend
  longitude: string; // Ou number, dependendo do backend
  foto_fachada_caminho: string | null;
  data_cadastro: string; // Formato ISO string
}

// Você pode adicionar outros tipos globais aqui se necessário

