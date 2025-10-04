// components/SeoHead.js
import Head from 'next/head';

export default function SeoHead({
  title = "OpenLibrary Explorer",
  description = "Search books by URL/ID/title, browse authors, and explore details using the OpenLibrary API.",
  url,
  image = "/og-default.png",
  themeColor = "#0d6efd",
}) {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const fullUrl = url || site;
  const fullImage = image.startsWith("http") ? image : `${site}${image}`;

  const v = "v=5"; // bump this when you replace the icon

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Use ICO only */}
      <link rel="icon" href={`/favicon.ico?${v}`} />

      <meta name="theme-color" content={themeColor} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={fullImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
    </Head>
  );
}
