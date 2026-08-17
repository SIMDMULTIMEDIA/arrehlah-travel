require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function seed() {
  console.log("Fetching destinations...");
  
  const { data: dbDestinations, error: destErr } = await supabase.from("Destination").select("id, slug");
  if (destErr) {
    console.error("Error fetching destinations:", destErr);
    return;
  }

  const destMap = {};
  dbDestinations.forEach(d => {
    destMap[d.slug] = d.id;
  });

  console.log("Seeding hotels...");
  
  const hotels = [
    {
      id: crypto.randomUUID(),
      name: "Grand Plaza Hotel",
      destinationId: destMap["dubai-uae"],
      address: "Downtown Dubai, 2km from center",
      rating: 5,
      description: "Experience luxury in the heart of Dubai.",
      isActive: true,
      updatedAt: new Date().toISOString()
    },
    {
      id: crypto.randomUUID(),
      name: "The Londoner",
      destinationId: destMap["london-uk"],
      address: "Leicester Square, London",
      rating: 4,
      description: "Boutique hotel in London.",
      isActive: true,
      updatedAt: new Date().toISOString()
    },
    {
      id: crypto.randomUUID(),
      name: "Nile View Resort",
      destinationId: destMap["cairo-egypt"],
      address: "Downtown Cairo",
      rating: 4,
      description: "Beautiful views of the Nile River.",
      isActive: true,
      updatedAt: new Date().toISOString()
    }
  ];

  for (const hotel of hotels) {
    const { error } = await supabase.from("Hotel").insert(hotel);
    if (error) {
      console.error("Error inserting hotel:", error);
      return;
    }
    
    // Seed one room for each hotel
    const room = {
      id: crypto.randomUUID(),
      hotelId: hotel.id,
      name: "Standard Room",
      type: "Double",
      pricePerNight: hotel.destinationId === destMap["dubai-uae"] ? 120000 : 90000,
      capacity: 2,
      updatedAt: new Date().toISOString()
    };
    
    const { error: roomError } = await supabase.from("Room").insert(room);
    if (roomError) {
      console.error("Error inserting room:", roomError);
      return;
    }
  }

  console.log("Seeding complete!");
}

seed();
