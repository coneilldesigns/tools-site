import { Metadata } from 'next';
import { toolSections } from '@/data/toolSections';
import ToolLayoutClient from './ToolLayoutClient';

type Props = {
  children: React.ReactNode;
  params: Promise<{ tool: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tool } = await params;
  
  // Find the tool in our sections
  const toolData = toolSections
    .flatMap(section => section.tools)
    .find(t => t.path === tool);

  if (!toolData) {
    return {
      title: 'Tool Not Found',
      description: 'The requested tool could not be found.',
    };
  }

  return {
    title: toolData.seo.title,
    description: toolData.seo.description,
    keywords: toolData.seo.keywords.join(', '),
    openGraph: {
      title: toolData.seo.title,
      description: toolData.seo.description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: toolData.seo.title,
      description: toolData.seo.description,
    },
  };
}

export default async function Layout({ children, params }: Props) {
  await params;
  return <ToolLayoutClient>{children}</ToolLayoutClient>;
} 