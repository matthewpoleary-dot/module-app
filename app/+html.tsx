// app/+html.tsx
// Expo Router v6: use raw <html> <head> <body> and ScrollViewStyleReset.
import { ScrollViewStyleReset } from 'expo-router/html';

export default function HTML({ children }: { children: React.ReactNode }) {
  const title = 'Module Tracker';
  const description = 'Track modules, weightings, schedules, and deadlines.';

  // If you want to bump caches again later, change ?v=3 to ?v=4, etc.
  const v = '3';

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <meta name="description" content={description} />
        <meta name="theme-color" content="#0f172a" />
        <ScrollViewStyleReset />

        {/* Stable root icons for iOS/Android/web */}
        <link rel="apple-touch-icon" sizes="180x180" href={`/apple-touch-icon-180x180.png?v=${v}`} />
        <link rel="apple-touch-icon" href={`/apple-touch-icon.png?v=${v}`} />
        <link rel="icon" type="image/png" sizes="192x192" href={`/favicon-192.png?v=${v}`} />
        <link rel="icon" type="image/png" sizes="512x512" href={`/favicon-512.png?v=${v}`} />

        {/* Social previews (optional but nice) */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={`/apple-touch-icon-180x180.png?v=${v}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={`/apple-touch-icon-180x180.png?v=${v}`} />

        <title>{title}</title>
      </head>
      <body>{children}</body>
    </html>
  );
}
