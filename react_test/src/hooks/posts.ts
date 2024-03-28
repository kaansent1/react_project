import { useEffect, useState } from 'react';
import { db, Post } from '../api/db';

export function usePosts(): [Post[], (() => void), ((post: Post) => void)] {
    const [posts, setPosts] = useState<Post[]>([]);

    const fetchPosts = () => {
        db.posts.toArray().then((result) => {
            setPosts(result);
        });
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const deletePost = (postToDelete: Post) => {
        db.posts.delete(postToDelete.postId).then(() => {
            setPosts(prevPosts => prevPosts.filter(post => post.postId !== postToDelete.postId));
        })
    };

    return [posts, fetchPosts, deletePost];
}
