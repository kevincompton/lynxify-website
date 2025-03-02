interface Article {
  id: string;
  title: string;
  date: string;
  author: string;
  summary: string;
  content: string;
  tags: string[];
}

// Import the JSON file directly
import articles from '../data/dao-journey-articles.json';

document.addEventListener('DOMContentLoaded', () => {
  try {
    // Check if we're on the article detail page
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');
    
    if (articleId) {
      // We're on an article detail page
      displaySingleArticle(articleId);
    } else {
      // We're on the main listing page
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

function displaySingleArticle(articleId: string): void {
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