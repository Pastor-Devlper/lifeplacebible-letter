import { getCollection } from 'astro:content';

export const getListedPosts = () => getCollection('blog', ({ data }) => !data.unlisted);
