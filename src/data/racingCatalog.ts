import type { RacingGameId } from './racingRecords';

export type RacingCatalogTrack = {
  gameId: RacingGameId;
  name: string;
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
  ].map((name) => ({ gameId: 'acc' as const, name, source: accSource })),
  ...[
    'Imola',
    'Brands Hatch',
    'Spa-Francorchamps',
    'Circuit of the Americas',
    'Donington Park',
    'Fuji International Speedway',
    'Laguna Seca',
    'Mount Panorama, Bathurst',
    'Red Bull Ring',
    'Suzuka',
    'Nurburgring Nordschleife',
    'Nurburgring Grand Prix',
    'Oulton Park',
    'Road Atlanta',
    'Monza',
    'Watkins Glen International',
    'Circuit Paul Ricard',
    'Sebring International Raceway'
  ].map((name) => ({ gameId: 'ace' as const, name, source: aceSource })),
  ...[
    ['Bahrain', 'Default, Endurance, Outer, Paddock'],
    ['Circuit de Barcelona-Catalunya', 'ELMS Pack 3'],
    ['Circuit de La Sarthe', 'Le Mans 24h, Mulsanne no-chicanes'],
    ['Circuit Paul Ricard', 'Default'],
    ['Circuit of the Americas', 'Default, National'],
    ['Fuji Speedway', 'Default, Classic'],
    ['Imola', 'Default'],
    ['Interlagos', 'Default'],
    ['Lusail', 'Default, Short'],
    ['Monza', 'Default, Curva Grande'],
    ['Portimao', 'Default'],
    ['Sebring', 'Default, School'],
    ['Silverstone', 'Default'],
    ['Spa-Francorchamps', 'Default, endurance pitlane']
  ].map(([name, layouts]) => ({ gameId: 'lmu' as const, name, layouts, source: lmuSource }))
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
  car('acc', 'Audi', 'R8 LMS GT3 / Evo / Evo II', 'GT3', accSource),
  car('acc', 'Bentley', 'Continental GT3 2015 / 2018', 'GT3', accSource),
  car('acc', 'BMW', 'M6 GT3 / M4 GT3 / M2 CS Racing', 'GT3/TCX', accSource),
  car('acc', 'Ferrari', '488 GT3 / 488 Evo / 296 GT3 / 488 Challenge Evo', 'GT3/GTC', accSource),
  car('acc', 'Honda', 'NSX GT3 / NSX Evo GT3', 'GT3', accSource),
  car('acc', 'Lamborghini', 'Huracan GT3 / Evo / Evo2 / Super Trofeo', 'GT3/GTC', accSource),
  car('acc', 'McLaren', '650S GT3 / 720S GT3 / 720S Evo / 570S GT4', 'GT3/GT4', accSource),
  car('acc', 'Mercedes-AMG', 'AMG GT3 / AMG GT3 Evo / GT4', 'GT3/GT4', accSource),
  car('acc', 'Nissan', 'GT-R NISMO GT3 2015 / 2018', 'GT3', accSource),
  car('acc', 'Porsche', '911 GT3 R / 992 GT3 R / Cup / Cayman GT4', 'GT3/GTC/GT4', accSource),
  car('acc', 'Alpine', 'A110 GT4', 'GT4', accSource),
  car('acc', 'Chevrolet', 'Camaro R GT4', 'GT4', accSource),
  car('acc', 'Ginetta', 'G55 GT4', 'GT4', accSource),
  car('acc', 'KTM', 'X-BOW GT4', 'GT4', accSource),
  car('acc', 'Maserati', 'GranTurismo MC GT4', 'GT4', accSource),
  car('acc', 'Jaguar', 'Emil Frey Jaguar G3', 'GT3', accSource),
  car('acc', 'Lexus', 'RC F GT3', 'GT3', accSource),
  car('acc', 'Reiter', 'R-EX GT3', 'GT3', accSource),

  ...[
    ['Abarth', '695 Biposto'],
    ['Alfa Romeo', '75 Turbo Evoluzione / Giulia GTAm / Giulia Sprint GTA / Junior Elettrica'],
    ['Alpine', 'A110 S Aero Kit / A290 concept'],
    ['Audi', 'RS 3 Sportback / RS 6 / Sport quattro / R8 LMS GT4 Evo'],
    ['BMW', 'M2 CS Racing / M3 E30 / M3 E46 CSL / M4 CSL / M4 GT3 Evo / M8 Competition'],
    ['Caterham', 'Seven Academy / Seven 485 CSR'],
    ['Chevrolet', 'Camaro ZL1 variants'],
    ['Dallara', 'Stradale / EXP'],
    ['Ferrari', '288 GTO / 296 GTB / 296 GT3 / 488 Challenge Evo / F40 LM / Daytona SP3 / F2004 / SF-25'],
    ['Ford', 'Escort Cosworth RS / Mustang GT3'],
    ['Honda', 'NSX-R / S2000'],
    ['Hyundai', 'i30 N Performance / Drive-N Limited'],
    ['Lamborghini', 'Countach LP5000 QV / Huracan STO / Huracan Super Trofeo EVO 2'],
    ['Lancia', 'Delta HF Integrale variants'],
    ['Lotus', 'Emira / Exige V6 Cup'],
    ['Maserati', 'GT2 MC20'],
    ['Mazda', 'MX-5 NA / MX-5 ND Global Cup'],
    ['Mercedes-AMG', '190E Evo II / AMG GT2'],
    ['Mini', 'John Cooper S MkVI variants'],
    ['Peugeot', '205 T16'],
    ['Porsche', '718 Cayman GT4 / 911 GT3 Cup / 992 GT3 R rennsport / 911 Turbo 964'],
    ['Renault', '5 GT Turbo'],
    ['Toyota', 'GR86 / Supra MKIV'],
    ['Volkswagen', 'Golf Mk1 GTI / Golf Mk8 GTI Clubsport']
  ].map(([brand, name]) => car('ace', brand, name, 'ACE catalog', aceSource)),

  ...[
    ['Alpine', 'A424', 'Hypercar'],
    ['Aston Martin', 'Valkyrie AMR-LMH / Vantage GTE / Vantage AMR LMGT3 Evo', 'Hypercar/GTE/LMGT3'],
    ['BMW', 'M Hybrid V8 / M4 LMGT3 / M4 LMGT3 Evo', 'Hypercar/LMGT3'],
    ['Cadillac', 'V-Series.R', 'Hypercar'],
    ['Chevrolet', 'Corvette C8.R / Z06 LMGT3.R', 'GTE/LMGT3'],
    ['Duqueine', 'D09', 'LMP3'],
    ['Ferrari', '296 LMGT3 / 488 GTE Evo / 499P', 'LMGT3/GTE/Hypercar'],
    ['Ford', 'Mustang LMGT3', 'LMGT3'],
    ['Ginetta', 'G61-LT-P325 Evo', 'LMP3'],
    ['Glickenhaus', 'SCG 007', 'Hypercar'],
    ['Isotta Fraschini', 'Tipo 6', 'Hypercar'],
    ['Lamborghini', 'Huracan LMGT3 Evo II / SC63', 'LMGT3/Hypercar'],
    ['Lexus', 'RC F LMGT3', 'LMGT3'],
    ['Ligier', 'JS P325', 'LMP3'],
    ['McLaren', '720S LMGT3 Evo', 'LMGT3'],
    ['Mercedes-AMG', 'LMGT3 Evo', 'LMGT3'],
    ['Oreca', '07 / 07 derestricted', 'LMP2'],
    ['Peugeot', '9X8 2023 / 9X8 2024', 'Hypercar'],
    ['Porsche', '911 LMGT3 R / RSR-19 / 963', 'LMGT3/GTE/Hypercar'],
    ['Toyota', 'GR010 Hybrid', 'Hypercar'],
    ['Vanwall', 'Vandervell 680', 'Hypercar']
  ].map(([brand, name, category]) => car('lmu', brand, name, category, lmuSource))
];

export const getCatalogCounts = (gameId: RacingGameId) => ({
  cars: racingCarCatalog.filter((carItem) => carItem.gameId === gameId).length,
  tracks: racingTrackCatalog.filter((trackItem) => trackItem.gameId === gameId).length
});
