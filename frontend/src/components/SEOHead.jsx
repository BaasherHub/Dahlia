import { useEffect } from 'react';

export default function SEOHead({
  title = 'Dahlia Baasher',
  description = 'Contemporary oil paintings by Dahlia Baasher. Refined works on premium linen canvas.',
  image = 'https://www.dahliabaasher.com/og-image.jpg'
}) {
  useEffect(() => {
    const fullTitle = `${title} | Dahlia Baasher - Contemporary Artist`;
    document.title = fullTitle;

    const setMeta = (selector, attr, value) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        const match = selector.match(/\[([^\]]+)\]/);
        if (match) {
          const [attrName, attrVal] = match[1].split('=');
          el.setAttribute(attrName, attrVal.replace(/['"]/g, ''));
        }
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };

    setMeta('meta[name="description"]', 'content', description);
    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[property="og:image"]', 'content', image);
    setMeta('meta[property="og:type"]', 'content', 'website');
    setMeta('meta[name="twitter:card"]', 'content', 'summary_large_image');
    setMeta('meta[name="twitter:title"]', 'content', title);
    setMeta('meta[name="twitter:description"]', 'content', description);
    setMeta('meta[name="twitter:image"]', 'content', image);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', window.location.href);
  }, [title, description, image]);

  return null;
}
