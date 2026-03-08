
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
}

export interface WebsiteRequest {
  id: string;
  userId: string;
  userName: string;
  email: string;
  phone: string;
  whatsapp: string;
  websiteType: string;
  budget: string;
  title: string;
  description: string;
  functions: string;
  pages: string;
  designStyle: string;
  extraFeatures: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
}

export const WEBSITE_TYPES = [
  { id: 'business', label: 'Business Website', price: '$49' },
  { id: 'portfolio', label: 'Portfolio Website', price: '$39' },
  { id: 'blog', label: 'Blog Website', price: '$29' },
  { id: 'ecommerce', label: 'Ecommerce Website', price: '$99' },
  { id: 'gaming', label: 'Gaming Website', price: '$59' },
  { id: 'hotel', label: 'Hotel / Resort Website', price: '$79' },
  { id: 'streaming', label: 'Streaming Website', price: '$129' },
  { id: 'custom', label: 'Custom Website', price: 'Varies' }
];
