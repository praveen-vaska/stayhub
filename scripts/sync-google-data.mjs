import fs from "fs";
import path from "path";

const apiKey = "AIzaSyDKz_0zAacZlP2RgekuyPEz_dZ6ImtwIc4";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ─────────────────────────────────────────────────────────────────────────────
// MASSIVE query list: Hyderabad + Bengaluru + Chennai + Pune + Mumbai + Delhi
// Each locality gets multiple category searches to maximise coverage.
// ─────────────────────────────────────────────────────────────────────────────
const HYDERABAD_LOCALITIES = [
  "Gachibowli", "Madhapur", "Kondapur", "Hitech City", "Kukatpally",
  "Ameerpet", "Banjara Hills", "Jubilee Hills", "Miyapur", "Begumpet",
  "SR Nagar", "Sainikpuri", "Kompally", "LB Nagar", "Dilsukhnagar",
  "Uppal", "Secunderabad", "Tarnaka", "ECIL", "Malkajgiri",
  "Somajiguda", "Panjagutta", "Yusufguda", "Manikonda", "Narsingi",
  "Financial District", "Nanakramguda", "Kokapet", "Khajaguda",
  "Raidurg", "Hafeezpet", "Nizampet", "Chandanagar", "Bachupally",
  "Alwal", "Maredpally", "Trimulgherry", "Bowenpally", "Karkhana",
  "Himayatnagar", "Nampally", "Abids", "Koti", "Chikkadpally",
  "Musheerabad", "Vidyanagar", "Saidabad", "Vanasthalipuram",
  "Hayathnagar", "Boduppal", "Nagole", "Ghatkesar",
];

const BENGALURU_LOCALITIES = [
  "Koramangala", "HSR Layout", "Whitefield", "Electronic City",
  "Indiranagar", "Bellandur", "BTM Layout", "JP Nagar",
  "Marathahalli", "Sarjapur Road", "Hebbal", "Yeshwanthpur",
  "Rajajinagar", "Jayanagar", "Banashankari", "Basavanagudi",
  "Yelahanka", "Kengeri", "Bommanahalli", "Hoskote",
  "MG Road", "Brigade Road", "Cunningham Road", "Frazer Town",
  "Shivajinagar", "Malleswaram", "Sadashivanagar",
];

const CHENNAI_LOCALITIES = [
  "Anna Nagar", "Velachery", "Tambaram", "OMR", "Porur",
  "Adyar", "Nungambakkam", "T Nagar", "Vadapalani", "Perambur",
  "Ambattur", "Chrompet", "Pallavaram", "Sholinganallur",
];

const PUNE_LOCALITIES = [
  "Hinjewadi", "Wakad", "Kharadi", "Viman Nagar", "Koregaon Park",
  "Baner", "Aundh", "Pimpri", "Chinchwad", "Hadapsar",
  "Magarpatta", "Kalyani Nagar",
];

const MUMBAI_LOCALITIES = [
  "Andheri", "Powai", "Thane", "Navi Mumbai", "Kurla",
  "Bandra", "Goregaon", "Malad", "Kandivali", "Borivali",
];

const DELHI_NCR_LOCALITIES = [
  "Noida Sector 62", "Gurgaon", "Dwarka", "Laxmi Nagar",
  "Rohini", "Pitampura", "Mayur Vihar", "Nehru Place",
  "Connaught Place", "Lajpat Nagar",
];

const PG_TERMS   = ["PG", "Paying Guest", "Boys PG", "Girls PG", "Co-living", "Coliving"];
const HOSTEL_TERMS = ["Hostel", "Boys Hostel", "Girls Hostel", "Student Hostel"];
const LODGE_TERMS = ["Lodge", "Guest House", "Service Apartment"];

function buildQueries() {
  const queries = [];

  const addForLocality = (locality, city, state, terms, cat) => {
    for (const term of terms) {
      queries.push({ q: `${term} in ${locality} ${city}`, locality, city, state, cat });
    }
  };

  for (const loc of HYDERABAD_LOCALITIES) {
    addForLocality(loc, "Hyderabad", "Telangana", PG_TERMS, "PG");
    addForLocality(loc, "Hyderabad", "Telangana", HOSTEL_TERMS, "Hostel");
    addForLocality(loc, "Hyderabad", "Telangana", LODGE_TERMS, "Lodge");
  }
  for (const loc of BENGALURU_LOCALITIES) {
    addForLocality(loc, "Bengaluru", "Karnataka", PG_TERMS, "PG");
    addForLocality(loc, "Bengaluru", "Karnataka", HOSTEL_TERMS, "Hostel");
    addForLocality(loc, "Bengaluru", "Karnataka", LODGE_TERMS, "Lodge");
  }
  for (const loc of CHENNAI_LOCALITIES) {
    addForLocality(loc, "Chennai", "Tamil Nadu", PG_TERMS, "PG");
    addForLocality(loc, "Chennai", "Tamil Nadu", HOSTEL_TERMS, "Hostel");
  }
  for (const loc of PUNE_LOCALITIES) {
    addForLocality(loc, "Pune", "Maharashtra", PG_TERMS, "PG");
    addForLocality(loc, "Pune", "Maharashtra", HOSTEL_TERMS, "Hostel");
  }
  for (const loc of MUMBAI_LOCALITIES) {
    addForLocality(loc, "Mumbai", "Maharashtra", PG_TERMS, "PG");
    addForLocality(loc, "Mumbai", "Maharashtra", HOSTEL_TERMS, "Hostel");
  }
  for (const loc of DELHI_NCR_LOCALITIES) {
    addForLocality(loc, "Delhi NCR", "Delhi", PG_TERMS, "PG");
    addForLocality(loc, "Delhi NCR", "Delhi", HOSTEL_TERMS, "Hostel");
  }

  return queries;
}

async function fetchWithPagination(item, seenIds, allProperties) {
  let pageToken = null;
  let pageNum = 0;
  let fetched = 0;

  do {
    try {
      const body = { textQuery: item.q, pageSize: 20 };
      if (pageToken) body.pageToken = pageToken;

      const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask":
            "places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.internationalPhoneNumber,places.types,places.photos,nextPageToken",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.text();
        console.error(`  API error (${res.status}) for "${item.q}": ${err.substring(0, 150)}`);
        break;
      }

      const d = await res.json();
      pageToken = d.nextPageToken || null;

      if (d.places && Array.isArray(d.places)) {
        for (const p of d.places) {
          if (seenIds.has(p.id)) continue;
          seenIds.add(p.id);
          fetched++;

          const title = p.displayName?.text || "Stay Accommodation";
          const lowerTitle = title.toLowerCase();
          const address = p.formattedAddress || `${item.locality}, ${item.city}`;
          const pinMatch = address.match(/\b\d{6}\b/);
          const pincode = pinMatch ? pinMatch[0] : "500032";

          let category = item.cat;
          if (lowerTitle.includes("hotel") || lowerTitle.includes("suites") || lowerTitle.includes("inn") || lowerTitle.includes("resort")) category = "Hotel";
          else if (lowerTitle.includes("hostel") || lowerTitle.includes("dormitory")) category = "Hostel";
          else if (lowerTitle.includes("lodge") || lowerTitle.includes("guest house") || lowerTitle.includes("guesthouse")) category = "Lodge";
          else if (lowerTitle.includes("pg") || lowerTitle.includes("paying guest") || lowerTitle.includes("coliving") || lowerTitle.includes("co-living")) category = "PG";
          else if (lowerTitle.includes("apartment") || lowerTitle.includes("flat") || lowerTitle.includes("service")) category = "Apartment";

          let genderPreference = "Any";
          if (lowerTitle.includes("women") || lowerTitle.includes("ladies") || lowerTitle.includes("girls") || lowerTitle.includes("female")) genderPreference = "Girls";
          else if (lowerTitle.includes("men") || lowerTitle.includes("gents") || lowerTitle.includes("boys") || lowerTitle.includes("male")) genderPreference = "Boys";
          else if (lowerTitle.includes("coliving") || lowerTitle.includes("co-living") || lowerTitle.includes("unisex") || lowerTitle.includes("coed")) genderPreference = "Unisex";

          let price = 8500;
          let pricingType = "monthly";
          if (category === "Hotel") { price = 2499; pricingType = "daily"; }
          else if (category === "Lodge") { price = 1299; pricingType = "daily"; }
          else if (category === "Hostel") { price = 6000; pricingType = "monthly"; }
          else if (category === "Apartment") { price = 15000; pricingType = "monthly"; }
          else if (lowerTitle.includes("luxury") || lowerTitle.includes("executive") || lowerTitle.includes("premium")) price = 12000;
          else if (lowerTitle.includes("affordable") || lowerTitle.includes("budget")) price = 5500;

          const images = (p.photos && p.photos.length > 0)
            ? p.photos.slice(0, 5).map((ph) => `/api/places-photo?name=${encodeURIComponent(ph.name)}`)
            : [
                "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1522770179533-24471fcdba45?auto=format&fit=crop&w=1200&q=80",
              ];

          const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${p.id.substring(0, 8)}`;
          const phone = p.internationalPhoneNumber || "+91 90590 30142";

          const amenitiesBase = [
            "High-Speed Wi-Fi", "Air Conditioning", "Power Backup",
            "CCTV Surveillance", "RO Drinking Water", "Geyser / Hot Water",
            "Two-Wheeler Parking", "Attached Bathroom",
          ];
          if (category !== "Hotel") amenitiesBase.push("Three Meals Included", "Daily Housekeeping", "Washing Machine / Laundry");
          if (category === "Hotel") amenitiesBase.push("Room Service", "24x7 Reception");

          allProperties.push({
            id: `gplace_${p.id}`,
            title,
            slug,
            category,
            description: `${title} is a verified business on Google Maps located at ${address}. Featuring quality accommodation with high-speed Wi-Fi, round-the-clock water and power backup, modern amenities, and prime connectivity to major IT hubs and metro stations.`,
            images,
            coverImage: images[0],
            country: "India",
            state: item.state,
            city: item.city,
            locality: item.locality,
            address,
            pincode,
            coordinates: {
              lat: p.location?.latitude || 17.4332,
              lng: p.location?.longitude || 78.3684,
            },
            price,
            pricingType,
            securityDeposit: pricingType === "monthly" ? price : 0,
            additionalCharges: "Electricity per sub-meter reading.",
            genderPreference,
            furnishingStatus: "Furnished",
            roomTypes: [
              { name: "Single Sharing Room", sharing: "Single", price: Math.round(price * 1.5), available: 2, total: 8 },
              { name: "Double Sharing Room", sharing: "Double", price, available: 4, total: 16 },
              { name: "Triple Sharing Room", sharing: "Triple", price: Math.round(price * 0.75), available: 6, total: 24 },
            ],
            totalRooms: 15,
            availableBeds: 12,
            amenities: amenitiesBase,
            rules: [
              "Government ID mandatory at check-in",
              "Main gate closes at 10:30 PM",
              "No smoking inside shared premises",
            ],
            checkInTime: "09:00 AM",
            checkOutTime: "11:00 AM",
            contact: {
              name: `${title} Front Desk`,
              phone,
              whatsapp: phone.replace(/[^0-9]/g, ""),
              email: `info@${slug.substring(0, 30)}.com`,
            },
            rating: p.rating || 4.4,
            reviewCount: p.userRatingCount || 45,
            approvalStatus: "approved",
            isFeatured: (p.rating || 0) >= 4.5,
            ownerId: "google_verified_partner",
            ownerName: "Google Maps Verified Business",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      }

      pageNum++;
      if (pageToken && pageNum < 3) await sleep(2000);
    } catch (err) {
      console.error(`  Fetch error for "${item.q}":`, err.message);
      break;
    }
  } while (pageToken && pageNum < 3);

  return fetched;
}

async function fetchAll() {
  const queries = buildQueries();
  console.log(`\n🚀 Starting massive fetch: ${queries.length} queries across all cities\n`);

  const allProperties = [];
  const seenIds = new Set();
  let queryCount = 0;

  for (const item of queries) {
    queryCount++;
    process.stdout.write(`[${queryCount}/${queries.length}] ${item.q} ... `);
    const count = await fetchWithPagination(item, seenIds, allProperties);
    console.log(`+${count} (total: ${allProperties.length} unique)`);

    await sleep(300);

    if (queryCount % 50 === 0) {
      fs.writeFileSync("src/lib/db/googlePlacesData.json", JSON.stringify(allProperties, null, 2));
      console.log(`\n💾 Progress checkpoint: ${allProperties.length} properties saved\n`);
    }
  }

  console.log(`\n✅ Done! ${allProperties.length} unique verified Google Places properties!`);
  fs.writeFileSync("src/lib/db/googlePlacesData.json", JSON.stringify(allProperties, null, 2));
  console.log("💾 Saved to src/lib/db/googlePlacesData.json");
}

fetchAll().catch(console.error);
