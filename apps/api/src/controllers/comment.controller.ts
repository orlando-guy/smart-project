import { CreateCommentInput, PaginationInput } from "@repo/shared";
import { Request, Response } from "express";
import { CommentService } from "src/services/comment.service";

export class CommentController {
    constructor(
        private readonly commentService = new CommentService()
    ) {}

    create = async (req: Request<{ taskId: string }, {}, CreateCommentInput>, res: Response) => {
        const { taskId } = req.params;
        const authorId = req.user.id;
        
        const comment = await this.commentService.createComment(taskId, authorId, req.body);
        
        return res.status(201).json({
            success: true,
            data: comment
        });
    }

    getComments = async (req: Request<{ taskId: string }, {}, {}, PaginationInput>, res: Response) => {
        const { taskId } = req.params;
        const comments = await this.commentService.getCommentsForTask(taskId, req.query);
        
        return res.status(200).json({
            success: true,
            ...comments
        });
    }
}
