import Express from "express";
import Comment from '../models/Comment.js';
import Blog from '../models/BlogPost.js';

const router = Express.Router()


// Create a new comment for a blog post
router.post('/:blogId/comments', async (req, res) => {
      try {
        const { text } = req.body;
        const blog = await Blog.findById(req.params.blogId);
        if (!blog) {
          return res.status(404).json({ error: 'Blog not found' });
        }
        const comment = new Comment({ text });
        blog.comments.push(comment);
        blog.commentCount += 1;
        await Promise.all([comment.save(), blog.save()]);
        return res.status(201).json(comment);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
      }
    });
    
    // Get all comments for a blog post
    router.get('/:blogId/comments', async (req, res) => {
      try {
        const blog = await Blog.findById(req.params.blogId).populate('comments');
        if (!blog) {
          return res.status(404).json({ error: 'Blog not found' });
        }
        return res.json(blog.comments);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
      }
    });
    
export default router

