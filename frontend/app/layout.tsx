import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Virtual Holidays | Slow Travel in Amsterdam & Paris',
    template: '%s | Virtual Holidays',
  },
  description:
    'Discover curated slow travel experiences in Amsterdam and Paris. Handpicked destinations, cultural immersion, and authentic local experiences for the discerning traveller.',
  keywords: ['Amsterdam travel', 'Paris travel', 'slow travel', 'European lifestyle', 'cultural travel', 'travel blog'],
  authors: [{ name: 'Virtual Holidays' }],
  creator: 'Virtual Holidays',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://neemtravels.com',
    siteName: 'Virtual Holidays',
    title: 'Virtual Holidays | Slow Travel in Amsterdam & Paris',
    description: 'Discover curated slow travel experiences in Amsterdam and Paris.',
    images: [
      {
        url: 'https://images.pexels.com/photos/1414467/pexels-photo-1414467.jpeg?auto=compress&cs=tinysrgb&w=1200',
        width: 1200,
        height: 630,
        alt: 'Virtual Holidays - Amsterdam Canals',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Virtual Holidays | Slow Travel in Amsterdam & Paris',
    description: 'Discover curated slow travel experiences in Amsterdam and Paris.',
    images: ['https://images.pexels.com/photos/1414467/pexels-photo-1414467.jpeg?auto=compress&cs=tinysrgb&w=1200'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
