// tipos e lista de eventos da plataforma
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: "Workshop" | "Palestra" | "Networking" | "Conferência" | string;
  image: string;
  time: string;
  capacity?: number; // Novas propriedades opcionais para o Gestor
  enrolledCount?: number;
}

// Lista original (como Fallback inicial)
const initialEvents: Event[] = [
  {
    id: "1",
    title: "Inovação Digital 2026",
    description: "Explorando as tendências que moldarão o futuro dos negócios digitais.",
    date: "15 de Mai",
    time: "09:00",
    location: "Auditório Central, São Paulo",
    category: "Conferência",
    image: "https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?auto=format&fit=crop&q=80&w=800",
    capacity: 200,
    enrolledCount: 150
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
    capacity: 50,
    enrolledCount: 48
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
    capacity: 80,
    enrolledCount: 80
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
    capacity: 300,
    enrolledCount: 120
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
    capacity: 150,
    enrolledCount: 90
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
    capacity: 40,
    enrolledCount: 15
  }
];

// --- FUNÇÕES DE BANCO DE DADOS LOCAL (LOCALSTORAGE) ---

// Mantemos a exportação original para evitar quebrar a Home.tsx enquanto ela não for refatorada
export const events: Event[] = initialEvents;

// Inicializa o banco de dados se estiver vazio
export function initDB() {
  if (!localStorage.getItem("senac_events")) {
    localStorage.setItem("senac_events", JSON.stringify(initialEvents));
  }
  if (!localStorage.getItem("senac_enrollments")) {
    localStorage.setItem("senac_enrollments", JSON.stringify(["1", "4"])); // Aluno começa com ingresso 1 e 4
  }
}

// Pega os eventos atualizados do banco
export function getEvents(): Event[] {
  initDB();
  const data = localStorage.getItem("senac_events");
  return data ? JSON.parse(data) : initialEvents;
}

// Pega os ingressos atuais do aluno
export function getMyEnrollments(): string[] {
  initDB();
  const data = localStorage.getItem("senac_enrollments");
  return data ? JSON.parse(data) : ["1", "4"];
}

// Salva um novo evento criado pelo gestor
export function addEvent(event: Event) {
  const currentEvents = getEvents();
  currentEvents.push(event);
  localStorage.setItem("senac_events", JSON.stringify(currentEvents));
  // Dispara um evento global para avisar as outras abas (o Aluno)
  window.dispatchEvent(new Event("db_updated"));
}

// Lida com inscrição e cancelamento e atualiza vagas
export function toggleEnrollment(eventId: string) {
  let enrollments = getMyEnrollments();
  let currentEvents = getEvents();
  const eventIndex = currentEvents.findIndex(e => e.id === eventId);

  if (enrollments.includes(eventId)) {
    // Cancelando inscrição
    enrollments = enrollments.filter(id => id !== eventId);
    if (eventIndex !== -1 && currentEvents[eventIndex].enrolledCount! > 0) {
      currentEvents[eventIndex].enrolledCount! -= 1;
    }
  } else {
    // Fazendo inscrição
    enrollments.push(eventId);
    if (eventIndex !== -1) {
      currentEvents[eventIndex].enrolledCount! = (currentEvents[eventIndex].enrolledCount || 0) + 1;
    }
  }

  localStorage.setItem("senac_enrollments", JSON.stringify(enrollments));
  localStorage.setItem("senac_events", JSON.stringify(currentEvents));
  
  // Avisa o sistema (Gestor) para atualizar os gráficos
  window.dispatchEvent(new Event("db_updated"));
  return enrollments;
}