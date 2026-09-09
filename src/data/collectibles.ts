export interface Seller {
  name: string;
  avatar: string;
  rating: number;
  reviewsCount: number;
  verified: boolean;
  memberSince: string;
  location: string;
  totalListings: number;
}

export interface Collectible {
  id: string;
  title: string;
  category: string;
  price: number;
  condition: 'Museum Grade' | 'Near Mint' | 'Excellent' | 'Restored Historic';
  location: string;
  seller: Seller;
  brand: string;
  year: number | string;
  images: string[];
  description: string;
  provenance: string;
  specifications: Record<string, string>;
  featured?: boolean;
  trending?: boolean;
  recentlyListed?: boolean;
  rareFind?: boolean;
  inquiriesCount?: number;
}

export const CATEGORIES = [
  {
    id: 'horology',
    name: 'Haute Horology',
    description: 'Masterwork timepieces, grand complications & historic chronometers',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop',
    count: 28,
  },
  {
    id: 'numismatics',
    name: 'Rare Numismatics',
    description: 'Ancient coinage, historic sovereign bullion & rare mint strikes',
    image: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=1200&auto=format&fit=crop',
    count: 19,
  },
  {
    id: 'manuscripts',
    name: 'First Editions & Manuscripts',
    description: 'Signed literary masterworks, archival letters & illuminated leaves',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1200&auto=format&fit=crop',
    count: 14,
  },
  {
    id: 'fine-art',
    name: 'Fine Art & Lithographs',
    description: 'Original paintings, signed atelier prints & post-war sculpture',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop',
    count: 32,
  },
  {
    id: 'haute-joaillerie',
    name: 'Haute Joaillerie',
    description: 'Estate jewels, untreated natural gemstones & Art Deco heirlooms',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop',
    count: 22,
  },
  {
    id: 'antiquities',
    name: 'Antiquities & Relics',
    description: 'Classical Mediterranean artifacts, Dynasty bronzes & ceremonial swords',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1200&auto=format&fit=crop',
    count: 17,
  },
  {
    id: 'automobilia',
    name: 'Vintage Automobilia',
    description: 'Factory archive dossiers, period coachwork relics & competition memorabilia',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop',
    count: 11,
  },
  {
    id: 'instruments',
    name: 'Rare Instruments & Optics',
    description: 'Pioneering cameras, legendary electric guitars & astronomical brass',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop',
    count: 15,
  },
];

export const INITIAL_COLLECTIBLES: Collectible[] = [
  {
    id: 'rv-101',
    title: "Audemars Piguet Royal Oak 'Jumbo' Ref. 5402ST (A-Series)",
    category: 'Haute Horology',
    price: 118000,
    condition: 'Near Mint',
    location: 'Geneva, Switzerland',
    seller: {
      name: 'Horlogerie Privée Genevoise',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      rating: 4.98,
      reviewsCount: 47,
      verified: true,
      memberSince: '2019',
      location: 'Geneva, Switzerland',
      totalListings: 14,
    },
    brand: 'Audemars Piguet',
    year: 1972,
    images: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1200&auto=format&fit=crop',
    ],
    description: 'A monument of twentieth-century industrial design penned by Gérald Genta. This historic A-Series example displays the AP monogram distinctly positioned at 6 o’clock and preserves unpolished chamfers on its octagonal bezel. Accompanied by the original Gay Frères tapered bracelet with signed folding clasp and official Audemars Piguet Archives Extract.',
    provenance: 'Acquired new from Bucherer Lucerne in November 1972 by a Swiss private collection; maintained under single-family stewardship until 2018.',
    specifications: {
      'Movement': 'Ultra-thin Calibre 2121 Automatic',
      'Case Diameter': '39 mm',
      'Dial': 'Petite Tapisserie Gris Ardoise',
      'Material': 'Stainless Steel',
      'Box & Papers': 'Original Archives Extract & Leather Travel Pouch',
    },
    featured: true,
    trending: true,
    rareFind: true,
    inquiriesCount: 18,
  },
  {
    id: 'rv-102',
    title: '1794 Flowing Hair Silver Dollar (Historic Early Federal Strike)',
    category: 'Rare Numismatics',
    price: 465000,
    condition: 'Museum Grade',
    location: 'Philadelphia, PA, USA',
    seller: {
      name: 'Heritage Cabinet of Coins',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
      rating: 5.0,
      reviewsCount: 82,
      verified: true,
      memberSince: '2017',
      location: 'Philadelphia, USA',
      totalListings: 23,
    },
    brand: 'United States Mint',
    year: 1794,
    images: [
      'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1610375461246-83df859d849d?q=80&w=1200&auto=format&fit=crop',
    ],
    description: 'Among the most celebrated icons in American numismatics. Hand-struck on a screw press at the inaugural Philadelphia mint in October 1794. Features Robert Scot’s pioneering Liberty portrait surrounded by 15 stars, with the eagle reverse framed in an olive wreath. PCGS authenticated with exquisite pewter-grey toning and strong peripheral strike details.',
    provenance: 'Ex-Garrett Collection (1885); Nobleman Estate, Boston; private Swiss vault since 1994.',
    specifications: {
      'Certification': 'PCGS Certified AU-55',
      'Composition': '89.24% Silver, 10.76% Copper',
      'Weight': '26.96 grams',
      'Diameter': '39.5 mm',
      'Edge': 'Lettered: HUNDRED CENTS ONE DOLLAR OR UNIT',
    },
    featured: true,
    trending: false,
    rareFind: true,
    inquiriesCount: 29,
  },
  {
    id: 'rv-103',
    title: 'The Great Gatsby - First Edition in Original 1925 Dust Jacket',
    category: 'First Editions & Manuscripts',
    price: 195000,
    condition: 'Excellent',
    location: 'Mayfair, London, UK',
    seller: {
      name: 'Sloane Rare Books Ltd.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
      rating: 4.96,
      reviewsCount: 63,
      verified: true,
      memberSince: '2018',
      location: 'London, UK',
      totalListings: 35,
    },
    brand: 'Charles Scribner\'s Sons',
    year: 1925,
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1200&auto=format&fit=crop',
    ],
    description: 'The crowning masterpiece of the Jazz Age. First impression, first state with all six primary textual points present, including "chatter" on page 60 and "sick in full" on page 211. Crucially retains the legendary pictorial dust jacket designed by Francis Cugat ("Celestial Eyes"), unrestored and richly saturated with minimal spine touch-up.',
    provenance: 'Acquired in New York by bibliophile Arthur Houghton; preserved in custom morocco-backed clamshell box by Rivière & Son.',
    specifications: {
      'Binding': 'Original dark green cloth, spine gilt-lettered',
      'Pagination': 'Octavo, [iv], 218pp',
      'State': 'First Printing, First State Jacket',
      'Enclosure': 'Full goatskin solander box',
    },
    featured: true,
    trending: true,
    recentlyListed: true,
    inquiriesCount: 14,
  },
  {
    id: 'rv-104',
    title: 'Cartier Art Deco Tutti Frutti Platinum & Carved Gem Bracelet',
    category: 'Haute Joaillerie',
    price: 320000,
    condition: 'Museum Grade',
    location: 'Place Vendôme, Paris, France',
    seller: {
      name: 'Maison d\'Or & Pierres',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
      rating: 5.0,
      reviewsCount: 31,
      verified: true,
      memberSince: '2020',
      location: 'Paris, France',
      totalListings: 9,
    },
    brand: 'Cartier',
    year: 1928,
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1200&auto=format&fit=crop',
    ],
    description: 'A sublime high-period jewel commissioned during Cartier’s celebrated Indian-inspired creations for the Maharajas. Articulated platinum ribbon set with hand-carved Mughal-style emerald and ruby foliage, punctuated by cabochon sapphires and old European-cut diamonds totalling approximately 16.50 carats. Signed Cartier Paris and numbered.',
    provenance: 'Commissioned in 1928 for Princess Niloufer of Hyderabad; exhibited at the Petit Palais retrospective.',
    specifications: {
      'Metals': 'Platinum 950 (French maker’s marks)',
      'Primary Stones': 'Natural untreated Colombian emeralds & Burmese rubies',
      'Diamonds': 'Old European & baguette-cut diamonds (E-F color, VVS clarity)',
      'Length': '18.2 cm',
      'Documentation': 'Cartier Certificate of Authenticity & Historic Dossier',
    },
    featured: true,
    rareFind: true,
    inquiriesCount: 22,
  },
  {
    id: 'rv-105',
    title: 'Andy Warhol - Campbell\'s Soup I: Tomato (Hand-Signed 1968)',
    category: 'Fine Art & Lithographs',
    price: 98000,
    condition: 'Museum Grade',
    location: 'Upper East Side, New York, USA',
    seller: {
      name: 'Vanderbilt Contemporary Curators',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop',
      rating: 4.94,
      reviewsCount: 55,
      verified: true,
      memberSince: '2016',
      location: 'New York, USA',
      totalListings: 18,
    },
    brand: 'Andy Warhol / Factory Additions',
    year: 1968,
    images: [
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?q=80&w=1200&auto=format&fit=crop',
    ],
    description: 'Color screenprint on smooth wove paper. Numbered 112/250 in ballpoint pen and hand-signed in pencil verso by Andy Warhol. Printed by Salvatore Silkscreen Co., New York, and published by Factory Additions. Retains pristine paper brightness with deckled margins intact and zero light fading.',
    provenance: 'Castelli Graphics NYC (1969); Private Collection, Zurich; Framed with museum UV70 Optium acrylic.',
    specifications: {
      'Medium': 'Screenprint on paper',
      'Dimensions': '89 x 58.7 cm (35 x 23.1 in)',
      'Catalogue Raisonné': 'Feldman & Schellmann II.46',
      'Edition': 'Edition of 250',
    },
    featured: false,
    trending: true,
    recentlyListed: true,
    inquiriesCount: 11,
  },
  {
    id: 'rv-106',
    title: 'Patek Philippe Perpetual Calendar Chronograph Ref. 3970EJ',
    category: 'Haute Horology',
    price: 142000,
    condition: 'Near Mint',
    location: 'Zurich, Switzerland',
    seller: {
      name: 'Kronos Connoisseurs AG',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop',
      rating: 4.99,
      reviewsCount: 91,
      verified: true,
      memberSince: '2015',
      location: 'Zurich, Switzerland',
      totalListings: 27,
    },
    brand: 'Patek Philippe',
    year: 1991,
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop',
    ],
    description: 'Second-series execution in 18k yellow gold with solid screw-down caseback, silvered opaline dial, and feuille hands. Integrates the legendary Lemania-derived CH 27-70 Q movement displaying day, date, month, leap year cycle, and moon phases. Preserved in unpolished condition with deep Swiss hallmarks.',
    provenance: 'Sold by Beyer Chronometrie Zurich in 1991; single collector ownership until current consignment.',
    specifications: {
      'Case': '18k Yellow Gold, 36 mm diameter',
      'Calibre': 'CH 27-70 Q Manual-wind',
      'Accessories': 'Original mahogany box, certificate of origin, stylus, and gold pin-buckle',
    },
    featured: false,
    trending: true,
    rareFind: false,
    recentlyListed: true,
    inquiriesCount: 16,
  },
  {
    id: 'rv-107',
    title: '1963 Ferrari 250 GTO Factory Blueprint & Scaglietti Dossier',
    category: 'Vintage Automobilia',
    price: 88000,
    condition: 'Excellent',
    location: 'Modena, Italy',
    seller: {
      name: 'Scuderia Archivio Storico',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop',
      rating: 4.97,
      reviewsCount: 38,
      verified: true,
      memberSince: '2017',
      location: 'Modena, Italy',
      totalListings: 12,
    },
    brand: 'Ferrari / Carrozzeria Scaglietti',
    year: 1963,
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1200&auto=format&fit=crop',
    ],
    description: 'An irreplaceable artifact of motorsport genesis. Original cyanotype technical drawing of the lightweight aluminum aerodynamic chassis developed for chassis 4153GT, annotated in hand by lead engineer Giotto Bizzarrini and stamp-certified by Carrozzeria Scaglietti. Accompanied by original dyno sheets and period testing logbook.',
    provenance: 'From the personal archive of engineer Franco Rocchi; preserved in inert archival sleeve.',
    specifications: {
      'Dimensions': '110 x 75 cm',
      'Medium': 'Diazo blueprint on engineering rag linen',
      'Certification': 'Ferrari Classiche Historical Archive Letter of Authentication',
    },
    featured: false,
    trending: false,
    recentlyListed: true,
    rareFind: true,
    inquiriesCount: 9,
  },
  {
    id: 'rv-108',
    title: 'Roman Imperial Aureus of Caesar Augustus (Lugdunum Mint)',
    category: 'Antiquities & Relics',
    price: 74000,
    condition: 'Museum Grade',
    location: 'Rome, Italy',
    seller: {
      name: 'Collegium Antiquitatis',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
      rating: 4.98,
      reviewsCount: 44,
      verified: true,
      memberSince: '2016',
      location: 'Rome, Italy',
      totalListings: 16,
    },
    brand: 'Roman Empire',
    year: '2 BC',
    images: [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=1200&auto=format&fit=crop',
    ],
    description: 'Struck circa 2 BC – AD 4 at the imperial Lugdunum mint. Obverse depicts the laureate head of Augustus facing right with title CAESAR AVGVSTVS DIVI F PATER PATRIAE. Reverse honors his adoptive grandsons Gaius and Lucius Caesar standing veiled beside sacrificial simpulum and lituus. Exceptional high-relief strike with shimmering luster.',
    provenance: 'Found in Northern Gaul hoard (documented 1911); Count de Sartiges Collection; NGC Ancients slabbed Choice VF.',
    specifications: {
      'Purity': '98.6% Native Gold',
      'Weight': '7.94 grams',
      'Reference': 'RIC I 206; Calicó 176a',
      'Grading': 'NGC Ancients Choice VF, Strike 5/5, Surface 4/5',
    },
    featured: true,
    trending: false,
    rareFind: true,
    inquiriesCount: 21,
  },
  {
    id: 'rv-109',
    title: 'Leica M3 Double Stroke (First Production Batch #700244)',
    category: 'Rare Instruments & Optics',
    price: 36500,
    condition: 'Excellent',
    location: 'Wetzlar, Germany',
    seller: {
      name: 'Optik & Feinmechanik Sammler',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=200&auto=format&fit=crop',
      rating: 4.93,
      reviewsCount: 26,
      verified: true,
      memberSince: '2021',
      location: 'Frankfurt, Germany',
      totalListings: 8,
    },
    brand: 'Ernst Leitz Wetzlar',
    year: 1954,
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=1200&auto=format&fit=crop',
    ],
    description: 'An extraordinary holy grail for rangefinder aficionados. From the legendary initial run of 1,000 cameras manufactured in 1954. Features the rare corner-screw top plate, glass pressure plate, Buddha-ear strap lugs, and double-stroke film advance. Paired with a matching 50mm f/2 Summicron collapsible lens in spotless condition.',
    provenance: 'Delivered directly to Leitz technical director in March 1954; preserved in climatized collector display.',
    specifications: {
      'Serial Number': '700244 (Early first 300 produced)',
      'Viewfinder': '0.91x magnification with brightline frame lines',
      'Shutter': 'Horizontal focal plane rubberised cloth, 1 to 1/1000s + B',
      'Accompanying Lens': 'Leitz 5cm f/2 Summicron Collapsible with original lens cap',
    },
    featured: false,
    trending: true,
    recentlyListed: false,
    inquiriesCount: 12,
  },
  {
    id: 'rv-110',
    title: '1959 Gibson Les Paul Standard "Burst" in Factory Sunburst',
    category: 'Rare Instruments & Optics',
    price: 335000,
    condition: 'Near Mint',
    location: 'Nashville, TN, USA',
    seller: {
      name: 'Vintage Guitar Vault LLC',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
      rating: 5.0,
      reviewsCount: 77,
      verified: true,
      memberSince: '2016',
      location: 'Nashville, USA',
      totalListings: 15,
    },
    brand: 'Gibson Guitars',
    year: 1959,
    images: [
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?q=80&w=1200&auto=format&fit=crop',
    ],
    description: 'The pinnacle of vintage electric lutherie. Featuring bookmatched figured flame maple top bathed in original un-faded cherry sunburst nitrocellulose lacquer. Retains two virgin, original PAF humbucking pickups with untouched solder joints, original bumblebee capacitors, and pristine Brazilian rosewood fingerboard with cellulose trapezoid inlays.',
    provenance: 'Documented in "The Beauty of the \'Burst" (p. 84); single professional session owner from 1964 to 2012.',
    specifications: {
      'Serial Number': '9 0823 (Registered 1959)',
      'Weight': '8 lbs 11 oz (Ideal resonance balance)',
      'Pickups': 'Original PAF Humbuckers (8.1k Neck / 8.4k Bridge)',
      'Case': 'Original Lifton brown hard case with pink plush lining',
    },
    featured: true,
    trending: true,
    rareFind: true,
    inquiriesCount: 34,
  },
  {
    id: 'rv-111',
    title: 'Edo Period Samurai Armor (Tosei Gusoku) with Dragon Crest',
    category: 'Antiquities & Relics',
    price: 62000,
    condition: 'Restored Historic',
    location: 'Kyoto, Japan',
    seller: {
      name: 'Kyoto Imperial Curiosities',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
      rating: 4.97,
      reviewsCount: 52,
      verified: true,
      memberSince: '2018',
      location: 'Kyoto, Japan',
      totalListings: 19,
    },
    brand: 'Myochin School Armorer',
    year: 1740,
    images: [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?q=80&w=1200&auto=format&fit=crop',
    ],
    description: 'An imposing samurai ceremonial suit of armor crafted by a master of the Myochin lineage. The 32-plate russet iron kabuto helmet is surmounted by a gilded copper dragon maedate crest, paired with a fierce ressei menpo face mask bearing genuine horsehair mustache. Black-lacquered scales are laced in silk navy cord (kebiki odoshi).',
    provenance: 'Preserved by the Matsudaira samurai clan of Aizu domain; exhibited at the Kyoto National Museum.',
    specifications: {
      'Materials': 'Forged iron, black urushi lacquer, gold leaf, dyed silk, boar leather',
      'Armor Box': 'Original black lacquered storage chest (gusoku bitsu) with family mon',
      'Height on Stand': '160 cm (Full display armature included)',
    },
    featured: false,
    trending: false,
    recentlyListed: true,
    inquiriesCount: 8,
  },
  {
    id: 'rv-112',
    title: 'René Lalique Amber Glass \'Tourbillons\' Vase (Marcilhac #973)',
    category: 'Fine Art & Lithographs',
    price: 38500,
    condition: 'Near Mint',
    location: 'Brussels, Belgium',
    seller: {
      name: 'Galerie Art Nouveau & Deco',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      rating: 4.92,
      reviewsCount: 39,
      verified: true,
      memberSince: '2020',
      location: 'Brussels, Belgium',
      totalListings: 14,
    },
    brand: 'René Lalique',
    year: 1926,
    images: [
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop',
    ],
    description: 'A sculptural triumph of the Art Deco glassmaker\'s art. The \'Tourbillons\' vase features deeply molded undulating swirls embellished with delicate black enamel accents across thick, rich cognac-amber crystal. Signed \'R. Lalique France\' in wheel-cut intaglio script to base.',
    provenance: 'Private Collection, Geneva; acquired at Sotheby\'s Monaco in 1989.',
    specifications: {
      'Dimensions': 'Height 20.8 cm, Diameter 19.5 cm',
      'Reference': 'F. Marcilhac, René Lalique 1860-1945, Cat. Raisonné No. 973',
      'Condition': 'No chips, flea bites or restorations; micro shelf wear to base',
    },
    featured: false,
    trending: false,
    recentlyListed: true,
    inquiriesCount: 7,
  },
];

export function getAllCollectibles(): Collectible[] {
  return INITIAL_COLLECTIBLES;
}

export function getCollectibleById(id: string): Collectible | undefined {
  return INITIAL_COLLECTIBLES.find(item => item.id === id);
}

export function getFeaturedCollectibles(): Collectible[] {
  return INITIAL_COLLECTIBLES.filter(item => item.featured);
}

export function getTrendingCollectibles(): Collectible[] {
  return INITIAL_COLLECTIBLES.filter(item => item.trending);
}

export function getRecentlyListedCollectibles(): Collectible[] {
  return INITIAL_COLLECTIBLES.filter(item => item.recentlyListed);
}

export function getRareFinds(): Collectible[] {
  return INITIAL_COLLECTIBLES.filter(item => item.rareFind);
}
