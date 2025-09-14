import { useEffect } from 'react';

export default function MetaTags({ userProfile, username, stats }) {
  useEffect(() => {
    // Reset to default meta tags if no username
    if (!username || username === 'invalid' || username === 'guest') {
      updateMetaTags({
        title: 'GitWrap - Your GitHub Year in Review',
        description: 'Turn your GitHub activity into a sleek, personalized year-in-review. See your commits, repos, languages, and coding patterns.',
        image: '/wrap.svg',
        url: window.location.href
      });
      return;
    }

    // Wait for user profile and stats to load
    if (!userProfile || userProfile.error) {
      updateMetaTags({
        title: `${username}'s GitHub Year in Review - GitWrap`,
        description: `Check out ${username}'s coding journey on GitWrap - commits, repositories, languages, and development patterns.`,
        image: '/wrap.svg',
        url: window.location.href
      });
      return;
    }

    // Generate dynamic description with stats
    let description = `${userProfile.name || username}'s 2025 GitHub journey`;
    
    if (stats) {
      const statParts = [];
      if (stats.commits) statParts.push(`${stats.commits} commits`);
      if (stats.repos) statParts.push(`${stats.repos} repositories`);
      if (stats.topLanguage) statParts.push(`coding in ${stats.topLanguage}`);
      
      if (statParts.length > 0) {
        description = `${userProfile.name || username} made ${statParts.join(', ')} in 2025`;
      }
    }

    // Update meta tags with user-specific data
    updateMetaTags({
      title: `${userProfile.name || username}'s 2025 GitHub Year in Review - GitWrap`,
      description: description,
      image: userProfile.avatarUrl || '/wrap.svg',
      url: window.location.href,
      username: username
    });

  }, [userProfile, username, stats]);

  return null; // This component doesn't render anything
}

function updateMetaTags({ title, description, image, url, username }) {
  // Update document title
  document.title = title;

  // Helper function to update or create meta tags
  const updateMetaTag = (property, content, attribute = 'property') => {
    let tag = document.querySelector(`meta[${attribute}="${property}"]`);
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute(attribute, property);
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
  };

  // Open Graph tags
  updateMetaTag('og:title', title);
  updateMetaTag('og:description', description);
  updateMetaTag('og:image', image.startsWith('http') ? image : `${window.location.origin}${image}`);
  updateMetaTag('og:url', url);
  updateMetaTag('og:type', 'website');
  updateMetaTag('og:site_name', 'GitWrap');

  // Twitter Card tags
  updateMetaTag('twitter:card', 'summary_large_image', 'name');
  updateMetaTag('twitter:title', title, 'name');
  updateMetaTag('twitter:description', description, 'name');
  updateMetaTag('twitter:image', image.startsWith('http') ? image : `${window.location.origin}${image}`, 'name');
  updateMetaTag('twitter:site', '@Xpektra7', 'name');

  // Additional meta tags
  updateMetaTag('description', description, 'name');
  
  // Discord/Slack specific
  updateMetaTag('theme-color', '#000000', 'name');

  // LinkedIn specific
  updateMetaTag('article:author', username || 'GitWrap User', 'property');
}