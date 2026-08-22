import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#00205B",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://arrehlah.com"),
  title: {
    default: "Arrehlah Travel & Tours Ltd | Flights, Tours, Umrah, Hajj & Visa Services",
    template: "%s | Arrehlah Travel & Tours",
  },
  description: "Arrehlah Travel & Tours Ltd is a premier travel agency based in Kano, Nigeria, offering international flights, Umrah and Hajj packages, custom tours, and visa assistance.",
  keywords: [
    "Arrehlah Travel & Tours",
    "Arrehlah Travel Kano",
    "Travel agency Kano",
    "Travel agency in Kano",
    "Travel agency Nigeria",
    "Flights from Kano",
    "International travel Kano",
    "Umrah packages Kano",
    "Hajj packages Kano",
    "Visa services Kano",
  ],
  authors: [{ name: "Arrehlah Travel & Tours Ltd" }],
  creator: "SIMDMULTIMEDIA",
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://arrehlah.com",
    title: "Arrehlah Travel & Tours Ltd",
    description: "Premium travel services from Kano to the world. Flights, hotels, tours, Umrah, Hajj, and visas with complete peace of mind.",
    siteName: "Arrehlah Travel & Tours",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Arrehlah Travel & Tours Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Arrehlah Travel & Tours Ltd",
    description: "Premium travel services from Kano to the world. Flights, hotels, tours, Umrah, Hajj, and visas.",
    images: ["/logo.png"],
  },
  alternates: {
    canonical: "/",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: "Arrehlah Travel & Tours Ltd",
  image: "https://arrehlah.com/logo.png",
  "@id": "https://arrehlah.com",
  url: "https://arrehlah.com",
  telephone: "+2349079797429",
  email: "arrehlahtravelandtours@gmail.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "NO 37 Dantata Plaza Sharada Phase 1, by Kwanar Freedom Radio",
    addressLocality: "Kano",
    addressCountry: "NG",
    postalCode: "700234"
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 11.974,
    longitude: 8.528
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ],
    opens: "09:00",
    closes: "17:00"
  },
  sameAs: [
    "https://facebook.com/arrehlahtravel",
    "https://twitter.com/arrehlahtravel",
    "https://instagram.com/arrehlahtravel"
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
