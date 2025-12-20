import { useEffect } from 'react';

const SEO = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  author = 'Financer',
  published,
  modified
}) => {
  const siteName = 'Financer - AI-Powered Personal Finance';
  const defaultImage = '/financer.png';
  const defaultDescription = 'Transform your financial future with AI-powered insights, real-time market data, and intelligent expense tracking. Join thousands who have taken control of their money.';
  const defaultKeywords = 'personal finance, AI financial advisor, expense tracking, stock analysis, portfolio management, financial planning, investment calculator, money management';

  const metaTitle = title ? `${title} | ${siteName}` : siteName;
  const metaDescription = description || defaultDescription;
  const metaKeywords = keywords || defaultKeywords;
  const metaImage = image || defaultImage;
  const metaUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  useEffect(() => {
    // Update document title
    document.title = metaTitle;

    // Helper function to update or create meta tag
    const updateMetaTag = (name, content, property = false) => {
      const attribute = property ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);

      if (element) {
        element.setAttribute('content', content);
      } else {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        element.setAttribute('content', content);
        document.head.appendChild(element);
      }
    };

    // Basic Meta Tags
    updateMetaTag('description', metaDescription);
    updateMetaTag('keywords', metaKeywords);
    updateMetaTag('author', author);
    updateMetaTag('robots', 'index, follow');
    updateMetaTag('language', 'English');
    updateMetaTag('revisit-after', '7 days');

    // Open Graph Tags
    updateMetaTag('og:title', metaTitle, true);
    updateMetaTag('og:description', metaDescription, true);
    updateMetaTag('og:image', metaImage, true);
    updateMetaTag('og:url', metaUrl, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:site_name', siteName, true);

    // Twitter Card Tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', metaTitle);
    updateMetaTag('twitter:description', metaDescription);
    updateMetaTag('twitter:image', metaImage);

    // Additional tags if provided
    if (published) {
      updateMetaTag('article:published_time', published, true);
    }
    if (modified) {
      updateMetaTag('article:modified_time', modified, true);
    }

  }, [metaTitle, metaDescription, metaKeywords, author, metaImage, metaUrl, type, siteName, published, modified]);

  return null; // This component doesn't render anything
};

export default SEO;