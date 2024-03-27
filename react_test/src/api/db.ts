import Dexie, { Table } from "dexie";
import {User} from "./user.ts";

export interface Post {
    user: User;
    text: string;
    image?: File;
    created_at: Date;
}

export class PostsDataBase extends Dexie {
    posts!: Table<Post>;

    constructor() {
        super('posts');
        this.version(2).stores({
            posts: '++id, user, text, image, created_at'
        });
    }
}

export const db = new PostsDataBase();