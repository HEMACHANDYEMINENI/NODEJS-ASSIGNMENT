const axios = require('axios');
const _ = require('lodash');

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to fetch blog data from the specified API URL
app.get('/api/blog-stats', async (req, res) => {
  try {
    const apiURL = 'https://intent-kit-16.hasura.app/api/rest/blogs'; // Replace with your actual API URL
    const headers = {
      'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6',
    };

    const response = await axios.get(apiURL, { headers });
    const blogData = response.data;

    // Calculate statistics using Lodash
    const totalBlogs = blogData.length;
    const longestBlog = _.maxBy(blogData, (blog) => blog.title.length);
    const blogsWithPrivacy = _.filter(blogData, (blog) =>
      blog.title.toLowerCase().includes('privacy')
    );
    const uniqueBlogTitles = _.uniqBy(blogData, 'title');

    // Prepare the response
    const statistics = {
      totalBlogs,
      longestBlogTitle: longestBlog.title,
      blogsWithPrivacy: blogsWithPrivacy.length,
      uniqueBlogTitles: uniqueBlogTitles.map((blog) => blog.title),
    };

    res.json(statistics);
  } catch (error) {
    console.error('Error fetching and analyzing blog data:', error);
    res.status(500).json({ error: 'An error occurred while fetching and analyzing data.' });
  }
});

// Blog search endpoint
app.get('/api/blog-search', async (req, res) => {
  try {
    const query = req.query.query || '';
    const lowercasedQuery = query.toLowerCase();

    const apiURL = 'https://intent-kit-16.hasura.app/api/rest/blogs'; // Replace with your actual API URL
    const headers = {
      'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6',
    };

    const response = await axios.get(apiURL, { headers });
    const blogData = response.data;

    // Filter blogs based on the query string (case-insensitive)
    const searchResults = _.filter(blogData, (blog) =>
      blog.title.toLowerCase().includes(lowercasedQuery)
    );

    res.json({ searchResults });
  } catch (error) {
    console.error('Error during blog search:', error);
    res.status(500).json({ error: 'An error occurred during blog search.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
