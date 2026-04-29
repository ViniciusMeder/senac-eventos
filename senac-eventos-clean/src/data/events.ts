// tipos e lista de eventos da plataforma
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: "Workshop" | "Palestra" | "Networking" | "Conferência";
  image: string;
  time: string;
}

export const events: Event[] = [
  {
    id: "1",
    title: "Inovação Digital 2026",
    description: "Explorando as tendências que moldarão o futuro dos negócios digitais.",
    date: "15 de Mai",
    time: "09:00",
    location: "Auditório Central, São Paulo",
    category: "Conferência",
    image: "https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "2",
    title: "Workshop de Liderança Criativa",
    description: "Desenvolva habilidades de liderança para o novo mercado corporativo.",
    date: "22 de Mai",
    time: "14:00",
    location: "Espaço Coworking, Rio de Janeiro",
    category: "Workshop",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "3",
    title: "Café com Networking",
    description: "Conecte-se com CEOs e diretores das maiores empresas da América Latina.",
    date: "05 de Jun",
    time: "08:30",
    location: "Hotel Fasano, Belo Horizonte",
    category: "Networking",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "4",
    title: "Palestra: Futuro da IA",
    description: "Como a inteligência artificial está transformando a produtividade nas empresas.",
    date: "12 de Jun",
    time: "19:00",
    location: "Centro de Convenções, Curitiba",
    category: "Palestra",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "5",
    title: "Senac Fashion Day",
    description: "Desfiles, tendências e o mercado da moda autoral em Pernambuco.",
    date: "20 de Jun",
    time: "10:30",
    location: "Teatro Senac, Recife",
    category: "Conferência",
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "6",
    title: "Mesa Redonda: Finanças 4.0",
    description: "O impacto do open banking e novos sistemas de pagamento.",
    date: "28 de Jun",
    time: "16:00",
    location: "Sala Executiva, Brasília",
    category: "Networking",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800",
  }
];
