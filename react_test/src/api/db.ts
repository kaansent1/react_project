import Dexie, { Table } from "dexie";
import {User} from "./user.ts";

export interface Post {
    id: string;
    user: User;
    text: string;
    image?: File;
    createdAt: Date;
}

export class PostsDataBase extends Dexie {
    posts!: Table<Post>;

    constructor() {
        super('posts');
        this.version(2).stores({
            posts: 'user, text, image, created_At'
        });
    }
}

export const db = new PostsDataBase();