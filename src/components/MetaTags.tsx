import React, { useEffect } from 'react';

interface MetaTagsProps {
  userProfile?: any | null;
  username?: string | null;
  stats?: { commits?: number; repos?: number; topLanguage?: string; mostActiveRepo?: string } | null;
}

export default function MetaTags({ userProfile, username, stats }: MetaTagsProps) {
  useEffect(() => {
    // Reset to default meta tags if no username
    if (!username || username === 'invalid' || username === 'guest') {
      updateMetaTags({
        title: 'GitWrap - Your GitHub Year in Review',
        description:
          'Turn your GitHub activity into a sleek, personalized year-in-review. See your commits, repos, languages, and coding patterns.',
        image: '/wrap.svg',
        url: window.location.href,
      });
      return;
    }

    // Wait for user profile and stats to load
    if (!userProfile || (userProfile && userProfile.error)) {
      updateMetaTags({
        title: `${username}'s GitHub Year in Review - GitWrap`,
        description: `Check out ${username}'s coding journey on GitWrap - commits, repositories, languages, and development patterns.`,
        image: '/wrap.svg',
        url: window.location.href,
      });
      return;
    }

    // Generate dynamic description with stats
    const currentYear = new Date().getFullYear();
    let description = `${userProfile.name || username}'s ${currentYear} GitHub journey`;

    if (stats) {
      const statParts: string[] = [];
      if (stats.commits) statParts.push(`${stats.commits} commits`);
      if (stats.repos) statParts.push(`${stats.repos} repositories`);
      if (stats.topLanguage) statParts.push(`coding in ${stats.topLanguage}`);

      if (statParts.length > 0) {
        description = `${userProfile.name || username} made ${statParts.join(', ')} in ${currentYear}`;
      }
    }

    // Update meta tags with user-specific data
    updateMetaTags({
      title: `${userProfile.name || username}'s ${currentYear} GitHub Year in Review - GitWrap`,
      description,
      image: userProfile.avatarUrl || '/wrap.svg',
      url: window.location.href,
      username: username || undefined,
    });

  }, [userProfile, username, stats]);

  return null; // This component doesn't render anything
}

function updateMetaTags({ title, description, image, url, username }: { title: string; description: string; image?: string; url?: string; username?: string }) {
  // Update document title
  document.title = title;

  // Helper function to update or create meta tags
  const updateMetaTag = (property: string, content: string, attribute: 'property' | 'name' = 'property') => {
    let tag = document.querySelector(`meta[${attribute}="${property}"]`);
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute(attribute, property);
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
  };

  const safeImage = typeof image === 'string' && image ? image : '/wrap.svg';
  const buildImageUrl = (img: string) => (img.startsWith('http') ? img : `${window.location.origin}${img}`);

  updateMetaTag('og:title', title);
  updateMetaTag('og:description', description);
  updateMetaTag('og:image', buildImageUrl(safeImage));
  updateMetaTag('og:url', url || window.location.href);
  updateMetaTag('og:type', 'website');
  updateMetaTag('og:site_name', 'GitWrap');

  updateMetaTag('twitter:card', 'summary_large_image', 'name');
  updateMetaTag('twitter:title', title, 'name');
  updateMetaTag('twitter:description', description, 'name');
  updateMetaTag('twitter:image', buildImageUrl(safeImage), 'name');
  updateMetaTag('twitter:site', '@gitwrap', 'name');

  updateMetaTag('description', description, 'name');
  updateMetaTag('theme-color', '#000000', 'name');

  updateMetaTag('article:author', username || 'GitWrap User', 'property');
}
