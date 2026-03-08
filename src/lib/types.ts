
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
  { 
    id: 'business', 
    label: 'Business Website', 
    price: '$149 - $250',
    features: ['Corporate Design', 'SEO Optimization', 'Contact Forms', 'Service Pages']
  },
  { 
    id: 'portfolio', 
    label: 'Portfolio Website', 
    price: '$100 - $129',
    features: ['Creative Showcase', 'Gallery System', 'Personal Branding', 'Mobile Ready']
  },
  { 
    id: 'blog', 
    label: 'Blog Website', 
    price: '$79 - $99',
    features: ['Article Management', 'Social Sharing', 'Newsletter Integration', 'Comments']
  },
  { 
    id: 'ecommerce', 
    label: 'Ecommerce Website', 
    price: '$299+',
    features: ['Payment Gateway', 'Inventory System', 'Cart/Checkout', 'User Accounts']
  },
  { 
    id: 'gaming', 
    label: 'Gaming Website', 
    price: '$149 - $199',
    features: ['E-sports Layout', 'Stream Integration', 'Community Forums', 'Dark Mode']
  },
  { 
    id: 'hotel', 
    label: 'Hotel / Resort Website', 
    price: '$199 - $299',
    features: ['Booking Calendar', 'Room Showcase', 'Maps Integration', 'Testimonials']
  },
  { 
    id: 'streaming', 
    label: 'Streaming Website', 
    price: '$399+',
    features: ['Video Management', 'Subscription Model', 'High Performance', 'Chat System']
  },
  { 
    id: 'custom', 
    label: 'Custom Website', 
    price: 'Varies',
    features: ['Tailored Solutions', 'Any Functionality', 'Scalable Architecture', 'Full Control']
  }
];
