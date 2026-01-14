/**
 * Sitemap to JSON Converter for Forevergreen Blog (ES Module Version)
 * 
 * This script converts the blog sitemap XML to the JSON format needed.
 * 
 * WHAT IT DOES:
 * 1. Parses the sitemap XML from forevergreen.earth/blog-posts-sitemap.xml
 * 2. Parses the RSS feed from forevergreen.earth/blog-feed.xml  
 * 3. Combines the data (sitemap has ALL posts, RSS has titles/descriptions for recent 20)
 * 4. Outputs in your desired JSON format
 * 
 * TO USE:
 * 1. Save the sitemap XML to "sitemap.xml"
 * 2. Save the RSS feed XML to "rss.xml"
 * 3. Run: node sitemap-to-json-converter.js sitemap.xml rss.xml > blog-data.json
 */

import fs from 'fs';
import { parseStringPromise } from 'xml2js';

// Extract slug from URL
function extractSlug(url) {
  const match = url.match(/\/post\/([^\/]+)/);
  return match ? match[1] : '';
}

// Format title from slug as fallback
function slugToTitle(slug) {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Main conversion function
async function convertToJson(sitemapXmlData, rssXmlData) {
  try {
    // Parse both XMLs
    const sitemapData = await parseStringPromise(sitemapXmlData);
    const rssData = await parseStringPromise(rssXmlData);
    
    // Create a map of RSS data by slug for quick lookup
    const rssMap = {};
    if (rssData.rss && rssData.rss.channel && rssData.rss.channel[0].item) {
      rssData.rss.channel[0].item.forEach(item => {
        const slug = extractSlug(item.link[0]);
        const guid = typeof item.guid[0] === 'object' ? item.guid[0]._ : item.guid[0];
        
        rssMap[slug] = {
          id: guid,
          title: item.title[0],
          description: item.description[0],
          author: item['dc:creator'] ? item['dc:creator'][0] : 'Forevergreen',
          category: item.category ? item.category[0] : undefined
        };
      });
    }
    
    // Convert sitemap entries to posts
    const posts = sitemapData.urlset.url.map(url => {
      const link = url.loc[0];
      const slug = extractSlug(link);
      const lastmod = url.lastmod[0];
      
      // Extract image URL
      let imageUrl = '';
      if (url['image:image'] && url['image:image'][0] && url['image:image'][0]['image:loc']) {
        imageUrl = url['image:image'][0]['image:loc'][0];
      }
      
      // Get data from RSS if available, otherwise use fallbacks
      const rssInfo = rssMap[slug] || {};
      
      const post = {
        id: rssInfo.id || slug.substring(0, 24).replace(/-/g, ''),
        title: rssInfo.title || slugToTitle(slug),
        description: rssInfo.description || '',
        link: link,
        slug: slug,
        pubDate: new Date(lastmod).toISOString(),
        imageUrl: imageUrl,
        author: rssInfo.author || 'Forevergreen'
      };
      
      // Only add category if it exists
      if (rssInfo.category) {
        post.category = rssInfo.category;
      }
      
      return post;
    });

    // Sort by date (newest first)
    posts.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

    // Create final output
    const output = {
      title: 'Forevergreen',
      description: 'We believe in creating a community where sustainability is accessible for everyone. We are building the future of our planet, one tree at a time.',
      posts: posts
    };

    return output;
    
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Main execution
const args = process.argv.slice(2);

if (args.length < 2) {
  console.error('Usage: node sitemap-to-json-converter.js <sitemap.xml> <rss.xml>');
  console.error('');
  console.error('Example:');
  console.error('  node sitemap-to-json-converter.js sitemap.xml rss.xml > blog-data.json');
  console.error('');
  console.error('Files needed:');
  console.error('  1. sitemap.xml - Download from: https://www.forevergreen.earth/blog-posts-sitemap.xml');
  console.error('  2. rss.xml - Download from: https://www.forevergreen.earth/blog-feed.xml');
  process.exit(1);
}

const sitemapFile = args[0];
const rssFile = args[1];

// Check if files exist
if (!fs.existsSync(sitemapFile)) {
  console.error(`Error: ${sitemapFile} not found`);
  process.exit(1);
}
if (!fs.existsSync(rssFile)) {
  console.error(`Error: ${rssFile} not found`);
  process.exit(1);
}

// Read files
const sitemapData = fs.readFileSync(sitemapFile, 'utf8');
const rssData = fs.readFileSync(rssFile, 'utf8');

// Convert and output
try {
  const data = await convertToJson(sitemapData, rssData);
  console.log(JSON.stringify(data, null, 2));
} catch (err) {
  console.error('Failed:', err);
  process.exit(1);
}