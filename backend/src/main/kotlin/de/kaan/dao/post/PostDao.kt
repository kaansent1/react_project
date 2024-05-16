package de.kaan.dao.post

interface PostDao {
    suspend fun createPost(text: String, image: String, userId: Long, username: String): Boolean

    suspend fun getFeedsPost(userIds: List<Long>, currentUserId: Long): List<PostRow>

    suspend fun getPostByUser(userId: Long): List<PostRow>

    suspend fun getPost(postId: Long): PostRow?

    suspend fun deletePost(postId: Long): Boolean

    suspend fun getAllPosts(): List<PostRow>

    suspend fun editPost(postId: Long, newText: String): Boolean

    suspend fun updateLikesCount(postId: Long, decrement: Boolean = false): Boolean

    suspend fun updateCommentsCount(postId: Long, decrement: Boolean = false): Boolean
}
