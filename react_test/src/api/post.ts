import {User} from "./user.ts";

export interface Post {
    postId: number;
    user: User;
    text: string;
    image?: string;
}

export interface Posts {
    posts: Post[]
}