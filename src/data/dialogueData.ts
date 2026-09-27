export type CharacterReaction = "wave" | "think" | "nod" | "happy" | "celebrate";

export interface DialogueOption {
  text: string;
  nextId: number;
  xp: number;
  isRestart?: boolean;
}

export interface DialogueStep {
  id: number;
  badge: string;
  question: string;
  reaction: CharacterReaction;
  options: DialogueOption[];
}

export const DIALOGUE_STEPS: DialogueStep[] = [
  {
    id: 0,
    badge: "Boas-vindas • Balcão de Recepção",
    question: "Olá, Jogador! 👋 Bem-vindo ao balcão de entrada do arquipélago das Soft Skills. Preparado para desvendar suas habilidades?",
    reaction: "wave",
    options: [
      { text: "Sim, vamos nessa! 🚀", nextId: 1, xp: 50 },
      { text: "Quero explorar e ver como funciona 🧭", nextId: 1, xp: 50 },
    ],
  },
  {
    id: 1,
    badge: "Desafio 1 • Comunicação & Escuta",
    question: "Sua equipe discorda sobre o rumo de uma entrega crítica. Qual é a sua atitude imediata no time?",
    reaction: "think",
    options: [
      { text: "Promovo um espaço seguro para ouvir cada perspectiva com empatia", nextId: 2, xp: 100 },
      { text: "Proponho uma votação rápida para destravar o andamento logo", nextId: 2, xp: 80 },
      { text: "Foco nos dados e métricas para fundamentar a decisão técnica", nextId: 2, xp: 90 },
    ],
  },
  {
    id: 2,
    badge: "Desafio 2 • Responsabilidade & Transparência",
    question: "Você percebe que uma entrega vai atrasar por um imprevisto técnico. Como procede?",
    reaction: "nod",
    options: [
      { text: "Aviso o time e stakeholders com clareza e planos de ação alternativos", nextId: 3, xp: 100 },
      { text: "Tento correr sozinho para entregar antes que alguém perceba o atraso", nextId: 3, xp: 70 },
      { text: "Aguardo a próxima reunião diária de alinhamento para comunicar", nextId: 3, xp: 80 },
    ],
  },
  {
    id: 3,
    badge: "Desafio 3 • Adaptabilidade & Resiliência",
    question: "Uma mudança inesperada de prioridade altera semanas de trabalho. Qual é o seu mindset?",
    reaction: "happy",
    options: [
      { text: "Abraço a mudança com agilidade e renegocio o escopo sem estresse", nextId: 4, xp: 100 },
      { text: "Analiso o impacto e sugiro uma transição gradual em fases", nextId: 4, xp: 95 },
      { text: "Questiono os motivos com a liderança para entender o cenário completo", nextId: 4, xp: 90 },
    ],
  },
  {
    id: 4,
    badge: "Jornada Concluída • Soft Skills Master",
    question: "Parabéns, Jogador! 🎉 Você demonstrou maturidade, empatia e visão estratégica. Seu check-in na ilha foi aprovado!",
    reaction: "celebrate",
    options: [
      { text: "Explorar o arquipélago 🏝️", nextId: 4, xp: 150 },
      { text: "Reiniciar jornada no balcão 🔄", nextId: 0, isRestart: true, xp: 0 },
    ],
  },
];

export interface SkillQuestOption {
  label: string;
  description: string;
  styleResult: string;
  xp: number;
}

export interface MerchantSkillQuest {
  key: "emotional_intelligence" | "leadership_styles" | "work_motivation" | "creativity";
  title: string;
  badge: string;
  icon: string;
  intro: string;
  question: string;
  options: SkillQuestOption[];
}

export const MERCHANT_SKILL_QUESTS: Record<string, MerchantSkillQuest> = {
  emotional_intelligence: {
    key: "emotional_intelligence",
    title: "Inteligência Emocional",
    badge: "Pergaminho Sagrado • Empatia & Equilíbrio",
    icon: "💖",
    intro: "Ei, aventureiro! Dominar as próprias emoções e conectar-se com o coração dos outros é a magia mais poderosa de qualquer guilda.",
    question: "Quando surge um conflito acalorado no calor de uma missão crítica, qual é o seu reflexo instintivo?",
    options: [
      {
        label: "Ouvinte Empático",
        description: "Respiro fundo, ouço ativamente cada ponto de vista e busco o consenso harmonioso.",
        styleResult: "Estilo Empático & Pacificador ✨",
        xp: 120,
      },
      {
        label: "Âncora Racional",
        description: "Mantenho a calma gélida e separo as emoções dos fatos objetivos para resolver a causa raiz.",
        styleResult: "Estilo Racional & Estratégico 🛡️",
        xp: 110,
      },
      {
        label: "Mediador Proativo",
        description: "Intervenho rapidamente com perguntas abertas para redirecionar a energia ao objetivo comum.",
        styleResult: "Estilo Mediador Dinâmico ⚡",
        xp: 115,
      },
    ],
  },
  leadership_styles: {
    key: "leadership_styles",
    title: "Estilos de Liderança",
    badge: "Pergaminho de Comando • Condução & Inspiração",
    icon: "👑",
    intro: "Um líder não apenas aponta o mapa; ele caminha junto na tempestade e desperta o herói adormecido em cada companheiro.",
    question: "Como você prefere guiar sua equipe rumo a um território desconhecido e desafiador?",
    options: [
      {
        label: "Líder Visionário",
        description: "Pinto o quadro do futuro com entusiasmo contagiante e dou autonomia total para o time criar.",
        styleResult: "Estilo Visionário & Inspirador 🌟",
        xp: 120,
      },
      {
        label: "Líder Mentor",
        description: "Foco no desenvolvimento pessoal de cada membro, capacitando um a um com paciência e feedback.",
        styleResult: "Estilo Mentor & Educador 📜",
        xp: 125,
      },
      {
        label: "Líder Servidor / Colaborativo",
        description: "Arregaço as mangas na linha de frente, removo obstáculos e celebro as vitórias coletivas.",
        styleResult: "Estilo Colaborativo & Servidor 🤝",
        xp: 115,
      },
    ],
  },
  work_motivation: {
    key: "work_motivation",
    title: "Motivação no trabalho",
    badge: "Pergaminho da Chama Interior • Propósito & Energia",
    icon: "🔥",
    intro: "O que faz seu espírito queimar mais forte toda manhã antes de erguer seu equipamento para a jornada diária?",
    question: "Qual dessas recompensas realmente recarrega sua mana no final do dia?",
    options: [
      {
        label: "Propósito & Impacto",
        description: "Saber que o meu esforço transformou positivamente a vida de pessoas e da comunidade.",
        styleResult: "Movido por Propósito & Significado 💫",
        xp: 120,
      },
      {
        label: "Autonomia & Desafio",
        description: "Ter liberdade criativa para desbravar problemas difíceis sem amarras burocráticas.",
        styleResult: "Movido por Autonomia & Maestria 🦅",
        xp: 120,
      },
      {
        label: "Reconhecimento & Conquista",
        description: "Ver marcos concretos alcançados, métricas superadas e o reconhecimento do time.",
        styleResult: "Movido por Conquista & Resultados 🏆",
        xp: 110,
      },
    ],
  },
  creativity: {
    key: "creativity",
    title: "Criatividade",
    badge: "Pergaminho da Faísca Mágica • Inovação & Pensamento",
    icon: "💡",
    intro: "Criatividade é ver o que todos viram e pensar o que ninguém ainda pensou. É conjurar novos mundos a partir do nada!",
    question: "Diante de um problema que os métodos tradicionais falharam em resolver, como sua mente age?",
    options: [
      {
        label: "Inovador Disruptivo",
        description: "Questiono premissas fundamentais e combino ideias de áreas totalmente improváveis.",
        styleResult: "Estilo Disruptivo & Não-Linear 🌀",
        xp: 125,
      },
      {
        label: "Experimentador Ágil",
        description: "Gero protótipos rápidos e hipóteses pequenas para aprender com o feedback real no mundo.",
        styleResult: "Estilo Pragmático & Maker 🔨",
        xp: 120,
      },
      {
        label: "Sintetizador Criativo",
        description: "Identifico padrões ocultos e conecto os melhores fragmentos de ideias em uma nova síntese genial.",
        styleResult: "Estilo Conectivo & Alquimista 🧪",
        xp: 115,
      },
    ],
  },
};

