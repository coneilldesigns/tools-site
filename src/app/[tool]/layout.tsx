import { Metadata } from 'next';
import { toolSections } from '@/data/toolSections';
import ToolLayoutClient from './ToolLayoutClient';

interface Props {
  params: {
    tool: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Find the tool in our sections
  const tool = toolSections
    .flatMap(section => section.tools)
    .find(tool => tool.path === params.tool);

  if (!tool) {
    return {
      title: 'Tool Not Found',
      description: 'The requested tool could not be found.',
    };
  }

  return {
    title: tool.seo.title,
    description: tool.seo.description,
    keywords: tool.seo.keywords.join(', '),
    openGraph: {
      title: tool.seo.title,
      description: tool.seo.description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: tool.seo.title,
      description: tool.seo.description,
    },
  };
}

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ToolLayoutClient>{children}</ToolLayoutClient>;
} 