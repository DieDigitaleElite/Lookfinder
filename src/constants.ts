
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
  { id: 'techniken', name: 'Farb-Techniken', description: 'Balayage, Ombré und mehr für Tiefe und Dimension.' },
];

export const HAIR_COLORS = [
  // Original / Natural
  { id: 'col-original', name: 'Ursprüngliche Haarfarbe beibehalten', hex: 'transparent', world: 'all', description: 'Deine natürliche Haarfarbe beibehalten.' },

  // Techniken
  { id: 'col-balayage', name: 'Balayage', hex: 'linear-gradient(to bottom, #3B2F2A, #D4AF37)', world: 'techniken', description: 'Handgemalte Highlights für einen natürlichen Sun-kissed Look mit weichen Übergängen.' },
  { id: 'col-babylights', name: 'Babylights', hex: '#F5F5DC', world: 'techniken', description: 'Extrem feine, zarte Highlights für eine subtile Aufhellung wie bei Kinderhaar.' },
  { id: 'col-straehnen', name: 'Klassische Strähnen', hex: '#EEDC82', world: 'techniken', description: 'Präzise Highlights vom Ansatz bis in die Spitzen für maximale Dimension.' },
  { id: 'col-foilayage', name: 'Foilayage', hex: 'linear-gradient(to bottom, #4A3728, #F0EAD6)', world: 'techniken', description: 'Kombination aus Balayage und Folientechnik für intensivere, hellere Kontraste.' },
  { id: 'col-airtouch', name: 'Airtouch', hex: '#FAF3E0', world: 'techniken', description: 'Hochmoderne Technik mit Föhn-Hilfe für nahtlose, extrem weiche Farbverläufe.' },
  { id: 'col-ombre', name: 'Ombré', hex: 'linear-gradient(to bottom, #2A1B0E, #9F7336)', world: 'techniken', description: 'Markanter Farbverlauf von dunklem Ansatz zu hellen Spitzen.' },

  // Blond
  // Kühle Blondtöne
  { id: 'col-platinblond', name: 'Platinblond', hex: '#F0EAD6', world: 'blond', tone: 'Kühle Blondtöne', description: 'Extrem helles, fast weißes Blond mit kühlem Unterton.' },
  { id: 'col-eisblond', name: 'Eisblond', hex: '#F4F4F4', world: 'blond', tone: 'Kühle Blondtöne', description: 'Kristallklares, sehr helles Blond mit silbrigem Glanz.' },
  { id: 'col-aschblond', name: 'Aschblond', hex: '#D1C7B7', world: 'blond', tone: 'Kühle Blondtöne', description: 'Kühler, neutraler Ton ohne Gelbstich.' },
  { id: 'col-silberblond', name: 'Silberblond', hex: '#C0C0C0', world: 'blond', tone: 'Kühle Blondtöne', description: 'Edler Metallic-Look mit kühlen Reflexen.' },
  { id: 'col-nordischblond', name: 'Nordischblond', hex: '#F8F8FF', world: 'blond', tone: 'Kühle Blondtöne', description: 'Natürliches, sehr helles Skandi-Blond.' },

  // Warme Blondtöne
  { id: 'col-goldblond', name: 'Goldblond', hex: '#FFD700', world: 'blond', tone: 'Warme Blondtöne', description: 'Sonniger Blondton mit warmen, goldenen Reflexen.' },
  { id: 'col-honigblond', name: 'Honigblond', hex: '#D4AF37', world: 'blond', tone: 'Warme Blondtöne', description: 'Warmes, dunkleres Blond mit viel Leuchtkraft.' },
  { id: 'col-karamellblond', name: 'Karamellblond', hex: '#9F7336', world: 'blond', tone: 'Warme Blondtöne', description: 'Tieferer, warmer Ton mit karamelligen Nuancen.' },
  { id: 'col-erdbeerblond', name: 'Erdbeerblond', hex: '#FF8C69', world: 'blond', tone: 'Warme Blondtöne', description: 'Helles Blond mit einem Hauch von Kupfer und Rosé.' },
  { id: 'col-kupferblond', name: 'Kupferblond', hex: '#CD7F32', world: 'blond', tone: 'Warme Blondtöne', description: 'Lebendiger Mix aus Blond und warmem Kupfer.' },

  // Neutrale/Natürliche Töne
  { id: 'col-dunkelblond', name: 'Dunkelblond', hex: '#7D6E5D', world: 'blond', tone: 'Neutrale/Natürliche Töne', description: 'Natürlicher Übergangston zwischen Blond und Hellbraun.' },
  { id: 'col-mittelblond', name: 'Mittelblond', hex: '#B5A691', world: 'blond', tone: 'Neutrale/Natürliche Töne', description: 'Der klassische, ausgewogene Blondton.' },
  { id: 'col-lichtblond', name: 'Lichtblond', hex: '#EEDC82', world: 'blond', tone: 'Neutrale/Natürliche Töne', description: 'Helles, strahlendes Naturblond.' },
  { id: 'col-beigeblond', name: 'Beige-Blond', hex: '#F5F5DC', world: 'blond', tone: 'Neutrale/Natürliche Töne', description: 'Sanfter, cremiger Sandton für einen soften Look.' },
  { id: 'col-vanilleblond', name: 'Vanilleblond', hex: '#F3E5AB', world: 'blond', tone: 'Neutrale/Natürliche Töne', description: 'Zarter, heller Gelb-Ocker für ein frisches Finish.' },
  { id: 'col-sandblond', name: 'Sandblond', hex: '#E3DAC9', world: 'blond', tone: 'Neutrale/Natürliche Töne', description: 'Matter Naturton, der an Meersand erinnert.' },

  // Braun
  { id: 'col-4', name: 'Schokobraun', hex: '#3B2F2A', world: 'braun', description: 'Ein tiefes, sattes Braun mit kühler Note.' },
  { id: 'col-goldbraun', name: 'Goldbraun', hex: '#996515', world: 'braun', description: 'Ein schimmerndes, warmes Braun mit goldenen Reflexen.' },
  { id: 'col-haselnuss', name: 'Haselnuss', hex: '#8E5E31', world: 'braun', description: 'Ein klassisches Mittelbraun, angelehnt an die natürliche Haselnuss.' },
  { id: 'col-aschbraun', name: 'Aschbraun', hex: '#6B5B51', world: 'braun', description: 'Ein kühler Braunton ohne jegliche Rot- oder Goldanteile.' },
  { id: 'col-8', name: 'Kastanienbraun', hex: '#633A2E', world: 'braun', description: 'Dunkles Braun mit lebendig warmen Reflexen.' },
  { id: 'col-3', name: 'Kupferrot', hex: '#8B4513', world: 'braun', description: 'Ein natürliches, warmes Braun mit rötlichem Schimmer.' },
  { id: 'col-11', name: 'Karamell', hex: '#9F7336', world: 'braun', description: 'Hellerer Braunton mit goldenem Glanz.' },

  // Fantasy
  { id: 'col-9', name: 'Pastellrosa', hex: '#FFD1DC', world: 'fantasy', description: 'Zartes, romantisches Rosa für verspielte Akzente.' },
  { id: 'col-12', name: 'Lavendel', hex: '#E6E6FA', world: 'fantasy', description: 'Kühles, modernes Lila mit rauchigem Finish.' },
  { id: 'col-13', name: 'Midnight Blue', hex: '#191970', world: 'fantasy', description: 'Tiefes, geheimnisvolles Blau für Mutige.' },
  { id: 'col-14', name: 'Peach Fuzz', hex: '#FFBE98', world: 'fantasy', description: 'Warmes, trendiges Pfirsichrosa.' },

  // Dark/Classic
  { id: 'col-5', name: 'Tiefschwarz', hex: '#1A1A1B', world: 'dark', description: 'Intensives, beinahe schwarzes Ebenholz.' },
  { id: 'col-10', name: 'Silber', hex: '#C0C0C0', world: 'dark', description: 'Klares, glänzendes Platin-Grau.' },
  { id: 'col-15', name: 'Blauschwarz', hex: '#121223', world: 'dark', description: 'Tiefstes Schwarz mit einem Hauch von Mitternachtsblau.' },
];

export const LIGHTING_SIMULATIONS = [
  { id: 'daylight', name: 'Tageslicht', prompt: 'in natural bright daylight, sun illuminating hair' },
  { id: 'studio', name: 'Studio-Licht', prompt: 'under professional soft studio lighting with rim light' },
  { id: 'evening', name: 'Abendlicht', prompt: 'in warm golden hour evening light, cinematic atmosphere' },
  { id: 'salon', name: 'Frisch vom Friseur', prompt: 'salon environment background, perfectly blow-dried, extra shine' },
  { id: 'messy', name: 'Messy Look', prompt: 'tousled textured hair, casual environment, realistic imperfections' },
];
