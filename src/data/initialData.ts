import { Memory, FamilyMember, DeliverySchedule, LifePrinciple } from '../types/eternal';

export const INITIAL_MEMORIES: Memory[] = [
  {
    id: 'mem-1',
    title: 'Para cuando sientas que el mundo te exige certezas',
    memoryType: 'voz',
    category: 'audio',
    recipient: 'Sofía',
    recipientRelation: 'Hija menor',
    dateCreated: '14 Oct 2024',
    releaseCondition: 'Al cumplir 25 años o ante su graduación',
    releaseDate: '18 Mar 2032',
    duration: '04:18',
    status: 'Cifrado',
    compatibility: { mobile: true, glasses: true },
    preview: 'Hija mía, la duda no es enemiga de la valentía; es su compañera de viaje. No elijas el camino que impresione a extraños, elige aquel donde tu corazón mantenga su paz...',
    fullContent: `Mi querida Sofía,

Si estás escuchando o leyendo estas líneas, es muy probable que te encuentres frente a una encrucijada y sientas que el mundo entero te exige certezas que aún no tienes. Quiero que respires hondo y recuerdes algo que aprendí tarde: la duda no es enemiga de la valentía, es su compañera de viaje.

Cuando yo tenía veinticinco años, pensé que había fracasado irremediablemente al perder mi primer taller. Pasé noches enteras despierto creyendo que había decepcionado a tus abuelos. Pero de esa grieta brotó la verdadera templanza que luego me permitió construir nuestro hogar y darte todo el amor que mereces.

No elijas el camino que impresione a extraños; elige aquel donde tu curiosidad no se apague y donde puedas mirarte al espejo al final del día en paz. Eres más fuerte de lo que imaginas y llevas en tu mirada la misma determinación con la que tu bisabuela cruzó un océano.

Camina sin prisa, pero sin miedo. Siempre estaré orgulloso de ti, no por lo que acumules, sino por la nobleza con la que trates a los demás.

Con todo mi amor infinito,
Papá.`,
    tags: ['Consejo', 'Vocación', 'Paternidad'],
    isLocked: true,
    securityLevel: 'Fecha Fija',
    hasVoiceNote: true,
    audioDuration: '04:18',
  },
  {
    id: 'mem-2',
    title: 'Cincuenta otoños de complicidad y gratitud',
    memoryType: 'carta',
    category: 'cartas',
    recipient: 'Mamá',
    recipientRelation: 'Esposa y compañera de vida',
    dateCreated: '20 Sep 2024',
    releaseCondition: 'Custodia inmediata y custodia testamentaria',
    duration: '3 min de lectura',
    status: 'Cifrado',
    compatibility: { mobile: true, glasses: true },
    preview: 'Elena, fuiste la calma en cada tempestad. Si este cuerpo se apaga antes, búscame en los árboles que plantamos juntos y en la risa cómplice de nuestros hijos...',
    fullContent: `Elena mía,

Dicen que el amor maduro es una quietud serena. Para mí ha sido el milagro cotidiano más asombroso de mi existencia. Mirar hacia atrás y ver cincuenta años compartidos, ver crecer las manos de nuestros hijos y luego las arrugas cómplices alrededor de tus ojos, es la certeza de que nada de mi vida fue en vano.

Gracias por sostenerme cuando yo flaqueaba, por tu risa que desarmaba mis peores días de trabajo, por el perdón que siempre estuvo dispuesto antes del orgullo.

No llores con desolación cuando este cuerpo ya no esté. Búscame en los árboles que plantamos en el jardín de la casa de campo, en el acorde favorito de la guitarra y en el brillo de Sofía, Carlos y Lucía. Estaré allí, amándote en silencio pero con la misma fuerza del primer día en la plaza.

Tuyo para siempre,
Enrique.`,
    tags: ['Amor Eterno', 'Matrimonio', 'Gratitud'],
    isLocked: true,
    securityLevel: 'Alta Custodia',
  },
  {
    id: 'mem-3',
    title: 'El valor de la palabra empeñada y el honor en el trabajo',
    memoryType: 'video',
    category: 'video',
    recipient: 'Carlos',
    recipientRelation: 'Hijo mayor',
    dateCreated: '08 Ene 2025',
    releaseCondition: 'Día de su enlace o inauguración de su proyecto',
    releaseDate: 'Hito Familiar',
    duration: '05:32',
    status: 'Cifrado',
    compatibility: { mobile: true, glasses: true },
    videoThumbnail: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
    preview: 'Carlos, la verdadera riqueza no cabe en una cuenta de banco: descansa en mirar a tus trabajadores a los ojos y saber que nunca faltaste a tu palabra...',
    fullContent: `Carlos, hijo mío:

Hoy miro el hombre en quien te has convertido con un orgullo sereno y hondo. Durante años me viste llegar tarde a casa con el polvo del taller en la chaqueta y las manos curtidas por el esfuerzo.

Quiero dejarte en este video tres verdades que me salvaron la vida cada vez que el negocio flaqueó:
1. Tu firma no vale más que tu palabra. Si prometes algo con un apretón de manos, cúmplelo aunque te cueste dinero.
2. Cuida a los que trabajan a tu lado; su esfuerzo es el que levanta tu techo.
3. El éxito sin honradez es solo una máscara vacía que se cae al primer viento.

Que este testimonio te recuerde siempre de dónde vienes. Estoy a tu lado en cada decisión difícil.`,
    videoDuration: '05:32',
    tags: ['Ética', 'Trabajo', 'Hijo'],
    isLocked: true,
    securityLevel: 'Doble Llave',
    hasVoiceNote: true,
  },
  {
    id: 'mem-4',
    title: 'El secreto de la salsa de los domingos y tu risa de niña',
    memoryType: 'voz',
    category: 'audio',
    recipient: 'Lucía',
    recipientRelation: 'Hija',
    dateCreated: '02 Dic 2024',
    releaseCondition: 'Apertura en la primera Nochebuena o boda',
    releaseDate: 'Hito Familiar',
    duration: '06:45',
    status: 'Cifrado',
    compatibility: { mobile: true, glasses: true },
    preview: 'Lucía querida, grabé esto mientras la salsa hervía a fuego lento. Cuando cocines para tu propia familia, recuerda que el ingrediente sagrado siempre fue no tener prisa...',
    fullContent: `[Registro de audio de alta fidelidad resguardado con transcripción fidedigna]

"Lucía, mi niña de ojos curiosos:
Quise grabar esto un domingo cualquiera, cuando la casa olía a pan horneado y café recién colado. Quiero que cierres los ojos y recuerdes que la felicidad nunca estuvo en los grandes aspavientos, sino en sentarnos alrededor de esta mesa de roble, discutir con cariño, pasarnos la sal y saborear la salsa con el secreto que mi madre me enseñó: nunca apresurar el fuego, esperar a que el laurel suelte su perfume despacio.

Cuando cocines para tus propios hijos, háganlo con paciencia. Y si algún día sientes nostalgia, preparen este mismo plato; en cada aroma estaré acompañándolos como siempre."`,
    audioDuration: '06:45',
    tags: ['Voz', 'Tradición', 'Familia'],
    isLocked: true,
    securityLevel: 'Doble Llave',
    hasVoiceNote: true,
  },
  {
    id: 'mem-5',
    title: 'Palabras para el umbral de tu independencia',
    memoryType: 'video',
    category: 'video',
    recipient: 'Sofía',
    recipientRelation: 'Hija menor',
    dateCreated: '11 Nov 2024',
    releaseCondition: 'El día en que habites tu primer hogar propio',
    duration: '03:40',
    status: 'Cifrado',
    compatibility: { mobile: true, glasses: true },
    videoThumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80',
    preview: 'Sofía, te veo partir con la misma mirada inquieta con la que tu abuela cruzó el mar. No temas a las despedidas: las raíces fuertes alimentan las ramas más altas...',
    fullContent: `Sofía, pequeña sabia:

Hoy cierras una puerta y abres la de tu propio destino. Ver tus maletas hechas despierta en mí una mezcla agridulce: el vacío en el pasillo de casa, pero la certeza absoluta de que tus alas están listas para el vuelo.

Tu primer hogar no lo definirán los muebles ni las paredes, sino la paz que respires al cerrar el cerrojo por las noches. Rodéate de personas nobles, deja entrar la luz del sol en tus mañanas y no olvides llamarme los domingos. La casa de tus padres siempre tendrá una silla reservada con tu nombre.`,
    videoDuration: '03:40',
    tags: ['Independencia', 'Vuelo', 'Amor Paternal'],
    isLocked: true,
    securityLevel: 'Fecha Fija',
    hasVoiceNote: true,
  },
  {
    id: 'mem-6',
    title: 'La memoria de nuestros orígenes y la fuerza de la sangre',
    memoryType: 'carta',
    category: 'cartas',
    recipient: 'Carlos y Lucía',
    recipientRelation: 'Hijos y descendientes',
    dateCreated: '30 Oct 2024',
    releaseCondition: 'Bóveda Permanente de la Familia Morales',
    duration: '4 min de lectura',
    status: 'Cifrado',
    compatibility: { mobile: true, glasses: true },
    preview: 'Hijos míos, antes de nosotros hubo hombres y mujeres que resistieron con dignidad inviernos enteros para que hoy ustedes florezcan en libertad. Honren su historia...',
    fullContent: `A Carlos, Lucía y a los que continuarán este apellido:

Durante mi vida administré bienes, fundé proyectos y vi a muchos perder el norte. Les escribo para recordarles de dónde venimos: de abuelos labradores que no tenían más riqueza que la honradez y la palabra firme.

Nunca permitan que la soberbia les nuble el juicio ni que la prisa les robe la compasión. La verdadera fuerza de nuestra sangre no está en las victorias fáciles, sino en la calma con la que aprendimos a resistir las tormentas sin quebrar los principios.

Lleven la frente en alto y cuídense los unos a los otros, porque el verdadero tesoro es el abrazo de los hermanos.`,
    tags: ['Legado', 'Orígenes', 'Familia'],
    isLocked: true,
    securityLevel: 'Alta Custodia',
  }
];

export const INITIAL_FAMILY: FamilyMember[] = [
  {
    id: 'fam-1',
    name: 'Sofia',
    relation: 'Hija',
    email: 'sofia@legado-familiar.org',
    phone: '+34 677 319 044',
    isCustodian: false,
    assignedMemoriesCount: 5,
    status: 'Activo',
    avatarInitials: 'S',
    avatarColor: '#E8D5C4',
    note: 'Destinataria de consejos vocacionales y memorias de infancia.'
  },
  {
    id: 'fam-2',
    name: 'Mama',
    relation: 'Madre',
    email: 'mama@legado-familiar.org',
    phone: '+34 612 884 102',
    isCustodian: true,
    custodianRole: 'Albacea Digital',
    assignedMemoriesCount: 3,
    status: 'Verificado',
    avatarInitials: 'M',
    avatarColor: '#D4AF37',
    note: 'Custodia de las cartas familiares y recetas ancestrales.'
  },
  {
    id: 'fam-3',
    name: 'Carlos',
    relation: 'Hermano',
    email: 'carlos@legado-familiar.org',
    phone: '+34 633 491 802',
    isCustodian: true,
    custodianRole: 'Custodio Primario',
    assignedMemoriesCount: 2,
    status: 'Verificado',
    avatarInitials: 'C',
    avatarColor: '#9BB5CE',
    note: 'Custodio de los principios sobre el trabajo y la palabra empeñada.'
  },
  {
    id: 'fam-4',
    name: 'Lucia',
    relation: 'Esposa',
    email: 'lucia@legado-familiar.org',
    phone: '+34 655 204 118',
    isCustodian: true,
    custodianRole: 'Albacea Digital',
    assignedMemoriesCount: 4,
    status: 'Activo',
    avatarInitials: 'L',
    avatarColor: '#C9ADA7',
    note: 'Compañera de vida, destinataria de testimonios íntimos.'
  }
];

export const INITIAL_DELIVERIES: DeliverySchedule[] = [
  {
    id: 'del-1',
    memoryId: 'mem-1',
    memoryTitle: 'Para cuando sientas que el mundo te exige certezas',
    recipientName: 'Sofía',
    relation: 'Hija menor',
    triggerType: 'fecha',
    triggerLabel: '25º Aniversario de Vida (18 de Marzo, 2032)',
    scheduledYear: 2032,
    scheduledDateFormatted: '18 Mar 2032',
    status: 'Programada',
    custodiansRequired: 1,
    custodiansConfirmed: 1,
  },
  {
    id: 'del-2',
    memoryId: 'mem-3',
    memoryTitle: 'El valor de la palabra empeñada y el honor en el trabajo',
    recipientName: 'Carlos',
    relation: 'Hijo mayor',
    triggerType: 'hito',
    triggerLabel: 'Enlace Matrimonial o Hito Empresarial de Carlos',
    scheduledYear: 2028,
    scheduledDateFormatted: 'Al certificar hito',
    status: 'En espera de hito',
    custodiansRequired: 2,
    custodiansConfirmed: 1,
  },
  {
    id: 'del-3',
    memoryId: 'mem-4',
    memoryTitle: 'El secreto de la salsa de los domingos y tu risa de niña',
    recipientName: 'Lucía',
    relation: 'Hija',
    triggerType: 'custodia_dual',
    triggerLabel: 'Protocolo de Trascendencia (Doble confirmación)',
    scheduledYear: 2035,
    scheduledDateFormatted: 'Protocolo de Apertura',
    status: 'Programada',
    custodiansRequired: 2,
    custodiansConfirmed: 2,
  },
  {
    id: 'del-4',
    memoryId: 'mem-2',
    memoryTitle: 'Cincuenta otoños de complicidad y gratitud',
    recipientName: 'Mamá',
    relation: 'Esposa',
    triggerType: 'latido_inactividad',
    triggerLabel: 'Custodia Notarial Inmediata',
    scheduledYear: 2026,
    scheduledDateFormatted: 'Vigencia activa',
    status: 'Programada',
    custodiansRequired: 2,
    custodiansConfirmed: 2,
  }
];

export const INITIAL_PRINCIPLES: LifePrinciple[] = [
  {
    id: 'p-1',
    category: 'Amor & Familia',
    quote: 'El perdón no es debilidad; es la única llave que desarma el orgullo antes de que destruya lo sagrado.',
    context: 'Reflexión compartida tras 30 años de matrimonio con Elena.'
  },
  {
    id: 'p-2',
    category: 'Trabajo & Esfuerzo',
    quote: 'El trabajo bien hecho en silencio produce un eco más duradero que la vanidad más estridente.',
    context: 'Enseñanza compartida con Carlos y Lucía durante la construcción del taller familiar.'
  },
  {
    id: 'p-3',
    category: 'Dificultades',
    quote: 'Cuando la noche sea más oscura, no corras a ciegas. Espera la luz del amanecer con la mente serena.',
    context: 'Durante la crisis económica de 2008 cuando logramos mantener a todos los empleados.'
  },
  {
    id: 'p-4',
    category: 'Espiritualidad',
    quote: 'Trascender no es que tu nombre quede grabado en mármol, sino haber dejado paz en el corazón de los que te conocieron.',
    context: 'Conversación en la sobremesa con Sofía, Carlos, Lucía y Mamá.'
  }
];

export const PRESET_AVATAR_QUESTIONS = [
  'Papá, ¿qué debo hacer cuando me sienta fracasado o perdido?',
  '¿Cuál fue el momento más feliz que recuerdas de nuestra familia?',
  'Tengo dudas sobre dar un paso importante, ¿cómo supiste tú que Mamá era la indicada?',
  '¿Qué valores consideras irrenunciables para educar a mis futuros hijos?',
  '¿Qué consejo le darías a Sofía y a Lucía en momentos de incertidumbre?'
];

export const FUTURE_TIMELINE_SCENARIOS = [
  {
    id: 'scen-2032',
    year: 2032,
    title: '18 de Marzo, 2032 · Los 25 años de Sofía',
    summary: 'Apertura programada de la carta y audio confidencial para Sofía.',
    recipient: 'Sofía',
    cardSnippet: 'Sofía recibe la notificación en su dispositivo personal. La verificación criptográfica se valida y se revela la carta que su padre escribió ocho años atrás.',
    memoryRefId: 'mem-1'
  },
  {
    id: 'scen-2038',
    year: 2038,
    title: '12 de Octubre, 2038 · La boda de Carlos en el campo',
    summary: 'Activación por custodio dual para la reproducción del video y mensaje matrimonial.',
    recipient: 'Carlos',
    cardSnippet: 'Elena y Julián introducen sus llaves de custodia. En la víspera del enlace, Carlos escucha la voz de su padre aconsejándole sobre la paciencia cotidiana y el amor leal.',
    memoryRefId: 'mem-3'
  },
  {
    id: 'scen-2045',
    year: 2045,
    title: '24 de Diciembre, 2045 · Nochebuena de Lucía y la nueva generación',
    summary: 'La receta ancestral y la voz viva de las tardes de domingo.',
    recipient: 'Lucía y familia',
    cardSnippet: 'Lucía escucha la voz original de Enrique mientras prepara la salsa de la abuela, con la textura y los sonidos del hogar de antaño intactos.',
    memoryRefId: 'mem-4'
  },
  {
    id: 'scen-2055',
    year: 2055,
    title: '15 de Mayo, 2055 · Consulta con el Avatar Consciente',
    summary: 'Una nieta de Lucía conversa con la memoria y valores de Enrique en busca de consejo.',
    recipient: 'Descendientes Morales',
    cardSnippet: 'Guiada por sus escritos y principios de honor y perseverancia, el Avatar de Sabiduría responde con calidez, cercanía y respeto a las dudas de la nueva generación.',
    memoryRefId: 'mem-6'
  }
];
