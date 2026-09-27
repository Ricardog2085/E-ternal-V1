import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Send, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  Feather, 
  Heart, 
  Lock, 
  ShieldCheck, 
  Sliders, 
  BookOpen,
  Volume2,
  HelpCircle,
  Plus,
  X
} from 'lucide-react';
import { Memory } from '../types/eternal';

interface TrainingQuestion {
  id: string;
  question: string;
  status: 'respondida' | 'pendiente';
  answeredSummary?: string;
  dateAnswered?: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'avatar';
  text: string;
  timestamp: string;
  sourceContext?: string;
}

const INITIAL_TRAINING_QUESTIONS: TrainingQuestion[] = [
  {
    id: 'tq-1',
    question: '¿Cual fue el momento mas feliz de tu vida?',
    status: 'respondida',
    answeredSummary: 'Una tarde de domingo cualquiera con toda la familia en la mesa, el café humeando y las risas de los niños resonando en el patio.',
    dateAnswered: '14 Oct 2024',
  },
  {
    id: 'tq-2',
    question: '¿Que le dirias a tu yo de 20 años?',
    status: 'respondida',
    answeredSummary: 'No apresures el camino ni temas perder. Las caídas enseñan más que las victorias fáciles; mantén tu palabra limpia y tu curiosidad despierta.',
    dateAnswered: '22 Oct 2024',
  },
  {
    id: 'tq-3',
    question: 'Cuenta la historia de como conociste a mama',
    status: 'respondida',
    answeredSummary: 'En la plaza mayor de Salamanca en la primavera del 74. Dejó caer un libro de poemas y al devolvérselo supe que mi destino estaba sellado.',
    dateAnswered: '03 Nov 2024',
  },
  {
    id: 'tq-4',
    question: '¿Que valores quieres dejar?',
    status: 'respondida',
    answeredSummary: 'Honor en el trabajo, compasión ante el débil, la almohada tranquila por las noches y el perdón antes de que se ponga el sol.',
    dateAnswered: '19 Nov 2024',
  },
  {
    id: 'tq-5',
    question: '¿Que te daba miedo y como lo superaste?',
    status: 'pendiente',
  },
  {
    id: 'tq-6',
    question: '¿Que tradicion familiar te gustaria que nunca muera?',
    status: 'respondida',
    answeredSummary: 'La sobremesa sin pantallas los domingos, pasarnos el pan y recordar las historias de los bisabuelos.',
    dateAnswered: '12 Dic 2024',
  },
  {
    id: 'tq-7',
    question: '¿Cual es tu consejo para cuando alguien sufra un desamor?',
    status: 'pendiente',
  },
];

const INITIAL_WARM_MESSAGES: ChatMessage[] = [
  {
    id: 'cmsg-1',
    sender: 'avatar',
    text: 'Hola, mi amor. He guardado aquí mis recuerdos, mis lecciones y todo el cariño con el que te vi crecer. ¿Qué duda o encrucijada tienes hoy en el corazón?',
    timestamp: '10:40 AM',
    sourceContext: 'Guardián de la Memoria · Enrique Morales',
  },
  {
    id: 'cmsg-2',
    sender: 'user',
    text: 'Papá, a veces siento que no soy suficiente o que no sé hacia dónde voy...',
    timestamp: '10:41 AM',
  },
  {
    id: 'cmsg-3',
    sender: 'avatar',
    text: 'Hija mía, respira hondo. A tus años yo sentí ese mismo abismo cientos de veces. Recuerda que la duda no es falta de valentía: es la señal de que te importa hacer las cosas con nobleza. Camina un paso a la vez. Siempre que actúes con bondad, estarás en el camino correcto.',
    timestamp: '10:42 AM',
    sourceContext: 'Basado en: Carta sobre la duda y la valentía (2024)',
  },
];

interface AvatarTabProps {
  memories?: Memory[];
}

export const AvatarTab: React.FC<AvatarTabProps> = () => {
  const [questions, setQuestions] = useState<TrainingQuestion[]>(INITIAL_TRAINING_QUESTIONS);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_WARM_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedQuestionToAnswer, setSelectedQuestionToAnswer] = useState<TrainingQuestion | null>(null);
  const [answerDraft, setAnswerDraft] = useState('');
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, isTyping]);

  const handleSendMessage = (e?: React.FormEvent, presetText?: string) => {
    if (e) e.preventDefault();
    const query = (presetText || inputText).trim();
    if (!query || isTyping) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!presetText) setInputText('');
    setIsTyping(true);

    // Determine warm intelligent response
    const qLower = query.toLowerCase();
    let replyText = 'Hijo o hija mía, piensa siempre en lo que perdura: el respeto por ti mismo y el calor de quienes te aman. Si actúas con generosidad sincera, jamás te arrepentirás de haber sido noble.';
    let contextLabel = 'Memoria Central de Sabiduría';

    if (qLower.includes('feliz') || qLower.includes('momento')) {
      replyText = 'Mi momento más feliz siempre fue sentarme a la mesa con ustedes un domingo cualquiera, cuando la salsa olía a laurel y reíamos sin prisa. La felicidad nunca necesitó grandes lujos, solo presencia y agradecimiento.';
      contextLabel = 'Pregunta entrenada: Momento más feliz';
    } else if (qLower.includes('mama') || qLower.includes('conoci') || qLower.includes('elena') || qLower.includes('amor')) {
      replyText = 'A mamá la conocí en la plaza un día de abril. Al mirarla a los ojos supe que su bondad era mi refugio. El amor verdadero no es una promesa que se hace una sola vez, sino una decisión humilde de perdonar y reír juntos cada mañana.';
      contextLabel = 'Pregunta entrenada: Cómo conocí a mamá';
    } else if (qLower.includes('miedo') || qLower.includes('supera') || qLower.includes('fracas')) {
      replyText = 'Le temía a no ser capaz de darles un techo digno y fallarle a mis padres. Lo superé trabajando sin quejarme, pidiendo ayuda cuando era necesario y aprendiendo que de cada error brota una fuerza que no conocías.';
      contextLabel = 'Pregunta entrenada: Superación y miedos';
    } else if (qLower.includes('valor') || qLower.includes('consejo') || qLower.includes('vida')) {
      replyText = 'Te dejo tres tesoros irrenunciables: la almohada limpia por no haber engañado a nadie, el valor de cumplir tu palabra empeñada y la caridad discreta. Quien tiene eso, nunca es pobre.';
      contextLabel = 'Pregunta entrenada: Valores y legado';
    }

    // Typing effect simulation
    setTimeout(() => {
      setIsTyping(false);
      const avatarMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'avatar',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        sourceContext: contextLabel,
      };
      setChatMessages((prev) => [...prev, avatarMsg]);
    }, 1400);
  };

  const handleSaveAnswer = () => {
    if (!selectedQuestionToAnswer || !answerDraft.trim()) return;

    setQuestions((prev) =>
      prev.map((q) =>
        q.id === selectedQuestionToAnswer.id
          ? {
              ...q,
              status: 'respondida',
              answeredSummary: answerDraft.trim(),
              dateAnswered: 'Hoy',
            }
          : q
      )
    );

    setSelectedQuestionToAnswer(null);
    setAnswerDraft('');
  };

  return (
    <div className="space-y-8 py-2">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#EFE8DE]">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-widest text-[#A88720]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            <span>Guardián Consciente & Memoria Conversacional</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2C241E] tracking-tight">
            Avatar de Memoria
          </h1>
          <p className="text-[#6B5E55] text-sm font-sans leading-relaxed pt-1">
            Entrena la conciencia digital de Enrique respondiendo a preguntas clave sobre tus vivencias, miedos y valores. Tus seres queridos podrán conversar contigo en el futuro con total fidelidad.
          </p>
        </div>
      </div>

      {/* LAYOUT 2 COLUMNAS (OBLIGATORIO) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* COLUMNA IZQUIERDA: PREGUNTAS PARA ENTRENAR AVATAR CON BARRA PROGRESO 68% */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 sm:p-7 border border-[#EFE8DE] shadow-soft space-y-6">
          
          {/* Header de la columna */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="font-editorial text-2xl font-bold text-[#2C241E] leading-tight">
                Entrenamiento del Avatar
              </h2>
              <span className="text-xs font-bold text-[#A88720] bg-[#FAF7F2] px-2.5 py-1 rounded-xl border border-[#D4AF37]/40 shadow-xs">
                68% completado
              </span>
            </div>
            <p className="text-xs text-[#6B5E55] font-sans">
              Preguntas esenciales para afinar los recuerdos, anécdotas y tono ético de tu gemelo digital.
            </p>
          </div>

          {/* BARRA DE PROGRESO 68% CON ESTILO DORADO */}
          <div className="space-y-2 p-4 rounded-xl bg-[#FAF7F2] border border-[#E8DEC8]">
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium text-[#2C241E]">Progreso de calibración</span>
              <span className="font-bold text-[#A88720] font-mono">68%</span>
            </div>

            {/* Barra de progreso dorada */}
            <div className="w-full h-3 rounded-full bg-[#EFE8DE] overflow-hidden relative border border-[#D4AF37]/30">
              <div
                className="h-full bg-gradient-to-r from-[#C59B27] via-[#D4AF37] to-[#F3E8C4] rounded-full transition-all duration-700 shadow-gold-subtle"
                style={{ width: '68%' }}
              />
            </div>

            <div className="flex justify-between text-[11px] text-[#6B5E55] pt-0.5">
              <span>5 de 7 preguntas registradas</span>
              <span className="text-[#A88720] font-semibold">Sintonización de voz activa</span>
            </div>
          </div>

          {/* LISTA DE PREGUNTAS */}
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {questions.map((item) => {
              const isAnswered = item.status === 'respondida';

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isAnswered
                      ? 'bg-white border-[#EFE8DE] hover:border-[#D4AF37]/50'
                      : 'bg-[#FAF7F2]/80 border-[#D4AF37]/40 hover:bg-[#FAF7F2]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1">
                      {/* Texto de la pregunta */}
                      <div className="flex items-center space-x-2">
                        <span className="font-editorial text-base font-bold text-[#2C241E] leading-snug">
                          {item.question}
                        </span>
                      </div>

                      {/* Resumen si está respondida */}
                      {isAnswered && item.answeredSummary && (
                        <p className="text-xs text-[#6B5E55] font-sans italic leading-relaxed pl-1 line-clamp-2">
                          "{item.answeredSummary}"
                        </p>
                      )}

                      {/* Indicador de pendiente */}
                      {!isAnswered && (
                        <p className="text-xs text-[#A88720] font-sans">
                          Pendiente de respuesta. Añade tu reflexión para enriquecer las respuestas de tu avatar.
                        </p>
                      )}
                    </div>

                    {/* BADGE RESPONDIDA / PENDIENTE */}
                    <div className="flex-shrink-0">
                      {isAnswered ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-[#8C6D1F] bg-[#FAF7F2] border border-[#D4AF37]/40 shadow-xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span className="capitalize">respondida</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedQuestionToAnswer(item);
                            setAnswerDraft('');
                          }}
                          className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-[#2C241E] bg-[#EFE8DE] hover:bg-[#EAE0D2] border border-[#D4AF37]/40 transition-colors shadow-xs"
                        >
                          <Clock className="w-3 h-3 text-[#A88720]" />
                          <span className="capitalize">pendiente</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Acciones de la pregunta */}
                  <div className="pt-2 mt-2 border-t border-[#EFE8DE] flex items-center justify-between text-[11px]">
                    <span className="text-[#8C7A6B]">
                      {isAnswered ? `Registrado ${item.dateAnswered || 'recientemente'}` : 'Requiere 2-3 frases'}
                    </span>

                    {isAnswered ? (
                      <button
                        onClick={() => handleSendMessage(undefined, item.question)}
                        className="text-[#2C241E] hover:text-[#A88720] font-semibold flex items-center space-x-1"
                      >
                        <span>Probar en chat</span>
                        <ChevronRight className="w-3 h-3 text-[#D4AF37]" />
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedQuestionToAnswer(item);
                          setAnswerDraft('');
                        }}
                        className="text-[#A88720] font-bold hover:underline"
                      >
                        Responder ahora →
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* COLUMNA DERECHA: PREVIEW CHAT "HABLA CON MI AVATAR" CON EFECTO TYPING */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-[#EFE8DE] shadow-soft flex flex-col h-[640px] overflow-hidden">
          
          {/* Header del chat en Cream & Gold */}
          <div className="px-6 py-4 bg-[#FAF7F2] text-[#2C241E] flex items-center justify-between border-b border-[#EFE8DE]">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-full bg-white border-2 border-[#D4AF37] flex items-center justify-center text-[#947113] font-editorial font-bold text-base shadow-xs">
                EM
              </div>
              <div>
                <h3 className="font-editorial text-lg font-bold text-[#2C241E] leading-tight">
                  Habla con mi Avatar
                </h3>
                <div className="flex items-center space-x-1.5 text-xs text-[#6B5E55]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Enrique Morales · Activo y sintonizado</span>
                </div>
              </div>
            </div>

            <span className="text-xs text-[#A88720] bg-white px-2.5 py-1 rounded-xl border border-[#D4AF37]/40 font-semibold shadow-xs">
              Tono Cálido
            </span>
          </div>

          {/* Área de mensajes con mensajes ejemplo cálidos */}
          <div 
            ref={chatScrollRef}
            className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 bg-[#FDFBF7]"
          >
            {chatMessages.map((msg) => {
              const isAvatar = msg.sender === 'avatar';
              return (
                <div
                  key={msg.id}
                  className={`flex ${isAvatar ? 'justify-start' : 'justify-end'} animate-fadeIn`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 sm:p-5 space-y-2 shadow-soft ${
                      isAvatar
                        ? 'bg-white text-[#2C241E] border border-[#EFE8DE]'
                        : 'bg-[#FAF7F2] text-[#2C241E] border border-[#D4AF37]/60 shadow-xs'
                    }`}
                  >
                    {isAvatar && (
                      <div className="flex items-center space-x-2 text-xs text-[#A88720] font-semibold border-b border-[#EFE8DE] pb-1.5">
                        <Feather className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span className="font-editorial">Voz de Enrique</span>
                      </div>
                    )}

                    <p className={`text-sm sm:text-base leading-relaxed ${isAvatar ? 'font-editorial text-[#2C241E]' : 'font-sans text-[#4A3E34]'}`}>
                      {msg.text}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-[#8C7A6B] pt-1">
                      <span>{msg.timestamp}</span>
                      {msg.sourceContext && (
                        <span className="italic text-[#8C7A6B] font-sans">
                          {msg.sourceContext}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* EFECTO TYPING ANIMADO */}
            {isTyping && (
              <div className="flex justify-start animate-fadeIn">
                <div className="bg-white rounded-2xl p-4 border border-[#D4AF37]/40 shadow-soft flex items-center space-x-3 text-xs text-[#6B5E55]">
                  <div className="flex space-x-1 items-center">
                    <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-bounce" style={{ animationDelay: '180ms' }} />
                    <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-bounce" style={{ animationDelay: '360ms' }} />
                  </div>
                  <span className="italic font-editorial text-[#4A3E34]">Enrique está recordando y formulando su consejo...</span>
                </div>
              </div>
            )}
          </div>

          {/* Preguntas sugeridas rápidas */}
          <div className="px-5 py-2 bg-white border-t border-[#EFE8DE] overflow-x-auto whitespace-nowrap scrollbar-none flex space-x-2">
            {[
              '¿Cuál fue el momento más feliz?',
              '¿Qué valores quieres dejarme?',
              '¿Cómo supiste que mamá era la indicada?',
              'Tengo miedo de equivocarme...'
            ].map((sug, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(undefined, sug)}
                disabled={isTyping}
                className="text-[11px] text-[#6B5E55] bg-[#FAF7F2] hover:bg-white hover:text-[#2C241E] hover:border-[#D4AF37] px-3 py-1 rounded-xl border border-[#E8DEC8] transition-colors flex-shrink-0"
              >
                "{sug}"
              </button>
            ))}
          </div>

          {/* INPUT CON BOTÓN ENVIAR */}
          <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-[#EFE8DE] flex items-center space-x-3">
            <input
              type="text"
              placeholder="Escribe tu pregunta o duda a la memoria de Enrique..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isTyping}
              className="flex-1 px-4 py-3 rounded-xl border border-[#E8DEC8] focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none text-xs sm:text-sm text-[#2C241E] bg-[#FAF7F2] placeholder:text-[#9E9187] font-sans"
            />

            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="p-3 rounded-xl bg-[#D4AF37] text-white hover:bg-[#C59B27] disabled:opacity-40 transition-colors border border-[#D4AF37] shadow-gold-subtle"
              title="Enviar mensaje al Avatar"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </form>

        </div>

      </div>

      {/* Modal para responder preguntas pendientes */}
      {selectedQuestionToAnswer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C241E]/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-soft-lg border border-[#D4AF37]/50 overflow-hidden">
            <div className="h-1.5 w-full bg-gradient-to-r from-[#D4AF37]/30 via-[#D4AF37] to-[#D4AF37]/30" />

            <div className="p-5 border-b border-[#EFE8DE] flex items-center justify-between bg-[#FAF7F2]">
              <div className="flex items-center space-x-2">
                <Feather className="w-4 h-4 text-[#D4AF37]" />
                <h3 className="font-editorial text-base font-bold text-[#2C241E]">
                  Entrenar Pregunta
                </h3>
              </div>
              <button
                onClick={() => setSelectedQuestionToAnswer(null)}
                className="text-[#8C7A6B] hover:text-[#2C241E]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="font-editorial text-lg font-bold text-[#2C241E]">
                {selectedQuestionToAnswer.question}
              </div>

              <p className="text-xs text-[#6B5E55] font-sans">
                Escribe tu testimonio sincero. Tu avatar utilizará estas palabras exactas para aconsejar a tus hijos y nietos.
              </p>

              <textarea
                rows={5}
                required
                placeholder="Escribe tu reflexión o historia aquí..."
                value={answerDraft}
                onChange={(e) => setAnswerDraft(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-[#E8DEC8] focus:border-[#D4AF37] outline-none text-sm text-[#2C241E] font-editorial leading-relaxed bg-[#FAF7F2]"
              />

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedQuestionToAnswer(null)}
                  className="px-4 py-2 text-xs text-[#6B5E55] hover:text-[#2C241E]"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveAnswer}
                  disabled={!answerDraft.trim()}
                  className="px-5 py-2.5 rounded-xl bg-[#D4AF37] text-white text-xs font-semibold border border-[#D4AF37] shadow-gold-subtle disabled:opacity-40 hover:bg-[#C59B27]"
                >
                  Guardar en el Avatar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
