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
    val image: String? = null

)

@Serializable
data class ProfileResponse(
    val success: Boolean,
    val profile: Profile? = null,
    val message: String? = null
)