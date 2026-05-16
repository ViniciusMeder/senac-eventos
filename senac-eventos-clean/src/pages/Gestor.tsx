import { useState, useMemo, useEffect } from "react";
import { getEvents, addEvent, Event } from "../data/events";
import { logout, isAuthenticated, getUserType } from "../utils/auth";
import { 
  LayoutDashboard, CalendarDays, Users, Ticket, BarChart3, LogOut, Plus, Search, 
  TrendingUp, MoreVertical, MapPin, Clock, ArrowLeft, ArrowRight, Filter, CheckCircle2, 
  XCircle, AlertCircle, Download, DollarSign, ArrowUpRight, ArrowDownRight, Menu, X
} from "lucide-react";

// Mock de dados adicionais para participantes (Apenas ilustrativo para a aba participantes)
const mockParticipants = [
  { id: 1, name: "Ana Beatriz", email: "ana.b@email.com", event: "Inovação Digital 2026", status: "Confirmado", date: "10/05/2026" },
  { id: 2, name: "Carlos Eduardo", email: "cadu@email.com", event: "Inovação Digital 2026", status: "Pendente", date: "11/05/2026" },
  { id: 3, name: "Mariana Costa", email: "mari.costa@email.com", event: "Workshop de Liderança", status: "Confirmado", date: "09/05/2026" },
  { id: 4, name: "João Pedro", email: "jp@email.com", event: "Inovação Digital 2026", status: "Cancelado", date: "08/05/2026" },
  { id: 5, name: "Juliana Lopes", email: "ju.lopes@email.com", event: "Senac Fashion Day", status: "Confirmado", date: "12/05/2026" },
];

export default function Gestor() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isNewEventModalOpen, setIsNewEventModalOpen] = useState(false);
  const [participantFilter, setParticipantFilter] = useState("Todos");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- ESTADOS DO BANCO DE DADOS LOCAL ---
  const [eventsList, setEventsList] = useState<Event[]>(getEvents());
  
  // Estado para o formulário de criação
  const [newEvent, setNewEvent] = useState({
    title: "", category: "Workshop", date: "", time: "19:00", 
    location: "Auditório Principal, Senac PE", 
    description: "Uma nova experiência de aprendizado incrível.", 
    image: "https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?auto=format&fit=crop&q=80&w=800", 
    capacity: 100
  });

  // Ouvinte para atualizar o painel quando o aluno comprar ingresso ou houver mudanças
  useEffect(() => {
    const handleSync = () => setEventsList(getEvents());
    window.addEventListener("db_updated", handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener("db_updated", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  // Proteção de rota
  if (!isAuthenticated() || getUserType() !== "gestor") {
    window.location.href = "/login";
    return null;
  }

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  // Função para salvar o evento real no banco
  const handleCreateEvent = () => {
    if (!newEvent.title || !newEvent.date) return alert("Preencha título e data!");
    
    const eventToSave: Event = {
      id: Date.now().toString(),
      title: newEvent.title,
      category: newEvent.category,
      date: newEvent.date,
      time: newEvent.time,
      location: newEvent.location,
      description: newEvent.description,
      image: newEvent.image,
      capacity: newEvent.capacity,
      enrolledCount: 0 // Começa com zero alunos
    };
    
    addEvent(eventToSave);
    setIsNewEventModalOpen(false);
    
    // Reseta o form
    setNewEvent({
      title: "", category: "Workshop", date: "", time: "19:00", 
      location: "Auditório Principal, Senac PE", description: "Uma nova experiência de aprendizado incrível.", 
      image: "https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?auto=format&fit=crop&q=80&w=800", capacity: 100
    });
  };

  const menuItems = [
    { id: "dashboard", label: "Visão Geral", icon: LayoutDashboard },
    { id: "eventos", label: "Eventos", icon: CalendarDays },
    { id: "participantes", label: "Participantes", icon: Users },
    { id: "ingressos", label: "Estoque", icon: Ticket },
    { id: "relatorios", label: "Relatórios", icon: BarChart3 },
  ];

  const selectedEvent = useMemo(() => 
    eventsList.find(e => e.id === selectedEventId), [selectedEventId, eventsList]
  );

  // --- CÁLCULO DE KPIs DINÂMICOS ---
  const totalIngressos = eventsList.reduce((acc, e) => acc + (e.enrolledCount || 0), 0);
  const capacidadeTotal = eventsList.reduce((acc, e) => acc + (e.capacity || 100), 0);
  const receita = totalIngressos * 150; // Simulando ticket médio de R$ 150
  const taxaOcupacao = capacidadeTotal > 0 ? Math.round((totalIngressos / capacidadeTotal) * 100) : 0;

  // --- SUB-TELA: DETALHES DO EVENTO ---
  const renderEventDetails = (event: Event) => {
    const capacidade = event.capacity || 100;
    const inscritos = event.enrolledCount || 0;
    const perc = Math.round((inscritos / capacidade) * 100);

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
        <button 
          onClick={() => setSelectedEventId(null)}
          className="flex items-center gap-2 text-slate-500 hover:text-senac-blue transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar para lista
        </button>

        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3 h-48 md:h-64 rounded-2xl overflow-hidden shadow-lg">
            <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="bg-senac-blue/10 text-senac-blue px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {event.category}
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-2">{event.title}</h2>
                <p className="text-slate-500 mt-2">{event.description}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                <CalendarDays className="text-senac-blue w-5 h-5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold">Data e Hora</p>
                  <p className="font-bold text-slate-900">{event.date} às {event.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                <MapPin className="text-senac-blue w-5 h-5 flex-shrink-0" />
                <div className="overflow-hidden">
                  <p className="text-xs text-slate-500 uppercase font-bold">Local</p>
                  <p className="font-bold text-slate-900 truncate">{event.location.split(',')[0]}</p>
                </div>
              </div>
            </div>

            <div className="p-4 border border-slate-100 rounded-2xl mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-500 font-medium">Ocupação Atual</span>
                <span className="font-bold text-senac-blue">{perc}% ({inscritos}/{capacidade})</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-1000 ${perc >= 100 ? 'bg-red-500' : 'bg-senac-blue'}`} style={{ width: `${Math.min(perc, 100)}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (selectedEventId && selectedEvent) return renderEventDetails(selectedEvent);

    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900">Dashboard</h2>
                <p className="text-slate-500 font-medium text-sm md:text-base">Bem-vindo de volta ao cockpit do Senac.</p>
              </div>
              <div className="hidden md:block text-right">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Status do Sistema</p>
                <p className="text-emerald-500 font-bold flex items-center gap-2 justify-end">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> Operacional
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[
                { label: "Eventos Ativos", value: eventsList.length.toString(), trend: "Ao Vivo", icon: CalendarDays },
                { label: "Inscrições", value: totalIngressos.toString(), trend: `${taxaOcupacao}% Ocup.`, icon: Users },
                { label: "Receita", value: `R$ ${(receita / 1000).toFixed(1)}k`, trend: "+Vendas", icon: DollarSign },
                { label: "Vagas Totais", value: capacidadeTotal.toString(), trend: "Estoque", icon: Ticket },
              ].map((kpi, i) => (
                <div key={i} className="bg-white p-5 md:p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-senac-blue/10 transition-colors">
                      <kpi.icon className="w-5 h-5 md:w-6 md:h-6 text-senac-blue" />
                    </div>
                    <span className="text-emerald-500 text-xs font-black bg-emerald-50 px-2 py-1 rounded-lg">{kpi.trend}</span>
                  </div>
                  <p className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-tighter">{kpi.label}</p>
                  <p className="text-2xl md:text-3xl font-black text-slate-900 mt-1">{kpi.value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               <div className="bg-white p-5 md:p-6 rounded-3xl border border-slate-100 shadow-sm">
                  <h3 className="text-lg md:text-xl font-black text-slate-900 mb-6">Últimos Eventos Adicionados</h3>
                  <div className="space-y-4">
                    {eventsList.slice().reverse().slice(0, 4).map(e => {
                      const perc = Math.round(((e.enrolledCount || 0) / (e.capacity || 100)) * 100);
                      return (
                        <div key={e.id} onClick={() => setSelectedEventId(e.id)} className="flex items-center gap-3 md:gap-4 p-2 md:p-3 hover:bg-slate-50 rounded-2xl transition-all cursor-pointer border border-transparent hover:border-slate-100">
                          <img src={e.image} className="w-12 h-12 md:w-14 md:h-14 rounded-xl object-cover flex-shrink-0" />
                          <div className="flex-1 overflow-hidden">
                            <p className="font-bold text-slate-900 leading-tight truncate">{e.title}</p>
                            <p className="text-[10px] md:text-xs text-slate-500 mt-1 font-medium truncate">{e.date} • {e.location.split(',')[0]}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className={`text-xs md:text-sm font-black ${perc >= 100 ? 'text-red-500' : 'text-senac-blue'}`}>{perc}%</p>
                            <p className="text-[9px] md:text-[10px] text-slate-400 uppercase font-bold">Vagas</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
               </div>
               <div className="bg-senac-blue p-6 md:p-8 rounded-3xl shadow-xl shadow-senac-blue/20 relative overflow-hidden flex flex-col justify-between min-h-[250px] md:min-h-[300px]">
                  <div className="relative z-10">
                    <h3 className="text-xl md:text-2xl font-black text-white">Precisa de um relatório personalizado?</h3>
                    <p className="text-white/70 mt-2 font-medium text-sm md:text-base">Exporte todos os dados de vendas e participantes em segundos.</p>
                  </div>
                  <button className="relative z-10 w-full sm:w-fit bg-white text-senac-blue px-6 py-3 rounded-2xl font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2 mt-6">
                    <Download className="w-5 h-5" /> Gerar PDF
                  </button>
                  <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
               </div>
            </div>
          </div>
        );
      case "eventos":
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900">Seus Eventos</h2>
                <p className="text-slate-500 font-medium text-sm md:text-base">Gerencie e acompanhe a logística das suas produções.</p>
              </div>
              <button 
                onClick={() => setIsNewEventModalOpen(true)}
                className="bg-senac-blue text-white px-6 py-4 rounded-2xl font-bold hover:bg-senac-blue/90 shadow-lg shadow-senac-blue/20 transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" /> Criar Evento
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {eventsList.map(e => {
                const perc = Math.round(((e.enrolledCount || 0) / (e.capacity || 100)) * 100);
                const esgotado = perc >= 100;
                return (
                <div key={e.id} className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col">
                  <div className="h-40 md:h-48 overflow-hidden relative">
                    <img src={e.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className={`absolute top-4 left-4 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${esgotado ? 'bg-red-500/90 text-white' : 'bg-white/90 text-senac-blue'}`}>
                      {esgotado ? "Esgotado" : e.category}
                    </div>
                  </div>
                  <div className="p-5 md:p-6 flex-1 flex flex-col">
                    <h4 className="text-lg md:text-xl font-black text-slate-900 leading-tight mb-2">{e.title}</h4>
                    <div className="space-y-2 mt-auto">
                      <div className="flex items-center justify-between text-slate-500 text-sm font-medium">
                        <span className="flex items-center gap-2"><CalendarDays className="w-4 h-4 text-senac-blue flex-shrink-0" /> {e.date}</span>
                        <span className="font-bold text-xs">{e.enrolledCount}/{e.capacity} vagas</span>
                      </div>
                      <button 
                        onClick={() => setSelectedEventId(e.id)}
                        className="w-full mt-4 bg-slate-50 text-slate-900 py-3 rounded-2xl font-bold hover:bg-senac-blue hover:text-white transition-all flex items-center justify-center gap-2"
                      >
                        Ver Detalhes <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )})}
            </div>
          </div>
        );
      case "participantes":
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900">Gestão de Participantes</h2>
              <p className="text-slate-500 font-medium text-sm md:text-base">Controle a lista de presença e inscrições em tempo real.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex gap-2 bg-slate-50 p-1 rounded-2xl w-full lg:w-auto overflow-x-auto">
                {["Todos", "Confirmado", "Pendente", "Cancelado"].map(f => (
                  <button 
                    key={f} 
                    onClick={() => setParticipantFilter(f)}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${participantFilter === f ? 'bg-white text-senac-blue shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    {f === "Confirmado" && <CheckCircle2 className="w-3 h-3 inline mr-1" />}
                    {f}
                  </button>
                ))}
              </div>
              <div className="relative w-full lg:w-72">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                 <input type="text" placeholder="Buscar por nome..." className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-senac-blue/20 font-medium text-sm outline-none" />
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[600px]">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Nome do Aluno</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Evento</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Data Inscr.</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                      <th className="px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {mockParticipants
                      .filter(p => participantFilter === "Todos" || p.status === participantFilter)
                      .map(p => (
                      <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-senac-blue/10 flex items-center justify-center text-senac-blue font-bold text-xs flex-shrink-0">{p.name.charAt(0)}</div>
                            <div>
                              <p className="font-bold text-slate-900 text-sm">{p.name}</p>
                              <p className="text-[10px] text-slate-400 font-medium">{p.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-600">{p.event}</td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-500">{p.date}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 w-fit ${
                            p.status === "Confirmado" ? "bg-emerald-50 text-emerald-600" :
                            p.status === "Pendente" ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600"
                          }`}>
                            {p.status === "Confirmado" ? <CheckCircle2 className="w-3 h-3" /> :
                             p.status === "Pendente" ? <AlertCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                            {p.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-slate-400 hover:text-senac-blue p-2 rounded-xl"><MoreVertical className="w-5 h-5" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case "ingressos":
      case "relatorios":
        // Outras abas permanecem iguais, usando os arrays originais da sua UI, 
        // mas conectadas com eventsList se necessário.
        return (
           <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 shadow-sm">
             <BarChart3 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
             <p className="text-slate-400 font-medium text-lg">Módulo em atualização com dados reais.</p>
           </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      
      {/* OVERLAY ESCURO PARA MOBILE */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR - RESPONSIVA */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-100 flex flex-col justify-between shadow-2xl shadow-slate-200/50 transform transition-transform duration-300 md:relative md:translate-x-0 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full">
          <div className="h-20 md:h-24 flex items-center justify-between px-6 md:px-10">
            <h1 className="text-2xl font-black text-senac-blue tracking-tighter">Senac<span className="text-senac-orange">.</span>Gestão</h1>
            <button 
              className="md:hidden p-2 text-slate-400 hover:text-slate-600 bg-slate-50 rounded-xl"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <nav className="flex-1 px-4 md:px-6 space-y-2 py-4 overflow-y-auto">
            <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Menu Principal</p>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSelectedEventId(null);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-4 px-4 py-4 rounded-[20px] font-bold transition-all duration-300 ${
                    isActive 
                      ? "bg-senac-blue text-white shadow-xl shadow-senac-blue/30 scale-[1.02]" 
                      : "text-slate-400 hover:bg-slate-50 hover:text-senac-blue"
                  }`}
                >
                  <div className={`p-1 rounded-lg ${isActive ? "bg-white/20" : ""}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm tracking-tight">{item.label}</span>
                  {isActive && <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />}
                </button>
              );
            })}
          </nav>

          <div className="p-4 md:p-6 border-t border-slate-50">
            <div className="bg-slate-50 rounded-3xl p-4 flex items-center gap-4 mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-senac-orange flex items-center justify-center text-white font-black text-lg shadow-lg shadow-senac-orange/20 flex-shrink-0">
                G
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-black text-slate-900 truncate">Gestor Senac</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest truncate">Admin Nível 1</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-4 text-red-500 hover:bg-red-50 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
            >
              <LogOut className="w-4 h-4" /> Sair do Sistema
            </button>
          </div>
        </div>
      </aside>

      {/* ÁREA DE CONTEÚDO */}
      <main className="flex-1 flex flex-col h-full overflow-hidden w-full">
        {/* TOPBAR MOBILE */}
        <header className="h-20 bg-white border-b border-slate-100 flex md:hidden items-center justify-between px-4 sm:px-6 z-30 relative shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-black text-senac-blue tracking-tighter">Senac<span className="text-senac-orange">.</span></h1>
          </div>
          <button onClick={handleLogout} className="text-slate-400 p-2 bg-slate-50 rounded-xl"><LogOut className="w-5 h-5" /></button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-12 relative scroll-smooth w-full">
          <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-senac-blue/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-senac-orange/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="max-w-6xl mx-auto relative z-10 pb-20">
            {renderContent()}
          </div>
        </div>
      </main>

      {/* MODAL: NOVO EVENTO REFORMULADO (Agora salva no banco!) */}
      {isNewEventModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-2xl rounded-[30px] md:rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
              <div className="p-6 md:p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                 <h3 className="text-xl md:text-2xl font-black text-slate-900">Nova Experiência</h3>
                 <button onClick={() => setIsNewEventModalOpen(false)} className="text-slate-400 hover:text-slate-900 bg-white shadow-sm p-2 rounded-xl">
                   <X className="w-5 h-5" />
                 </button>
              </div>
              
              <div className="p-6 md:p-8 space-y-4 overflow-y-auto flex-1">
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Título do Evento</label>
                    <input type="text" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} placeholder="Ex: Workshop de Design..." className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-senac-blue font-medium outline-none" />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Breve Descrição</label>
                    <textarea rows={2} value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-senac-blue font-medium outline-none resize-none" />
                 </div>
                 
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Data (Ex: 10 de Ago)</label>
                        <input type="text" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-senac-blue font-medium outline-none" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Horário (Ex: 19:00)</label>
                        <input type="text" value={newEvent.time} onChange={e => setNewEvent({...newEvent, time: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-senac-blue font-medium outline-none" />
                    </div>
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Localização</label>
                        <input type="text" value={newEvent.location} onChange={e => setNewEvent({...newEvent, location: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-senac-blue font-medium outline-none" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Capacidade de Vagas</label>
                        <input type="number" value={newEvent.capacity} onChange={e => setNewEvent({...newEvent, capacity: Number(e.target.value)})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-senac-blue font-medium outline-none" />
                    </div>
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Categoria</label>
                        <select value={newEvent.category} onChange={e => setNewEvent({...newEvent, category: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-senac-blue font-medium outline-none">
                          <option>Workshop</option>
                          <option>Palestra</option>
                          <option>Networking</option>
                          <option>Conferência</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Link da Imagem (URL)</label>
                        <input type="text" value={newEvent.image} onChange={e => setNewEvent({...newEvent, image: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-senac-blue font-medium outline-none" />
                    </div>
                 </div>
              </div>
              
              <div className="p-6 md:p-8 border-t border-slate-50 bg-white">
                 <button onClick={handleCreateEvent} className="w-full bg-senac-blue text-white py-4 md:py-5 rounded-[22px] font-black text-lg hover:scale-[1.02] transition-transform shadow-xl shadow-senac-blue/20 flex items-center justify-center gap-2">
                   <Plus className="w-5 h-5" /> Publicar Evento Imediatamente
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}