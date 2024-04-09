package de.kaan.models

import kotlinx.serialization.Serializable

@Serializable
data class PostTextParams(
    val text: String,
    val userId: Long
)

@Serializable
data class Post(
    val postId: Long,
    val text: String,
    val image: String?,
    val createdAt: String,
    val userId: Long,
    val userName: String,
    val userImage: String?,
    val isOwnPost: Boolean
)

@Serializable
data class PostResponse(
    val success: Boolean,
    val post: Post? = null,
    val message: String? = null
)

@Serializable
data class PostsResponse(
    val success: Boolean,
    val posts: List<Post> = listOf(),
    val message: String? = null
)