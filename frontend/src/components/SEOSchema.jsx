import { useEffect } from 'react';

export default function SEOSchema({ type, data }) {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify(data);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [data]);

  return null;
}

export const artistSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  'name': 'Dahlia Baasher',
  'title': 'Artist',
  'image': 'https://dahliabaasher.com/logo.jpg',
  'description': 'Contemporary artist specializing in fine art paintings',
  'url': 'https://dahliabaasher.com',
  'sameAs': [
    'https://instagram.com/dahliabaasher',
    'https://twitter.com/dahliabaasher'
  ]
};

export const gallerySchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  'name': 'Art Gallery',
  'url': 'https://dahliabaasher.com/gallery',
  'description': 'Browse contemporary art collection'
};
