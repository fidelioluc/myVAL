// Categorized German word lists for Codenames Duet

export const CATEGORIES: Record<string, { label: string; words: string[] }> = {
  abenteuer: {
    label: "Abenteuer & Action",
    words: [
      "Schatten", "Wirbel", "Chiffre", "Phantom", "Nebel", "Rabe", "Gletscher", "Donner", "Illusion", "Obsidian",
      "Flamme", "Gespenst", "Titan", "Finsternis", "Nomade", "Falke", "Gipfel", "Drift", "Onyx", "Chaos",
      "Geist", "Zenit", "Puls", "Glut", "Frost", "Gift", "Horizont", "Sturm", "Kobalt", "Abgrund",
      "Purpur", "Dolch", "Luchs", "Prisma", "Blitz", "Tarnung", "Kaskade", "Raptor", "Zobel", "Strom",
      "Quecksilber", "Pirsch", "Inferno", "Quarz", "Woge", "Bandit", "Orakel", "Magnet", "Späher", "Neon",
      "Anker", "Axt", "Bogen", "Burg", "Dampf", "Drache", "Echo", "Eisen", "Falle", "Fels",
      "Feuer", "Funke", "Helm", "Jäger", "Klinge", "Krieger", "Lasso", "Lawine", "Panzer", "Pirat",
      "Rakete", "Ritter", "Schwert", "Schild", "Spur", "Vulkan", "Wüste", "Festung", "Fährte", "Galgen",
      "Hinterhalt", "Kavallerie", "Lanze", "Marsch", "Patrouille", "Söldner", "Überfall", "Wachturm", "Zuflucht", "Arsenal",
    ],
  },

  tiere: {
    label: "Tiere & Natur",
    words: [
      "Adler", "Ameise", "Bär", "Biber", "Chamäleon", "Dachs", "Delfin", "Eichhörnchen", "Elefant", "Ente",
      "Eule", "Falke", "Flamingo", "Fledermaus", "Forelle", "Frosch", "Fuchs", "Gans", "Gecko", "Gepard",
      "Gorilla", "Hai", "Hamster", "Hase", "Hecht", "Hirsch", "Hund", "Igel", "Jaguar", "Kakadu",
      "Kamel", "Känguru", "Katze", "Kobra", "Kolibri", "Krähe", "Krokodil", "Lachs", "Leopard", "Libelle",
      "Löwe", "Luchs", "Maulwurf", "Möwe", "Murmeltier", "Nachtigall", "Nashorn", "Otter", "Papagei", "Pelikan",
      "Pfau", "Pferd", "Pinguin", "Puma", "Rabe", "Reh", "Robbe", "Salamander", "Schmetterling", "Schnecke",
      "Schwan", "Skorpion", "Specht", "Spinne", "Storch", "Tiger", "Uhu", "Wal", "Wespe", "Wolf",
      "Wurm", "Zebra", "Ziege", "Kranich", "Panther", "Schildkröte", "Marder", "Wiesel", "Drossel", "Fink",
      "Grille", "Hornisse", "Käfer", "Lama", "Molch", "Pfau", "Qualle", "Raupe", "Stier", "Taube",
    ],
  },

  essen: {
    label: "Essen & Trinken",
    words: [
      "Apfel", "Banane", "Birne", "Brezel", "Brötchen", "Butter", "Erdbeere", "Gurke", "Honig", "Ingwer",
      "Käse", "Kartoffel", "Keks", "Kirsche", "Knoblauch", "Kuchen", "Mandel", "Marmelade", "Melone", "Milch",
      "Möhre", "Nudel", "Olive", "Orange", "Pfeffer", "Pflaume", "Pilz", "Pizza", "Quark", "Reis",
      "Sahne", "Salat", "Salz", "Schinken", "Schokolade", "Senf", "Spargel", "Spinat", "Steak", "Suppe",
      "Tomate", "Torte", "Traube", "Vanille", "Waffel", "Wurst", "Zimt", "Zitrone", "Zucker", "Zwiebel",
      "Aubergine", "Basilikum", "Brokkoli", "Croissant", "Dattel", "Essig", "Feige", "Grapefruit", "Haselnuss", "Joghurt",
      "Kakao", "Koriander", "Lauch", "Mango", "Nuss", "Paprika", "Radieschen", "Rosmarin", "Sellerie", "Thymian",
      "Ananas", "Avocado", "Baguette", "Cranberry", "Espresso", "Fondue", "Granatapfel", "Himbeere", "Kaffee", "Limette",
      "Marzipan", "Muskat", "Pfirsich", "Risotto", "Safran", "Tee", "Walnuss", "Minze", "Chili", "Kokos",
    ],
  },

  technik: {
    label: "Technik & Wissenschaft",
    words: [
      "Akku", "Algorithmus", "Antenne", "Atom", "Batterie", "Bildschirm", "Bluetooth", "Chip", "Cloud", "Code",
      "Cursor", "Daten", "Diode", "Drohne", "Dynamo", "Elektron", "Energie", "Fiber", "Filter", "Frequenz",
      "Fusion", "Generator", "Genom", "Grafik", "Hacker", "Hardware", "Infrarot", "Kabel", "Kamera", "Kapsel",
      "Laser", "Laufwerk", "Linse", "Magnet", "Matrix", "Membran", "Mikrofon", "Modem", "Monitor", "Motor",
      "Netzwerk", "Neutron", "Orbit", "Partikel", "Patent", "Pixel", "Plasma", "Platine", "Proton", "Prozessor",
      "Quantum", "Radar", "Reaktor", "Roboter", "Router", "Satellit", "Scanner", "Sensor", "Server", "Signal",
      "Software", "Solar", "Spektrum", "Strahlung", "Synapse", "Tablet", "Teleskop", "Transistor", "Turbine", "Vakuum",
      "Ventil", "Virus", "Volt", "Watt", "Zelle", "Sonde", "Labor", "Pendel", "Kolben", "Spule",
      "Impuls", "Modul", "Treiber", "Binär", "Kernel", "Portal", "Sender", "Empfänger", "Schaltung", "Relais",
    ],
  },

  sport: {
    label: "Sport & Spiel",
    words: [
      "Abseits", "Angriff", "Aufschlag", "Ball", "Bank", "Bogen", "Boxen", "Doping", "Dribbling", "Elfmeter",
      "Endspiel", "Fairplay", "Finte", "Flanke", "Freistoss", "Gewicht", "Halfpipe", "Halbzeit", "Hantel", "Helm",
      "Hürde", "Joker", "Kader", "Kapitän", "Klettern", "Korb", "Latte", "Liga", "Lauf", "Mannschaft",
      "Marathon", "Medaille", "Netz", "Parade", "Passspiel", "Pfiff", "Pokal", "Puck", "Punkt", "Rasen",
      "Reifen", "Rekord", "Ringe", "Rückhand", "Schach", "Schläger", "Schuss", "Sieg", "Ski", "Slalom",
      "Sprint", "Sprung", "Stadion", "Staffel", "Stürmer", "Taktik", "Tempo", "Tor", "Trainer", "Treffer",
      "Triathlon", "Trikot", "Turnen", "Viererkette", "Volleyball", "Vorhand", "Weitsprung", "Würfel", "Zeitstrafe", "Ziellinie",
      "Anpfiff", "Block", "Duell", "Ecke", "Foul", "Gelb", "Haken", "Jubel", "Konter", "Libero",
      "Match", "Overtime", "Penalty", "Ringrichter", "Strafraum", "Tackle", "Unentschieden", "Verteidiger", "Volley", "Wurf",
    ],
  },

  geschichte: {
    label: "Geschichte & Mythologie",
    words: [
      "Adel", "Amphore", "Artefakt", "Baron", "Befestigung", "Belagerung", "Bündnis", "Dynastie", "Edikt", "Erbe",
      "Expedition", "Fehde", "Festung", "Flotte", "Galerie", "Gladiator", "Göttin", "Grenze", "Handel", "Herold",
      "Hymne", "Imperium", "Kaiser", "Kanone", "Kathedrale", "Kelch", "Kleriker", "Kloster", "Kolonie", "König",
      "Kreuzzug", "Krone", "Kurier", "Labyrinth", "Legion", "Manuskript", "Monarch", "Mönch", "Münze", "Mythos",
      "Obelisk", "Orakel", "Orden", "Palast", "Papyrus", "Pergament", "Pharao", "Pilger", "Prinzessin", "Prophet",
      "Pyramide", "Rebellion", "Regent", "Relikt", "Revolution", "Rune", "Sage", "Samurai", "Schatz", "Schrift",
      "Seide", "Senator", "Sphinx", "Stamm", "Tempel", "Thron", "Titan", "Tribut", "Triumph", "Turnier",
      "Vasall", "Vertrag", "Wappen", "Wikinger", "Zepter", "Zitadelle", "Drache", "Elfe", "Goblin", "Hexe",
      "Kentaur", "Krake", "Meerjungfrau", "Minotaurus", "Pegasus", "Phoenix", "Troll", "Einhorn", "Zwerg", "Golem",
    ],
  },

  alltag: {
    label: "Alltag & Beruf",
    words: [
      "Ampel", "Arzt", "Balkon", "Bank", "Besen", "Bibliothek", "Brief", "Brille", "Bühne", "Büro",
      "Dach", "Dose", "Dusche", "Eimer", "Fabrik", "Fahrstuhl", "Fenster", "Flasche", "Flur", "Gabel",
      "Gardine", "Garten", "Geschenk", "Glocke", "Hafen", "Hammer", "Handtuch", "Herd", "Jacke", "Kalender",
      "Kamin", "Kerze", "Kissen", "Klingel", "Koffer", "Kühlschrank", "Lampe", "Leiter", "Löffel", "Lupe",
      "Markt", "Maske", "Matratze", "Mütze", "Nadel", "Nagel", "Ofen", "Paket", "Pflaster", "Pinsel",
      "Post", "Regal", "Regenschirm", "Ring", "Schere", "Schirm", "Schloss", "Schlüssel", "Schnur", "Schrank",
      "Schreibtisch", "Schuh", "Seil", "Seife", "Spiegel", "Stempel", "Stift", "Stuhl", "Tasche", "Tasse",
      "Teppich", "Treppe", "Tür", "Uhr", "Vase", "Vorhang", "Waage", "Wecker", "Werkzeug", "Zaun",
      "Zeitung", "Zange", "Apotheke", "Bäckerei", "Friseur", "Gärtner", "Handwerker", "Kellner", "Maler", "Schneider",
    ],
  },

  geografie: {
    label: "Geografie & Reisen",
    words: [
      "Archipel", "Atoll", "Basalt", "Berg", "Bucht", "Canyon", "Delta", "Düne", "Eisberg", "Fels",
      "Fjord", "Fluss", "Gebirge", "Geysir", "Gipfel", "Gletscher", "Grotte", "Hafen", "Halbinsel", "Höhle",
      "Insel", "Kap", "Klippe", "Kontinent", "Koralle", "Krater", "Küste", "Lagune", "Lava", "Leuchtturm",
      "Mangrove", "Moor", "Oase", "Ozean", "Pass", "Plateau", "Quelle", "Riff", "Savanne", "Schlucht",
      "See", "Steppe", "Strand", "Sumpf", "Tal", "Taiga", "Tundra", "Ufer", "Vulkan", "Wasserfall",
      "Wüste", "Kompass", "Landkarte", "Brücke", "Damm", "Fähre", "Grenze", "Kanal", "Kreuzung", "Pfad",
      "Pier", "Route", "Steg", "Tunnel", "Anlegestelle", "Basar", "Botschaft", "Denkmal", "Festung", "Friedhof",
      "Hochhaus", "Jahrmarkt", "Kaserne", "Kloster", "Marktplatz", "Moschee", "Pagode", "Rathaus", "Ruine", "Schloss",
      "Siedlung", "Tempel", "Turm", "Villa", "Windmühle", "Zollamt", "Graben", "Staudamm", "Aquädukt", "Kolosseum",
    ],
  },

  musik: {
    label: "Musik & Kunst",
    words: [
      "Akkord", "Arie", "Ballade", "Bass", "Bratsche", "Bühne", "Cellist", "Chor", "Dirigent", "Duett",
      "Fanfare", "Flöte", "Galerie", "Geige", "Gitarre", "Gong", "Harfe", "Harmonie", "Horn", "Hymne",
      "Improvisation", "Jazz", "Kanon", "Klarinette", "Klavier", "Komposition", "Konzert", "Kulisse", "Leinwand", "Lyrik",
      "Melodie", "Mosaik", "Muse", "Note", "Oboe", "Oper", "Orchester", "Orgel", "Ouvertüre", "Palette",
      "Partitur", "Pauke", "Pinsel", "Podium", "Portrait", "Pose", "Prosa", "Refrain", "Rhythmus", "Roman",
      "Saxophon", "Skulptur", "Solo", "Sonate", "Sopran", "Staffelei", "Strophe", "Symphonie", "Takt", "Tambourin",
      "Tenor", "Tinte", "Trommel", "Trompete", "Tuba", "Vers", "Violine", "Walzer", "Xylophon", "Zugabe",
      "Aquarell", "Fresko", "Graffiti", "Keramik", "Lithografie", "Pastell", "Radierung", "Siebdruck", "Stillleben", "Tusche",
      "Abstrakt", "Barock", "Epik", "Gotik", "Klassik", "Moderne", "Romantik", "Surrealismus", "Tragödie", "Komödie",
    ],
  },
};

export const ALL_CATEGORY_KEYS = Object.keys(CATEGORIES);

export function getWordsForCategory(category: string): string[] {
  if (category === "random") {
    // Combine all categories
    const all = Object.values(CATEGORIES).flatMap((c) => c.words);
    // Deduplicate
    return [...new Set(all)];
  }
  return CATEGORIES[category]?.words ?? [];
}

export function getCategoryLabels(): Record<string, string> {
  const labels: Record<string, string> = { random: "Zufällig (Alle)" };
  for (const [key, val] of Object.entries(CATEGORIES)) {
    labels[key] = val.label;
  }
  return labels;
}
