// ─── Featured (Home page hero cards) ─────────────────────────────────────────
export const FEATURED_SERVICES = [
  { id: 1, name: 'Hair Cutting & Styling', category: 'HAIR',      price: 800  },
  { id: 2, name: 'Facials',               category: 'SKIN',      price: 1500 },
  { id: 3, name: 'Hair Treatments',       category: 'TREATMENT', price: 2500 },
]

// ─── Full menu grouped by category (Services page) ───────────────────────────
export const SERVICE_CATEGORIES = [
  {
    id: 'hair',
    name: 'Hair Cutting & Styling',
    description: 'From sharp fades to timeless classic cuts, our barbers shape every style to suit your face and personality. Finished with precision and a clean styling touch — you walk out looking your absolute best.',
    services: [
      { name: 'Hair Cut',      price: 800  },
      { name: 'Fade Cut',      price: 1000 },
      { name: 'Beard Shave',   price: 500  },
      { name: 'Turkish Beard', price: 700  },
      { name: 'Hair Styling',  price: 500  },
    ],
  },
  {
    id: 'treatment',
    name: 'Hair Treatments',
    description: 'Revive tired, damaged hair with our professional treatments. From deep protein therapy to high-shine finishing, we use trusted products to strengthen, smooth, and restore your hair\'s natural health.',
    services: [
      { name: 'Hair Treatments',    price: '8,000 – 10,000' },
      { name: 'Hair Pumps',         price: '8,000 – 10,000' },
      { name: 'Hair Protein Blue',  price: 3500 },
      { name: 'Hair Protein Black', price: 3000 },
      { name: 'Hair Shiner',        price: 1500 },
    ],
  },
  {
    id: 'facial',
    name: 'Facials',
    description: 'Refresh and rejuvenate your skin with facials tailored to your needs — brightening, hydrating, and deep-cleansing. Walk out with skin that looks clean, even-toned, and visibly healthier.',
    services: [
      { name: 'Jensen Facial',    price: 4000 },
      { name: 'Hydra Facial',     price: 5000 },
      { name: 'Dermacos Facial',  price: 3000 },
      { name: 'Gold Facial',      price: 3000 },
      { name: 'Whitening Facial', price: 2500 },
      { name: 'Silver Facial',    price: 2500 },
      { name: 'Herbal Facial',    price: 2000 },
    ],
  },
  {
    id: 'cleansing',
    name: 'Cleansing',
    description: 'A quick, professional reset for your skin. Our deep-cleansing treatments clear away dirt and dullness, leaving you looking fresh and feeling sharp.',
    services: [
      { name: 'Jensen Cleansing',    price: 2500 },
      { name: 'Dermacos Cleansing',  price: 2000 },
      { name: 'Whitening Cleansing', price: 1800 },
      { name: 'Herbal Cleansing',    price: 1500 },
      { name: 'Silver Cleansing',    price: 1500 },
      { name: 'Gold Cleansing',      price: 1500 },
    ],
  },
  {
    id: 'colour',
    name: 'Hair & Beard Colour',
    description: "Natural, long-lasting colour for hair and beard using premium L'Oréal and Keune ranges. Matched to your tone and applied evenly for a clean, confident finish.",
    services: [
      { name: "L'Oréal Hair Colour",  price: 2000 },
      { name: "L'Oréal Beard Colour", price: 1000 },
      { name: 'Keune Hair Colour',    price: 1500 },
      { name: 'Keune Beard Colour',   price: 800  },
      { name: 'Apple Beard Colour',   price: 800  },
    ],
  },
  {
    id: 'wax',
    name: 'Wax & Cleaning',
    description: 'Smooth, hygienic grooming for face and body, handled by experienced staff — quick, clean, and comfortable.',
    services: [
      { name: 'Face Wax',       price: 500            },
      { name: 'Half Body Wax',  price: '4,000 – 8,000' },
      { name: 'Foot Cleansing', price: 1500           },
      { name: 'Hand Cleansing', price: 500            },
    ],
  },
  {
    id: 'massage',
    name: 'Massage & Care',
    description: 'Relax and recharge with our massage and care services — from head and shoulder relief to full manicure and pedicure. The perfect way to unwind after your grooming session.',
    services: [
      { name: 'Manicure',                  price: 1500 },
      { name: 'Pedicure',                  price: 1500 },
      { name: 'Head & Shoulder Massage',   price: 1000 },
      { name: 'Foot Massage',              price: 1000 },
      { name: 'Hand Massage',              price: 1000 },
      { name: 'Head Massage',              price: 800  },
    ],
  },
]

// ─── Combo deals (Home + Services pages) ─────────────────────────────────────
export const DEALS = [
  {
    id: 1,
    name: 'Deal 1',
    desc: 'Hair Cut, Beard Shave, Cleansing.',
    includes: ['Hair Cut', 'Beard Shave', 'Cleansing'],
    price: 1300,
    popular: false,
  },
  {
    id: 2,
    name: 'Deal 2',
    desc: 'Hair Cut, Beard Shave, Facial, Face Wax.',
    includes: ['Hair Cut', 'Beard Shave', 'Facial', 'Face Wax'],
    price: 2500,
    popular: true,
  },
  {
    id: 3,
    name: 'Deal 3',
    desc: 'Hair Cut, Beard Shave, Hair Protein, Herbal Cleansing, Face Cleansing.',
    includes: ['Hair Cut', 'Beard Shave', 'Hair Protein', 'Herbal Cleansing', 'Face Cleansing'],
    price: 4000,
    popular: false,
  },
  {
    id: 4,
    name: 'Deal 4',
    desc: 'Hair Cut, Beard Shave, Shiner, Colour, Cleansing, Face Wax, Skin Polish.',
    includes: ['Hair Cut', 'Beard Shave', 'Shiner', 'Colour', 'Cleansing', 'Face Wax', 'Skin Polish'],
    price: 5000,
    popular: false,
  },
  {
    id: 5,
    name: 'Deal 5',
    desc: 'Hair Cut, Beard Shave, Face Wax, Face Skin Polish.',
    includes: ['Hair Cut', 'Beard Shave', 'Face Wax', 'Face Skin Polish'],
    price: 1500,
    popular: false,
  },
]

// ─── Real Google reviews ──────────────────────────────────────────────────────
export const REVIEWS = [
  {
    id: 1,
    name: 'Muhammad Tayyab',
    stars: 5,
    text: 'Excellent service and professional staff. Clean environment and great attention to detail. Highly recommended for anyone looking for quality grooming.',
  },
  {
    id: 2,
    name: 'Zeeshi Fankar',
    stars: 5,
    text: 'Nice saloon in Wah Cantt, very good job. Clean and relaxing atmosphere — great experience overall.',
  },
  {
    id: 3,
    name: "Usman's Creation",
    stars: 5,
    text: 'Best saloon ever! Will definitely come back. Outstanding attention to detail every single time.',
  },
]

// ─── Premium Facilities (Services page + Home highlight) ─────────────────────
export const FACILITIES = [
  {
    id:    1,
    icon:  'chair',
    image: '/images/privacy.png',
    name:  'Private Grooming Chair',
    desc:  'A dedicated private section with its own chair, where grooming and haircuts can be done in complete privacy and comfort — perfect for clients who prefer a more personal, secluded experience.',
    short: 'Private seating for a personal, secluded grooming experience.',
  },
  {
    id:    2,
    icon:  'manicure',
    image: '/images/manicure.png',
    name:  'Private Manicure & Pedicure Section',
    desc:  'A separate private area for manicure and pedicure services, offering a relaxed and discreet space to unwind while you\'re pampered.',
    short: 'A discreet, relaxed space dedicated to nail and foot care.',
  },
  {
    id:    3,
    icon:  null,
    image: '/images/chair.png',
    name:  'Automatic Massage Chair',
    desc:  'A state-of-the-art automatic massage chair for ultimate relaxation — melt away stress with a soothing full-body massage during your visit.',
    short: 'Full-body automatic massage chair — unwind while you wait.',
  },
  {
    id:    4,
    icon:  'ac',
    image: '/images/ac.png',
    name:  'Fully Air-Conditioned',
    desc:  'Relax in a cool, comfortable, fully air-conditioned environment throughout your visit — premium comfort in every season.',
    short: 'Fully air-conditioned for cool, comfortable visits year-round.',
  },
]

// ─── Why Choose Us (Home + About pages) ──────────────────────────────────────
export const WHY_CHOOSE = [
  { id: 1, icon: 'clock',    label: '14 Years\nExperience'              },
  { id: 2, icon: 'gem',      label: "Premium Products\n(L'Oréal, Keune)" },
  { id: 3, icon: 'shield',   label: 'Skilled &\nTrained Team'           },
  { id: 4, icon: 'calendar', label: 'Clean Relaxed\nSpace'              },
]

// ─── Gallery images (Gallery page) ───────────────────────────────────────────
export const GALLERY_IMAGES = [
  ...Array.from({ length: 21 }, (_, i) => ({
    id: i + 1,
    src: `/images/haircut-${i + 1}.jpeg`,
    category: 'haircuts',
    alt: `Men's haircut at Bliss Haven Edge salon, Wah Cantt`,
  })),
  ...Array.from({ length: 3 }, (_, i) => ({
    id: 9 + i,
    src: `/images/beard-${i + 1}.jpeg`,
    category: 'beard',
    alt: `Beard styling and grooming at Bliss Haven Edge, Wah Cantt`,
  })),
  { id: 12, src: '/images/interior-1.jpeg', category: 'interior', alt: "Bliss Haven Edge men's salon interior, Wah Cantt" },
  { id: 13, src: '/images/interior-2.jpeg', category: 'interior', alt: "Bliss Haven Edge premium grooming lounge, Wah Cantt" },
  { id: 14, src: '/images/interior-3.jpeg', category: 'interior', alt: "Barber station at Bliss Haven Edge salon, Wah Cantt" },
  { id: 15, src: '/images/interior-4.jpeg', category: 'interior', alt: "Relaxed grooming space at Bliss Haven Edge, Wah Cantt" },
  { id: 16, src: '/images/interior-7.jpeg', category: 'interior', alt: "Bliss Haven Edge salon ambiance, Laiq Ali Chowk, Wah Cantt" },
  { id: 19, src: '/images/exterior-1.jpeg', category: 'interior', alt: "Bliss Haven Edge salon exterior, CB Shop No 2, Wah Cantt" },
]

// ─── Transformation videos (Gallery page) ────────────────────────────────────
export const GALLERY_VIDEOS = [
  { id: 0, src: '/videos/transform-5.mp4', title: 'Haircut Transformation', category: 'TRANSFORMATION' },
  { id: 1, src: '/videos/transform-1.mp4', title: 'The Ritual of Grooming', category: 'TRANSFORMATION' },
  { id: 2, src: '/videos/transform-2.mp4', title: 'The Art of Scissor Cutting', category: 'SCISSOR CRAFT' },
  { id: 3, src: '/videos/transform-6.mp4', title: 'The Perfect Perm',       category: 'HAIR PERM'    },
  { id: 4, src: '/videos/groom-1.mp4',     title: 'The Complete Groom',        category: 'GROOMING' },
  { id: 5, src: '/videos/groom-2.mp4',     title: 'The Grooming Experience',   category: 'GROOMING'  },
]
