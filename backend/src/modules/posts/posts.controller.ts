import { Request, Response } from "express";
import postService from "./posts.service.instance.js";
import { UnauthorizedError } from "../../errors/errors.js";
import { asNumber, asString, requireString } from "../../utils/typeValidators.js";

const postController = {
  async getFeed(req: Request, res: Response) {
    const queries = {
      limit: asNumber(req.query.limit) ?? 10,
      page: asNumber(req.query.page) ?? 1,
      authorId: asString(req.query.authorId),
      categoryId: asString(req.query.categoryId),
      search: asString(req.query.search),
    }
    const userId = req.user?.userId;
    const result = await postService.getFeed(queries, userId);
    res.status(200).json(result);
  },
  async createPost(req: Request, res: Response) {
    const authorId = req.user?.userId;
    if (!authorId) {
      throw new UnauthorizedError();
    }
    const result = await postService.createPost({ ...req.body, authorId });
    res.status(201).json(result);
  },
  async deletePost(req: Request, res: Response) {
    const authorId = req.user?.userId;
    if (!authorId) {
      throw new UnauthorizedError();
    }
    const postId = requireString(req.params);
    await postService.deletePost(postId, authorId);
    res.status(204).json("Post deleted sucessfully");
  },
  async getPostById(req: Request, res: Response) {
    const { postId } = req.params;
    const userId = req.user?.userId;
    const result = await postService.getPostById(String(postId), userId);
    res.status(200).json(result);
  },
  async getPostBySlug(req: Request, res: Response) {
    const { slug } = req.params;
    const userId = req.user?.userId;
    const result = await postService.getPostBySlug(String(slug), userId);
    res.status(200).json(result);
  }
}
export default postController;
