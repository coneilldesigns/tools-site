import { MetadataRoute } from 'next';
import { toolSections } from '@/data/toolSections';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.everyday-tools.dev';

  // Get all enabled tools
  const toolUrls = toolSections.flatMap(section =>
    section.tools
      .filter(tool => tool.enabled)
      .map(tool => ({
        url: `${baseUrl}/${tool.path}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }))
  );

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ];

  return [...staticPages, ...toolUrls];
} 