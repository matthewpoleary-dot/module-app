// app/+html.tsx
import { ScrollViewStyleReset } from 'expo-router/html';

export default function Document({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Basic */}
        <meta name="title" content="My App" />
        <meta name="description" content="Your short description." />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="My App" />
        <meta property="og:description" content="Your short description." />
        <meta property="og:image" content="/og.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="My App" />
        <meta name="twitter:description" content="Your short description." />
        <meta name="twitter:image" content="/og.png" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        {/* Home screen / PWA icons */}
        <link rel="apple-touch-icon" sizes="180x180" href="/assets/icon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/assets/icon.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/assets/icon.png" />

        <ScrollViewStyleReset />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
