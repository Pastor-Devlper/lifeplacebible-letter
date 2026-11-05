import rss from '@astrojs/rss';
import { getListedPosts } from '../lib/posts';

export async function GET(context) {
  const posts = await getListedPosts();
  return rss({
    title: 'Life Place Bible Ministry | Blog',
    description: 'A blog about life, faith, and the Bible.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description ?? post.data.title,
      pubDate: post.data.pubDate,
      link: `/posts/${post.id}`,
    })),
    customData: `<language>en-us</language>`,
  });
}