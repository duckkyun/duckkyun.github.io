type RawPost = {
  title: string;
  slug: string;
  date: string;
  summary: string;
  categories: string[];
  tags: string[];
};

export type TaxonomyItem = {
  name: string;
  slug: string;
  url: string;
};

export type BlogPost = {
  title: string;
  slug: string;
  url: string;
  date: string;
  formattedDate: string;
  summary: string;
  categories: TaxonomyItem[];
  tags: TaxonomyItem[];
};

export type TaxonomyGroup = TaxonomyItem & {
  count: number;
  posts: BlogPost[];
};

const rawPosts: RawPost[] = [
  {
    title: 'First Post: Starting the Archive',
    slug: 'first-post',
    date: '2026-03-02T10:00:00+09:00',
    summary:
      'A short note about using this website as a home for writing, project logs, and small research-adjacent reflections.',
    categories: ['blog', 'notes'],
    tags: ['astro', 'github-pages', 'launch'],
  },
];

function toSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\s/]+/g, '-')
    .replace(/[^\p{Letter}\p{Number}-]+/gu, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function formatDate(value: string) {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}.${month}.${day}`;
}

function createTaxonomyItem(basePath: string, name: string): TaxonomyItem {
  const slug = toSlug(name);

  return {
    name,
    slug,
    url: `/${basePath}/${slug}/`,
  };
}

function sortPostsByDate(items: BlogPost[]) {
  return [...items].sort(
    (left, right) => new Date(right.date).getTime() - new Date(left.date).getTime(),
  );
}

export const posts = sortPostsByDate(
  rawPosts.map((post) => ({
    title: post.title,
    slug: post.slug,
    url: `/article/${post.slug}/`,
    date: post.date,
    formattedDate: formatDate(post.date),
    summary: post.summary,
    categories: post.categories.map((name) => createTaxonomyItem('categories', name)),
    tags: post.tags.map((name) => createTaxonomyItem('tags', name)),
  })),
);

function groupPostsByTaxonomy(
  items: BlogPost[],
  key: 'categories' | 'tags',
): TaxonomyGroup[] {
  const groups = new Map<string, TaxonomyGroup>();

  for (const post of items) {
    for (const entry of post[key]) {
      const current = groups.get(entry.slug);

      if (current) {
        current.posts.push(post);
        current.count += 1;
        continue;
      }

      groups.set(entry.slug, {
        ...entry,
        count: 1,
        posts: [post],
      });
    }
  }

  return [...groups.values()].sort((left, right) => left.name.localeCompare(right.name));
}

export const categories = groupPostsByTaxonomy(posts, 'categories');
export const tags = groupPostsByTaxonomy(posts, 'tags');

export function getCategoryBySlug(slug: string) {
  return categories.find((item) => item.slug === slug);
}

export function getTagBySlug(slug: string) {
  return tags.find((item) => item.slug === slug);
}
