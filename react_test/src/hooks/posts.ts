import { useEffect, useState } from 'react';
import { db, Post } from '../api/db';

export function usePosts(): [Post[], () => void] {
    const [posts, setPosts] = useState<Post[]>([]);

    const fetchPosts = () => {
        db.posts.toArray().then((result) => {
            setPosts(result);
        });
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return [posts, fetchPosts];
}
