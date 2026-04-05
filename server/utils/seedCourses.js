const mongoose = require('mongoose');
const Course = require('../models/Course');
require('dotenv').config();

const connectDB = require('../config/db');

const courses = [
  // Tech & Development (15 courses)
  {
    title: 'React for Beginners: Build Your First Website',
    slug: 'react-for-beginners',
    description: 'Learn React from scratch and build modern web applications. This course covers components, hooks, state management, and deployment. Perfect for beginners wanting to enter web development.',
    shortDescription: 'Master React and build modern websites from scratch',
    image: '/images/courses/react-basics.jpg',
    price: 1500,
    originalPrice: 2500,
    category: 'tech-development',
    level: 'beginner',
    duration: 180,
    whatYouWillLearn: [
      'Build reusable React components',
      'Manage state with hooks',
      'Create responsive web applications',
      'Deploy your website live'
    ],
    requirements: ['Basic HTML/CSS knowledge', 'Computer with internet'],
    earningsPotential: 'Web developers earn Ksh 50,000-200,000/month',
    isFeatured: true,
    modules: [
      {
        title: 'Getting Started with React',
        order: 1,
        lessons: [
          { title: 'Introduction to React', duration: 15, order: 1, isPreview: true },
          { title: 'Setting Up Your Environment', duration: 20, order: 2 },
          { title: 'Your First React Component', duration: 25, order: 3 }
        ]
      },
      {
        title: 'React Hooks and State',
        order: 2,
        lessons: [
          { title: 'Understanding useState', duration: 30, order: 1 },
          { title: 'Working with useEffect', duration: 35, order: 2 },
          { title: 'Building a Counter App', duration: 40, order: 3 }
        ]
      }
    ]
  },
  {
    title: 'Node.js API Development Masterclass',
    slug: 'nodejs-api-development',
    description: 'Build robust REST APIs with Node.js and Express. Learn authentication, database integration, and best practices for scalable backend development.',
    shortDescription: 'Build powerful APIs with Node.js and Express',
    image: '/images/courses/nodejs-api.jpg',
    price: 2000,
    category: 'tech-development',
    level: 'intermediate',
    duration: 240,
    whatYouWillLearn: [
      'Build RESTful APIs',
      'Implement JWT authentication',
      'Connect to MongoDB',
      'Handle errors and validation'
    ],
    earningsPotential: 'Backend developers earn Ksh 60,000-250,000/month',
    isFeatured: true,
    modules: [
      {
        title: 'Node.js Fundamentals',
        order: 1,
        lessons: [
          { title: 'Node.js Basics', duration: 20, order: 1, isPreview: true },
          { title: 'Express Framework', duration: 30, order: 2 },
          { title: 'Routing Basics', duration: 25, order: 3 }
        ]
      }
    ]
  },
  {
    title: 'Full-Stack MERN Development',
    slug: 'mern-fullstack',
    description: 'Become a full-stack developer with MongoDB, Express, React, and Node.js. Build complete applications from database to frontend.',
    shortDescription: 'Master the MERN stack and build complete apps',
    image: '/images/courses/mern-stack.jpg',
    price: 3500,
    originalPrice: 5000,
    category: 'tech-development',
    level: 'intermediate',
    duration: 360,
    whatYouWillLearn: [
      'Build complete MERN applications',
      'Implement full authentication flow',
      'Deploy full-stack apps',
      'Connect frontend to backend'
    ],
    earningsPotential: 'Full-stack developers earn Ksh 80,000-300,000/month',
    isFeatured: true,
    modules: [
      {
        title: 'MERN Stack Overview',
        order: 1,
        lessons: [
          { title: 'Introduction to MERN', duration: 15, order: 1, isPreview: true },
          { title: 'Project Setup', duration: 30, order: 2 }
        ]
      }
    ]
  },
  {
    title: 'Mobile App Development with React Native',
    slug: 'react-native-mobile',
    description: 'Build cross-platform mobile apps for iOS and Android using React Native. Create apps that feel native on both platforms.',
    shortDescription: 'Build mobile apps for iOS and Android',
    image: '/images/courses/mobile-app-dev.jpg',
    price: 2500,
    category: 'tech-development',
    level: 'intermediate',
    duration: 280,
    whatYouWillLearn: [
      'Build iOS and Android apps',
      'Use native device features',
      'Deploy to app stores',
      'Create responsive mobile UIs'
    ],
    earningsPotential: 'Mobile developers earn Ksh 70,000-280,000/month',
    modules: [
      {
        title: 'React Native Basics',
        order: 1,
        lessons: [
          { title: 'Introduction to React Native', duration: 20, order: 1, isPreview: true },
          { title: 'Setting Up Environment', duration: 30, order: 2 }
        ]
      }
    ]
  },
  {
    title: 'WordPress Development for Freelancers',
    slug: 'wordpress-freelancing',
    description: 'Master WordPress and start building websites for clients. Learn themes, plugins, customization, and how to monetize your skills.',
    shortDescription: 'Build WordPress sites and start earning',
    image: '/images/courses/nodejs-api.jpg',
    price: 1200,
    category: 'tech-development',
    level: 'beginner',
    duration: 150,
    whatYouWillLearn: [
      'Install and configure WordPress',
      'Customize themes',
      'Build client websites',
      'Start your freelance business'
    ],
    earningsPotential: 'WordPress developers earn Ksh 30,000-150,000/month',
    modules: [
      {
        title: 'WordPress Fundamentals',
        order: 1,
        lessons: [
          { title: 'WordPress Introduction', duration: 15, order: 1, isPreview: true },
          { title: 'Installing WordPress', duration: 20, order: 2 }
        ]
      }
    ]
  },

  // Cybersecurity (8 courses)
  {
    title: 'Ethical Hacking Fundamentals',
    slug: 'ethical-hacking-basics',
    description: 'Learn the basics of ethical hacking and cybersecurity. Understand how hackers think and how to protect systems from attacks.',
    shortDescription: 'Learn ethical hacking from scratch',
    image: '/images/courses/bug-bounty.jpg',
    price: 2500,
    category: 'cybersecurity',
    level: 'beginner',
    duration: 200,
    whatYouWillLearn: [
      'Understand hacker methodologies',
      'Identify security vulnerabilities',
      'Use ethical hacking tools',
      'Protect systems from attacks'
    ],
    earningsPotential: 'Ethical hackers earn Ksh 100,000-400,000/month',
    isFeatured: true,
    modules: [
      {
        title: 'Introduction to Ethical Hacking',
        order: 1,
        lessons: [
          { title: 'What is Ethical Hacking', duration: 20, order: 1, isPreview: true },
          { title: 'Legal and Ethical Considerations', duration: 25, order: 2 }
        ]
      }
    ]
  },
  {
    title: 'Bug Bounty Hunting: Start to First Payout',
    slug: 'bug-bounty-hunting',
    description: 'Learn how to find security vulnerabilities and earn money through bug bounty programs. From reconnaissance to reporting.',
    shortDescription: 'Find bugs and earn bounties',
    image: '/images/courses/bug-bounty.jpg',
    price: 3000,
    category: 'cybersecurity',
    level: 'intermediate',
    duration: 250,
    whatYouWillLearn: [
      'Find security vulnerabilities',
      'Write effective bug reports',
      'Join bug bounty platforms',
      'Earn your first bounty'
    ],
    earningsPotential: 'Bug bounty hunters earn $500-$10,000+ per bug',
    modules: [
      {
        title: 'Bug Bounty Basics',
        order: 1,
        lessons: [
          { title: 'Introduction to Bug Bounties', duration: 20, order: 1, isPreview: true },
          { title: 'Setting Up Your Lab', duration: 30, order: 2 }
        ]
      }
    ]
  },

  // Design & Creative (10 courses)
  {
    title: 'Graphic Design with Canva & Photoshop',
    slug: 'graphic-design-canva-photoshop',
    description: 'Master graphic design using Canva and Photoshop. Create stunning visuals for social media, marketing, and branding.',
    shortDescription: 'Create stunning designs with Canva and Photoshop',
    image: '/images/courses/graphic-design.jpg',
    price: 1500,
    originalPrice: 2200,
    category: 'design-creative',
    level: 'beginner',
    duration: 180,
    whatYouWillLearn: [
      'Design with Canva like a pro',
      'Master Photoshop basics',
      'Create social media graphics',
      'Build your design portfolio'
    ],
    earningsPotential: 'Graphic designers earn Ksh 40,000-180,000/month',
    isFeatured: true,
    modules: [
      {
        title: 'Canva Mastery',
        order: 1,
        lessons: [
          { title: 'Canva Interface', duration: 15, order: 1, isPreview: true },
          { title: 'Creating Your First Design', duration: 25, order: 2 }
        ]
      }
    ]
  },
  {
    title: 'UI/UX Design with Figma',
    slug: 'ui-ux-figma',
    description: 'Learn to design beautiful user interfaces and experiences with Figma. From wireframes to high-fidelity prototypes.',
    shortDescription: 'Design beautiful interfaces with Figma',
    image: '/images/courses/ui-ux-design.jpg',
    price: 2000,
    category: 'design-creative',
    level: 'beginner',
    duration: 200,
    whatYouWillLearn: [
      'Design user interfaces',
      'Create wireframes and prototypes',
      'Conduct user research',
      'Build a UX portfolio'
    ],
    earningsPotential: 'UI/UX designers earn Ksh 60,000-250,000/month',
    isFeatured: true,
    modules: [
      {
        title: 'Figma Fundamentals',
        order: 1,
        lessons: [
          { title: 'Figma Interface', duration: 20, order: 1, isPreview: true },
          { title: 'Working with Frames', duration: 25, order: 2 }
        ]
      }
    ]
  },
  {
    title: 'Logo Design for Clients',
    slug: 'logo-design-business',
    description: 'Learn professional logo design and start earning from client work. From concept to final delivery.',
    shortDescription: 'Design logos and start your business',
    image: '/images/courses/ui-ux-design.jpg',
    price: 1200,
    category: 'design-creative',
    level: 'beginner',
    duration: 120,
    whatYouWillLearn: [
      'Design professional logos',
      'Work with clients',
      'Present your designs',
      'Build a logo portfolio'
    ],
    earningsPotential: 'Logo designers earn Ksh 5,000-50,000 per logo',
    modules: [
      {
        title: 'Logo Design Basics',
        order: 1,
        lessons: [
          { title: 'Understanding Logo Types', duration: 15, order: 1, isPreview: true },
          { title: 'The Design Process', duration: 20, order: 2 }
        ]
      }
    ]
  },
  {
    title: 'Photo Editing and Retouching',
    slug: 'photo-editing-lightroom',
    description: 'Master photo editing with Lightroom and Photoshop. Enhance photos professionally for clients or personal use.',
    shortDescription: 'Edit photos like a professional',
    image: '/images/courses/photo-editing.jpg',
    price: 1500,
    category: 'design-creative',
    level: 'beginner',
    duration: 150,
    whatYouWillLearn: [
      'Edit photos in Lightroom',
      'Retouch in Photoshop',
      'Color correction techniques',
      'Build an editing workflow'
    ],
    earningsPotential: 'Photo editors earn Ksh 30,000-120,000/month',
    modules: [
      {
        title: 'Lightroom Basics',
        order: 1,
        lessons: [
          { title: 'Lightroom Interface', duration: 15, order: 1, isPreview: true },
          { title: 'Basic Adjustments', duration: 25, order: 2 }
        ]
      }
    ]
  },

  // Video & Content (10 courses)
  {
    title: 'Video Editing with CapCut & Premiere Pro',
    slug: 'video-editing-capcut-premiere',
    description: 'Learn professional video editing from mobile to desktop. Edit videos for YouTube, TikTok, and client work.',
    shortDescription: 'Edit videos like a pro',
    image: '/images/courses/video-editing.jpg',
    price: 1500,
    originalPrice: 2200,
    category: 'video-content',
    level: 'beginner',
    duration: 180,
    whatYouWillLearn: [
      'Edit videos on mobile with CapCut',
      'Master Premiere Pro',
      'Create engaging content',
      'Build a video portfolio'
    ],
    earningsPotential: 'Video editors earn Ksh 40,000-200,000/month',
    isFeatured: true,
    modules: [
      {
        title: 'CapCut Mastery',
        order: 1,
        lessons: [
          { title: 'CapCut Interface', duration: 15, order: 1, isPreview: true },
          { title: 'Basic Editing', duration: 25, order: 2 }
        ]
      }
    ]
  },
  {
    title: 'TikTok Content Strategy',
    slug: 'tiktok-content-strategy',
    description: 'Master TikTok and grow your audience. Learn viral content strategies, trends, and monetization.',
    shortDescription: 'Grow on TikTok and go viral',
    image: '/images/courses/tiktok-content.jpg',
    price: 1000,
    category: 'video-content',
    level: 'beginner',
    duration: 120,
    whatYouWillLearn: [
      'Create viral TikTok content',
      'Understand the algorithm',
      'Grow your following',
      'Monetize your account'
    ],
    earningsPotential: 'TikTok creators earn Ksh 20,000-500,000/month',
    isFeatured: true,
    modules: [
      {
        title: 'TikTok Fundamentals',
        order: 1,
        lessons: [
          { title: 'Understanding TikTok', duration: 15, order: 1, isPreview: true },
          { title: 'Content Strategy', duration: 20, order: 2 }
        ]
      }
    ]
  },
  {
    title: 'YouTube Content Creation',
    slug: 'youtube-content-creation',
    description: 'Build a successful YouTube channel from scratch. Learn filming, editing, SEO, and monetization strategies.',
    shortDescription: 'Build a successful YouTube channel',
    image: '/images/courses/youtube-content.jpg',
    price: 2000,
    category: 'video-content',
    level: 'beginner',
    duration: 240,
    whatYouWillLearn: [
      'Create engaging YouTube videos',
      'Optimize for YouTube SEO',
      'Grow your subscriber base',
      'Monetize your channel'
    ],
    earningsPotential: 'YouTubers earn Ksh 50,000-1,000,000+/month',
    modules: [
      {
        title: 'YouTube Basics',
        order: 1,
        lessons: [
          { title: 'Starting Your Channel', duration: 20, order: 1, isPreview: true },
          { title: 'Content Planning', duration: 25, order: 2 }
        ]
      }
    ]
  },

  // Freelancing (12 courses)
  {
    title: 'Fiverr: Zero to First Client',
    slug: 'fiverr-first-client',
    description: 'Start your freelance journey on Fiverr. Create winning gigs, attract clients, and build your freelance business.',
    shortDescription: 'Get your first client on Fiverr',
    image: '/images/courses/freelancing.jpg',
    price: 1200,
    originalPrice: 1800,
    category: 'freelancing',
    level: 'beginner',
    duration: 120,
    whatYouWillLearn: [
      'Create winning Fiverr gigs',
      'Optimize your profile',
      'Attract your first clients',
      'Deliver great work'
    ],
    earningsPotential: 'Fiverr freelancers earn $500-$5,000+/month',
    isFeatured: true,
    modules: [
      {
        title: 'Fiverr Fundamentals',
        order: 1,
        lessons: [
          { title: 'How Fiverr Works', duration: 15, order: 1, isPreview: true },
          { title: 'Creating Your Profile', duration: 20, order: 2 }
        ]
      }
    ]
  },
  {
    title: 'Upwork Domination Strategy',
    slug: 'upwork-domination',
    description: 'Master Upwork and land high-paying clients. Learn proposal writing, client communication, and profile optimization.',
    shortDescription: 'Win clients on Upwork consistently',
    image: '/images/courses/virtual-assistant.jpg',
    price: 1500,
    category: 'freelancing',
    level: 'beginner',
    duration: 150,
    whatYouWillLearn: [
      'Create a winning profile',
      'Write proposals that win',
      'Land high-paying clients',
      'Build long-term relationships'
    ],
    earningsPotential: 'Upwork freelancers earn $1,000-$10,000+/month',
    modules: [
      {
        title: 'Upwork Basics',
        order: 1,
        lessons: [
          { title: 'Understanding Upwork', duration: 15, order: 1, isPreview: true },
          { title: 'Profile Optimization', duration: 25, order: 2 }
        ]
      }
    ]
  },
  {
    title: 'Copywriting for Income',
    slug: 'copywriting-income',
    description: 'Learn persuasive copywriting and start earning. Write sales copy, emails, ads, and content that converts.',
    shortDescription: 'Write copy that sells',
    image: '/images/courses/copywriting.jpg',
    price: 1800,
    category: 'freelancing',
    level: 'beginner',
    duration: 160,
    whatYouWillLearn: [
      'Write persuasive copy',
      'Create sales pages',
      'Write email sequences',
      'Find copywriting clients'
    ],
    earningsPotential: 'Copywriters earn Ksh 50,000-300,000/month',
    modules: [
      {
        title: 'Copywriting Fundamentals',
        order: 1,
        lessons: [
          { title: 'What is Copywriting', duration: 15, order: 1, isPreview: true },
          { title: 'Understanding Your Audience', duration: 20, order: 2 }
        ]
      }
    ]
  },
  {
    title: 'Virtual Assistant Skills',
    slug: 'virtual-assistant-skills',
    description: 'Become a high-demand virtual assistant. Learn email management, scheduling, customer service, and more.',
    shortDescription: 'Become a successful virtual assistant',
    image: '/images/courses/virtual-assistant.jpg',
    price: 1000,
    category: 'freelancing',
    level: 'beginner',
    duration: 120,
    whatYouWillLearn: [
      'Manage emails and calendars',
      'Handle customer service',
      'Use VA tools effectively',
      'Find VA clients'
    ],
    earningsPotential: 'Virtual assistants earn Ksh 30,000-150,000/month',
    modules: [
      {
        title: 'VA Fundamentals',
        order: 1,
        lessons: [
          { title: 'What is a Virtual Assistant', duration: 15, order: 1, isPreview: true },
          { title: 'Essential VA Tools', duration: 20, order: 2 }
        ]
      }
    ]
  },

  // E-commerce (10 courses)
  {
    title: 'Dropshipping in Kenya',
    slug: 'dropshipping-kenya',
    description: 'Start a dropshipping business in Kenya. Find suppliers, set up your store, and start making sales.',
    shortDescription: 'Start your dropshipping business',
    image: '/images/courses/dropshipping.jpg',
    price: 2000,
    originalPrice: 3000,
    category: 'ecommerce',
    level: 'beginner',
    duration: 180,
    whatYouWillLearn: [
      'Find reliable suppliers',
      'Set up your online store',
      'Market your products',
      'Handle orders and shipping'
    ],
    earningsPotential: 'Dropshippers earn Ksh 50,000-500,000/month',
    isFeatured: true,
    modules: [
      {
        title: 'Dropshipping Basics',
        order: 1,
        lessons: [
          { title: 'How Dropshipping Works', duration: 20, order: 1, isPreview: true },
          { title: 'Finding Suppliers', duration: 30, order: 2 }
        ]
      }
    ]
  },
  {
    title: 'Importing from Alibaba',
    slug: 'importing-alibaba',
    description: 'Learn to import products from Alibaba and resell in Kenya. Find suppliers, negotiate, and manage shipping.',
    shortDescription: 'Import and resell products profitably',
    image: '/images/courses/affiliate-marketing.jpg',
    price: 1500,
    category: 'ecommerce',
    level: 'beginner',
    duration: 140,
    whatYouWillLearn: [
      'Find suppliers on Alibaba',
      'Negotiate better prices',
      'Manage shipping and customs',
      'Resell for profit'
    ],
    earningsPotential: 'Importers earn Ksh 100,000-1,000,000+/month',
    modules: [
      {
        title: 'Alibaba Basics',
        order: 1,
        lessons: [
          { title: 'Introduction to Alibaba', duration: 15, order: 1, isPreview: true },
          { title: 'Finding Products', duration: 25, order: 2 }
        ]
      }
    ]
  },

  // Digital Marketing (10 courses)
  {
    title: 'Facebook Ads Mastery',
    slug: 'facebook-ads-mastery',
    description: 'Master Facebook advertising and drive sales for your business or clients. From setup to scaling.',
    shortDescription: 'Run profitable Facebook ad campaigns',
    image: '/images/courses/digital-marketing.jpg',
    price: 2000,
    originalPrice: 2800,
    category: 'digital-marketing',
    level: 'beginner',
    duration: 180,
    whatYouWillLearn: [
      'Create effective Facebook ads',
      'Target the right audience',
      'Optimize for conversions',
      'Scale profitable campaigns'
    ],
    earningsPotential: 'Facebook ad specialists earn Ksh 60,000-250,000/month',
    isFeatured: true,
    modules: [
      {
        title: 'Facebook Ads Basics',
        order: 1,
        lessons: [
          { title: 'Introduction to Facebook Ads', duration: 20, order: 1, isPreview: true },
          { title: 'Business Manager Setup', duration: 25, order: 2 }
        ]
      }
    ]
  },
  {
    title: 'SEO for Beginners',
    slug: 'seo-beginners',
    description: 'Learn search engine optimization and rank websites on Google. Drive organic traffic and grow your business.',
    shortDescription: 'Rank on Google and drive traffic',
    image: '/images/courses/seo-basics.jpg',
    price: 1500,
    category: 'digital-marketing',
    level: 'beginner',
    duration: 160,
    whatYouWillLearn: [
      'Understand how SEO works',
      'Do keyword research',
      'Optimize your website',
      'Build quality backlinks'
    ],
    earningsPotential: 'SEO specialists earn Ksh 50,000-200,000/month',
    modules: [
      {
        title: 'SEO Fundamentals',
        order: 1,
        lessons: [
          { title: 'What is SEO', duration: 15, order: 1, isPreview: true },
          { title: 'How Search Engines Work', duration: 20, order: 2 }
        ]
      }
    ]
  },
  {
    title: 'Affiliate Marketing Income',
    slug: 'affiliate-marketing-income',
    description: 'Build passive income through affiliate marketing. Learn to promote products and earn commissions.',
    shortDescription: 'Earn passive income with affiliate marketing',
    image: '/images/courses/affiliate-marketing.jpg',
    price: 1200,
    category: 'digital-marketing',
    level: 'beginner',
    duration: 140,
    whatYouWillLearn: [
      'Choose profitable products',
      'Build an affiliate website',
      'Drive traffic to offers',
      'Maximize commissions'
    ],
    earningsPotential: 'Affiliate marketers earn Ksh 30,000-500,000+/month',
    modules: [
      {
        title: 'Affiliate Marketing Basics',
        order: 1,
        lessons: [
          { title: 'How Affiliate Marketing Works', duration: 15, order: 1, isPreview: true },
          { title: 'Choosing Products', duration: 20, order: 2 }
        ]
      }
    ]
  },

  // Social Media (8 courses)
  {
    title: 'Instagram Growth Hacks',
    slug: 'instagram-growth',
    description: 'Grow your Instagram following organically. Learn content strategy, engagement tactics, and monetization.',
    shortDescription: 'Grow your Instagram organically',
    image: '/images/courses/social-media-management.jpg',
    price: 1000,
    category: 'social-media',
    level: 'beginner',
    duration: 120,
    whatYouWillLearn: [
      'Create engaging content',
      'Grow your followers',
      'Increase engagement',
      'Monetize your account'
    ],
    earningsPotential: 'Instagram influencers earn Ksh 20,000-300,000/post',
    modules: [
      {
        title: 'Instagram Basics',
        order: 1,
        lessons: [
          { title: 'Understanding Instagram', duration: 15, order: 1, isPreview: true },
          { title: 'Profile Optimization', duration: 20, order: 2 }
        ]
      }
    ]
  },
  {
    title: 'Social Media Management',
    slug: 'social-media-management',
    description: 'Become a social media manager for businesses. Learn to manage accounts, create content, and report results.',
    shortDescription: 'Manage social media for businesses',
    image: '/images/courses/social-media-management.jpg',
    price: 1500,
    category: 'social-media',
    level: 'beginner',
    duration: 140,
    whatYouWillLearn: [
      'Manage multiple accounts',
      'Create content calendars',
      'Analyze performance',
      'Find SMM clients'
    ],
    earningsPotential: 'Social media managers earn Ksh 40,000-180,000/month',
    modules: [
      {
        title: 'SMM Fundamentals',
        order: 1,
        lessons: [
          { title: 'Role of a Social Media Manager', duration: 15, order: 1, isPreview: true },
          { title: 'Content Planning', duration: 25, order: 2 }
        ]
      }
    ]
  },

  // Finance & Money (6 courses)
  {
    title: 'Personal Finance Mastery',
    slug: 'personal-finance',
    description: 'Take control of your finances. Learn budgeting, saving, investing, and building wealth in Kenya.',
    shortDescription: 'Master your personal finances',
    image: '/images/courses/personal-finance.jpg',
    price: 1000,
    originalPrice: 1500,
    category: 'finance-money',
    level: 'beginner',
    duration: 120,
    whatYouWillLearn: [
      'Create a budget that works',
      'Build an emergency fund',
      'Start investing',
      'Plan for your future'
    ],
    earningsPotential: 'Save and invest for financial freedom',
    isFeatured: true,
    modules: [
      {
        title: 'Finance Fundamentals',
        order: 1,
        lessons: [
          { title: 'Understanding Your Money', duration: 15, order: 1, isPreview: true },
          { title: 'Creating a Budget', duration: 20, order: 2 }
        ]
      }
    ]
  },

  // Career & Digital Survival (6 courses)
  {
    title: 'CV Building & Interview Skills',
    slug: 'cv-interview-skills',
    description: 'Create a winning CV and ace your interviews. Land your dream job with proven strategies.',
    shortDescription: 'Land your dream job',
    image: '/images/courses/career-coaching.jpg',
    price: 800,
    category: 'career-survival',
    level: 'beginner',
    duration: 100,
    whatYouWillLearn: [
      'Create a professional CV',
      'Write compelling cover letters',
      'Ace job interviews',
      'Negotiate your salary'
    ],
    earningsPotential: 'Get hired faster and earn more',
    modules: [
      {
        title: 'CV Writing',
        order: 1,
        lessons: [
          { title: 'CV Basics', duration: 15, order: 1, isPreview: true },
          { title: 'Writing Your CV', duration: 20, order: 2 }
        ]
      }
    ]
  },

  // AI & Automation (5 courses)
  {
    title: 'ChatGPT for Income',
    slug: 'chatgpt-income',
    description: 'Leverage ChatGPT and AI to boost your productivity and income. Learn prompts, automation, and AI tools.',
    shortDescription: 'Use AI to boost your income',
    image: '/images/courses/ai-automation.jpg',
    price: 1500,
    originalPrice: 2200,
    category: 'ai-automation',
    level: 'beginner',
    duration: 140,
    whatYouWillLearn: [
      'Master ChatGPT prompts',
      'Automate tasks with AI',
      'Create content faster',
      'Offer AI-powered services'
    ],
    earningsPotential: 'AI-powered workers earn 2-3x more',
    isFeatured: true,
    modules: [
      {
        title: 'ChatGPT Basics',
        order: 1,
        lessons: [
          { title: 'Introduction to ChatGPT', duration: 15, order: 1, isPreview: true },
          { title: 'Writing Effective Prompts', duration: 25, order: 2 }
        ]
      }
    ]
  },

  // Local Skills (5 courses)
  {
    title: 'Start a Cyber Cafe Business',
    slug: 'cyber-cafe-business',
    description: 'Start and run a profitable cyber cafe business in Kenya. Learn setup, management, and growth strategies.',
    shortDescription: 'Start your own cyber cafe',
    image: '/images/courses/cyber-cafe.jpg',
    price: 1200,
    category: 'local-skills',
    level: 'beginner',
    duration: 120,
    whatYouWillLearn: [
      'Plan your cyber cafe',
      'Set up computers and internet',
      'Manage daily operations',
      'Grow your business'
    ],
    earningsPotential: 'Cyber cafes earn Ksh 50,000-300,000/month',
    modules: [
      {
        title: 'Cyber Cafe Basics',
        order: 1,
        lessons: [
          { title: 'Business Planning', duration: 20, order: 1, isPreview: true },
          { title: 'Setup Requirements', duration: 25, order: 2 }
        ]
      }
    ]
  }
];

const seedCourses = async () => {
  try {
    await connectDB();
    
    console.log('Deleting existing courses...');
    await Course.deleteMany({});
    
    console.log('Seeding courses...');
    for (const courseData of courses) {
      await Course.create(courseData);
      console.log(`Created: ${courseData.title}`);
    }
    
    console.log(`\n✅ Successfully seeded ${courses.length} courses!`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding courses:', error);
    process.exit(1);
  }
};

seedCourses();
