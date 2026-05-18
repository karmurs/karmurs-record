import type { RacingGameId } from './racingRecords';

export type RacingCatalogTrack = {
  gameId: RacingGameId;
  name: string;
  layout?: string;
  layouts?: string;
  source: string;
};

export type RacingCatalogCar = {
  gameId: RacingGameId;
  brand: string;
  name: string;
  category: string;
  source: string;
};

export const brandLogoPaths: Record<string, string> = {
  'Aston Martin': 'racing/brands/aston-martin.svg',
  Audi: 'racing/brands/audi.svg',
  Bentley: 'racing/brands/bentley.svg',
  BMW: 'racing/brands/bmw.svg',
  Cadillac: 'racing/brands/cadillac.svg',
  Chevrolet: 'racing/brands/chevrolet.svg',
  Cupra: 'racing/brands/cupra.svg',
  Ferrari: 'racing/brands/ferrari.svg',
  Ford: 'racing/brands/ford.svg',
  Honda: 'racing/brands/honda.svg',
  Hyundai: 'racing/brands/hyundai.svg',
  KTM: 'racing/brands/ktm.svg',
  Lamborghini: 'racing/brands/lamborghini.svg',
  Maserati: 'racing/brands/maserati.svg',
  Mazda: 'racing/brands/mazda.svg',
  McLaren: 'racing/brands/mclaren.svg',
  Mini: 'racing/brands/mini.svg',
  Nissan: 'racing/brands/nissan.svg',
  Peugeot: 'racing/brands/peugeot.svg',
  Porsche: 'racing/brands/porsche.svg',
  Toyota: 'racing/brands/toyota.svg'
};

export const brandFallbacks: Record<string, string> = {
  Abarth: 'AB',
  'Alfa Romeo': 'AR',
  Alpine: 'A',
  Caterham: 'C',
  Cupra: 'C',
  Dallara: 'D',
  Duqueine: 'D',
  Ginetta: 'G',
  Genesis: 'G',
  Glickenhaus: 'SCG',
  'Isotta Fraschini': 'IF',
  Jaguar: 'J',
  Lancia: 'L',
  Lexus: 'L',
  Ligier: 'L',
  Lotus: 'L',
  McMurtry: 'M',
  'Mercedes-AMG': 'AMG',
  Morgan: 'M',
  Oreca: 'O',
  Reiter: 'R',
  Renault: 'R',
  Vanwall: 'V',
  Volkswagen: 'VW'
};

const accSource = 'ACC March 2026 car/track lists';
const aceSource = 'Assetto Corsa EVO v0.6 / 2026 lists';
const lmuSource = 'Le Mans Ultimate 2026 / v1.3 lists';

const track = (
  gameId: RacingGameId,
  name: string,
  layout: string,
  source: string
): RacingCatalogTrack => ({
  gameId,
  name,
  layout,
  layouts: layout,
  source
});

const tracks = (
  gameId: RacingGameId,
  name: string,
  layouts: string[],
  source: string
): RacingCatalogTrack[] => layouts.map((layout) => track(gameId, name, layout, source));

export const getTrackDisplayName = (trackItem: RacingCatalogTrack) =>
  trackItem.layout && trackItem.layout !== 'Default' ? `${trackItem.name} - ${trackItem.layout}` : trackItem.name;

export const getCarDisplayName = (carItem: RacingCatalogCar) => `${carItem.brand} ${carItem.name}`;

export const racingTrackCatalog: RacingCatalogTrack[] = [
  ...[
    'Barcelona',
    'Brands Hatch',
    'Hungaroring',
    'Misano',
    'Monza',
    'Nurburgring',
    'Paul Ricard',
    'Silverstone',
    'Spa-Francorchamps',
    'Zandvoort',
    'Zolder',
    'Snetterton',
    'Oulton Park',
    'Donington Park',
    'Kyalami Grand Prix Circuit',
    'Suzuka Circuit',
    'WeatherTech Raceway Laguna Seca',
    'Mount Panorama Circuit',
    'Imola',
    'Watkins Glen',
    'Circuit of the Americas',
    'Indianapolis',
    'Valencia',
    'Red Bull Ring',
    '24H Nurburgring Nordschleife'
  ].map((name) => track('acc', name, name === '24H Nurburgring Nordschleife' ? '24H' : 'Default', accSource)),
  ...tracks('ace', 'Autodromo Internazionale Enzo e Dino Ferrari - Imola', ['Default'], aceSource),
  ...tracks('ace', 'Brands Hatch', ['GP'], aceSource),
  ...tracks('ace', 'Circuit de Spa-Francorchamps', ['Default'], aceSource),
  ...tracks('ace', 'Circuit of the Americas', ['GP'], aceSource),
  ...tracks('ace', 'Donington Park', ['GP'], aceSource),
  ...tracks('ace', 'Fuji International Speedway', ['Default'], aceSource),
  ...tracks('ace', 'Laguna Seca', ['Default'], aceSource),
  ...tracks('ace', 'Mount Panorama, Bathurst', ['Default'], aceSource),
  ...tracks('ace', 'Red Bull Ring', ['GP'], aceSource),
  ...tracks('ace', 'Suzuka', ['GP'], aceSource),
  ...tracks('ace', 'Nurburgring Nordschleife', ['24H', 'Touristenfahrten'], aceSource),
  ...tracks('ace', 'Nurburgring Grand Prix', ['GP'], aceSource),
  ...tracks('ace', 'Oulton Park', ['International', 'Foster'], aceSource),
  ...tracks('ace', 'Road Atlanta', ['Default'], aceSource),
  ...tracks('ace', 'Monza', ['GP'], aceSource),
  ...tracks('ace', 'Watkins Glen International', ['GP'], aceSource),
  ...tracks('ace', 'Circuit Paul Ricard', ['GP'], aceSource),
  ...tracks('ace', 'Sebring International Raceway', ['Default'], aceSource),
  ...tracks('lmu', 'Bahrain', ['Default', 'Endurance', 'Outer', 'Paddock'], lmuSource),
  ...tracks('lmu', 'Circuit de Barcelona-Catalunya', ['Default'], lmuSource),
  ...tracks('lmu', 'Circuit de La Sarthe', ['Le Mans 24h', 'Mulsanne no-chicanes'], lmuSource),
  ...tracks('lmu', 'Circuit Paul Ricard', ['Default'], lmuSource),
  ...tracks('lmu', 'Circuit of the Americas', ['Default', 'National'], lmuSource),
  ...tracks('lmu', 'Fuji Speedway', ['Default', 'Classic'], lmuSource),
  ...tracks('lmu', 'Imola', ['Default'], lmuSource),
  ...tracks('lmu', 'Interlagos', ['Default'], lmuSource),
  ...tracks('lmu', 'Lusail', ['Default', 'Short'], lmuSource),
  ...tracks('lmu', 'Monza', ['Default', 'Curva Grande'], lmuSource),
  ...tracks('lmu', 'Portimao', ['Default'], lmuSource),
  ...tracks('lmu', 'Sebring', ['Default', 'School'], lmuSource),
  ...tracks('lmu', 'Silverstone', ['Default'], lmuSource),
  ...tracks('lmu', 'Spa-Francorchamps', ['Default', 'Endurance pitlane'], lmuSource)
];

const car = (
  gameId: RacingGameId,
  brand: string,
  name: string,
  category: string,
  source: string
): RacingCatalogCar => ({ gameId, brand, name, category, source });

export const racingCarCatalog: RacingCatalogCar[] = [
  car('acc', 'Aston Martin', 'V12 Vantage GT3', 'GT3', accSource),
  car('acc', 'Aston Martin', 'V8 Vantage GT3', 'GT3', accSource),
  car('acc', 'Audi', 'R8 LMS GT3', 'GT3', accSource),
  car('acc', 'Audi', 'R8 LMS GT3 Evo', 'GT3', accSource),
  car('acc', 'Audi', 'R8 LMS GT3 Evo II', 'GT3', accSource),
  car('acc', 'Audi', 'R8 LMS GT2', 'GT2', accSource),
  car('acc', 'Bentley', 'Continental GT3 2015', 'GT3', accSource),
  car('acc', 'Bentley', 'Continental GT3 2018', 'GT3', accSource),
  car('acc', 'BMW', 'M6 GT3', 'GT3', accSource),
  car('acc', 'BMW', 'M4 GT3', 'GT3', accSource),
  car('acc', 'BMW', 'M2 CS Racing', 'TCX', accSource),
  car('acc', 'Ferrari', '488 GT3', 'GT3', accSource),
  car('acc', 'Ferrari', '488 GT3 Evo', 'GT3', accSource),
  car('acc', 'Ferrari', '488 Challenge Evo', 'GTC', accSource),
  car('acc', 'Ferrari', '296 GT3', 'GT3', accSource),
  car('acc', 'Honda', 'NSX GT3', 'GT3', accSource),
  car('acc', 'Honda', 'NSX GT3 Evo', 'GT3', accSource),
  car('acc', 'Lamborghini', 'Huracan GT3', 'GT3', accSource),
  car('acc', 'Lamborghini', 'Huracan GT3 Evo', 'GT3', accSource),
  car('acc', 'Lamborghini', 'Huracan GT3 Evo2', 'GT3', accSource),
  car('acc', 'Lamborghini', 'Huracan Super Trofeo EVO2', 'GTC', accSource),
  car('acc', 'McLaren', '650S GT3', 'GT3', accSource),
  car('acc', 'McLaren', '720S GT3', 'GT3', accSource),
  car('acc', 'McLaren', '720S GT3 Evo', 'GT3', accSource),
  car('acc', 'McLaren', '570S GT4', 'GT4', accSource),
  car('acc', 'Mercedes-AMG', 'AMG GT3', 'GT3', accSource),
  car('acc', 'Mercedes-AMG', 'AMG GT3 Evo', 'GT3', accSource),
  car('acc', 'Mercedes-AMG', 'AMG GT4', 'GT4', accSource),
  car('acc', 'Mercedes-AMG', 'AMG GT2', 'GT2', accSource),
  car('acc', 'Nissan', 'GT-R NISMO GT3 2015', 'GT3', accSource),
  car('acc', 'Nissan', 'GT-R NISMO GT3 2018', 'GT3', accSource),
  car('acc', 'Porsche', '911 GT3 R', 'GT3', accSource),
  car('acc', 'Porsche', '992 GT3 R', 'GT3', accSource),
  car('acc', 'Porsche', '911 GT3 Cup', 'GTC', accSource),
  car('acc', 'Porsche', '718 Cayman GT4 Clubsport', 'GT4', accSource),
  car('acc', 'Porsche', '935', 'GT2', accSource),
  car('acc', 'Porsche', '911 GT2 RS Clubsport Evo', 'GT2', accSource),
  car('acc', 'Alpine', 'A110 GT4', 'GT4', accSource),
  car('acc', 'Chevrolet', 'Camaro GT4.R', 'GT4', accSource),
  car('acc', 'Ginetta', 'G55 GT4', 'GT4', accSource),
  car('acc', 'KTM', 'X-BOW GT4', 'GT4', accSource),
  car('acc', 'KTM', 'X-BOW GT2', 'GT2', accSource),
  car('acc', 'Maserati', 'GranTurismo MC GT4', 'GT4', accSource),
  car('acc', 'Maserati', 'GT2', 'GT2', accSource),
  car('acc', 'Jaguar', 'Emil Frey Jaguar G3', 'GT3', accSource),
  car('acc', 'Lexus', 'RC F GT3', 'GT3', accSource),
  car('acc', 'Reiter', 'R-EX GT3', 'GT3', accSource),

  ...[
    ['Abarth', '695 Biposto'],
    ['Alfa Romeo', '75 Turbo Evoluzione'],
    ['Alfa Romeo', 'Giulia GTAm'],
    ['Alfa Romeo', 'Giulia Sprint GTA'],
    ['Alfa Romeo', 'Junior Veloce'],
    ['Alpine', 'A110 S'],
    ['Alpine', 'A290 Concept'],
    ['Audi', 'RS3 Sportback (8Y)'],
    ['Audi', 'RS6 Avant (C8)'],
    ['Audi', 'Sport quattro'],
    ['Audi', 'R8 LMS GT4 Evo'],
    ['BMW', 'M2 CS Racing (F87)'],
    ['BMW', 'M3 Sport Evolution (E30)'],
    ['BMW', 'M3 CSL (E46)'],
    ['BMW', 'M4 CSL (G82)'],
    ['BMW', 'M4 GT3 Evo (G82)'],
    ['BMW', 'M8 Competition (G15)'],
    ['Caterham', 'Seven Academy'],
    ['Caterham', 'Seven 485 CSR Final Edition'],
    ['Chevrolet', 'Camaro ZL1'],
    ['Dallara', 'Stradale'],
    ['Dallara', 'EXP'],
    ['Ferrari', '288 GTO'],
    ['Ferrari', '296 GTB'],
    ['Ferrari', '296 GT3'],
    ['Ferrari', '488 Challenge Evo'],
    ['Ferrari', 'F40 LM'],
    ['Ferrari', 'Daytona SP3'],
    ['Ferrari', 'F2004 F1'],
    ['Ferrari', 'SF-25 F1'],
    ['Ford', 'Escort RS Cosworth'],
    ['Ford', 'Mustang GT3'],
    ['Honda', 'NSX-R (NA1)'],
    ['Honda', 'S2000 (AP1)'],
    ['Hyundai', 'i30 N Performance'],
    ['Lamborghini', 'Countach LP5000 Quattrovalvole'],
    ['Lamborghini', 'Huracan STO'],
    ['Lamborghini', 'Huracan Super Trofeo EVO 2'],
    ['Lancia', 'Delta HF Integrale Evo II'],
    ['Lotus', 'Emira First Edition'],
    ['Lotus', 'Exige V6 Cup'],
    ['Maserati', 'GT2'],
    ['Mazda', 'MX-5 (NA)'],
    ['Mazda', 'MX-5 Global Cup (ND)'],
    ['Mercedes-AMG', '190E 2.5-16 Evolution II'],
    ['Mercedes-AMG', 'AMG GT2'],
    ['Mini', 'John Cooper Works Mk6'],
    ['Peugeot', '205 T16'],
    ['Porsche', '718 Cayman GT4'],
    ['Porsche', '718 Cayman GT4 Clubsport'],
    ['Porsche', '718 Cayman GT4 RS'],
    ['Porsche', '911 GT3 Cup (992)'],
    ['Porsche', '911 GT3 R Rennsport (992)'],
    ['Porsche', '911 GT3 RS (992)'],
    ['Porsche', '911 Turbo 3.6 (964)'],
    ['Renault', '5 GT Turbo'],
    ['Toyota', 'GR86'],
    ['Toyota', 'Supra RZ Twin-Turbo (A80)'],
    ['Volkswagen', 'Golf GTI Clubsport (Mk8)']
  ].map(([brand, name]) => car('ace', brand, name, 'ACE catalog', aceSource)),

  ...[
    ['Alpine', 'A424', 'Hypercar'],
    ['Aston Martin', 'Valkyrie AMR-LMH', 'Hypercar'],
    ['Aston Martin', 'Vantage GTE', 'GTE'],
    ['Aston Martin', 'Vantage AMR LMGT3 Evo', 'LMGT3'],
    ['BMW', 'M Hybrid V8', 'Hypercar'],
    ['BMW', 'M4 LMGT3', 'LMGT3'],
    ['BMW', 'M4 LMGT3 Evo', 'LMGT3'],
    ['Cadillac', 'V-Series.R', 'Hypercar'],
    ['Chevrolet', 'Corvette C8.R', 'GTE'],
    ['Chevrolet', 'Corvette Z06 LMGT3.R', 'LMGT3'],
    ['Duqueine', 'D09', 'LMP3'],
    ['Ferrari', '296 LMGT3', 'LMGT3'],
    ['Ferrari', '296 LMGT3 Evo', 'LMGT3'],
    ['Ferrari', '488 GTE Evo', 'GTE'],
    ['Ferrari', '499P', 'Hypercar'],
    ['Ford', 'Mustang LMGT3', 'LMGT3'],
    ['Genesis', 'GMR-001', 'Hypercar'],
    ['Ginetta', 'G61-LT-P325 Evo', 'LMP3'],
    ['Glickenhaus', 'SCG 007', 'Hypercar'],
    ['Isotta Fraschini', 'Tipo 6', 'Hypercar'],
    ['Lamborghini', 'Huracan LMGT3 Evo II', 'LMGT3'],
    ['Lamborghini', 'SC63', 'Hypercar'],
    ['Lexus', 'RC F LMGT3', 'LMGT3'],
    ['Ligier', 'JS P325', 'LMP3'],
    ['McLaren', '720S LMGT3 Evo', 'LMGT3'],
    ['Mercedes-AMG', 'LMGT3 Evo', 'LMGT3'],
    ['Oreca', '07', 'LMP2'],
    ['Oreca', '07 derestricted', 'LMP2'],
    ['Peugeot', '9X8 2023', 'Hypercar'],
    ['Peugeot', '9X8 2024', 'Hypercar'],
    ['Porsche', '911 LMGT3 R', 'LMGT3'],
    ['Porsche', 'RSR-19', 'GTE'],
    ['Porsche', '963', 'Hypercar'],
    ['Toyota', 'GR010 Hybrid', 'Hypercar'],
    ['Vanwall', 'Vandervell 680', 'Hypercar']
  ].map(([brand, name, category]) => car('lmu', brand, name, category, lmuSource))
];

export const getCatalogCounts = (gameId: RacingGameId) => ({
  cars: racingCarCatalog.filter((carItem) => carItem.gameId === gameId).length,
  tracks: racingTrackCatalog.filter((trackItem) => trackItem.gameId === gameId).length
});
