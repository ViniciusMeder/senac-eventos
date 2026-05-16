import { useState, useEffect, useMemo } from "react";
import { getEvents, getMyEnrollments, toggleEnrollment, Event } from "../data/events";
import { logout, isAuthenticated, getUserType } from "../utils/auth";
import { 
  CalendarDays, Ticket, Award, User, Settings, LogOut,
  MapPin, Clock, QrCode, Search, Download, 
  Menu, X, Sparkles, ChevronLeft, ChevronRight, XCircle, Camera, Save, Bell, Shield, BellRing
} from "lucide-react";
import { Link } from "react-router-dom";

// Mock inicial de certificados
const mockCertificados = [
  { id: "101", eventName: "Semana da Computação 2025", date: "12 de Nov, 2025", hours: "12h" },
  { id: "102", eventName: "Workshop de Python Básico", date: "05 de Out, 2025", hours: "04h" }
];

export default function Aluno() {
  const [activeTab, setActiveTab] = useState("inicio");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  
  // Controle do calendário
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState("05");

  // --- ESTADOS DO BANCO DE DADOS LOCAL ---
  const [eventsList, setEventsList] = useState<Event[]>(getEvents());
  const [meusIngressos, setMeusIngressos] = useState<string[]>(getMyEnrollments());
  
  // Estado para a Notificação Push
  const [pushNotification, setPushNotification] = useState<Event | null>(null);

  // Dados do perfil (Fictício)
  const [perfilData, setPerfilData] = useState({
    nome: "Aluno Senac",
    email: "aluno@pe.senac.br",
    curso: "Técnico em Informática",
    cidade: "Paulista, PE"
  });

  // Configurações (Toggles)
  const [configToggles, setConfigToggles] = useState({
    emailNotif: true,
    pushNotif: false,
    profilePublic: true,
  });

  // --- OUVINTE EM TEMPO REAL ---
  useEffect(() => {
    const handleDatabaseUpdate = () => {
      const newEventsData = getEvents();
      
      // Verifica se um evento novo foi adicionado (para disparar o Push)
      if (newEventsData.length > eventsList.length) {
        const latestEvent = newEventsData[newEventsData.length - 1];
        setPushNotification(latestEvent);
        setTimeout(() => setPushNotification(null), 5000); // Oculta após 5s
      }
      
      setEventsList(newEventsData);
      setMeusIngressos(getMyEnrollments());
    };

    window.addEventListener("db_updated", handleDatabaseUpdate);
    window.addEventListener("storage", handleDatabaseUpdate); // Funciona entre abas!
    
    return () => {
      window.removeEventListener("db_updated", handleDatabaseUpdate);
      window.removeEventListener("storage", handleDatabaseUpdate);
    };
  }, [eventsList]);

  if (!isAuthenticated() || getUserType() !== "aluno") {
    window.location.href = "/login";
    return null;
  }

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  // Nova função de inscrição comunicando com o BD
  const toggleInscricao = (eventId: string) => {
    const novosIngressos = toggleEnrollment(eventId);
    setMeusIngressos(novosIngressos);
  };

  const myEventsData = useMemo(() => 
    eventsList.filter(e => meusIngressos.includes(e.id)), [eventsList, meusIngressos]
  );

  const bannerEvent = useMemo(() => {
    if (myEventsData.length > 0) {
      return { event: myEventsData[0], isRegistered: true };
    }
    const recomendacao = eventsList.find(e => !meusIngressos.includes(e.id));
    return recomendacao ? { event: recomendacao, isRegistered: false } : null;
  }, [myEventsData, eventsList, meusIngressos]);

  const categorias = ["Todos", "Workshop", "Palestra", "Networking", "Conferência"];
  const filteredEvents = useMemo(() => {
    return eventsList.filter(e => {
      const matchesSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           e.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "Todos" || e.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [eventsList, searchTerm, selectedCategory]);

  const menuItems = [
    { id: "inicio", label: "Painel Inicial", icon: User },
    { id: "ingressos", label: "Meus Ingressos", icon: Ticket, count: meusIngressos.length },
    { id: "calendario", label: "Calendário de Eventos", icon: CalendarDays },
    { id: "certificados", label: "Seus Certificados", icon: Award },
  ];

  const calendarDaysList = useMemo(() => {
    if (currentCalendarMonth === "05") {
      const blanks = Array(5).fill(null);
      const days = Array.from({ length: 31 }, (_, i) => i + 1);
      return [...blanks, ...days];
    } else {
      const blanks = Array(1).fill(null);
      const days = Array.from({ length: 30 }, (_, i) => i + 1);
      return [...blanks, ...days];
    }
  }, [currentCalendarMonth]);

  const getEventForDay = (day: number | null) => {
    if (!day) return null;
    const padDay = day.toString().padStart(2, "0");
    const searchString = `${padDay} de ${currentCalendarMonth === "05" ? "Mai" : "Jun"}`;
    return myEventsData.find(e => e.date.toLowerCase().includes(searchString.toLowerCase()));
  };

  const renderContent = () => {
    switch (activeTab) {
      case "inicio":
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                Olá, <span className="text-senac-blue">{perfilData.nome.split(' ')[0]}</span>! 👋
              </h2>
              <p className="text-slate-500 font-medium mt-1">Gerencie suas experiências e descubra novos conhecimentos.</p>
            </div>

            {bannerEvent && (
              <div className={`rounded-[2.5rem] p-6 md:p-10 shadow-xl transition-all duration-500 relative overflow-hidden flex flex-col lg:flex-row items-center gap-8 ${
                bannerEvent.isRegistered 
                  ? "bg-gradient-to-br from-senac-blue to-blue-900 text-white shadow-senac-blue/20" 
                  : "bg-gradient-to-br from-amber-500 to-senac-orange text-white shadow-senac-orange/20"
              }`}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />
                <div className="w-full lg:w-1/4 aspect-video lg:aspect-square rounded-2xl overflow-hidden shadow-md flex-shrink-0 relative z-10">
                  <img src={bannerEvent.event.image} alt={bannerEvent.event.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 space-y-4 relative z-10 w-full text-center lg:text-left">
                  <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                    {bannerEvent.isRegistered ? "✨ Seu Próximo Evento" : "🔥 Recomendado para Você"}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-black leading-tight tracking-tight">{bannerEvent.event.title}</h3>
                  <div className="flex flex-wrap justify-center lg:justify-start gap-3 text-xs font-semibold text-white/90">
                    <span className="flex items-center gap-1.5 bg-black/10 px-3 py-1.5 rounded-xl"><CalendarDays className="w-4 h-4" /> {bannerEvent.event.date}</span>
                    <span className="flex items-center gap-1.5 bg-black/10 px-3 py-1.5 rounded-xl"><Clock className="w-4 h-4" /> {bannerEvent.event.time}</span>
                    <span className="flex items-center gap-1.5 bg-black/10 px-3 py-1.5 rounded-xl"><MapPin className="w-4 h-4" /> {bannerEvent.event.location.split(',')[0]}</span>
                  </div>
                  <div className="pt-2">
                    {bannerEvent.isRegistered ? (
                      <button onClick={() => setActiveTab("ingressos")} className="w-full sm:w-fit bg-white text-senac-blue hover:bg-slate-50 px-6 py-3.5 rounded-xl font-black uppercase tracking-widest text-xs shadow-md transition-all flex items-center justify-center gap-2 mx-auto lg:mx-0">
                        <QrCode className="w-4 h-4" /> Acessar Ingresso
                      </button>
                    ) : (
                      <button onClick={() => toggleInscricao(bannerEvent.event.id)} className="w-full sm:w-fit bg-slate-900 hover:bg-slate-800 text-white px-6 py-3.5 rounded-xl font-black uppercase tracking-widest text-xs shadow-md transition-all flex items-center justify-center gap-2 mx-auto lg:mx-0">
                        <Sparkles className="w-4 h-4 text-senac-orange" /> Inscrever-se Agora
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 pb-4">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Explorar Eventos</h3>
                <div className="flex gap-1 bg-slate-100 p-1 rounded-xl overflow-x-auto scrollbar-none">
                  {categorias.map(cat => (
                    <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${selectedCategory === cat ? 'bg-white text-senac-blue shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div className="relative bg-white shadow-sm rounded-2xl border border-slate-100 overflow-hidden max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input type="text" placeholder="Buscar eventos na vitrine..." className="w-full pl-12 pr-4 py-3 bg-transparent border-none focus:ring-0 text-sm font-medium outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map(e => {
                  const inscrito = meusIngressos.includes(e.id);
                  const esgotado = (e.enrolledCount || 0) >= (e.capacity || 100);
                  
                  return (
                    <div key={e.id} className="bg-white rounded-3xl border border-slate-100 p-4 shadow-sm hover:shadow-xl transition-all group flex flex-col relative overflow-hidden">
                      <div className="h-44 rounded-2xl overflow-hidden relative mb-4">
                        <img src={e.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <span className={`absolute top-3 left-3 backdrop-blur px-2.5 py-1 rounded-xl text-[9px] font-black uppercase tracking-wider ${esgotado && !inscrito ? 'bg-red-500/90 text-white' : 'bg-white/90 text-senac-blue'}`}>
                          {esgotado && !inscrito ? "Esgotado" : e.category}
                        </span>
                      </div>
                      <h4 className="font-black text-slate-900 text-lg leading-tight mb-1">{e.title}</h4>
                      <p className="text-xs text-slate-400 font-medium flex items-center justify-between mb-4">
                        <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-senac-orange" /> {e.location.split(',')[0]}</span>
                        {!inscrito && <span className="font-bold">{e.enrolledCount || 0}/{e.capacity || 100} vagas</span>}
                      </p>
                      
                      <button 
                        onClick={() => !esgotado && toggleInscricao(e.id)}
                        disabled={esgotado && !inscrito}
                        className={`mt-auto w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                          inscrito ? "bg-emerald-50 text-emerald-600 hover:bg-red-50 hover:text-red-600" 
                          : esgotado ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                          : "bg-slate-50 text-slate-700 hover:bg-senac-blue hover:text-white"
                        }`}
                      >
                        {inscrito ? "✓ Inscrito" : esgotado ? "Lotação Máxima" : "Garantir Vaga"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case "perfil":
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-3xl font-black text-slate-900">Meu Perfil</h2>
              <p className="text-slate-500 font-medium">Mantenha seus dados acadêmicos e pessoais atualizados.</p>
            </div>
            
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="h-32 bg-senac-blue relative">
                <div className="absolute -bottom-12 left-8 w-24 h-24 bg-white rounded-full p-1 shadow-xl">
                  <div className="w-full h-full bg-slate-200 rounded-full overflow-hidden relative group">
                    <img src={`https://ui-avatars.com/api/?name=${perfilData.nome.replace(' ', '+')}&background=004a90&color=fff&size=150`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-16 p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nome Completo</label>
                    <input type="text" value={perfilData.nome} onChange={(e) => setPerfilData({...perfilData, nome: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 font-medium text-slate-900 focus:ring-2 focus:ring-senac-blue/20 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">E-mail Institucional</label>
                    <input type="email" value={perfilData.email} disabled className="w-full bg-slate-100/50 border border-slate-100 rounded-2xl px-4 py-3 font-medium text-slate-500 cursor-not-allowed" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Curso Atual</label>
                    <input type="text" value={perfilData.curso} onChange={(e) => setPerfilData({...perfilData, curso: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 font-medium text-slate-900 focus:ring-2 focus:ring-senac-blue/20 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Localização</label>
                    <input type="text" value={perfilData.cidade} onChange={(e) => setPerfilData({...perfilData, cidade: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 font-medium text-slate-900 focus:ring-2 focus:ring-senac-blue/20 outline-none" />
                  </div>
                </div>
                
                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button className="bg-senac-blue text-white px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-senac-blue/90 shadow-lg shadow-senac-blue/20 transition-all flex items-center gap-2">
                    <Save className="w-4 h-4" /> Salvar Alterações
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case "configuracoes":
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-3xl font-black text-slate-900">Configurações</h2>
              <p className="text-slate-500 font-medium">Ajuste suas preferências de sistema e notificações.</p>
            </div>
            
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              {/* Notificações */}
              <div className="p-6 md:p-8 border-b border-slate-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-amber-50 text-amber-500 rounded-xl"><Bell className="w-5 h-5" /></div>
                  <h3 className="font-black text-slate-900 text-lg">Notificações</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-800">E-mails de Eventos</p>
                      <p className="text-xs text-slate-500">Receber alertas de novos workshops e palestras.</p>
                    </div>
                    <button onClick={() => setConfigToggles({...configToggles, emailNotif: !configToggles.emailNotif})} className={`w-12 h-6 rounded-full p-1 transition-colors ${configToggles.emailNotif ? 'bg-senac-blue' : 'bg-slate-200'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${configToggles.emailNotif ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-800">Alertas no Celular (Push)</p>
                      <p className="text-xs text-slate-500">Lembretes 24h antes do evento começar.</p>
                    </div>
                    <button onClick={() => setConfigToggles({...configToggles, pushNotif: !configToggles.pushNotif})} className={`w-12 h-6 rounded-full p-1 transition-colors ${configToggles.pushNotif ? 'bg-senac-blue' : 'bg-slate-200'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${configToggles.pushNotif ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Privacidade */}
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-emerald-50 text-emerald-500 rounded-xl"><Shield className="w-5 h-5" /></div>
                  <h3 className="font-black text-slate-900 text-lg">Privacidade</h3>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-800">Perfil Público</p>
                    <p className="text-xs text-slate-500">Permitir que outros alunos vejam seus certificados na aba de Networking.</p>
                  </div>
                  <button onClick={() => setConfigToggles({...configToggles, profilePublic: !configToggles.profilePublic})} className={`w-12 h-6 rounded-full p-1 transition-colors ${configToggles.profilePublic ? 'bg-senac-blue' : 'bg-slate-200'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${configToggles.profilePublic ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case "ingressos":
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div>
              <h2 className="text-3xl font-black text-slate-900">Meus Ingressos</h2>
              <p className="text-slate-500 font-medium">Apresente os QR Codes abaixo na portaria do evento.</p>
            </div>

            {myEventsData.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 shadow-sm">
                <Ticket className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-400 font-medium text-lg">Você não possui inscrições ativas.</p>
                <button onClick={() => setActiveTab("inicio")} className="mt-4 bg-slate-50 hover:bg-slate-100 text-senac-blue px-6 py-3 rounded-xl font-bold text-sm transition-colors">Explorar vitrine de eventos</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {myEventsData.map(e => (
                  <div key={e.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col sm:flex-row relative group">
                    <div className="hidden sm:block absolute right-36 top-0 bottom-0 w-px border-l-2 border-dashed border-slate-200 z-10" />
                    
                    <div className="flex-1 p-6 flex flex-col justify-between">
                      <div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-senac-blue bg-senac-blue/5 px-2.5 py-1 rounded-full">{e.category}</span>
                        <h3 className="text-xl font-black text-slate-900 mt-3 leading-tight">{e.title}</h3>
                        <p className="text-xs text-slate-400 font-medium mt-1.5 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {e.location}</p>
                      </div>
                      <div className="mt-6 flex items-center gap-6">
                         <div>
                           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Data</p>
                           <p className="font-black text-slate-800 text-sm">{e.date}</p>
                         </div>
                         <div>
                           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Horário</p>
                           <p className="font-black text-slate-800 text-sm">{e.time}</p>
                         </div>
                      </div>
                    </div>
                    
                    <div className="bg-slate-50/50 p-6 sm:w-36 flex flex-col items-center justify-center border-t sm:border-t-0 sm:border-l border-slate-100">
                      <div className="w-20 h-20 bg-white rounded-xl shadow-sm border border-slate-200 p-2 mb-3 flex items-center justify-center">
                        <QrCode className="w-full h-full text-slate-800" />
                      </div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center mb-3">Confirmado</p>
                      
                      <button 
                        onClick={() => toggleInscricao(e.id)}
                        className="flex items-center justify-center gap-1 w-full py-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg text-[9px] font-black uppercase tracking-widest transition-colors"
                      >
                        <XCircle className="w-3 h-3" /> Cancelar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "calendario":
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h2 className="text-3xl font-black text-slate-900">Meu Calendário</h2>
                <p className="text-slate-500 font-medium">Acompanhe visualmente os dias de suas palestras e workshops.</p>
              </div>
              <div className="flex items-center gap-3 bg-white border border-slate-100 px-4 py-2 rounded-2xl shadow-sm w-fit self-end sm:self-auto">
                <button onClick={() => setCurrentCalendarMonth("05")} className={`p-1.5 rounded-lg transition-colors ${currentCalendarMonth === "05" ? "text-slate-300 cursor-not-allowed" : "text-slate-600 hover:bg-slate-50"}`} disabled={currentCalendarMonth === "05"}>
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="font-black text-sm text-slate-800 min-w-[100px] text-center uppercase tracking-wider">
                  {currentCalendarMonth === "05" ? "Maio 2026" : "Junho 2026"}
                </span>
                <button onClick={() => setCurrentCalendarMonth("06")} className={`p-1.5 rounded-lg transition-colors ${currentCalendarMonth === "06" ? "text-slate-300 cursor-not-allowed" : "text-slate-600 hover:bg-slate-50"}`} disabled={currentCalendarMonth === "06"}>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-4 md:p-8 overflow-hidden">
              <div className="grid grid-cols-7 gap-2 text-center mb-4">
                {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(d => (
                  <div key={d} className="text-[10px] font-black text-slate-400 uppercase tracking-widest py-2">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2 md:gap-4">
                {calendarDaysList.map((day, idx) => {
                  const dayEvent = getEventForDay(day);
                  return (
                    <div key={idx} className={`aspect-square rounded-2xl border flex flex-col justify-between p-2 relative group transition-all ${!day ? "bg-slate-50/30 border-transparent pointer-events-none" : dayEvent ? "bg-senac-blue/5 border-senac-blue/30 text-senac-blue" : "bg-white border-slate-100 text-slate-700 hover:border-slate-300"}`}>
                      <span className={`text-xs md:text-sm font-black ${dayEvent ? "text-senac-blue" : "text-slate-700"}`}>{day}</span>
                      {dayEvent && <div className="w-2 h-2 bg-senac-orange rounded-full self-end animate-pulse mb-1 md:mb-0" />}
                      {dayEvent && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-slate-900 text-white text-[11px] p-3 rounded-xl shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 line-clamp-3">
                          <p className="font-black text-senac-orange leading-none mb-1">{dayEvent.category}</p>
                          <p className="font-bold leading-tight">{dayEvent.title}</p>
                          <p className="text-[9px] text-white/60 mt-1">{dayEvent.time} • {dayEvent.location.split(',')[0]}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <h3 className="font-black text-slate-900 text-lg">Eventos agendados para este mês</h3>
              <div className="space-y-3">
                {myEventsData.filter(e => e.date.includes(currentCalendarMonth === "05" ? "Mai" : "Jun")).length === 0 ? (
                  <p className="text-xs text-slate-400 font-medium">Nenhum compromisso confirmado para este mês.</p>
                ) : (
                  myEventsData.filter(e => e.date.includes(currentCalendarMonth === "05" ? "Mai" : "Jun")).map(e => (
                    <div key={e.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 bg-senac-orange rounded-full" />
                        <div>
                          <p className="font-black text-slate-800 text-sm">{e.title}</p>
                          <p className="text-[11px] text-slate-400 font-medium">{e.date} às {e.time} • {e.location.split(',')[0]}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-black uppercase text-senac-blue bg-white border border-slate-100 px-3 py-1 rounded-xl">{e.category}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        );

      case "certificados":
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-3xl font-black text-slate-900">Seus Certificados</h2>
              <p className="text-slate-500 font-medium">Baixe os comprovantes de presença e horas complementares.</p>
            </div>
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h3 className="font-bold text-slate-700 text-sm">Histórico Acadêmico</h3>
                <span className="bg-senac-orange/10 text-senac-orange px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">16 Horas Emitidas</span>
              </div>
              <div className="divide-y divide-slate-50">
                {mockCertificados.map(cert => (
                  <div key={cert.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/30 transition-colors">
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-xl bg-senac-blue/5 flex items-center justify-center text-senac-blue flex-shrink-0">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 text-sm sm:text-base">{cert.eventName}</h4>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">Emissão: {cert.date} • Carga: {cert.hours}</p>
                      </div>
                    </div>
                    <button className="flex items-center justify-center gap-2 bg-slate-50 hover:bg-senac-blue hover:text-white text-slate-700 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-sm">
                      <Download className="w-4 h-4" /> Download PDF
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans relative">
      
      {/* SIMULAÇÃO DE NOTIFICAÇÃO PUSH DO SISTEMA (Fica flutuando no topo direito) */}
      <div className={`fixed top-6 right-6 z-[200] bg-white rounded-2xl shadow-2xl border-l-4 border-senac-orange p-4 pr-10 w-80 transform transition-all duration-500 ease-out ${pushNotification ? "translate-x-0 opacity-100" : "translate-x-[120%] opacity-0"}`}>
        <div className="flex items-start gap-3">
          <div className="p-2 bg-senac-orange/10 rounded-full animate-pulse"><BellRing className="w-5 h-5 text-senac-orange" /></div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Novo Evento Adicionado!</p>
            <p className="text-sm font-bold text-slate-900 mt-0.5">{pushNotification?.title}</p>
            <p className="text-xs text-slate-500 line-clamp-1 mt-1">{pushNotification?.description}</p>
          </div>
        </div>
      </div>

      {/* OVERLAYS GLOBAIS COM Z-INDEX AJUSTADO */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}
      {isProfileMenuOpen && (
        <div className="fixed inset-0 z-[35]" onClick={() => setIsProfileMenuOpen(false)} />
      )}

      {/* SIDEBAR COM BOTÃO DE LOGOUT RETORNADO */}
      <aside className={`fixed inset-y-0 left-0 z-[70] w-64 bg-white border-r border-slate-100 flex flex-col justify-between shadow-xl transform transition-transform duration-300 md:relative md:translate-x-0 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full">
          <div className="h-20 md:h-24 flex items-center justify-between px-6 border-b border-slate-50">
            <h1 className="text-xl font-black text-senac-blue tracking-tighter">Senac<span className="text-senac-orange">.</span>Portal</h1>
            <button className="md:hidden p-1.5 text-slate-400 bg-slate-50 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
            <p className="px-3 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Navegação Aluno</p>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl font-bold transition-all duration-200 text-sm ${isActive ? "bg-senac-blue text-white shadow-lg shadow-senac-blue/20" : "text-slate-400 hover:bg-slate-50 hover:text-slate-800"}`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="tracking-tight">{item.label}</span>
                  {item.count !== undefined && item.count > 0 && (
                    <span className={`ml-auto text-[10px] font-black px-2 py-0.5 rounded-full ${isActive ? 'bg-white text-senac-blue' : 'bg-senac-blue/10 text-senac-blue'}`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-50 mt-auto">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 text-red-500 hover:bg-red-50 rounded-xl font-black text-xs uppercase tracking-widest transition-all"
            >
              <LogOut className="w-4 h-4" /> Sair do Sistema
            </button>
          </div>
        </div>
      </aside>

      {/* PAINEL CENTRAL DE CONTEÚDO */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* TOPBAR */}
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-6 z-40 flex-shrink-0 shadow-sm relative">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-slate-600 hover:bg-slate-50 rounded-xl md:hidden transition-colors">
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-black text-slate-900 tracking-tighter hidden md:block">Área do Aluno</h1>
          </div>

          {/* PERFIL DROPDOWN */}
          <div className="relative">
            <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className={`flex items-center gap-2 p-1 rounded-full border transition-all ${isProfileMenuOpen ? 'border-senac-blue bg-slate-50' : 'border-slate-100 hover:border-slate-200'}`}>
              <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center border shadow-sm">
                 <img src={`https://ui-avatars.com/api/?name=${perfilData.nome.replace(' ', '+')}&background=004a90&color=fff`} className="w-full h-full object-cover" />
              </div>
              <span className="text-xs font-black text-slate-800 pr-2 hidden sm:inline-block">{perfilData.nome.split(' ')[0]}</span>
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-[50] animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-4 border-b border-slate-50 bg-slate-50/50">
                  <p className="text-sm font-black text-slate-900">{perfilData.nome}</p>
                  <p className="text-[10px] font-semibold text-slate-400">{perfilData.email}</p>
                </div>
                <div className="p-1.5">
                  <button onClick={() => { setActiveTab("perfil"); setIsProfileMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-senac-blue rounded-xl transition-colors">
                    <User className="w-4 h-4 text-slate-400" /> Ver Perfil
                  </button>
                  <button onClick={() => { setActiveTab("ingressos"); setIsProfileMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-senac-blue rounded-xl transition-colors">
                    <Ticket className="w-4 h-4 text-slate-400" /> Meus Ingressos
                  </button>
                  <button onClick={() => { setActiveTab("calendario"); setIsProfileMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-senac-blue rounded-xl transition-colors">
                    <CalendarDays className="w-4 h-4 text-slate-400" /> Meu Calendário
                  </button>
                  <button onClick={() => { setActiveTab("certificados"); setIsProfileMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-senac-blue rounded-xl transition-colors">
                    <Award className="w-4 h-4 text-slate-400" /> Seus Certificados
                  </button>
                  <button onClick={() => { setActiveTab("configuracoes"); setIsProfileMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-senac-blue rounded-xl transition-colors">
                    <Settings className="w-4 h-4 text-slate-400" /> Configurações
                  </button>
                </div>
                <div className="p-1.5 border-t border-slate-50">
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-black text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                    <LogOut className="w-4 h-4" /> Sair da Conta
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-10 relative">
          <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-senac-blue/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-senac-orange/5 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="max-w-5xl mx-auto relative z-10 pb-16">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}