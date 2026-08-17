import { Response } from "express";
import postService from "./posts.service.instance.js";
import { asNumber, asString, requireString } from "../../shared/utils/typeValidators.js";
import { AuthenticatedRequest, RequestAfterAttachUserMiddleware } from "../auth/auth.types.js";

const postController = {
  async getFeed(req: RequestAfterAttachUserMiddleware, res: Response) {
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
  async createPost(req: AuthenticatedRequest, res: Response) {
    const authorId = req.user.userId;
    const result = await postService.createPost({ ...req.body, authorId });
    res.status(201).json(result);
  },
  async deletePost(req: AuthenticatedRequest, res: Response) {
    const authorId = req.user.userId;
    const postId = requireString(req.params);
    await postService.deletePost(postId, authorId);
    res.status(204).json("Post deleted sucessfully");
  },
  async getPostById(req: RequestAfterAttachUserMiddleware, res: Response) {
    const { postId } = req.params;
    const userId = req.user?.userId;
    const result = await postService.getPostById(String(postId), userId);
    res.status(200).json(result);
  },
  async getPostBySlug(req: RequestAfterAttachUserMiddleware, res: Response) {
    const { slug } = req.params;
    const userId = req.user?.userId;
    const result = await postService.getPostBySlug(String(slug), userId);
    res.status(200).json(result);
  }
}
export default postController;
