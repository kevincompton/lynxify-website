interface Article {
  id: string;
  title: string;
  date: string;
  author: string;
  summary: string;
  content: string;
  tags: string[];
  prototype?: Prototype; // Optional prototype section
  caseStudy?: CaseStudy; // Optional case study section
}

interface Prototype {
  title: string;
  description: string;
  images: PrototypeImage[];
}

interface CaseStudy {
  title: string;
  content: string;
  images: CaseStudyImage[];
}

interface PrototypeImage {
  src: string;
  alt: string;
  caption: string;
}

interface CaseStudyImage {
  src: string;
  alt: string;
  caption: string;
}

// Import the JSON file directly
import articles from '../data/dao-journey-articles.json';

// Import images directly to ensure they're included in the build
import dashImage from '../public/dash.png';
import compositionImage from '../public/composition.png';
import rebalancingImage from '../public/rebalancing.png';
import daoDiagramImage from '../public/dao-diagram.png';
// Create a mapping of filenames to their imported URLs
const imageMap: Record<string, string> = {
  'dash.png': dashImage,
  'composition.png': compositionImage,
  'rebalancing.png': rebalancingImage,
  'dao-diagram.png': daoDiagramImage
};

document.addEventListener('DOMContentLoaded', () => {
  try {
    console.log("Page loaded, URL:", window.location.href);
    
    // Check if we're on the article detail page
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');
    
    console.log("Article ID from URL:", articleId);
    console.log("Current page:", window.location.pathname);
    
    // Check if we're on the article page
    if (window.location.pathname.includes('dao-article.html')) {
      if (articleId) {
        console.log("Displaying single article:", articleId);
        displaySingleArticle(articleId);
      } else {
        console.error("No article ID provided");
        const container = document.getElementById('article-container');
        if (container) {
          container.innerHTML = '<div class="error">Article ID not found in URL.</div>';
        }
      }
    } else {
      // We're on the main listing page
      console.log("Displaying article list");
      displayArticles(articles);
    }
  } catch (error) {
    console.error('Error displaying content:', error);
    const container = document.getElementById('articles-container') || document.getElementById('article-container');
    if (container) {
      container.innerHTML = '<div class="error">Failed to load content. Please try again later.</div>';
    }
  }
});

function displayArticles(articles: Article[]): void {
  const container = document.getElementById('articles-container');
  if (!container) return;
  
  // Clear loading message
  container.innerHTML = '';
  
  // Sort articles by date (newest first)
  const sortedArticles = [...articles].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  sortedArticles.forEach(article => {
    const articleElement = createArticlePreviewElement(article);
    container.appendChild(articleElement);
  });
}

function createArticlePreviewElement(article: Article): HTMLElement {
  const articleElement = document.createElement('div');
  articleElement.className = 'article';
  articleElement.id = article.id;
  
  const formattedDate = formatDate(article.date);
  
  const tagsHtml = article.tags.map(tag => 
    `<span class="tag">${tag}</span>`
  ).join('');
  
  articleElement.innerHTML = `
    <h2>${article.title}</h2>
    <div class="article-meta">
      <span class="date">${formattedDate}</span>
      <span class="author">By ${article.author}</span>
    </div>
    <div class="tags">${tagsHtml}</div>
    <p class="summary">${article.summary}</p>
    <a href="dao-article.html?id=${article.id}" class="read-more-link">Read Full Article</a>
  `;
  
  return articleElement;
}

async function displaySingleArticle(articleId: string): Promise<void> {
  const container = document.getElementById('article-container');
  if (!container) return;
  
  console.log("Looking for article with ID:", articleId);
  console.log("Available articles:", articles.map(a => a.id));
  
  // Find the article with the matching ID
  const article = articles.find(a => a.id === articleId);
  
  if (!article) {
    console.error("Article not found with ID:", articleId);
    container.innerHTML = `
      <div class="error">
        <p>Article not found with ID: ${articleId}</p>
        <a href="dao-journey.html" class="back-link">← Back to Articles</a>
      </div>
    `;
    return;
  }
  
  const formattedDate = formatDate(article.date);
  
  const tagsHtml = article.tags.map(tag => 
    `<span class="tag">${tag}</span>`
  ).join('');
  
  // Create prototype section HTML if it exists
  let prototypeHtml = '';
  if (article.prototype) {
    const imagesHtml = article.prototype.images.map(image => {
      // Get just the filename from the path
      const filename = image.src.split('/').pop() || '';
      // Use the imported image URL from our imageMap
      const imageUrl = imageMap[filename];
      
      return `
        <div class="prototype-image">
          <img src="${imageUrl}" alt="${image.alt}">
          <p class="image-caption">${image.caption}</p>
        </div>
      `;
    }).join('');
    
    prototypeHtml = `
      <div class="prototype-section">
        <h2>${article.prototype.title}</h2>
        <p class="prototype-description">${article.prototype.description}</p>
        <div class="prototype-gallery">
          ${imagesHtml}
        </div>
      </div>
    `;
  }
  
  // Create case study section HTML if it exists
  let caseStudyHtml = '';
  if (article.caseStudy) {
    const imagesHtml = article.caseStudy.images.map(image => {
      // Get just the filename from the path
      const filename = image.src.split('/').pop() || '';
      // Use the imported image URL from our imageMap
      const imageUrl = imageMap[filename];
      
      return `
        <div class="case-study-image">
          <img src="${imageUrl}" alt="${image.alt}">
          <p class="image-caption">${image.caption}</p>
        </div>
      `;
    }).join('');
    
    caseStudyHtml = `
      <div class="case-study-section">
        <h2>${article.caseStudy.title}</h2>
        <div class="case-study-content">${article.caseStudy.content}</div>
        <div class="case-study-gallery">
          ${imagesHtml}
        </div>
      </div>
    `;
  }
  
  container.innerHTML = `
    <div class="article-full">
      <h1>${article.title}</h1>
      <div class="article-meta">
        <span class="date">${formattedDate}</span>
        <span class="author">By ${article.author}</span>
      </div>
      <div class="tags">${tagsHtml}</div>
      <p class="summary">${article.summary}</p>
      <div class="content">${article.content}</div>
      ${prototypeHtml}
      ${caseStudyHtml}
      <a href="dao-journey.html" class="back-link">← Back to Articles</a>
    </div>
  `;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
} 