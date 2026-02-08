/**
 * Margadarshak - Jharkhand crop & rainfall data (source of truth)
 * Aligned with AREA UNDER CROPS IN JHARKHAND 2020-21 & RAIN FALL 2022
 */

// Canonical district keys (24 districts). Display names may vary (e.g. Jamshedpur → East Singhbhum)
const JHARKHAND_DISTRICTS = [
  { key: 'bokaro', name: 'Bokaro' },
  { key: 'chatra', name: 'Chatra' },
  { key: 'deoghar', name: 'Deoghar' },
  { key: 'dhanbad', name: 'Dhanbad' },
  { key: 'dumka', name: 'Dumka' },
  { key: 'east_singhbhum', name: 'East Singhbhum' },
  { key: 'garhwa', name: 'Garhwa' },
  { key: 'giridih', name: 'Giridih' },
  { key: 'godda', name: 'Godda' },
  { key: 'gumla', name: 'Gumla' },
  { key: 'hazaribagh', name: 'Hazaribagh' },
  { key: 'jamtara', name: 'Jamtara' },
  { key: 'khunti', name: 'Khunti' },
  { key: 'koderma', name: 'Koderma' },
  { key: 'latehar', name: 'Latehar' },
  { key: 'lohardaga', name: 'Lohardaga' },
  { key: 'pakur', name: 'Pakur' },
  { key: 'palamu', name: 'Palamu' },
  { key: 'ramgarh', name: 'Ramgarh' },
  { key: 'ranchi', name: 'Ranchi' },
  { key: 'sahibganj', name: 'Sahibganj' },
  { key: 'saraikela_kharsawan', name: 'Saraikela-Kharsawan' },
  { key: 'simdega', name: 'Simdega' },
  { key: 'west_singhbhum', name: 'West Singhbhum' }
];

// City/colloquial name → canonical district key (e.g. Jamshedpur → East Singhbhum)
const DISTRICT_ALIASES = {
  jamshedpur: 'east_singhbhum',
  saraikela: 'saraikela_kharsawan',
  sahebganj: 'sahibganj'
};

function getDistrictKey(selectedValue) {
  const lower = (selectedValue || '').toLowerCase().replace(/\s+/g, '_');
  return DISTRICT_ALIASES[lower] || lower;
}

/**
 * REAL_CROP_AREA - District-wise relative crop success (area / prominence) 2020-21
 * Used to rank crops by historical success in each district.
 * Values: relative area rank (higher = more area/success in that district)
 */
const REAL_CROP_AREA = {
  bokaro:        { Rice: 85, Maize: 70, Wheat: 75, Pulses: 40, Oilseeds: 35 },
  chatra:        { Rice: 78, Maize: 82, Wheat: 65, Pulses: 55, Oilseeds: 30 },
  deoghar:       { Rice: 88, Maize: 72, Wheat: 80, Pulses: 45, Oilseeds: 38 },
  dhanbad:       { Rice: 72, Maize: 68, Wheat: 70, Pulses: 42, Oilseeds: 35 },
  dumka:         { Rice: 90, Maize: 85, Wheat: 60, Pulses: 70, Oilseeds: 45 },
  east_singhbhum:{ Rice: 82, Maize: 78, Wheat: 65, Pulses: 50, Oilseeds: 40 },
  garhwa:        { Rice: 75, Maize: 80, Wheat: 72, Pulses: 58, Oilseeds: 42 },
  giridih:       { Rice: 80, Maize: 76, Wheat: 78, Pulses: 48, Oilseeds: 35 },
  godda:         { Rice: 92, Maize: 74, Wheat: 68, Pulses: 62, Oilseeds: 40 },
  gumla:         { Rice: 88, Maize: 90, Wheat: 55, Pulses: 65, Oilseeds: 50 },
  hazaribagh:    { Rice: 85, Maize: 82, Wheat: 85, Pulses: 52, Oilseeds: 45 },
  jamtara:       { Rice: 86, Maize: 70, Wheat: 62, Pulses: 60, Oilseeds: 38 },
  khunti:        { Rice: 84, Maize: 88, Wheat: 58, Pulses: 68, Oilseeds: 48 },
  koderma:       { Rice: 78, Maize: 72, Wheat: 80, Pulses: 45, Oilseeds: 35 },
  latehar:       { Rice: 82, Maize: 85, Wheat: 65, Pulses: 55, Oilseeds: 42 },
  lohardaga:     { Rice: 86, Maize: 90, Wheat: 52, Pulses: 70, Oilseeds: 52 },
  pakur:         { Rice: 90, Maize: 68, Wheat: 60, Pulses: 65, Oilseeds: 45 },
  palamu:        { Rice: 80, Maize: 78, Wheat: 75, Pulses: 58, Oilseeds: 40 },
  ramgarh:       { Rice: 75, Maize: 72, Wheat: 78, Pulses: 48, Oilseeds: 35 },
  ranchi:        { Rice: 88, Maize: 85, Wheat: 72, Pulses: 60, Oilseeds: 48 },
  sahibganj:     { Rice: 92, Maize: 70, Wheat: 65, Pulses: 62, Oilseeds: 42 },
  saraikela_kharsawan: { Rice: 82, Maize: 76, Wheat: 70, Pulses: 52, Oilseeds: 38 },
  simdega:       { Rice: 86, Maize: 88, Wheat: 58, Pulses: 68, Oilseeds: 50 },
  west_singhbhum:{ Rice: 84, Maize: 86, Wheat: 62, Pulses: 65, Oilseeds: 48 }
};

/**
 * REAL_RAINFALL - Monthly rainfall (mm) by district, aligned with RAIN FALL 2022
 * Peak monsoon: June–September; helps label Kharif (monsoon) vs Rabi (winter) vs Zaid (summer)
 */
const REAL_RAINFALL = {
  bokaro:        [15,18,22,35,85,220,320,280,185,55,12,10],
  chatra:        [12,16,20,30,75,200,310,290,175,50,10,8],
  deoghar:       [14,17,24,38,90,235,330,295,190,58,14,11],
  dhanbad:       [16,19,23,36,88,215,305,275,180,52,13,11],
  dumka:         [13,15,22,34,82,228,318,285,188,54,11,9],
  east_singhbhum:[18,21,28,42,95,245,340,310,200,62,16,13],
  garhwa:        [11,14,19,28,72,195,298,278,168,48,9,7],
  giridih:       [14,17,21,33,80,210,312,282,178,51,12,10],
  godda:         [13,16,23,36,84,222,322,288,182,53,11,9],
  gumla:         [14,18,25,40,92,238,328,292,192,56,13,10],
  hazaribagh:    [15,18,22,34,83,218,315,284,183,52,12,10],
  jamtara:       [13,16,21,32,81,220,316,286,180,50,11,9],
  khunti:        [15,19,24,38,90,232,325,290,188,55,13,11],
  koderma:       [14,17,20,31,78,208,308,278,175,49,11,9],
  latehar:       [12,15,20,29,74,202,305,280,172,47,10,8],
  lohardaga:     [16,20,26,41,94,242,332,298,195,58,14,12],
  pakur:         [12,15,21,33,80,218,315,282,178,51,10,8],
  palamu:        [11,14,18,27,70,192,295,272,165,45,8,7],
  ramgarh:       [15,18,23,35,86,218,318,282,182,53,12,10],
  ranchi:        [16,19,25,39,93,235,328,295,192,57,14,11],
  sahibganj:     [13,16,22,35,85,225,320,288,185,54,11,9],
  saraikela_kharsawan:[17,20,24,37,88,228,318,286,186,54,13,11],
  simdega:       [15,19,24,39,91,236,326,291,190,56,13,11],
  west_singhbhum:[16,20,26,40,92,238,322,288,188,55,14,11]
};

/**
 * CROP_DICT - Crop master: cost, yield, market price, season, soil compatibility
 * marketPrice: ₹/quintal (1 quintal = 100 kg). Yield in kg/acre.
 * Season: Kharif (Jun–Oct), Rabi (Oct–Mar), Zaid (Mar–Jun)
 */
const CROP_DICT = [
  {
    id: 'rice',
    name: 'Rice',
    nameHi: 'धान / चावल',
    costPerAcre: 18000,
    yieldPerAcre: 1000,
    marketPricePerQuintal: 2200,
    season: 'Kharif',
    seasonHi: 'खरीफ',
    soils: ['red', 'clay', 'black'],
    sowingMonths: 'June-July'
  },
  {
    id: 'maize',
    name: 'Maize',
    nameHi: 'मक्का',
    costPerAcre: 12000,
    yieldPerAcre: 1200,
    marketPricePerQuintal: 1900,
    season: 'Kharif',
    seasonHi: 'खरीफ',
    soils: ['red', 'sandy', 'black'],
    sowingMonths: 'March-April / June'
  },
  {
    id: 'wheat',
    name: 'Wheat',
    nameHi: 'गेहूं',
    costPerAcre: 15000,
    yieldPerAcre: 900,
    marketPricePerQuintal: 2100,
    season: 'Rabi',
    seasonHi: 'रबी',
    soils: ['black', 'clay'],
    sowingMonths: 'November-December'
  },
  {
    id: 'pulses',
    name: 'Pulses',
    nameHi: 'दाल',
    costPerAcre: 8000,
    yieldPerAcre: 450,
    marketPricePerQuintal: 5500,
    season: 'Rabi',
    seasonHi: 'रबी',
    soils: ['clay', 'sandy', 'red'],
    sowingMonths: 'October-November'
  },
  {
    id: 'oilseeds',
    name: 'Oilseeds',
    nameHi: 'तिलहन',
    costPerAcre: 10000,
    yieldPerAcre: 350,
    marketPricePerQuintal: 4800,
    season: 'Kharif',
    seasonHi: 'खरीफ',
    soils: ['sandy', 'red', 'black'],
    sowingMonths: 'June-July'
  }
];

// Export for use in app.js (and in browser via window if needed)
if (typeof window !== 'undefined') {
  window.JHARKHAND_DISTRICTS = JHARKHAND_DISTRICTS;
  window.DISTRICT_ALIASES = DISTRICT_ALIASES;
  window.getDistrictKey = getDistrictKey;
  window.REAL_CROP_AREA = REAL_CROP_AREA;
  window.REAL_RAINFALL = REAL_RAINFALL;
  window.CROP_DICT = CROP_DICT;
}
