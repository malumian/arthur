import rss from '@astrojs/rss';
import {getCollection} from 'astro:content';

import {createExcerpt} from '@/utils/create-excerpt';

import {SITE_TITLE, PAGES_METADATA} from '@/consts';

export async function GET(context) {
  const posts = await getCollection('blog');

  return rss({
    title: SITE_TITLE,
    description: PAGES_METADATA.blog.description,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      link: `/blog/${post.id}/`,
      description: createExcerpt(post.body),
    })),
  });
}
