import { Helmet } from 'react-helmet';

export default function SEOHead({ 
  title = 'Dahlia Baasher', 
  description = 'Contemporary oil paintings by Dahlia Baasher. Refined works on premium linen canvas.',
  image = 'https://www.dahliabaasher.com/og-image.jpg'
}) {
  return (
    <Helmet>
      <title>{title} | Dahlia Baasher - Contemporary Artist</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta charSet="utf-8" />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content="website" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Canonical */}
      <link rel="canonical" href={window.location.href} />
    </Helmet>
  );
}
