import { ThumbsUp } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

interface FeedPostProps {
    post: {
        postId: string;
        authorId: string;
        description: string;
        title: string;
        slug: string;
        categoryId?: string;
        createdAt: string;
        updatedAt: string;
        authorName: string;
        categoryName?: string;
        likes: number
        isLiked: boolean;
    }

}
const FeedPost = ({ post }: FeedPostProps) => {
    const { postId, authorName, isLiked, description, title, likes, categoryName, slug } = post;
    const [likeState, setLikeState] = useState<{ isLiked: boolean, likeCount: number }>({ isLiked, likeCount: likes });
    return (
        <Link
            to={`/posts/${slug}`}
        >
            <div
                id={postId}
                className="cursor-pointer h-[300px] w-[400px] rounded-[16px] flex flex-col justify-center gap-4 p-8 bg-[#26262c] border-1 border-[#4b4c52]"
            >
                <div className="flex flex-col gap-2">
                    <h1 className="text-[#edf2f4] text-[44px] font-bold">{title}</h1>
                    <p className="text-[#adb5bd] text-[20px]">{description}</p>
                    <div className="text-[#edf2f4] flex items-center">{authorName}</div>
                </div>
                <div className="flex items-center gap-2 text-[#f8f9fa] justify-between">
                    <div className="flex items-center gap-2">
                        <ThumbsUp
                            fill={likeState.isLiked ? "#edf2f4" : ""}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setLikeState(prev => ({ isLiked: !prev.isLiked, likeCount: prev.isLiked ? prev.likeCount - 1 : prev.likeCount + 1 }));
                            }}
                        />
                        {likeState.likeCount}
                    </div>
                    <div className="bg-[#393a41] px-4 py-1 rounded-full">{categoryName}</div>
                </div>

            </div>
        </Link>
    );

}
export default FeedPost
