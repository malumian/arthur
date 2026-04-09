export const SITE_TITLE = 'Arthur Malumian';

export const PAGES_METADATA = {
  home: {
    title: '',
    description:
      'This is the personal website of Arthur Malumian, a software engineer who loves web technologies.',
  },
  blog: {
    title: 'Blog',
    description:
      "This is the blog of Arthur Malumian, a software engineer who posts about web development and more. He shares about the books he's reading, the movies he's watching, and the trips he's taking.",
  },
  tags: {
    title: 'Tags',
    description:
      "This page provides an overview of Arthur Malumian's tags used in the blog",
  },
  setup: {
    title: 'Setup',
    description:
      "This page provides an overview of Arthur Malumian's personal setup.",
  },
  history: {
    title: 'Website History',
    description: 'History of Arthur Malumian website.',
  },
  404: {
    title: '404',
    description: 'Page not found.',
  },
};

export const ROUTES = [
  {
    name: 'Home',
    link: '/',
  },
  {
    name: 'Blog',
    link: '/blog/',
  },
  {
    name: 'Setup',
    link: '/setup/',
  },
];

export const SOCIALS = [
  {
    name: 'GitHub',
    link: 'https://github.com/amalumian',
    icon: 'github',
  },
  {
    name: 'LinkedIn',
    link: 'https://www.linkedin.com/in/amalumian',
    icon: 'linkedin',
  },
  {
    name: 'Facebook',
    link: 'https://www.facebook.com/amalumian',
    icon: 'facebook',
  },
  {
    name: 'Twitter',
    link: 'https://twitter.com/amalumian',
    icon: 'twitter',
  },
  {
    name: 'Telegram',
    link: 'https://t.me/amalumian',
    icon: 'telegram',
  },
  {
    name: 'YouTube',
    link: 'https://www.youtube.com/@amalumian',
    icon: 'youtube',
  },
  {
    name: 'RSS',
    link: '/rss.xml',
    icon: 'rss',
  },
];
