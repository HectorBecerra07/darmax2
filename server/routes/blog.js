import express from "express";
import prisma from "../prisma.js";

const router = express.Router();

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

// GET all posts or by slug/id
router.get("/", async (req, res) => {
  const { id, slug } = req.query;
  try {
    if (slug) {
      const post = await prisma.blogPost.findUnique({ where: { slug } });
      if (!post) return res.status(404).json({ error: "Post not found" });
      return res.json(post);
    }
    if (id) {
      const post = await prisma.blogPost.findUnique({ where: { id } });
      if (!post) return res.status(404).json({ error: "Post not found" });
      return res.json(post);
    }
    const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });
    return res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST new article
router.post("/", async (req, res) => {
  const { title, content, excerpt, blocks, image, videoUrl, category, tags, published, author } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }

  try {
    let generatedSlug = slugify(title);
    const existing = await prisma.blogPost.findUnique({ where: { slug: generatedSlug } });
    if (existing) {
      generatedSlug = `${generatedSlug}-${Date.now().toString().slice(-4)}`;
    }

    const newPost = await prisma.blogPost.create({
      data: {
        title,
        slug: generatedSlug,
        content,
        excerpt,
        blocks,
        image,
        videoUrl,
        category: category || "Articulo",
        tags: tags || ["Darmax"],
        published: published !== undefined ? published : true,
        author: author || "Darmax"
      }
    });
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update article
router.put("/", async (req, res) => {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: "Missing ID" });

  try {
    const { tags, ...rest } = req.body;
    
    const updatedPost = await prisma.blogPost.update({
      where: { id },
      data: {
        ...rest,
        ...(tags && { tags: Array.isArray(tags) ? tags : [tags] })
      }
    });
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE article
router.delete("/", async (req, res) => {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: "Missing ID" });

  try {
    await prisma.blogPost.delete({ where: { id } });
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
