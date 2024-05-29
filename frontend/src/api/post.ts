export interface Post {
    postId: number;
    username: string;
    userImage: string;
    text: string;
    image?: string;
    createdAt: string;
    isOwnPost: boolean;
    userId: number;
    isLiked: boolean;
    likesCount: number;
    commentsCount: number
}
