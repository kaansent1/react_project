import Dexie, { Table } from "dexie";
import {User} from "./user.ts";

export interface Post {
    postId: string;
    user: User;
    text: string;
    image?: string;
}

export class PostsDataBase extends Dexie {
    posts!: Table<Post>;

    constructor() {
        super('posts');
        this.version(10).stores({
            posts: '++postId, user, text, image'
        });
    }
}

export const db = new PostsDataBase();