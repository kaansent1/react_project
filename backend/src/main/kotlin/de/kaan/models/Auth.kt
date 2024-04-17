package de.kaan.models

import kotlinx.serialization.Serializable

@Serializable
data class RegisterCredentials(
    val username: String,
    val password: String,
    val email: String
)

@Serializable
data class LoginCredentials(
    val username: String,
    val password: String
)

@Serializable
data class AuthResponse(
    val data: AuthResponseData? = null,
    val errorMessage: String? = null
)

@Serializable
data class AuthResponseData(
    val userId: Long,
    val username: String,
    val image: String? = null,
    val email: String
)