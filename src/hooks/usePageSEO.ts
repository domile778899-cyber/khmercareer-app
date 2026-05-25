import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getPageSEO } from '../components/SEOProvider';

/**
 * Hook to automatically update page SEO metadata based on current route.
 * Falls back to DOM manipulation for HashRouter compatibility.
 *
 * Usage:
 *   // In Layout component or top-level component
 *   usePageSEO();
 *
 *   // Or with custom overrides
 *   usePageSEO({ title: 'Custom Title' });
 */
export function usePageSEO(customConfig?: { title?: string; description?: string }) {
  const location = useLocation();

  useEffect(() => {
    const seo = getPageSEO(location.pathname);

    // Use custom config if provided, otherwise use route-based SEO
    const title = customConfig?.title || seo.title || '高棉职通车';
    const description = customConfig?.description || seo.description || '';

    // Update document title
    document.title = title;

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // Update og:title
    let ogTitle = document.querySelector('meta[property="og:title"]') as HTMLMetaElement | null;
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', title);

    // Update og:description
    let ogDesc = document.querySelector('meta[property="og:description"]') as HTMLMetaElement | null;
    if (!ogDesc) {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute('content', description);

    // Update og:url
    let ogUrl = document.querySelector('meta[property="og:url"]') as HTMLMetaElement | null;
    if (!ogUrl) {
      ogUrl = document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrl);
    }
    const canonicalUrl = seo.canonical || `https://khmercareer.com${location.pathname}`;
    ogUrl.setAttribute('content', canonicalUrl);

    // Update canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // Add noindex if needed
    if (seo.noindex) {
      let robotsMeta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
      if (!robotsMeta) {
        robotsMeta = document.createElement('meta');
        robotsMeta.setAttribute('name', 'robots');
        document.head.appendChild(robotsMeta);
      }
      robotsMeta.setAttribute('content', 'noindex, nofollow');
    }

    // Update theme-color for mobile browsers
    let themeColor = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
    if (!themeColor) {
      themeColor = document.createElement('meta');
      themeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(themeColor);
    }
    themeColor.setAttribute('content', '#C2A26E');

  }, [location.pathname, customConfig?.title, customConfig?.description]);
}

export default usePageSEO;
