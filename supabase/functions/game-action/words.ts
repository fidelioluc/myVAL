// Simple, everyday German words for Codenames Duet
// No categories – just a large pool of common, recognizable words

export const ALL_WORDS: string[] = [
  // Tiere
  "Hund", "Katze", "Pferd", "Kuh", "Schwein", "Schaf", "Ziege", "Huhn", "Ente", "Gans",
  "Fisch", "Vogel", "Maus", "Ratte", "Hase", "Fuchs", "Wolf", "Bär", "Affe", "Löwe",
  "Tiger", "Elefant", "Giraffe", "Zebra", "Adler", "Eule", "Frosch", "Schlange", "Spinne", "Biene",
  "Wespe", "Fliege", "Schmetterling", "Ameise", "Käfer", "Wurm", "Krebs", "Wal", "Delfin", "Hai",

  // Essen & Trinken
  "Brot", "Butter", "Käse", "Ei", "Milch", "Wasser", "Saft", "Bier", "Wein", "Kaffee",
  "Tee", "Zucker", "Salz", "Pfeffer", "Öl", "Essig", "Mehl", "Reis", "Nudel", "Suppe",
  "Fleisch", "Wurst", "Schinken", "Steak", "Fisch", "Salat", "Tomate", "Gurke", "Möhre", "Zwiebel",
  "Knoblauch", "Kartoffel", "Apfel", "Birne", "Banane", "Orange", "Zitrone", "Erdbeere", "Kirsche", "Traube",
  "Kuchen", "Torte", "Keks", "Schokolade", "Eis", "Marmelade", "Honig", "Nuss", "Pizza", "Burger",

  // Haushalt & Wohnen
  "Haus", "Wohnung", "Zimmer", "Küche", "Bad", "Keller", "Dach", "Fenster", "Tür", "Wand",
  "Boden", "Decke", "Treppe", "Balkon", "Garten", "Garage", "Tisch", "Stuhl", "Sofa", "Bett",
  "Schrank", "Regal", "Lampe", "Spiegel", "Teppich", "Kissen", "Deckel", "Topf", "Pfanne", "Tasse",
  "Teller", "Glas", "Löffel", "Gabel", "Messer", "Schlüssel", "Schloss", "Besen", "Eimer", "Seife",
  "Handtuch", "Dusche", "Badewanne", "Waschmaschine", "Kühlschrank", "Herd", "Ofen", "Mülleimer", "Vorhang", "Uhr",

  // Kleidung & Körper
  "Hemd", "Hose", "Rock", "Kleid", "Jacke", "Mantel", "Schal", "Mütze", "Schuh", "Socke",
  "Unterwäsche", "Handschuh", "Gürtel", "Tasche", "Brille", "Ring", "Kette", "Kopf", "Haar", "Auge",
  "Nase", "Mund", "Ohr", "Zahn", "Hand", "Finger", "Arm", "Bein", "Fuß", "Rücken",
  "Bauch", "Herz", "Hals", "Schulter", "Knie", "Haut", "Blut", "Knochen", "Muskel", "Stimme",

  // Natur & Wetter
  "Sonne", "Mond", "Stern", "Wolke", "Regen", "Schnee", "Wind", "Sturm", "Blitz", "Donner",
  "Eis", "Feuer", "Wasser", "Erde", "Stein", "Sand", "Berg", "Tal", "Fluss", "See",
  "Wald", "Baum", "Blume", "Gras", "Blatt", "Wurzel", "Ast", "Pilz", "Moos", "Fels",
  "Strand", "Meer", "Insel", "Wüste", "Sumpf", "Feld", "Wiese", "Hügel", "Höhle", "Quelle",

  // Stadt & Verkehr
  "Straße", "Weg", "Brücke", "Tunnel", "Ampel", "Kreuzung", "Parkplatz", "Auto", "Bus", "Bahn",
  "Fahrrad", "Motorrad", "Zug", "Flugzeug", "Schiff", "Boot", "Taxi", "Lkw", "Tankstelle", "Bahnhof",
  "Flughafen", "Hafen", "Markt", "Supermarkt", "Bäckerei", "Apotheke", "Krankenhaus", "Schule", "Kirche", "Rathaus",
  "Hotel", "Restaurant", "Café", "Kino", "Museum", "Park", "Zoo", "Schwimmbad", "Sporthalle", "Polizei",

  // Berufe & Menschen
  "Arzt", "Lehrer", "Koch", "Fahrer", "Bauer", "Soldat", "Polizist", "Feuerwehr", "Pilot", "Kellner",
  "Verkäufer", "Bäcker", "Maler", "Gärtner", "Mechaniker", "Elektriker", "Sanitäter", "Richter", "Anwalt", "Pfarrer",
  "Kind", "Baby", "Junge", "Mädchen", "Mann", "Frau", "Großvater", "Großmutter", "Vater", "Mutter",
  "Bruder", "Schwester", "Freund", "Nachbar", "Chef", "Kollege", "König", "Prinz", "Held", "Feind",

  // Schule & Büro
  "Buch", "Heft", "Stift", "Bleistift", "Lineal", "Schere", "Kleber", "Papier", "Brief", "Paket",
  "Computer", "Handy", "Telefon", "Drucker", "Tastatur", "Bildschirm", "Kamera", "Radio", "Fernseher", "Lautsprecher",
  "Schreibtisch", "Büro", "Werkzeug", "Hammer", "Säge", "Nagel", "Schraube", "Bohrer", "Pinsel", "Farbe",

  // Freizeit & Sport
  "Ball", "Spiel", "Sport", "Fußball", "Tennis", "Schwimmen", "Laufen", "Radfahren", "Klettern", "Tanzen",
  "Musik", "Gitarre", "Klavier", "Trommel", "Flöte", "Gesang", "Film", "Buch", "Malen", "Basteln",
  "Urlaub", "Reise", "Koffer", "Zelt", "Karte", "Kompass", "Fernglas", "Lagerfeuer", "Wandern", "Angeln",

  // Gefühle & Konzepte
  "Freude", "Trauer", "Wut", "Angst", "Liebe", "Hass", "Glück", "Pech", "Hoffnung", "Traum",
  "Geheimnis", "Rätsel", "Abenteuer", "Gefahr", "Sicherheit", "Frieden", "Krieg", "Fehler", "Erfolg", "Misserfolg",
  "Wahrheit", "Lüge", "Versprechen", "Wunsch", "Ziel", "Plan", "Idee", "Gedanke", "Erinnerung", "Zukunft",
];

export function getWords(): string[] {
  // Deduplicate
  return [...new Set(ALL_WORDS)];
}
