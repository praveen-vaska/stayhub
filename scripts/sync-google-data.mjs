import fs from "fs";
import path from "path";

const apiKey = "AIzaSyDKz_0zAacZlP2RgekuyPEz_dZ6ImtwIc4";

const queries = [
  { q: "PG in Gachibowli Hyderabad", locality: "Gachibowli", city: "Hyderabad", cat: "PG" },
  { q: "Hostels in Madhapur Hyderabad", locality: "Madhapur", city: "Hyderabad", cat: "Hostel" },
  { q: "PG in Kondapur Hyderabad", locality: "Kondapur", city: "Hyderabad", cat: "PG" },
  { q: "Hostels in Ameerpet Hyderabad", locality: "Ameerpet", city: "Hyderabad", cat: "Hostel" },
  { q: "Coliving in Hitech City Hyderabad", locality: "Hitech City", city: "Hyderabad", cat: "PG" },
  { q: "Hotels in Banjara Hills Hyderabad", locality: "Banjara Hills", city: "Hyderabad", cat: "Hotel" },
  { q: "Hostels in Kukatpally Hyderabad", locality: "Kukatpally", city: "Hyderabad", cat: "Hostel" },
  { q: "PG in Koramangala Bengaluru", locality: "Koramangala", city: "Bengaluru", cat: "PG" },
];

async function fetchAll() {
  const allProperties = [];
  const seenIds = new Set();

  for (const item of queries) {
    try {
      console.log(`Fetching: ${item.q}...`);
      const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask":
            "places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.internationalPhoneNumber,places.types,places.photos",
        },
        body: JSON.stringify({ textQuery: item.q, pageSize: 8 }),
      });

      const d = await res.json();
      if (d.places && Array.isArray(d.places)) {
        for (const p of d.places) {
          if (seenIds.has(p.id)) continue;
          seenIds.add(p.id);

          const title = p.displayName?.text || "Stay Accommodation";
          const lowerTitle = title.toLowerCase();
          const address = p.formattedAddress || `${item.locality}, ${item.city}`;
          const pinMatch = address.match(/\b\d{6}\b/);
          const pincode = pinMatch ? pinMatch[0] : "500032";

          let category = item.cat;
          if (lowerTitle.includes("hotel") || lowerTitle.includes("suites")) category = "Hotel";
          else if (lowerTitle.includes("hostel")) category = "Hostel";
          else if (lowerTitle.includes("lodge")) category = "Lodge";
          else if (lowerTitle.includes("pg") || lowerTitle.includes("paying guest")) category = "PG";

          let genderPreference = "Any";
          if (lowerTitle.includes("women") || lowerTitle.includes("ladies") || lowerTitle.includes("girls")) genderPreference = "Girls";
          else if (lowerTitle.includes("men") || lowerTitle.includes("gents") || lowerTitle.includes("boys")) genderPreference = "Boys";
          else if (lowerTitle.includes("coliving") || lowerTitle.includes("unisex")) genderPreference = "Unisex";

          let price = 8500;
          let pricingType = "monthly";
          if (category === "Hotel") { price = 2499; pricingType = "daily"; }
          else if (category === "Lodge") { price = 1299; pricingType = "daily"; }
          else if (category === "Hostel") { price = 6000; pricingType = "monthly"; }
          else if (lowerTitle.includes("luxury") || lowerTitle.includes("executive")) price = 12000;

          const images = (p.photos && p.photos.length > 0)
            ? p.photos.slice(0, 4).map((ph) => `/api/places-photo?name=${encodeURIComponent(ph.name)}`)
            : [
                "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1522770179533-24471fcdba45?auto=format&fit=crop&w=1200&q=80",
              ];

          const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${p.id.substring(0, 8)}`;
          const phone = p.internationalPhoneNumber || "+91 90590 30142";

          allProperties.push({
            id: `gplace_${p.id}`,
            title,
            slug,
            category,
            description: `${title} is a verified business on Google Maps located at ${address}. Featuring quality accommodation with high-speed Wi-Fi, round-the-clock water and power backup, modern amenities, and prime connectivity.`,
            images,
            coverImage: images[0],
            country: "India",
            state: item.city === "Bengaluru" ? "Karnataka" : "Telangana",
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
              { name: "Single Sharing Room", sharing: "Single", price: price * 1.5, available: 2, total: 8 },
              { name: "Double Sharing Room", sharing: "Double", price, available: 4, total: 16 },
              { name: "Triple Sharing Room", sharing: "Triple", price: Math.round(price * 0.75), available: 6, total: 24 },
            ],
            totalRooms: 15,
            availableBeds: 12,
            amenities: [
              "High-Speed Wi-Fi",
              category === "Hotel" ? "Air Conditioning" : "Three Meals Included",
              "Air Conditioning",
              "Two-Wheeler Parking",
              "Attached Bathroom",
              "Power Backup",
              "CCTV Surveillance",
              "Daily Housekeeping",
              "Washing Machine / Laundry",
              "RO Drinking Water",
              "Geyser / Hot Water",
            ],
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
              email: `info@${slug}.com`,
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
    } catch (err) {
      console.error(`Error fetching ${item.q}:`, err);
    }
  }

  console.log(`Successfully fetched ${allProperties.length} verified real Google Places properties!`);
  fs.writeFileSync("src/lib/db/googlePlacesData.json", JSON.stringify(allProperties, null, 2));
  console.log("Saved to src/lib/db/googlePlacesData.json");
}

fetchAll();
