package de.kaan.models

import kotlinx.serialization.Serializable

@Serializable
data class UpdateUserParams(
    val userId: Long,
    val username: String,
    val email: String,
)

@Serializable
data class Profile(
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
data class ProfileResponse(
    val success: Boolean,
    val profile: Profile? = null,
    val message: String? = null
)

@Serializable
data class UsersResponse(
    val success: Boolean,
    val users: List<Profile> = listOf(),
    val message: String? = null
)