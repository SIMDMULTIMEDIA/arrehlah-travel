require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function seed() {
  console.log("Seeding destinations...");

  const destinations = [
    { id: crypto.randomUUID(), name: "Dubai, UAE", slug: "dubai-uae", country: "United Arab Emirates" },
    { id: crypto.randomUUID(), name: "London, UK", slug: "london-uk", country: "United Kingdom" },
    { id: crypto.randomUUID(), name: "Cairo, Egypt", slug: "cairo-egypt", country: "Egypt" },
  ];

  for (const dest of destinations) {
    const { error } = await supabase.from("Destination").upsert({
      id: dest.id,
      name: dest.name,
      slug: dest.slug,
      country: dest.country,
      updatedAt: new Date().toISOString()
    }, { onConflict: "slug" });
    if (error) {
      console.error("Error inserting destination:", error);
      return;
    }
  }

  // Fetch the created destinations to get their IDs (in case they already existed)
  const { data: dbDestinations } = await supabase.from("Destination").select("id, slug");
  
  const destMap = {};
  dbDestinations.forEach(d => {
    destMap[d.slug] = d.id;
  });

  console.log("Seeding tours...");
  
  const tours = [
    {
      id: crypto.randomUUID(),
      title: "Discover Dubai - 5 Days",
      slug: "discover-dubai-5-days",
      destinationId: destMap["dubai-uae"],
      durationDays: 5,
      price: 650000,
      coverImage: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: crypto.randomUUID(),
      title: "Best of London",
      slug: "best-of-london",
      destinationId: destMap["london-uk"],
      durationDays: 7,
      price: 1200000,
      coverImage: "https://images.unsplash.com/photo-1513635269975-59693e0cd156?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: crypto.randomUUID(),
      title: "Egyptian Wonders",
      slug: "egyptian-wonders",
      destinationId: destMap["cairo-egypt"],
      durationDays: 6,
      price: 750000,
      coverImage: "https://images.unsplash.com/photo-1539667468225-eebb663053e6?q=80&w=800&auto=format&fit=crop",
    }
  ];

  for (const tour of tours) {
    const { error } = await supabase.from("Tour").upsert({
      id: tour.id,
      title: tour.title,
      slug: tour.slug,
      destinationId: tour.destinationId,
      durationDays: tour.durationDays,
      price: tour.price,
      coverImage: tour.coverImage,
      updatedAt: new Date().toISOString()
    }, { onConflict: "slug" });
    if (error) {
      console.error("Error inserting tour:", error);
      return;
    }
  }

  console.log("Seeding complete!");
}

seed();
