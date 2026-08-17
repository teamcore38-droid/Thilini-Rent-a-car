# 🚗 Thilini Rent A Car - Production-Ready MERN Platform (Sri Lanka)

A fast, mobile-first, conversion-focused vehicle rental and reservation platform built for **Thilini Rent A Car** (Sri Lanka). The system connects local customers, international tourists, and corporate travellers to self-drive and chauffeur-driven car rental services across Sri Lanka.

---

## 🌟 Core Highlights & Primary Conversion Channels

1. **Direct Booking Engine (3-Step)**: Fast reservation request generator with date overlap validation and human-readable reference codes (`TRC-2026-XXXX`).
2. **Instant WhatsApp Direct Booking**: 1-tap pre-filled WhatsApp quote and enquiry actions across all vehicle pages and booking confirmations.
3. **Direct Telephone Hotline**: 1-tap phone dialing on desktop and mobile sticky bottom action bar.
4. **Transparent Sri Lankan Localization**: Prices formatted in Sri Lankan Rupees (`LKR 12,000 / day`), +94 phone number validation, Katunayake Airport (CMB) coverage, and `Asia/Colombo` timezone handling.
5. **Secure Administrative Portal (`/admin`)**: Protected fleet manager, reservation review, booking status lifecycles, and CSV export.

---

## 🛠️ Technology Stack

- **Frontend**:
  - React 19 with Vite 8
  - React Router v7
  - Tailwind CSS with Sri Lankan crimson & charcoal design tokens
  - Axios (with centralized JWT interceptor)
  - React Hook Form
  - Lucide React icons
- **Backend**:
  - Node.js & Express.js (ES Modules)
  - MongoDB with Mongoose (with automated connection retry and indexing)
  - JWT Authentication & Bcrypt Password Hashing
  - Helmet, CORS, Express Rate Limit, and Express Validator
- **Testing**:
  - Node test runner (`node:test`) covering date overlap detection, booking reference formatting, and phone sanitization.

---

## 📁 Repository Structure

```
thilini-rent-a-car/
├── client/                     # Vite React Frontend
│   ├── public/
│   │   ├── favicon.svg         # SVG Brand Favicon
│   │   ├── robots.txt          # SEO Crawl Directives
│   │   └── sitemap.xml         # XML Sitemap
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/         # Logo, VehicleCard, TrustStrip, SEOHead, Skeletons
│   │   │   ├── home/           # HeroSection, SearchWidget, HowItWorks, Reviews, FAQ
│   │   │   └── layout/         # Navbar, Footer, MobileBottomBar, FloatingWhatsApp, PublicLayout
│   │   ├── context/            # AuthContext, SettingsContext
│   │   ├── pages/              # Home, Fleet, VehicleDetails, Services, About, Book, FAQ, Contact, Terms, Privacy, 404
│   │   │   └── admin/          # Login, Dashboard, Vehicles, Bookings, Content, Settings
│   │   ├── services/           # Axios API client modules
│   │   ├── App.jsx             # Main router
│   │   ├── index.css           # Tailwind design tokens & mobile utilities
│   │   └── main.jsx
│   ├── package.json
│   └── tailwind.config.js
│
├── server/                     # Node.js Express Backend
│   ├── src/
│   │   ├── config/             # MongoDB connection & Sri Lankan constants
│   │   ├── controllers/        # Auth, Vehicle, Booking, Content, and Settings controllers
│   │   ├── middleware/         # JWT Auth, RateLimit, Validator, ErrorHandler
│   │   ├── models/             # Vehicle, Booking, Admin, Service, FAQ, Testimonial, Setting
│   │   ├── routes/             # REST API endpoint routes
│   │   ├── scripts/            # Database seed script (Sri Lankan fleet, FAQs, Admin)
│   │   ├── tests/              # Overlap & booking reference test suite
│   │   ├── utils/              # Reference generator & overlap checker
│   │   └── server.js           # Server entry point
│   ├── package.json
│   └── .env.example
│
├── .env.example                # Root environment template
├── package.json                # Root orchestration scripts
└── README.md                   # Project documentation & handover
```

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- Node.js (v18+ recommended, tested on v24.14)
- MongoDB instance running locally on `mongodb://localhost:27017` or a free MongoDB Atlas connection string.

### 2. Installation
Clone or navigate to the project directory and install dependencies:

```bash
# Install root, backend, and frontend dependencies in one command
npm run install:all
```

Alternatively, install individually:
```bash
# In /server
cd server && npm install

# In /client
cd ../client && npm install
```

### 3. Environment Variables Setup
Copy the `.env.example` templates to `.env` in both `/server` and `/client`:

**Server Configuration (`server/.env`)**:
```env
PORT=5000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/thilini_rent_a_car
JWT_SECRET=thilini_super_secret_jwt_key_2026_lk
JWT_EXPIRES_IN=7d
ADMIN_NAME=Admin
ADMIN_EMAIL=admin@thilinirentacar.com
ADMIN_PASSWORD=Admin@Thilini2026#
```

**Client Configuration (`client/.env`)**:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_WHATSAPP_NUMBER=94771234567
VITE_PHONE_NUMBER=+94771234567
VITE_SITE_URL=http://localhost:5173
```

### 4. Seed Database with Sri Lankan Fleet
Populate 9 realistic sample vehicles (Toyota Aqua, Suzuki Wagon R, Toyota Prius, Toyota Premio, Suzuki Alto, Toyota Raize SUV, Toyota KDH Van, Toyota Prado, Mercedes-Benz), FAQs, rental services, and default admin account:

```bash
npm run seed
```

### 5. Running the Application
Start backend and frontend servers simultaneously:

```bash
# From the root directory:
npm run dev
```

- **Public Website**: [http://localhost:5173](http://localhost:5173)
- **Admin Portal**: [http://localhost:5173/admin/login](http://localhost:5173/admin/login)
- **Backend API**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🔐 Default Administrator Credentials

- **URL**: `http://localhost:5173/admin/login`
- **Email**: `admin@thilinirentacar.com`
- **Password**: `Admin@Thilini2026#`

> ⚠️ *Important: Change the administrator password upon first login in production via the Site Settings / Admin Profile menu.*

---

## 🧪 Running Automated Tests

Run backend unit tests for date overlap detection, booking reference generation, and WhatsApp URI encoding:

```bash
npm run test:server
```

## 📈 Optional Production Performance Monitoring

Client monitoring is disabled safely by default. To send privacy-safe route,
API, JavaScript error, and Core Web Vital events to your own collector, set:

```bash
VITE_ENABLE_MONITORING=true
VITE_MONITORING_ENDPOINT=https://your-monitoring-collector.example/events
VITE_APP_RELEASE=your-release-id
```

The monitoring payload excludes form values, contact details, tokens, query
strings, and database information. API responses also expose `X-Request-ID`,
and the server writes structured request duration records for correlation.

Operational health checks:

- `GET /health/live` — process liveness; never waits for MongoDB.
- `GET /health/ready` — immediate database readiness state.

---

## 🏗️ Production Build Commands

```bash
# Build optimized client production bundle
npm run build:client

# The production bundle will be created in /client/dist
```

---

## 📋 Checklist of Placeholder Business Information to Replace

Before official public launch, update the following placeholder records via the **Admin Settings Portal** (`/admin/settings`):

1. **Official Telephone Numbers**: Replace `+94 77 123 4567` with the verified primary business landline / mobile.
2. **Official WhatsApp Number**: Replace `94771234567` with the dedicated customer service WhatsApp line.
3. **Official Email**: Replace `info@thilinirentacar.com` with the official domain email.
4. **Physical Office Address**: Replace the Katunayake / Negombo road sample address with the exact registered office location.
5. **Google Maps Embed Link**: Update the embed URL in Settings to point to your physical branch or vehicle pickup yard.
6. **Business Hours**: Confirm operating hours (e.g. 24/7 Katunayake Airport delivery vs. office opening hours).
7. **Actual Vehicle Rates & Deposits**: Update daily/weekly/monthly rates for each vehicle model in `/admin/vehicles`.
8. **Genuine Customer Testimonials**: Replace the placeholder reviews in `/admin/content` with real customer reviews.
9. **Logo File**: Place your high-resolution transparent PNG / SVG as `/client/public/logo.png` or `/client/public/logo.svg`.

---

## 🚀 Known Limitations & Recommended Phase 2 Enhancements

1. **Online Payment Gateway**: Integration with Sri Lankan gateways (e.g. PayHere, WebXPay, Genie) or Stripe for advance online card deposits.
2. **Automated SMS / Email Notifications**: Automated SMS dispatch to customers via Sri Lankan SMS gateways (Mobitel / Dialog / Textware) upon booking confirmation.
3. **Sinhala & Tamil Multilingual Toggle**: The code structure is organized for `react-i18next` integration when verified Sinhala and Tamil translations are provided.
4. **GPS & Telematics Integration**: Live vehicle tracking and odometer sync for fleet operations.
