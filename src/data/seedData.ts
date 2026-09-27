import { Person, DbMemory, MediaAsset, MemoryPerson } from '../types/eternal';

// ==============================================================================
// SEED DATA PARA DEMO / DESARROLLO E-TERNAL
// ==============================================================================

export const SEED_PEOPLE: Person[] = [
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    user_id: null,
    first_name: 'Enrique',
    last_name: 'Morales',
    display_name: 'Enrique Morales',
    birth_date: '1952-04-12',
    death_date: null,
    profile_photo_url: null,
    bio: 'Padre de familia, amante de la carpintería fina y las sobremesas con café recién hecho.',
    status: 'active',
    created_at: '2024-01-10T12:00:00Z',
    updated_at: '2024-01-10T12:00:00Z',
  },
  {
    id: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    user_id: null,
    first_name: 'Sofía',
    last_name: 'Morales',
    display_name: 'Sofía Morales',
    birth_date: '2017-03-12',
    death_date: null,
    profile_photo_url: null,
    bio: 'Hija menor. Curiosa, apasionada por la música y la astronomía.',
    status: 'active',
    created_at: '2024-01-10T12:00:00Z',
    updated_at: '2024-01-10T12:00:00Z',
  },
  {
    id: 'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e',
    user_id: null,
    first_name: 'Elena',
    last_name: 'Gómez',
    display_name: 'Elena Gómez',
    birth_date: '1954-08-22',
    death_date: null,
    profile_photo_url: null,
    bio: 'Esposa y compañera de vida. Pilar emocional de la familia Morales.',
    status: 'active',
    created_at: '2024-01-10T12:00:00Z',
    updated_at: '2024-01-10T12:00:00Z',
  },
  {
    id: 'c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f',
    user_id: null,
    first_name: 'Carlos',
    last_name: 'Morales',
    display_name: 'Carlos Morales',
    birth_date: '1982-11-05',
    death_date: null,
    profile_photo_url: null,
    bio: 'Hijo mayor. Ingeniero, perseverante y leal a sus principios.',
    status: 'active',
    created_at: '2024-01-10T12:00:00Z',
    updated_at: '2024-01-10T12:00:00Z',
  },
  {
    id: 'd4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a',
    user_id: null,
    first_name: 'Lucía',
    last_name: 'Morales',
    display_name: 'Lucía Morales',
    birth_date: '1987-06-14',
    death_date: null,
    profile_photo_url: null,
    bio: 'Hija y albacea digital. Sensible y protectora de la memoria familiar.',
    status: 'active',
    created_at: '2024-01-10T12:00:00Z',
    updated_at: '2024-01-10T12:00:00Z',
  },
];

export const SEED_MEMORIES: DbMemory[] = [
  {
    id: 'e1f2a3b4-c5d6-4e7f-8a9b-0c1d2e3f4a5b',
    person_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', // Enrique
    title: 'Para cuando sientas que el mundo te exige certezas',
    description: 'Reflexión íntima para Sofía sobre la duda, la vocación y el valor de equivocarse con dignidad.',
    content: `Mi querida Sofía,

Si estás escuchando o leyendo estas líneas, es muy probable que te encuentres frente a una encrucijada y sientas que el mundo entero te exige certezas que aún no tienes. Quiero que respires hondo y recuerdes algo que aprendí tarde: la duda no es enemiga de la valentía, es su compañera de viaje.

Cuando yo tenía veinticinco años, pensé que había fracasado irremediablemente al perder mi primer taller. Pasé noches enteras despierto creyendo que había decepcionado a tus abuelos. Pero de esa grieta brotó la verdadera templanza que luego me permitió construir nuestro hogar y darte todo el amor que mereces.

No elijas el camino que impresione a extraños; elige aquel donde tu curiosidad no se apague y donde puedas mirarte al espejo al final del día en paz. Eres más fuerte de lo que imaginas y llevas en tu mirada la misma determinación con la que tu bisabuela cruzó un océano.

Camina sin prisa, pero sin miedo. Siempre estaré orgulloso de ti, no por lo que acumules, sino por la nobleza con la que trates a los demás.

Con todo mi amor infinito,
Papá.`,
    memory_type: 'voice',
    category: 'advice',
    event_date: '2024-10-14',
    location: 'Salamanca, España',
    importance: 'critical',
    status: 'ready',
    is_locked: true,
    created_at: '2024-10-14T10:00:00Z',
    updated_at: '2024-10-14T10:00:00Z',
  },
  {
    id: 'f2a3b4c5-d6e7-4f8a-9b0c-1d2e3f4a5b6c',
    person_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', // Enrique
    title: 'Cincuenta otoños de complicidad y gratitud',
    description: 'Carta manuscrita a Elena con agradecimiento por cinco décadas de amor incondicional.',
    content: `Elena mía,

Dicen que el amor maduro es una quietud serena. Para mí ha sido el milagro cotidiano más asombroso de mi existencia. Mirar hacia atrás y ver cincuenta años compartidos, ver crecer las manos de nuestros hijos y luego las arrugas cómplices alrededor de tus ojos, es la certeza de que nada de mi vida fue en vano.

Gracias por sostenerme cuando yo flaqueaba, por tu risa que desarmaba mis peores días de trabajo, por el perdón que siempre estuvo dispuesto antes del orgullo.

No llores con desolación cuando este cuerpo ya no esté. Búscame en los árboles que plantamos en el jardín de la casa de campo, en el acorde favorito de la guitarra y en el brillo de Sofía, Carlos y Lucía. Estaré allí, amándote en silencio pero con la misma fuerza del primer día en la plaza.

Tuyo para siempre,
Enrique.`,
    memory_type: 'letter',
    category: 'love',
    event_date: '2024-09-20',
    location: 'Finca Los Olivos',
    importance: 'critical',
    status: 'ready',
    is_locked: true,
    created_at: '2024-09-20T16:30:00Z',
    updated_at: '2024-09-20T16:30:00Z',
  },
  {
    id: 'a3b4c5d6-e7f8-4a9b-0c1d-2e3f4a5b6c7d',
    person_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', // Enrique
    title: 'El valor de la palabra empeñada y el honor en el trabajo',
    description: 'Video testimonial para Carlos sobre honestidad, lealtad y el peso moral del apretón de manos.',
    content: `Carlos, hijo mío,

Te dejo esta grabación para que la guardes en el bolsillo del alma. Tu bisabuelo solía decirme que el patrimonio más valioso de un hombre no cabe en una caja fuerte: es el peso de su palabra empeñada.

A lo largo de tus proyectos, verás que la prisa invita a tomar atajos y que muchos justifican la deslealtad diciendo que son meros negocios. No caigas en esa trampa. Cumple siempre lo que pactes, aún cuando descubras que te cuesta más de lo previsto.

Trata a cada obrero, empleado y colega con la misma reverencia que tendrías con un maestro. La verdadera autoridad moral no se impone con gritos, se gana con rectitud y serenidad.

Te bendigo con todo mi orgullo de padre,
Enrique.`,
    memory_type: 'video',
    category: 'work',
    event_date: '2025-01-08',
    location: 'Taller de Restauración',
    importance: 'high',
    status: 'ready',
    is_locked: true,
    created_at: '2025-01-08T09:15:00Z',
    updated_at: '2025-01-08T09:15:00Z',
  },
  {
    id: 'b4c5d6e7-f8a9-4b0c-1d2e-3f4a5b6c7d8e',
    person_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', // Enrique
    title: 'La tarde que nos sorprendió la tormenta en el valle',
    description: 'Grabación acústica con el relato de la expedición familiar a los Picos de Europa.',
    content: `Lucía, familia entera,

Cada vez que huelo la tierra mojada después de la lluvia de verano, vuelvo a ver aquella furgoneta azul atascada en el barro en medio del valle de Valdeón.

Teníamos frío, las mantas estaban húmedas y la cena se redujo a una lata de sardinas y medio pan duro. Pero ¿recuerdan lo que pasó? Tu madre sacó las velas, Carlos empezó a cantar desafinando y nos reímos tanto que se nos olvidó la noche oscura.

Ese día aprendí que la felicidad familiar no depende del clima ni del destino planeado, sino de saber cantar bajo la lluvia con la gente que amas. No dejen que las prisas modernas les roben la capacidad de reírse de las tormentas.`,
    memory_type: 'voice',
    category: 'family',
    event_date: '2024-11-12',
    location: 'Picos de Europa',
    importance: 'normal',
    status: 'ready',
    is_locked: false,
    created_at: '2024-11-12T18:40:00Z',
    updated_at: '2024-11-12T18:40:00Z',
  },
];

export const SEED_MEMORY_PEOPLE: MemoryPerson[] = [
  {
    id: 'mp-1',
    memory_id: 'e1f2a3b4-c5d6-4e7f-8a9b-0c1d2e3f4a5b', // Para Sofía
    person_id: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', // Sofía
    relationship_context: 'Destinataria principal · Hija menor',
    created_at: '2024-10-14T10:00:00Z',
  },
  {
    id: 'mp-2',
    memory_id: 'f2a3b4c5-d6e7-4f8a-9b0c-1d2e3f4a5b6c', // Para Elena
    person_id: 'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e', // Elena
    relationship_context: 'Destinataria principal · Esposa',
    created_at: '2024-09-20T16:30:00Z',
  },
  {
    id: 'mp-3',
    memory_id: 'a3b4c5d6-e7f8-4a9b-0c1d-2e3f4a5b6c7d', // Para Carlos
    person_id: 'c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f', // Carlos
    relationship_context: 'Destinatario principal · Hijo mayor',
    created_at: '2025-01-08T09:15:00Z',
  },
  {
    id: 'mp-4',
    memory_id: 'b4c5d6e7-f8a9-4b0c-1d2e-3f4a5b6c7d8e', // Para Lucía y Familia
    person_id: 'd4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a', // Lucía
    relationship_context: 'Destinataria e integrante del viaje',
    created_at: '2024-11-12T18:40:00Z',
  },
  {
    id: 'mp-5',
    memory_id: 'b4c5d6e7-f8a9-4b0c-1d2e-3f4a5b6c7d8e', // También relacionada con Carlos
    person_id: 'c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f', // Carlos
    relationship_context: 'Integrante del viaje',
    created_at: '2024-11-12T18:40:00Z',
  },
];

export const SEED_MEDIA_ASSETS: MediaAsset[] = [
  {
    id: 'media-1',
    memory_id: 'e1f2a3b4-c5d6-4e7f-8a9b-0c1d2e3f4a5b',
    person_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    storage_path: 'people/f47ac10b-58cc-4372-a567-0e02b2c3d479/memories/e1f2a3b4-c5d6-4e7f-8a9b-0c1d2e3f4a5b/audio_master.mp3',
    public_url: null,
    media_type: 'audio',
    mime_type: 'audio/mpeg',
    file_size: 4210000,
    duration_seconds: 258,
    thumbnail_url: null,
    transcript: 'Hija mía, la duda no es enemiga de la valentía...',
    created_at: '2024-10-14T10:00:00Z',
  },
  {
    id: 'media-2',
    memory_id: 'a3b4c5d6-e7f8-4a9b-0c1d-2e3f4a5b6c7d',
    person_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    storage_path: 'people/f47ac10b-58cc-4372-a567-0e02b2c3d479/memories/a3b4c5d6-e7f8-4a9b-0c1d-2e3f4a5b6c7d/video_taller.mp4',
    public_url: null,
    media_type: 'video',
    mime_type: 'video/mp4',
    file_size: 45200000,
    duration_seconds: 145,
    thumbnail_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=800',
    transcript: 'Carlos, hijo mío, te dejo esta grabación para que la guardes en el bolsillo del alma...',
    created_at: '2025-01-08T09:15:00Z',
  },
];
