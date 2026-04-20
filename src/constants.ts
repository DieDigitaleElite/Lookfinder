
export const HAIRSTYLE_CATEGORIES = [
  { id: 'short', name: 'Kurzhaar', gender: 'female' },
  { id: 'medium', name: 'Medium', gender: 'female' },
  { id: 'long', name: 'Langhaar', gender: 'female' },
  { id: 'trends', name: 'Trends', gender: 'female' },
  { id: 'men', name: 'Männer Styles', gender: 'male' },
];

export const HAIRSTYLE_LIBRARY = [
  // Short
  { id: 'lib-1', name: 'Pixie Cut', category: 'short', description: 'Ein frecher, sehr kurzer Haarschnitt mit Struktur.' },
  { id: 'lib-2', name: 'Bixie Cut', category: 'short', description: 'Mischung aus Bob und Pixie, perfekt für feines Haar.' },
  { id: 'lib-3', name: 'Buzz Cut', category: 'short', description: 'Minimalistisch und markant, betont die Gesichtszüge.' },
  { id: 'lib-4', name: 'French Girl Bob', category: 'short', description: 'Kürzerer Bob mit leichtem Pony, sehr chic und effortless.' },
  { id: 'lib-17', name: 'Boyish Pixie', category: 'short', description: 'Eleganter, kurzer Schnitt mit längerem Deckhaar.' },

  // Medium
  { id: 'lib-5', name: 'Classic Bob', category: 'medium', description: 'Ein zeitloser, kinnlanger Schnitt für klare Konturen.' },
  { id: 'lib-6', name: 'Italian Bob', category: 'medium', description: 'Ein voluminöser, stumpf geschnittener Bob mit viel Sprungkraft.' },
  { id: 'lib-7', name: 'Lob (Long Bob)', category: 'medium', description: 'Schulterlanger Bob, vielseitig und schmeichelhaft.' },
  { id: 'lib-8', name: 'Shag Cut', category: 'medium', description: 'Stufiger Look mit Retro-Vibe und viel Textur.' },
  { id: 'lib-18', name: 'Midi-Layers', category: 'medium', description: 'Sanft gestuftes, mittellanges Haar für natürliche Bewegung.' },

  // Long
  { id: 'lib-9', name: 'Beach Waves', category: 'long', description: 'Lässige, lockere Wellen für einen entspannten Sommer-Look.' },
  { id: 'lib-10', name: 'Hollywood Glam', category: 'long', description: 'Elegante, große Wellen für einen luxuriösen Auftritt.' },
  { id: 'lib-11', name: 'Butterfly Cut', category: 'long', description: 'Starker Lagen-Schnitt, der wie Flügel das Gesicht umrahmt.' },
  { id: 'lib-12', name: 'XXL Straight', category: 'long', description: 'Ultra-langes, glattes Haar für einen modernen Sleek-Look.' },
  { id: 'lib-19', name: 'Silky Curls', category: 'long', description: 'Definierte, seidige Locken mit viel Sprungkraft.' },

  // Trends
  { id: 'lib-13', name: 'Wolf Cut', category: 'trends', description: 'Wilde Mischung aus Mullet und Shag, sehr trendy.' },
  { id: 'lib-14', name: 'Wispy Bangs', category: 'trends', description: 'Zarter, luftiger Pony, der jedem Schnitt Frische verleiht.' },
  { id: 'lib-15', name: 'Glass Hair', category: 'trends', description: 'Extrem glänzendes, perfekt geschnittenes Haar wie aus Glas.' },
  { id: 'lib-16', name: 'Bottleneck Bangs', category: 'trends', description: 'Kürzer in der Mitte, länger an den Seiten – der It-Pony.' },

  // Men
  { id: 'lib-m1', name: 'Classic Fade', category: 'men', description: 'Kurze Seiten mit sanftem Übergang zum längeren Deckhaar.' },
  { id: 'lib-m2', name: 'Modern Quiff', category: 'men', description: 'Voluminös hochgestyltes Deckhaar für einen markanten Look.' },
  { id: 'lib-m3', name: 'Buzz Cut Fade', category: 'men', description: 'Sehr kurzer, präziser Schnitt mit harten Konturen.' },
  { id: 'lib-m4', name: 'Textured Crop', category: 'men', description: 'Kurzes, texturiertes Deckhaar mit viel Definition.' },
  { id: 'lib-m5', name: 'Long Flow', category: 'men', description: 'Lässiges, mittellanges Männerhaar mit natürlichem Schwung.' },
];

export const COLOR_WORLDS = [
  { id: 'blond', name: 'Blond', description: 'Von kühlem Platin bis warmem Gold.' },
  { id: 'braun', name: 'Braun', description: 'Tiefe Schokoladen- und Kastanientöne.' },
  { id: 'fantasy', name: 'Fantasy', description: 'Gewagte Pastell- und Leuchtfarben.' },
  { id: 'dark', name: 'Dark/Classic', description: 'Zeitloses Schwarz und dunkle Nuancen.' },
];

export const HAIR_COLORS = [
  // Blond
  { id: 'col-1', name: 'Platinblond', hex: '#E5E4E2', world: 'blond', description: 'Sehr kühles, fast weißes Blond.' },
  { id: 'col-2', name: 'Honigblond', hex: '#D4AF37', world: 'blond', description: 'Warmes, goldenes Blond mit Glanz.' },
  { id: 'col-6', name: 'Aschblond', hex: '#B2BEB5', world: 'blond', description: 'Kühles Blond ohne Gelbstich.' },
  { id: 'col-7', name: 'Butterblond', hex: '#FDF5E6', world: 'blond', description: 'Cremiges, weiches Blond.' },

  // Braun
  { id: 'col-4', name: 'Schokobraun', hex: '#3D2B1F', world: 'braun', description: 'Sattes, dunkles Braun.' },
  { id: 'col-8', name: 'Kastanienbraun', hex: '#8B4513', world: 'braun', description: 'Warmes Braun mit rötlichen Reflexen.' },
  { id: 'col-3', name: 'Kupferrot', hex: '#B87333', world: 'braun', description: 'Vibrantes, warmes Kupferbraun.' },
  { id: 'col-11', name: 'Karamell', hex: '#AF6E4D', world: 'braun', description: 'Helles, schmeichelhaftes Braun.' },

  // Fantasy
  { id: 'col-9', name: 'Pastellrosa', hex: '#FFD1DC', world: 'fantasy', description: 'Zartes, romantisches Rosa.' },
  { id: 'col-12', name: 'Lavendel', hex: '#E6E6FA', world: 'fantasy', description: 'Kühles, modernes Lila.' },
  { id: 'col-13', name: 'Midnight Blue', hex: '#191970', world: 'fantasy', description: 'Tiefes, geheimnisvolles Blau.' },
  { id: 'col-14', name: 'Peach Fuzz', hex: '#FFBE98', world: 'fantasy', description: 'Warmer, trendiger Pfirsichton.' },

  // Dark/Classic
  { id: 'col-5', name: 'Tiefschwarz', hex: '#000000', world: 'dark', description: 'Intensives, glänzendes Schwarz.' },
  { id: 'col-10', name: 'Silber', hex: '#C0C0C0', world: 'dark', description: 'Edles Grau/Silber.' },
  { id: 'col-15', name: 'Blauschwarz', hex: '#000033', world: 'dark', description: 'Schwarz mit kühlem Schimmer.' },
];

export const LIGHTING_SIMULATIONS = [
  { id: 'daylight', name: 'Tageslicht', prompt: 'in natural bright daylight, sun illuminating hair' },
  { id: 'studio', name: 'Studio-Licht', prompt: 'under professional soft studio lighting with rim light' },
  { id: 'evening', name: 'Abendlicht', prompt: 'in warm golden hour evening light, cinematic atmosphere' },
  { id: 'salon', name: 'Frisch vom Friseur', prompt: 'salon environment background, perfectly blow-dried, extra shine' },
  { id: 'messy', name: 'Messy Look', prompt: 'tousled textured hair, casual environment, realistic imperfections' },
];
