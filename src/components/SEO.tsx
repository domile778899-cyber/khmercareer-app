/**
 * SEO Component
 * Provides dynamic meta tags, Open Graph, Twitter Cards, and JSON-LD structured data
 * for search engine optimization and social sharing.
 */
import { useEffect } from 'react';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  type?: 'website' | 'article';
  canonicalUrl?: string;
  noindex?: boolean;
  /** JSON-LD structured data schema */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  /** Article specific props */
  article?: {
    author?: string;
    publishedTime?: string;
    modifiedTime?: string;
    section?: string;
    tags?: string[];
  };
  /** Twitter specific props */
  twitter?: {
    card?: 'summary' | 'summary_large_image' | 'app' | 'player';
    site?: string;
    creator?: string;
  };
}

const DEFAULT_CONFIG = {
  siteName: '高棉职通车 - Khmer Career Express',
  siteUrl: 'https://khmercareer.com',
  defaultDescription:
    '高棉职通车 - 连接柬埔寨人才与中国、日本及东南亚的就业机会。Khmer Career Express - Connecting Cambodian talent with opportunities across China, Japan and Southeast Asia.',
  defaultKeywords:
    'jobs, career, Cambodia, Khmer, China, Japan, Southeast Asia, recruitment, employment, 高棉职通车, 柬埔寨, 招聘, 就业, ការងារ',
  defaultImage: 'https://khmercareer.com/og-image.jpg',
};

export function SEO({
  title,
  description,
  keywords,
  ogImage,
  type = 'website',
  canonicalUrl,
  noindex = false,
  jsonLd,
  article,
  twitter,
}: SEOProps) {
  const fullTitle = title
    ? `${title} | ${DEFAULT_CONFIG.siteName}`
    : DEFAULT_CONFIG.siteName;
  const metaDescription = description || DEFAULT_CONFIG.defaultDescription;
  const metaKeywords = keywords || DEFAULT_CONFIG.defaultKeywords;
  const imageUrl = ogImage || DEFAULT_CONFIG.defaultImage;
  const canonical = canonicalUrl || DEFAULT_CONFIG.siteUrl;

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Helper to set or create meta tags
    const setMeta = (name: string, content: string, property = false) => {
      const attrName = property ? 'property' : 'name';
      let element = document.querySelector(
        `meta[${attrName}="${name}"]`
      ) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, name);
        document.head.appendChild(element);
      }
      element.content = content;
    };

    // Helper to set link tags
    const setLink = (rel: string, href: string) => {
      let element = document.querySelector(
        `link[rel="${rel}"]`
      ) as HTMLLinkElement | null;
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.href = href;
    };

    // --- Basic Meta Tags ---
    setMeta('description', metaDescription);
    setMeta('keywords', metaKeywords);
    setMeta('robots', noindex ? 'noindex, nofollow' : 'index, follow');

    // --- Canonical URL ---
    setLink('canonical', canonical);

    // --- Open Graph Tags ---
    setMeta('og:title', fullTitle, true);
    setMeta('og:description', metaDescription, true);
    setMeta('og:type', type, true);
    setMeta('og:url', canonical, true);
    setMeta('og:image', imageUrl, true);
    setMeta('og:site_name', DEFAULT_CONFIG.siteName, true);
    setMeta('og:locale', 'km_KH', true);

    // --- Twitter Card Tags ---
    const twitterCard = twitter?.card || 'summary_large_image';
    setMeta('twitter:card', twitterCard);
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', metaDescription);
    setMeta('twitter:image', imageUrl);
    if (twitter?.site) setMeta('twitter:site', twitter.site);
    if (twitter?.creator) setMeta('twitter:creator', twitter.creator);

    // --- Article Specific Tags ---
    if (type === 'article' && article) {
      if (article.author) {
        setMeta('article:author', article.author, true);
      }
      if (article.publishedTime) {
        setMeta('article:published_time', article.publishedTime, true);
      }
      if (article.modifiedTime) {
        setMeta('article:modified_time', article.modifiedTime, true);
      }
      if (article.section) {
        setMeta('article:section', article.section, true);
      }
      if (article.tags) {
        // Remove old article tags
        document
          .querySelectorAll('meta[property="article:tag"]')
          .forEach((el) => el.remove());
        article.tags.forEach((tag) => {
          const tagEl = document.createElement('meta');
          tagEl.setAttribute('property', 'article:tag');
          tagEl.content = tag;
          document.head.appendChild(tagEl);
        });
      }
    }

    // --- JSON-LD Structured Data ---
    // Remove existing JSON-LD scripts created by this component
    document
      .querySelectorAll('script[data-seo-jsonld]')
      .forEach((el) => el.remove());

    if (jsonLd) {
      const schemas = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      schemas.forEach((schema) => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-seo-jsonld', '');
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
      });
    }

    // Cleanup: reset title and remove dynamic meta on unmount
    return () => {
      // Note: We don't clean up meta tags to avoid flickering between pages.
      // The next SEO component will override them. This is standard SPA behavior.
    };
  }, [
    fullTitle,
    metaDescription,
    metaKeywords,
    imageUrl,
    canonical,
    type,
    noindex,
    jsonLd,
    article,
    twitter,
  ]);

  // This component doesn't render anything visible
  return null;
}

/** Predefined JSON-LD schemas for common use cases */

/**
 * Generate Organization structured data
 */
export function generateOrganizationSchema(
  overrides: Record<string, unknown> = {}
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: '高棉职通车',
    alternateName: 'Khmer Career Express',
    url: DEFAULT_CONFIG.siteUrl,
    logo: `${DEFAULT_CONFIG.siteUrl}/logo.png`,
    sameAs: [
      'https://facebook.com/khmercareer',
      'https://twitter.com/khmercareer',
      'https://linkedin.com/company/khmercareer',
    ],
    description: DEFAULT_CONFIG.defaultDescription,
    ...overrides,
  };
}

/**
 * Generate JobPosting structured data for job listings
 */
export function generateJobPostingSchema(job: {
  title: string;
  description: string;
  company: string;
  location: string;
  salary?: string;
  employmentType?: string;
  datePosted: string;
  validThrough?: string;
  applyUrl: string;
  companyLogo?: string;
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    datePosted: job.datePosted,
    validThrough: job.validThrough,
    employmentType: job.employmentType || 'FULL_TIME',
    hiringOrganization: {
      '@type': 'Organization',
      name: job.company,
      logo: job.companyLogo || `${DEFAULT_CONFIG.siteUrl}/logo.png`,
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'KH',
        addressLocality: job.location,
      },
    },
    baseSalary: job.salary
      ? {
          '@type': 'MonetaryAmount',
          currency: 'USD',
          value: {
            '@type': 'QuantitativeValue',
            value: job.salary,
          },
        }
      : undefined,
    directApply: true,
    url: job.applyUrl,
  };
}

/**
 * Generate WebSite structured data (with SearchAction for Sitelinks Searchbox)
 */
export function generateWebSiteSchema(
  overrides: Record<string, unknown> = {}
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: DEFAULT_CONFIG.siteName,
    url: DEFAULT_CONFIG.siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${DEFAULT_CONFIG.siteUrl}/jobs?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
    ...overrides,
  };
}

/**
 * Generate BreadcrumbList structured data
 */
export function generateBreadcrumbSchema(
  items: { name: string; url: string }[]
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate FAQPage structured data
 */
export function generateFAQSchema(
  questions: { question: string; answer: string }[]
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  };
}

export default SEO;
