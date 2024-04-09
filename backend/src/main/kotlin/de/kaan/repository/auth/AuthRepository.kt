package de.kaan.repository.auth

import de.kaan.models.AuthResponse
import de.kaan.models.LoginCredentials
import de.kaan.models.RegisterCredentials
import de.kaan.utils.Response

interface AuthRepository {
    suspend fun register(params: RegisterCredentials): Response<AuthResponse>
    suspend fun login(params: LoginCredentials): Response<AuthResponse>
}