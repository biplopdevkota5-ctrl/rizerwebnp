
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
  ipAddress?: string;
}

export const WEBSITE_TYPES = [
  { 
    id: 'business', 
    label: 'Business Website', 
    price: '$119 - $200',
    baseVal: 119,
    features: ['Corporate Design', 'SEO Optimization', 'Contact Forms', 'Service Pages']
  },
  { 
    id: 'portfolio', 
    label: 'Portfolio Website', 
    price: '$80 - $103',
    baseVal: 80,
    features: ['Creative Showcase', 'Gallery System', 'Personal Branding', 'Mobile Ready']
  },
  { 
    id: 'blog', 
    label: 'Blog Website', 
    price: '$63 - $79',
    baseVal: 63,
    features: ['Article Management', 'Social Sharing', 'Newsletter Integration', 'Comments']
  },
  { 
    id: 'ecommerce', 
    label: 'Ecommerce Website', 
    price: '$239+',
    baseVal: 239,
    features: ['Payment Gateway', 'Inventory System', 'Cart/Checkout', 'User Accounts']
  },
  { 
    id: 'gaming', 
    label: 'Gaming Website', 
    price: '$119 - $159',
    baseVal: 119,
    features: ['E-sports Layout', 'Stream Integration', 'Community Forums', 'Dark Mode']
  },
  { 
    id: 'hotel', 
    label: 'Hotel / Resort Website', 
    price: '$159 - $239',
    baseVal: 159,
    features: ['Booking Calendar', 'Room Showcase', 'Maps Integration', 'Testimonials']
  },
  { 
    id: 'streaming', 
    label: 'Streaming Website', 
    price: '$319+',
    baseVal: 319,
    features: ['Video Management', 'Subscription Model', 'High Performance', 'Chat System']
  },
  { 
    id: 'custom', 
    label: 'Custom Website', 
    price: 'Varies',
    baseVal: 0,
    features: ['Tailored Solutions', 'Any Functionality', 'Scalable Architecture', 'Full Control']
  }
];
