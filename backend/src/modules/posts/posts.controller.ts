import { Request, Response } from "express";
import postService from "./posts.service.js";

const postController = {
  async getFeed(req: Request, res: Response) {
    const { limit = 10, page = 1 } = req.query;
    const result = await postService.getFeed(Number(limit), Number(page));
    res.status(200).json(result);
  },
  async createPost(req: Request, res: Response) {
    const result = await postService.createPost(req.body);
    res.status(201).json(result);
  },
  async deletePost(req: Request, res: Response) {
    const { postId } = req.params;
    await postService.deletePost(String(postId));
    res.status(204).json("Post deleted sucessfully");
  },
  async getPostById(req: Request, res: Response) {
    const { postId } = req.params;
    const result = await postService.getPostById(String(postId));
    res.status(200).json(result);
  },
  async getPostBySlug(req: Request, res: Response) {
    const { slug } = req.params;
    const result = await postService.getPostBySlug(String(slug));
    res.status(200).json(result);
  }
}
export default postController;
