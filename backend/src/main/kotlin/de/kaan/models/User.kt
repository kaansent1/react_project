package de.kaan.models

import kotlinx.serialization.Serializable

@Serializable
data class UpdateUserParams(
    val userId: Long,
    val username: String,
    val email: String,
)

@Serializable
data class UpdateUserImageParams(
    val userId: Long,
    val image: String? = null
)

@Serializable
data class User(
    val userId: Long,
    val username: String,
    val email: String,
    val image: String? = null,
    val followersCount: Int = 0,
    val followingCount: Int = 0,
    val isFollowing: Boolean,
    val isOwnProfile: Boolean

)

@Serializable
data class UserResponse(
    val success: Boolean,
    val user: User? = null,
    val message: String? = null
)

@Serializable
data class UsersResponse(
    val success: Boolean,
    val users: List<User> = listOf(),
    val message: String? = null
)