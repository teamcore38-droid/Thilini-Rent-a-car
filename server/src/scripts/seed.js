import mongoose from '../config/mongoose.js';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import dns from 'node:dns';
import { Vehicle } from '../models/Vehicle.js';
import { Admin } from '../models/Admin.js';
import { Service } from '../models/Service.js';
import { FAQ } from '../models/FAQ.js';
import { Testimonial } from '../models/Testimonial.js';
import { Setting } from '../models/Setting.js';
import { DEFAULT_BUSINESS_SETTINGS } from '../config/constants.js';

dotenv.config();

if (!process.env.VERCEL) {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
  } catch (e) {}
}

const sampleVehicles = [
  {
    name: 'Suzuki Alto 800',
    slug: 'suzuki-alto-800',
    make: 'Suzuki',
    model: 'Alto 800',
    year: 2022,
    category: 'Economy',
    transmission: 'Manual',
    fuelType: 'Petrol',
    seats: 4,
    doors: 4,
    luggage: 1,
    hasAC: true,
    features: ['Air Conditioning', 'FM/USB Audio', 'Power Steering', 'Exceptional Fuel Economy (18-22 km/l)'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80',
        alt: 'Suzuki Alto Economy Car',
        isPrimary: true
      }
    ],
    serviceTypes: ['Self Drive', 'Airport Transfer', 'Long-Term Rental'],
    dailyRate: 7500,
    weeklyRate: 48000,
    monthlyRate: 175000,
    deposit: 20000,
    includedMileagePerDay: 100,
    excessMileageRate: 60,
    status: 'available',
    featured: true,
    active: true
  },
  {
    name: 'Suzuki Wagon R Stingray Hybrid',
    slug: 'suzuki-wagon-r-stingray-hybrid',
    make: 'Suzuki',
    model: 'Wagon R Stingray',
    year: 2023,
    category: 'Economy',
    transmission: 'Automatic',
    fuelType: 'Hybrid',
    seats: 4,
    doors: 4,
    luggage: 2,
    hasAC: true,
    features: ['Automatic Transmission', 'Smart Hybrid Tech', 'Reverse Camera', 'Spacious Cabin & Legroom', 'Bluetooth'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
        alt: 'Suzuki Wagon R Hybrid',
        isPrimary: true
      }
    ],
    serviceTypes: ['Self Drive', 'With Driver', 'Airport Transfer', 'Long-Term Rental'],
    dailyRate: 9500,
    weeklyRate: 60000,
    monthlyRate: 220000,
    deposit: 25000,
    includedMileagePerDay: 100,
    excessMileageRate: 65,
    status: 'available',
    featured: true,
    active: true
  },
  {
    name: 'Toyota Aqua Hybrid',
    slug: 'toyota-aqua-hybrid',
    make: 'Toyota',
    model: 'Aqua G / S Grade',
    year: 2022,
    category: 'Hybrid',
    transmission: 'Automatic',
    fuelType: 'Hybrid',
    seats: 5,
    doors: 4,
    luggage: 2,
    hasAC: true,
    features: ['EV/Eco Mode Driving', 'Push Start', 'Touchscreen Infotainment', 'High Fuel Efficiency (24+ km/l)', 'Dual Airbags'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80',
        alt: 'Toyota Aqua Hybrid',
        isPrimary: true
      }
    ],
    serviceTypes: ['Self Drive', 'With Driver', 'Airport Transfer', 'Long-Term Rental'],
    dailyRate: 12000,
    weeklyRate: 78000,
    monthlyRate: 280000,
    deposit: 30000,
    includedMileagePerDay: 100,
    excessMileageRate: 75,
    status: 'available',
    featured: true,
    active: true
  },
  {
    name: 'Toyota Prius 4th Gen Hybrid',
    slug: 'toyota-prius-hybrid',
    make: 'Toyota',
    model: 'Prius S Safety Plus',
    year: 2021,
    category: 'Sedan',
    transmission: 'Automatic',
    fuelType: 'Hybrid',
    seats: 5,
    doors: 4,
    luggage: 3,
    hasAC: true,
    features: ['Toyota Safety Sense', 'Climate Control AC', 'Cruise Control', 'Large Boot Space', 'Premium Sound System'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
        alt: 'Toyota Prius Sedan',
        isPrimary: true
      }
    ],
    serviceTypes: ['Self Drive', 'With Driver', 'Airport Transfer', 'Long-Term Rental', 'Wedding Hire'],
    dailyRate: 15000,
    weeklyRate: 98000,
    monthlyRate: 350000,
    deposit: 35000,
    includedMileagePerDay: 100,
    excessMileageRate: 85,
    status: 'available',
    featured: true,
    active: true
  },
  {
    name: 'Toyota Premio 1.5 Executive',
    slug: 'toyota-premio-executive',
    make: 'Toyota',
    model: 'Premio NZT260',
    year: 2020,
    category: 'Sedan',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    seats: 5,
    doors: 4,
    luggage: 3,
    hasAC: true,
    features: ['Teak Interior Trims', 'Electric Seats', 'Velvet Upholstery', 'Dual Climate AC', 'Smooth Executive Ride'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=800&q=80',
        alt: 'Toyota Premio Luxury Sedan',
        isPrimary: true
      }
    ],
    serviceTypes: ['With Driver', 'Self Drive', 'Airport Transfer', 'Wedding Hire'],
    dailyRate: 16500,
    weeklyRate: 108000,
    monthlyRate: 390000,
    deposit: 35000,
    includedMileagePerDay: 100,
    excessMileageRate: 90,
    status: 'available',
    featured: true,
    active: true
  },
  {
    name: 'Toyota Raize Turbo Compact SUV',
    slug: 'toyota-raize-turbo-suv',
    make: 'Toyota',
    model: 'Raize Z Grade',
    year: 2023,
    category: 'SUV',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    seats: 5,
    doors: 5,
    luggage: 3,
    hasAC: true,
    features: ['High Ground Clearance (200mm)', 'Turbo Charged Power', 'Apple CarPlay & Android Auto', '360 Camera', 'Hill Start Assist'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
        alt: 'Toyota Raize SUV',
        isPrimary: true
      }
    ],
    serviceTypes: ['Self Drive', 'With Driver', 'Airport Transfer', 'Long-Term Rental'],
    dailyRate: 18000,
    weeklyRate: 118000,
    monthlyRate: 420000,
    deposit: 40000,
    includedMileagePerDay: 100,
    excessMileageRate: 95,
    status: 'available',
    featured: true,
    active: true
  },
  {
    name: 'Toyota KDH Commuter Van (High Roof)',
    slug: 'toyota-kdh-commuter-van',
    make: 'Toyota',
    model: 'HiAce KDH 200',
    year: 2021,
    category: 'Van',
    transmission: 'Manual',
    fuelType: 'Diesel',
    seats: 12,
    doors: 4,
    luggage: 6,
    hasAC: true,
    features: ['Dual Line Rear AC', 'Reclining High-Back Seats', 'Massive Luggage Capacity', 'Islandwide Tour Driver Available', 'Microphone System'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
        alt: 'Toyota KDH Van',
        isPrimary: true
      }
    ],
    serviceTypes: ['With Driver', 'Airport Transfer', 'Wedding Hire', 'Long-Term Rental'],
    dailyRate: 22000,
    weeklyRate: 145000,
    monthlyRate: 520000,
    deposit: 35000,
    includedMileagePerDay: 100,
    excessMileageRate: 110,
    status: 'available',
    featured: true,
    active: true
  },
  {
    name: 'Toyota Land Cruiser Prado TX',
    slug: 'toyota-land-cruiser-prado-tx',
    make: 'Toyota',
    model: 'Land Cruiser Prado',
    year: 2022,
    category: 'Luxury',
    transmission: 'Automatic',
    fuelType: 'Diesel',
    seats: 7,
    doors: 5,
    luggage: 5,
    hasAC: true,
    features: ['Full 4WD Capability', 'Sunroof', 'Leather Upholstery', '3-Zone Climate Control', 'Chauffeur / VIP Protocol Available'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80',
        alt: 'Toyota Prado Luxury 4x4',
        isPrimary: true
      }
    ],
    serviceTypes: ['With Driver', 'Wedding Hire', 'Airport Transfer', 'Self Drive'],
    dailyRate: 38000,
    weeklyRate: 250000,
    monthlyRate: 890000,
    deposit: 75000,
    includedMileagePerDay: 100,
    excessMileageRate: 160,
    status: 'available',
    featured: false,
    active: true
  },
  {
    name: 'Mercedes-Benz C200 AMG',
    slug: 'mercedes-benz-c200-amg',
    make: 'Mercedes-Benz',
    model: 'C200 AMG Line',
    year: 2021,
    category: 'Wedding Vehicle',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    seats: 5,
    doors: 4,
    luggage: 3,
    hasAC: true,
    features: ['Panoramic Sunroof', 'Burmester Surround Sound', 'Ambient Lighting', 'Ribbon & Flower Decor Allowed', 'White Exterior Finish'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
        alt: 'Mercedes-Benz Luxury Wedding Car',
        isPrimary: true
      }
    ],
    serviceTypes: ['Wedding Hire', 'With Driver', 'Airport Transfer'],
    dailyRate: 35000,
    weeklyRate: 230000,
    monthlyRate: 800000,
    deposit: 60000,
    includedMileagePerDay: 80,
    excessMileageRate: 150,
    status: 'available',
    featured: false,
    active: true
  }
];

const sampleServices = [
  {
    title: 'Self-Drive Rentals',
    slug: 'self-drive-rentals',
    shortDescription: 'Freedom to explore Sri Lanka at your own pace with well-maintained hatchbacks, sedans, and compact SUVs.',
    fullDescription: 'Experience complete privacy and schedule flexibility across Sri Lanka. All self-drive rentals undergo comprehensive multi-point mechanical inspections, sanitized interiors, and transparent mileage allowances.',
    iconName: 'Key',
    features: [
      'Comprehensive fleet selection (Manual & Automatic)',
      'Flexible daily, weekly, and monthly rates',
      'Straightforward deposit refund terms',
      'Assistance with International Driving Permit endorsements'
    ],
    order: 1,
    active: true
  },
  {
    title: 'Chauffeur-Driven Rentals',
    slug: 'chauffeur-driven-rentals',
    shortDescription: 'Sit back and relax with experienced, courteous English-speaking Sri Lankan drivers who know every highway and scenic route.',
    fullDescription: 'Enjoy stress-free travel for business, leisure, or island tours. Our experienced chauffeurs handle all traffic, navigation, and parking while you focus on enjoying your journey.',
    iconName: 'UserCheck',
    features: [
      'Courteous, verified, professional chauffeurs',
      'Custom islandwide itineraries (Hill country, Coastal belt, Cultural Triangle)',
      'No stress of driving in unfamiliar traffic',
      'Fixed daily driver allowance and transparent guidelines'
    ],
    order: 2,
    active: true
  },
  {
    title: 'Airport Pickup & Drop-off',
    slug: 'airport-pickup-dropoff',
    shortDescription: 'Reliable on-time transfers to and from Bandaranaike International Airport (CMB - Katunayake) with flight tracking.',
    fullDescription: 'Start or end your trip in absolute comfort. We track your flight arrival time in real-time so your vehicle is ready the moment you step out of customs.',
    iconName: 'Plane',
    features: [
      '24/7 Katunayake Airport delivery & collection',
      'Real-time flight delay monitoring',
      'Meet & Greet service with personalized signage upon request',
      'Direct highway transfers to Colombo, Galle, Kandy, and Negombo'
    ],
    order: 3,
    active: true
  },
  {
    title: 'Wedding & Event Hire',
    slug: 'wedding-event-hire',
    shortDescription: 'Make your special day unforgettable with elegant luxury sedans and premium wedding vehicles.',
    fullDescription: 'Arrive in style on your wedding day. We provide pristine white and black luxury vehicles, punctually delivered with smart chauffeur service.',
    iconName: 'HeartHandshake',
    features: [
      'Pristine luxury sedans (Mercedes, BMW, Toyota Premio)',
      'Coordination with your floral decorators',
      'Well-groomed, punctual chauffeurs in formal attire',
      'Package deals for bridal and family transport vans'
    ],
    order: 4,
    active: true
  },
  {
    title: 'Monthly & Long-Term Rentals',
    slug: 'monthly-long-term-rentals',
    shortDescription: 'Cost-effective corporate packages and long-stay rental agreements with priority maintenance.',
    fullDescription: 'Ideal for expatriates, corporate executives, NGOs, and long-stay visitors in Sri Lanka. Enjoy significant discounts over daily rates with replacement vehicle guarantees.',
    iconName: 'CalendarDays',
    features: [
      'Heavily discounted monthly packages',
      'Scheduled periodic maintenance included',
      'Instant replacement vehicle in case of servicing',
      'Consolidated monthly corporate billing'
    ],
    order: 5,
    active: true
  }
];

const sampleFAQs = [
  {
    question: 'What documents are required to rent a self-drive car in Sri Lanka?',
    answer: 'For Sri Lankan citizens: National Identity Card (NIC) / Valid Passport, a valid Sri Lankan Driving Licence, and a recent utility bill as proof of address. For foreign tourists: Valid Passport, your home country Driving Licence, and an International Driving Permit (IDP) or a Temporary Sri Lankan Driving Licence endorsement issued by the AA Sri Lanka (Automobile Association of Ceylon).',
    category: 'Documents & Licences',
    order: 1,
    active: true
  },
  {
    question: 'How do I obtain the driving permit endorsement for tourists?',
    answer: 'If you possess an International Driving Permit (IDP) from your home country, it can be quickly endorsed upon arrival or handled prior to your visit. Alternatively, AA Sri Lanka in Colombo can endorse your foreign national licence. Our team can advise you on the quickest procedure.',
    category: 'Documents & Licences',
    order: 2,
    active: true
  },
  {
    question: 'Is a refundable security deposit required?',
    answer: 'Yes, a refundable security deposit is collected upon vehicle handover (typically between LKR 20,000 to LKR 75,000 depending on vehicle category). This deposit is refunded promptly upon the vehicle\'s safe return after fuel and excess mileage reconciliation.',
    category: 'Rates & Deposits',
    order: 3,
    active: true
  },
  {
    question: 'What is the daily included mileage limit and excess charge?',
    answer: 'Standard rentals include 100 km per day (calculated cumulatively over the rental period). Any excess mileage is charged at a transparent rate (typically LKR 60 – LKR 160 per additional km, depending on the vehicle model). Unlimited mileage packages are also available upon prior request.',
    category: 'Mileage & Fuel',
    order: 4,
    active: true
  },
  {
    question: 'What is the fuel policy?',
    answer: 'We operate on a "Same-to-Same" fuel policy. The vehicle will be handed over with a recorded fuel level (commonly full or half tank) and must be returned with the equivalent fuel level.',
    category: 'Mileage & Fuel',
    order: 5,
    active: true
  },
  {
    question: 'Can you deliver the vehicle directly to Bandaranaike International Airport (CMB)?',
    answer: 'Yes! We provide convenient 24/7 delivery and pickup services at Bandaranaike International Airport (Katunayake) as well as Colombo city hotels, Negombo, and islandwide destinations.',
    category: 'Airport & Delivery',
    order: 6,
    active: true
  },
  {
    question: 'What is the cancellation and booking amendment policy?',
    answer: 'You can modify or cancel your booking request without penalty by contacting our team via WhatsApp or phone at least 48 hours prior to your scheduled pickup time.',
    category: 'Cancellations',
    order: 7,
    active: true
  },
  {
    question: 'Can an additional driver be registered on the rental agreement?',
    answer: 'Yes, one additional driver can be included on the rental agreement free of charge, provided their valid driving licence and identity documents are submitted prior to vehicle handover.',
    category: 'General',
    order: 8,
    active: true
  }
];

const sampleTestimonials = [
  {
    customerName: 'Saman Jayasinghe (Sample Review)',
    locationOrCountry: 'Colombo, Sri Lanka',
    rating: 5,
    comment: 'Punctual airport handover and extremely clean Toyota Aqua. Transparent terms and prompt deposit return. Recommended for reliable travel in Sri Lanka.',
    vehicleRented: 'Toyota Aqua Hybrid',
    serviceType: 'Self Drive',
    isVerified: true,
    isPlaceholder: true, // Marked as placeholder as required
    order: 1,
    active: true
  },
  {
    customerName: 'David & Sarah Jenkins (Sample Review)',
    locationOrCountry: 'United Kingdom (Tourist)',
    rating: 5,
    comment: 'Our chauffeur for the 10-day cultural triangle tour was fantastic and very polite. The KDH van was spacious and comfortable for all our luggage.',
    vehicleRented: 'Toyota KDH Commuter Van',
    serviceType: 'With Driver',
    isVerified: true,
    isPlaceholder: true,
    order: 2,
    active: true
  },
  {
    customerName: 'Kavinda Perera (Sample Review)',
    locationOrCountry: 'Negombo, Sri Lanka',
    rating: 5,
    comment: 'Hired the Suzuki Wagon R for 2 weeks. Fuel economy was great and the WhatsApp reservation was quick and hassle-free.',
    vehicleRented: 'Suzuki Wagon R Hybrid',
    serviceType: 'Self Drive',
    isVerified: true,
    isPlaceholder: true,
    order: 3,
    active: true
  }
];

export const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/thilini_rent_a_car';
    await mongoose.connect(mongoUri, {
      dbName: 'thilini_rent_a_car',
      serverSelectionTimeoutMS: 15000
    });
    console.log(`[Seed Engine] Connected to MongoDB: ${mongoose.connection.host}/${mongoose.connection.name}`);

    // 1. Seed Admin
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@thilinirentacar.com').toLowerCase();
    const existingAdmin = await Admin.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@Thilini2026#';
      const passwordHash = await bcrypt.hash(adminPassword, 12);
      await Admin.create({
        name: process.env.ADMIN_NAME || 'Admin',
        email: adminEmail,
        passwordHash,
        role: 'superadmin'
      });
      console.log(`[Seed Engine] Created default superadmin: ${adminEmail}`);
    } else {
      console.log(`[Seed Engine] Admin ${adminEmail} already exists`);
    }

    // 2. Seed Vehicles
    await Vehicle.deleteMany({});
    await Vehicle.insertMany(sampleVehicles);
    console.log(`[Seed Engine] Seeded ${sampleVehicles.length} Sri Lankan sample vehicles`);

    // 3. Seed Services
    await Service.deleteMany({});
    await Service.insertMany(sampleServices);
    console.log(`[Seed Engine] Seeded ${sampleServices.length} rental services`);

    // 4. Seed FAQs
    await FAQ.deleteMany({});
    await FAQ.insertMany(sampleFAQs);
    console.log(`[Seed Engine] Seeded ${sampleFAQs.length} FAQs`);

    // 5. Seed Testimonials (clearly marked as placeholders)
    await Testimonial.deleteMany({});
    await Testimonial.insertMany(sampleTestimonials);
    console.log(`[Seed Engine] Seeded ${sampleTestimonials.length} placeholder testimonials`);

    // 6. Seed Site Settings
    const existingSettings = await Setting.findOne();
    if (!existingSettings) {
      await Setting.create(DEFAULT_BUSINESS_SETTINGS);
      console.log('[Seed Engine] Seeded default business settings');
    } else {
      console.log('[Seed Engine] Business settings already exist');
    }

    console.log('[Seed Engine] Database seeding completed successfully!');
    if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
      process.exit(0);
    }
  } catch (error) {
    console.error('[Seed Engine Error]:', error);
    if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
      process.exit(1);
    }
  }
};

if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  seedDatabase();
}
