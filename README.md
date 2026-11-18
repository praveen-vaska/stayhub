# StayHub — Accommodation Discovery & Listing Marketplace

A production-oriented accommodation discovery platform engineered with Next.js 14 (App Router), TypeScript, Tailwind CSS, Leaflet Maps, and MongoDB/Mongoose. StayHub enables users to discover, search, filter, compare, and enquire about PGs, coliving spaces, boutique hotels, budget lodges, hostels, and rental apartments across Indian cities and localities.

---

## 🎨 Design System & Theme

Designed with a tailored palette and smooth, moderate animations (no harsh neon/AI aesthetics):

| Role | Color Name | Hex Code | Purpose |
| :--- | :--- | :--- | :--- |
| **Primary Brand** | **Deep Navy** | `#142D4E` | Navigation header, page titles, footer, primary buttons |
| **Accent** | **Teal** | `#159A91` | Primary CTA buttons, active filters, highlights, verified markers |
| **Background** | **Soft White** | `#F7F8FA` | Section backgrounds, card well containers |
| **Cards** | **Pure White** | `#FFFFFF` | Accommodation cards, search containers, dialogs, forms |
| **Borders** | **Cool Grey** | `#E7EDF3` | Separators, subtle card outlines, inactive filters |
| **Secondary Accent**| **Warm Amber**| `#E9A23B` | Star ratings, premium badges, special discounts |

---

## 🚀 Key Features

1. **City & Locality Hierarchy Search:**
   - Multi-tier search covering Hyderabad (Gachibowli, Madhapur, Kondapur, Kukatpally, Miyapur, Hitech City, Ameerpet, Banjara Hills, Jubilee Hills), Bengaluru (Koramangala, Indiranagar, HSR Layout), Mumbai, Pune, Chennai, etc.
   - Real-time location autocomplete with landmark suggestions.

2. **Interactive Map Exploration:**
   - Interactive Leaflet Map with custom teal price markers (`₹8,500/mo`) that expand to Deep Navy on selection.
   - Direct link to Google Maps directions for exact geolocation navigation.

3. **Multi-Faceted Filtering:**
   - Filter by Accommodation Category (PG, Hotel, Lodge, Hostel, Apartment, Room).
   - Price range slider with minimum and maximum bounds.
   - Gender preference (Men Only, Women Only, Co-living Unisex, Family Stays).
   - Room sharing options (Single Room, Double Sharing, Triple Sharing, Four+ Sharing).
   - Furnishing state (Furnished, Semi-Furnished, Unfurnished).
   - Amenities checklist (High-speed Wi-Fi, Food Included, AC, Parking, CCTV, Attached Bathroom, Power Backup).

4. **Side-by-Side Property Comparison Matrix:**
   - Add up to 4 stays into a side-by-side comparison drawer.
   - Compare pricing, security deposit, sharing configurations, and amenities checklist.
   - Accessible via floating bottom comparison drawer and dedicated `/compare` route.

5. **Direct Host Connect & Enquiry System:**
   - Submit direct visit enquiries with preferred dates and custom messages.
   - Direct WhatsApp integration with pre-filled property reference links.
   - Interactive resident review submission with real-time rating recalculation.

6. **Role-Based Portals (User, Host, Super Admin):**
   - **User Dashboard (`/dashboard`):** Saved properties wishlist, enquiry history tracking.
   - **Host Console (`/owner/dashboard`):** Listing performance, lead management, 8-step Add Property wizard (`/owner/add-property`).
   - **Admin Control Center (`/admin/dashboard`):** Listing verification, approve/reject workflow, user & host oversight.
   - **1-Click Demo Switcher:** Easily toggle between Tenant, Host, and Super Admin in 1 click from the navbar or login screen.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14.2.20 (App Router, Server & Client Components)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS with custom theme palette
- **Icons:** Lucide React
- **Mapping:** Leaflet with custom HTML price markers
- **Authentication:** JWT tokens with bcrypt password hashing
- **Database:** MongoDB / Mongoose with resilient unified fallback store

---

## 💻 How to Run Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/stayhub
JWT_SECRET=super_secret_stayhub_jwt_key_2026
```

### 3. Build & Start Production Server
```bash
npm run build
npm run start
```
The application will be live at **`http://localhost:3000`**.

### 4. Or Run in Development Mode
```bash
npm run dev
```

---

## 🧪 Demo Credentials

Use the **1-Click Demo Login** buttons on the navigation bar / login page:
- **Tenant User:** `user@stayhub.com` / `Password123`
- **Property Host:** `owner@stayhub.com` / `Password123`
- **Super Administrator:** `admin@stayhub.com` / `AdminPass123`
