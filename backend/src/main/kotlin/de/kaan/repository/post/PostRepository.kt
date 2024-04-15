package de.kaan.repository.post

import de.kaan.models.PostResponse
import de.kaan.models.PostTextParams
import de.kaan.models.PostsResponse
import de.kaan.utils.Response

interface PostRepository {
    suspend fun createPost(image: String, postTextParams: PostTextParams): Response<PostResponse>


    suspend fun getPostsByUser(
        postsOwnerId: Long,
        currentUserId: Long,
    ): Response<PostsResponse>

    suspend fun getPost(postId: Long, currentUserId: Long): Response<PostResponse>

    suspend fun deletePost(postId: Long): Response<PostResponse>

    suspend fun getAllPosts(): Response<PostsResponse>

    suspend fun editPost(postId: Long, newText: String): Response<PostResponse>
}