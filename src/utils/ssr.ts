/**
 * KhmerCareer - SEO SSR Service
 * Pre-rendering utilities, meta tag helpers, JSON-LD generators, and sitemap builder
 */

/* ═══════════════════════════════════════════
   Types
   ═══════════════════════════════════════════ */

export interface SEOMetaTags {
  title: string;
  description: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonical?: string;
  lang?: string;
  noindex?: boolean;
  nofollow?: boolean;
  author?: string;
  publishedAt?: string;
  modifiedAt?: string;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface OrganizationJsonLD {
  name: string;
  url: string;
  logo: string;
  description: string;
  sameAs?: string[];
  contactPoint?: {
    telephone: string;
    contactType: string;
    areaServed: string;
    availableLanguage: string[];
  }[];
}

export interface JobPostingJsonLD {
  title: string;
  description: string;
  companyName: string;
  companyLogo?: string;
  location: string;
  employmentType: string;
  salaryCurrency?: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryUnit?: string;
  datePosted: string;
  validThrough?: string;
  applyUrl: string;
  skills?: string[];
}

export interface WebPageJsonLD {
  title: string;
  description: string;
  url: string;
  siteName: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  breadcrumbs?: BreadcrumbItem[];
}

export interface SitemapEntry {
  url: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
  alternates?: { lang: string; url: string }[];
}

/* ═══════════════════════════════════════════
   Meta Tag Generation
   ═══════════════════════════════════════════ */

export function generateMetaTags(meta: SEOMetaTags): string {
  const tags: string[] = [];
  tags.push(`<title>${escapeHtml(meta.title)}</title>`);
  tags.push(`<meta name="description" content="${escapeHtml(meta.description)}" />`);
  if (meta.keywords?.length) tags.push(`<meta name="keywords" content="${meta.keywords.map(escapeHtml).join(', ')}" />`);
  if (meta.author) tags.push(`<meta name="author" content="${escapeHtml(meta.author)}" />`);
  if (meta.noindex) tags.push(`<meta name="robots" content="noindex${meta.nofollow ? ', nofollow' : ''}" />`);
  if (meta.canonical) tags.push(`<link rel="canonical" href="${escapeHtml(meta.canonical)}" />`);
  tags.push(`<meta property="og:title" content="${escapeHtml(meta.ogTitle || meta.title)}" />`);
  tags.push(`<meta property="og:description" content="${escapeHtml(meta.ogDescription || meta.description)}" />`);
  if (meta.ogImage) tags.push(`<meta property="og:image" content="${escapeHtml(meta.ogImage)}" />`);
  if (meta.ogUrl) tags.push(`<meta property="og:url" content="${escapeHtml(meta.ogUrl)}" />`);
  if (meta.ogType) tags.push(`<meta property="og:type" content="${escapeHtml(meta.ogType)}" />`);
  if (meta.twitterCard) tags.push(`<meta name="twitter:card" content="${escapeHtml(meta.twitterCard)}" />`);
  if (meta.twitterTitle || meta.title) tags.push(`<meta name="twitter:title" content="${escapeHtml(meta.twitterTitle || meta.title)}" />`);
  if (meta.twitterDescription || meta.description) tags.push(`<meta name="twitter:description" content="${escapeHtml(meta.twitterDescription || meta.description)}" />`);
  if (meta.twitterImage || meta.ogImage) tags.push(`<meta name="twitter:image" content="${escapeHtml(meta.twitterImage || meta.ogImage || '')}" />`);
  if (meta.publishedAt) tags.push(`<meta property="article:published_time" content="${meta.publishedAt}" />`);
  if (meta.modifiedAt) tags.push(`<meta property="article:modified_time" content="${meta.modifiedAt}" />`);
  return tags.join('\n');
}

/* ═══════════════════════════════════════════
   JSON-LD Structured Data Generators
   ═══════════════════════════════════════════ */

export function generateOrganizationJsonLD(org: OrganizationJsonLD): string {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: org.name,
    url: org.url,
    logo: org.logo,
    description: org.description,
    sameAs: org.sameAs || [],
    contactPoint: (org.contactPoint || []).map(cp => ({
      '@type': 'ContactPoint',
      telephone: cp.telephone,
      contactType: cp.contactType,
      areaServed: cp.areaServed,
      availableLanguage: cp.availableLanguage,
    })),
  };
  return wrapJsonLD(data);
}

export function generateJobPostingJsonLD(job: JobPostingJsonLD): string {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    datePosted: job.datePosted,
    validThrough: job.validThrough,
    hiringOrganization: {
      '@type': 'Organization',
      name: job.companyName,
      logo: job.companyLogo,
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.location,
        addressCountry: 'KH',
      },
    },
    employmentType: job.employmentType,
    applyUrl: job.applyUrl,
  };
  if (job.salaryMin && job.salaryMax) {
    data.baseSalary = {
      '@type': 'MonetaryAmount',
      currency: job.salaryCurrency || 'USD',
      value: {
        '@type': 'QuantitativeValue',
        minValue: job.salaryMin,
        maxValue: job.salaryMax,
        unitText: job.salaryUnit || 'MONTH',
      },
    };
  }
  if (job.skills?.length) data.skills = job.skills;
  return wrapJsonLD(data);
}

export function generateWebPageJsonLD(page: WebPageJsonLD): string {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.title,
    description: page.description,
    url: page.url,
    isPartOf: { '@type': 'WebSite', name: page.siteName },
  };
  if (page.image) data.image = page.image;
  if (page.datePublished) data.datePublished = page.datePublished;
  if (page.dateModified) data.dateModified = page.dateModified;
  if (page.breadcrumbs?.length) {
    data.breadcrumb = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: page.breadcrumbs.map((crumb, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: crumb.name,
        item: crumb.url,
      })),
    };
  }
  return wrapJsonLD(data);
}

export function generateBreadcrumbJsonLD(items: BreadcrumbItem[]): string {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
  return wrapJsonLD(data);
}

export function generateFAQJsonLD(questions: { question: string; answer: string }[]): string {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map(q => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  };
  return wrapJsonLD(data);
}

function wrapJsonLD(data: Record<string, unknown>): string {
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

/* ═══════════════════════════════════════════
   Sitemap Generator
   ═══════════════════════════════════════════ */

export function generateSitemap(entries: SitemapEntry[]): string {
  const lines: string[] = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  ];
  for (const entry of entries) {
    lines.push('  <url>');
    lines.push(`    <loc>${escapeXml(entry.url)}</loc>`);
    if (entry.lastmod) lines.push(`    <lastmod>${entry.lastmod}</lastmod>`);
    if (entry.changefreq) lines.push(`    <changefreq>${entry.changefreq}</changefreq>`);
    if (entry.priority !== undefined) lines.push(`    <priority>${entry.priority}</priority>`);
    if (entry.alternates) {
      for (const alt of entry.alternates) {
        lines.push(`    <xhtml:link rel="alternate" hreflang="${alt.lang}" href="${escapeXml(alt.url)}" />`);
      }
    }
    lines.push('  </url>');
  }
  lines.push('</urlset>');
  return lines.join('\n');
}

export function generateRobotsTxt(sitemapUrl?: string): string {
  const lines = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin',
    'Disallow: /api',
    'Disallow: /superadmin',
    'Disallow: /login',
    'Disallow: /register',
    'Disallow: /*?*',
    'Crawl-delay: 1',
  ];
  if (sitemapUrl) lines.push(`Sitemap: ${sitemapUrl}`);
  return lines.join('\n');
}

/* ═══════════════════════════════════════════
   Pre-render Utility
   ═══════════════════════════════════════════ */

export interface PreRenderOptions {
  url: string;
  meta: SEOMetaTags;
  jsonLd?: string[];
  lang?: string;
  appShell?: string;
}

export function generatePreRenderHTML(options: PreRenderOptions): string {
  const { url, meta, jsonLd = [], lang = 'en', appShell = '<div id="root"></div>' } = options;
  const metaTags = generateMetaTags(meta);
  const ldScripts = jsonLd.join('\n  ');
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  ${metaTags}
  ${ldScripts}
</head>
<body>
  ${appShell}
</body>
</html>`;
}

/* ═══════════════════════════════════════════
   Default SEO Config
   ═══════════════════════════════════════════ */

export function getDefaultSEOMetaTags(overrides?: Partial<SEOMetaTags>): SEOMetaTags {
  return {
    title: overrides?.title || 'KhmerCareer - Cambodia\'s Leading Job Platform',
    description: overrides?.description || 'Find jobs in Cambodia. Live recruitment, AI matching, video interviews, and career training.',
    keywords: overrides?.keywords || ['jobs cambodia', 'phnom penh jobs', 'khmer jobs', 'recruitment', 'career'],
    ogType: 'website',
    ogUrl: overrides?.ogUrl || 'https://khmercareer.com',
    ogImage: overrides?.ogImage || 'https://khmercareer.com/og-image.jpg',
    twitterCard: 'summary_large_image',
    lang: 'en',
    ...overrides,
  };
}

/* ═══════════════════════════════════════════
   Helper Utilities
   ═══════════════════════════════════════════ */

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function escapeXml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}
