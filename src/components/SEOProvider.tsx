import { HelmetProvider, Helmet } from 'react-helmet-async';
import { ReactNode } from 'react';

export interface SEOConfig {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  canonical?: string;
  noindex?: boolean;
  jsonLd?: Record<string, unknown>;
}

const DEFAULT_SEO: SEOConfig = {
  title: '高棉职通车 - Khmer Career Express',
  description: '柬埔寨领先的中英双语招聘平台，连接人才与全球就业机会。提供直聊模式、AI匹配、一键申请、视频面试等功能。',
  keywords: '柬埔寨招聘,柬埔寨求职,柬埔寨工作,Cambodia Jobs,Phnom Penh Careers',
  ogImage: 'https://khmercareer.com/og-image.jpg',
  ogType: 'website',
  canonical: 'https://khmercareer.com/',
};

const PAGE_SEO: Record<string, SEOConfig> = {
  '/': {
    title: '高棉职通车 - Khmer Career Express',
    description: '柬埔寨领先的中英双语招聘平台，连接人才与全球就业机会。提供直聊模式、AI匹配、一键申请、视频面试等功能。覆盖服装纺织、旅游酒店、ICT科技等14大行业，113+职位等你来申请。',
    keywords: '柬埔寨招聘,柬埔寨求职,柬埔寨工作,Cambodia Jobs,Phnom Penh Careers,高棉职通车',
    canonical: 'https://khmercareer.com/',
  },
  '/jobs': {
    title: '职位搜索 - 高棉职通车',
    description: '浏览柬埔寨最新招聘职位，覆盖服装纺织、旅游酒店、ICT科技等14大行业，113+职位等你来申请。',
    keywords: '柬埔寨职位,招聘搜索,找工作,Phnom Penh Jobs,金边招聘',
    canonical: 'https://khmercareer.com/jobs',
  },
  '/login': {
    title: '登录 - 高棉职通车',
    description: '登录高棉职通车，开始你的求职之旅。',
    canonical: 'https://khmercareer.com/login',
    noindex: true,
  },
  '/register': {
    title: '注册 - 高棉职通车',
    description: '注册高棉职通车账户，创建你的专业简历。',
    canonical: 'https://khmercareer.com/register',
    noindex: true,
  },
  '/ai-match': {
    title: 'AI智能匹配 - 高棉职通车',
    description: '使用AI智能匹配系统，根据你的技能、经验、期望薪资找到最适合的职位。',
    keywords: 'AI匹配,智能推荐,职位匹配,Cambodia AI Jobs',
    canonical: 'https://khmercareer.com/ai-match',
  },
  '/video-interview': {
    title: '视频面试 - 高棉职通车',
    description: '在线视频面试平台，支持AI面试辅助和实时评分。',
    canonical: 'https://khmercareer.com/video-interview',
  },
  '/courses': {
    title: '培训课程 - 高棉职通车',
    description: '职业技能培训课程，提升你的职场竞争力。涵盖IT、语言、管理等多个领域。',
    keywords: '职业培训,技能培训,在线课程,Cambodia Training',
    canonical: 'https://khmercareer.com/courses',
  },
  '/about': {
    title: '关于我们 - 高棉职通车',
    description: '了解高棉职通车，柬埔寨领先的中英双语招聘平台。我们的使命是连接人才与全球就业机会。',
    keywords: '关于高棉职通车,Cambodia Recruitment Platform',
    canonical: 'https://khmercareer.com/about',
  },
  '/contact': {
    title: '联系我们 - 高棉职通车',
    description: '联系高棉职通车团队，获取招聘和求职支持。',
    canonical: 'https://khmercareer.com/contact',
  },
  '/employers': {
    title: '企业招聘 - 高棉职通车',
    description: '企业招聘解决方案，发布职位、搜索简历、管理候选人。',
    keywords: '企业招聘,人才招聘,雇主服务,Cambodia Employers',
    canonical: 'https://khmercareer.com/employers',
  },
  '/pricing': {
    title: '服务价格 - 高棉职通车',
    description: '了解高棉职通车的企业招聘服务价格和套餐。',
    canonical: 'https://khmercareer.com/pricing',
  },
  '/privacy': {
    title: '隐私政策 - 高棉职通车',
    description: '高棉职通车隐私政策，保护你的个人信息安全。',
    canonical: 'https://khmercareer.com/privacy',
    noindex: true,
  },
  '/terms': {
    title: '服务条款 - 高棉职通车',
    description: '高棉职通车服务条款和用户协议。',
    canonical: 'https://khmercareer.com/terms',
    noindex: true,
  },
  '/admin': {
    title: '管理后台 - 高棉职通车',
    noindex: true,
  },
  '/profile': {
    title: '个人中心 - 高棉职通车',
    noindex: true,
  },
  '/chat': {
    title: '消息中心 - 高棉职通车',
    noindex: true,
  },
  '/resume': {
    title: '简历中心 - 高棉职通车',
    description: '创建和管理你的专业简历，提升求职竞争力。',
    noindex: true,
  },
  '/interview': {
    title: '面试准备 - 高棉职通车',
    description: '面试技巧、模拟面试、面试题库，助你轻松通过面试。',
    canonical: 'https://khmercareer.com/interview',
  },
  '/factory-jobs': {
    title: '工厂招聘 - 高棉职通车',
    description: '柬埔寨工厂招聘信息，覆盖服装纺织、电子制造等行业。',
    keywords: '工厂招聘,制造业招聘,服装招聘,Cambodia Factory Jobs',
    canonical: 'https://khmercareer.com/factory-jobs',
  },
  '/chinese-enterprise': {
    title: '中资企业招聘 - 高棉职通车',
    description: '中资企业在柬埔寨的招聘信息，提供中文工作机会。',
    keywords: '中资企业,中文工作,中国企业招聘,Chinese Enterprise Cambodia',
    canonical: 'https://khmercareer.com/chinese-enterprise',
  },
  '/app': {
    title: '下载APP - 高棉职通车',
    description: '下载高棉职通车APP，随时随地找工作、招人才。',
    canonical: 'https://khmercareer.com/app',
  },
};

/**
 * Get SEO config for a given path
 * Handles dynamic routes like /jobs/:id and /courses/:id
 */
export function getPageSEO(path: string): SEOConfig {
  // Remove trailing slash and query parameters
  const cleanPath = path.replace(/\/?\?.*$/, '').replace(/\/$/, '') || '/';

  // Try exact match first
  if (PAGE_SEO[cleanPath]) {
    return { ...DEFAULT_SEO, ...PAGE_SEO[cleanPath] };
  }

  // Handle dynamic routes - convert /jobs/123 to /jobs/:id pattern
  // Try removing the last segment (ID) for detail pages
  const segments = cleanPath.split('/');
  if (segments.length > 2) {
    // Try /:id pattern
    const basePath = '/' + segments[1] + '/:id';
    if (PAGE_SEO[basePath]) {
      return { ...DEFAULT_SEO, ...PAGE_SEO[basePath] };
    }
    // Try parent path
    const parentPath = '/' + segments[1];
    if (PAGE_SEO[parentPath]) {
      return { ...DEFAULT_SEO, ...PAGE_SEO[parentPath] };
    }
  }

  // Fallback to default
  return { ...DEFAULT_SEO };
}

/**
 * SEO component - renders Helmet tags based on config
 */
export function SEO({ config }: { config?: SEOConfig }) {
  const merged = { ...DEFAULT_SEO, ...config };
  return (
    <Helmet>
      <title>{merged.title}</title>
      <meta name="description" content={merged.description} />
      {merged.keywords && <meta name="keywords" content={merged.keywords} />}
      {merged.noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
      )}

      {/* Open Graph */}
      <meta property="og:title" content={merged.title} />
      <meta property="og:description" content={merged.description} />
      <meta property="og:type" content={merged.ogType} />
      <meta property="og:image" content={merged.ogImage} />
      {merged.canonical && <meta property="og:url" content={merged.canonical} />}
      <meta property="og:site_name" content="高棉职通车" />
      <meta property="og:locale" content="zh_CN" />
      <meta property="og:locale:alternate" content="en_US" />
      <meta property="og:locale:alternate" content="km_KH" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={merged.title} />
      <meta name="twitter:description" content={merged.description} />
      <meta name="twitter:image" content={merged.ogImage} />

      {/* Canonical */}
      {merged.canonical && <link rel="canonical" href={merged.canonical} />}

      {/* Structured Data - JSON-LD */}
      {merged.jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(merged.jsonLd)}
        </script>
      )}
    </Helmet>
  );
}

/**
 * Default Organization JSON-LD
 */
export function OrganizationJsonLd() {
  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: '高棉职通车',
    alternateName: 'Khmer Career Express',
    url: 'https://khmercareer.com',
    logo: 'https://khmercareer.com/logo.png',
    description: '柬埔寨领先的中英双语招聘平台',
    sameAs: [
      'https://www.facebook.com/khmercareer',
      'https://t.me/khmercareer',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+855-XXX-XXXXXX',
      contactType: 'customer service',
      areaServed: 'KH',
      availableLanguage: ['Chinese', 'English', 'Khmer'],
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(organizationData)}
      </script>
    </Helmet>
  );
}

/**
 * Job Posting JSON-LD for individual job pages
 */
export function JobPostingJsonLd({
  title,
  description,
  company,
  location,
  salary,
  datePosted,
  validThrough,
  employmentType,
}: {
  title: string;
  description: string;
  company: string;
  location: string;
  salary?: string;
  datePosted: string;
  validThrough?: string;
  employmentType?: string;
}) {
  const jobData = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title,
    description,
    datePosted,
    validThrough: validThrough || datePosted,
    hiringOrganization: {
      '@type': 'Organization',
      name: company,
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: location,
        addressCountry: 'KH',
      },
    },
    employmentType: employmentType || 'FULL_TIME',
    ...(salary && {
      baseSalary: {
        '@type': 'MonetaryAmount',
        currency: 'USD',
        value: {
          '@type': 'QuantitativeValue',
          value: salary,
        },
      },
    }),
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(jobData)}
      </script>
    </Helmet>
  );
}

/**
 * SEO Provider wrapper component
 */
export function SEOProvider({ children }: { children: ReactNode }) {
  return <HelmetProvider>{children}</HelmetProvider>;
}

export default SEOProvider;
