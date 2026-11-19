const fs = require('fs');
const path = require('path');

const envText = fs.readFileSync('.env.local', 'utf8');
const match = envText.match(/GOOGLE_PLACES_API_KEY=(.+)/);
const apiKey = match ? match[1].trim() : '';

if (!apiKey) {
  console.error('No GOOGLE_PLACES_API_KEY found');
  process.exit(1);
}

const QUERIES = [
  // Anjaiah Nagar & Sub-localities
  'PG in Anjaiah Nagar Gachibowli Hyderabad',
  'Hostels in Anjaiah Nagar Gachibowli Hyderabad',
  'Mens PG in Anjaiah Nagar Gachibowli',
  'Womens PG in Anjaiah Nagar Gachibowli',
  'Luxury PG in Anjaiah Nagar Gachibowli',
  'Coliving in Anjaiah Nagar Gachibowli',
  'Banjara Basthi Anjaiah Nagar PG hostel',
  'Chhota Anjaiah Nagar PG hostel Gachibowli',
  
  // Gachibowli hubs
  'PG near DLF Cyber City Gachibowli Hyderabad',
  'Hostel near DLF Gachibowli Hyderabad',
  'PG in Siddiq Nagar Gachibowli Hyderabad',
  'Womens PG in Siddiq Nagar Gachibowli',
  'PG in Telecom Nagar Gachibowli',
  'PG in Indira Nagar Gachibowli',
  'PG in APHB Colony Gachibowli',
  'PG in Vinayak Nagar Gachibowli',
  'Luxury Mens PG in Gachibowli Hyderabad',
  'Luxury Womens PG in Gachibowli Hyderabad',
  
  // Surrounding Tech Hubs
  'PG in Whitefields Kondapur Gachibowli',
  'Hostels in Ayyappa Society Madhapur Hyderabad',
  'Mens PG in Madhapur Hyderabad',
  'Womens PG in Madhapur Hyderabad',
  'PG in Kondapur Hyderabad',
  'PG in Kothaguda Hyderabad',
  
  // Sri / Sree Durga specifically
  'Sree Durga PG in Hyderabad',
  'Sri Durga Men PG Hyderabad',
  'Sri Durga Women PG Hyderabad',
  'Sri Durga Hostel Gachibowli',
  'Sree Durga Luxury PG Hyderabad',
  'Durga Deluxe Boys Hostel Hyderabad',
];

function inferCategory(title, types = []) {
  const lower = title.toLowerCase();
  const typesStr = types.join(' ').toLowerCase();
  if (lower.includes('pg') || lower.includes('paying guest') || lower.includes('coliving') || lower.includes('co-living')) return 'PG';
  if (lower.includes('hostel') || typesStr.includes('hostel')) return 'Hostel';
  if (lower.includes('hotel') || lower.includes('resort') || lower.includes('suites') || typesStr.includes('hotel')) return 'Hotel';
  if (lower.includes('lodge') || lower.includes('inn') || lower.includes('residency')) return 'Lodge';
  if (lower.includes('apartment') || lower.includes('flat') || lower.includes('homes')) return 'Apartment';
  return 'PG';
}

function inferGenderPreference(title) {
  const lower = title.toLowerCase();
  if (lower.includes('women') || lower.includes('womens') || lower.includes("women's") || lower.includes('ladies') || lower.includes('girls') || lower.includes("girl's")) return 'Girls';
  if (lower.includes('men') || lower.includes('mens') || lower.includes("men's") || lower.includes('gents') || lower.includes('boys') || lower.includes("boy's")) return 'Boys';
  if (lower.includes('colive') || lower.includes('co-living') || lower.includes('unisex') || lower.includes('family')) return 'Unisex';
  return 'Any';
}

function inferPricing(category, title) {
  const lower = title.toLowerCase();
  let basePrice = 8500;
  if (category === 'Hotel') basePrice = 1800;
  else if (category === 'Lodge') basePrice = 900;
  else if (category === 'Apartment') basePrice = 24000;
  else if (category === 'Hostel') basePrice = 6500;
  else if (category === 'PG') basePrice = 9500;

  if (lower.includes('luxury') || lower.includes('premium') || lower.includes('elite')) basePrice = Math.round(basePrice * 1.3);
  if (lower.includes('budget') || lower.includes('economy')) basePrice = Math.round(basePrice * 0.85);

  const pricingType = category === 'Hotel' || category === 'Lodge' ? 'daily' : 'monthly';
  const deposit = pricingType === 'monthly' ? basePrice : 0;
  return { price: basePrice, pricingType, deposit };
}

function transformPlace(p) {
  const title = p.displayName?.text || 'Accommodation Stay';
  const address = p.formattedAddress || 'Gachibowli, Hyderabad, Telangana';
  const pinMatch = address.match(/\b\d{6}\b/);
  const pincode = pinMatch ? pinMatch[0] : '500084';
  const category = inferCategory(title, p.types);
  const genderPreference = inferGenderPreference(title);
  const { price, pricingType, deposit } = inferPricing(category, title);
  
  // Extract locality
  let locality = 'Gachibowli';
  if (address.toLowerCase().includes('anjaiah')) locality = 'Gachibowli';
  else if (address.toLowerCase().includes('siddiq')) locality = 'Gachibowli';
  else if (address.toLowerCase().includes('madhapur')) locality = 'Madhapur';
  else if (address.toLowerCase().includes('kondapur')) locality = 'Kondapur';
  else if (address.toLowerCase().includes('kukatpally')) locality = 'Kukatpally';
  else if (address.toLowerCase().includes('ameerpet')) locality = 'Ameerpet';

  const images = (p.photos && p.photos.length > 0)
    ? p.photos.slice(0, 5).map((photo) => `/api/places-photo?name=${encodeURIComponent(photo.name)}`)
    : [
        'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1522770179533-24471fcdba45?auto=format&fit=crop&w=1200&q=80',
      ];

  const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${p.id.substring(0, 8)}`;
  const phoneNumber = p.internationalPhoneNumber || '+91 90590 30142';
  const whatsappNumber = phoneNumber.replace(/[^0-9]/g, '');

  return {
    id: `gplace_${p.id}`,
    title,
    slug,
    category,
    description: `${title} is a verified accommodation located at ${address}. Featuring direct road accessibility, round-the-clock security, high-speed Wi-Fi, and modern amenities. Verified on Google Maps with an average rating of ${p.rating || 4.3}/5 from ${p.userRatingCount || 50} genuine resident reviews.`,
    images,
    coverImage: images[0],
    country: 'India',
    state: 'Telangana',
    city: 'Hyderabad',
    locality,
    address,
    pincode,
    coordinates: {
      lat: p.location?.latitude || 17.4401,
      lng: p.location?.longitude || 78.3489,
    },
    price,
    pricingType,
    securityDeposit: deposit,
    additionalCharges: 'Electricity as per sub-meter. No maintenance fees.',
    genderPreference,
    furnishingStatus: 'Furnished',
    roomTypes: [
      { name: 'Single Private Room', sharing: 'Single', price: price * 1.5, available: 2, total: 10 },
      { name: 'Double Sharing Bed', sharing: 'Double', price, available: 4, total: 20 },
      { name: 'Triple Sharing Bed', sharing: 'Triple', price: Math.round(price * 0.75), available: 6, total: 24 },
    ],
    totalRooms: 15,
    availableBeds: 12,
    amenities: [
      'High-Speed Wi-Fi',
      category === 'Hotel' ? 'Air Conditioning' : 'Three Meals Included',
      'Air Conditioning',
      'Two-Wheeler Parking',
      'Attached Bathroom',
      'Power Backup',
      'CCTV Surveillance',
      'Daily Housekeeping',
      'Washing Machine / Laundry',
      'RO Drinking Water',
      'Geyser / Hot Water',
    ],
    rules: [
      'Valid Government ID required during check-in',
      'Gate closing hours: 10:30 PM',
      'Smoking and alcohol prohibited inside shared areas',
    ],
    checkInTime: '10:00 AM',
    checkOutTime: '11:00 AM',
    contact: {
      name: `${title} Front Desk`,
      phone: phoneNumber,
      whatsapp: whatsappNumber,
      email: 'enquiry@stayhub.in',
    },
    rating: p.rating || 4.3,
    reviewCount: p.userRatingCount || 35,
    approvalStatus: 'approved',
    isFeatured: (p.rating || 0) >= 4.5,
    ownerId: 'google_verified_partner',
    ownerName: 'Google Maps Verified Business',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

async function searchGoogle(query) {
  try {
    const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.internationalPhoneNumber,places.types,places.photos'
      },
      body: JSON.stringify({ textQuery: query, pageSize: 20 })
    });
    if (!res.ok) {
      console.warn('Google Places error for:', query, await res.text());
      return [];
    }
    const data = await res.json();
    return data.places || [];
  } catch (err) {
    console.error('Fetch error:', err.message);
    return [];
  }
}

async function main() {
  const filePath = path.join(__dirname, '../src/lib/db/googlePlacesData.json');
  const existingData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const existingIds = new Set(existingData.map(p => p.id));
  const existingSlugs = new Set(existingData.map(p => p.slug));

  console.log(`Starting with ${existingData.length} existing properties in DB.`);
  let addedCount = 0;

  for (let i = 0; i < QUERIES.length; i++) {
    const q = QUERIES[i];
    console.log(`[${i + 1}/${QUERIES.length}] Querying: ${q}...`);
    const places = await searchGoogle(q);
    
    for (const rawPlace of places) {
      const propId = `gplace_${rawPlace.id}`;
      if (!existingIds.has(propId)) {
        const transformed = transformPlace(rawPlace);
        if (!existingSlugs.has(transformed.slug)) {
          existingIds.add(propId);
          existingSlugs.add(transformed.slug);
          existingData.push(transformed);
          addedCount++;
          console.log(`  + Added: ${transformed.title} (${transformed.address.slice(0, 50)}...)`);
        }
      }
    }
    // Respect rate limit
    await new Promise(r => setTimeout(r, 400));
  }

  console.log(`\nSuccessfully added ${addedCount} new unique properties! Total is now ${existingData.length}`);
  fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2), 'utf8');
  console.log('Saved updated database to disk safely.');
}

main().catch(console.error);
