package de.kaan.models

import kotlinx.serialization.Serializable

@Serializable
data class LoginCredentials(
    val username: String,
    val password: String
)
