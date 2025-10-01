// app/+html.tsx
import { ScrollViewStyleReset } from 'expo-router/html';

export default function Document({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Basic */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#E6F4FE" />
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
        <link rel="icon" type="image/png" sizes="any" href="/assets/icon.png?v=1.0.5" />
      {/* Home screen / PWA icons */}
      <link rel="apple-touch-icon" sizes="180x180" href="/assets/icon.png" />
      <link rel="apple-touch-icon-precomposed" sizes="180x180" href="/assets/icon.png" />
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
