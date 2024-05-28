package de.kaan.repository.profile

import de.kaan.models.UserResponse
import de.kaan.models.UpdateUserImageParams
import de.kaan.models.UpdateUserParams
import de.kaan.models.UsersResponse
import de.kaan.utils.Response

interface UserRepository {

    suspend fun getUserById(userId: Long, currentUserId: Long): Response<UserResponse>

    suspend fun updateUser(updateUserParams: UpdateUserParams): Response<UserResponse>

    suspend fun updateUserImage(updateUserImageParams: UpdateUserImageParams): Response<UserResponse>

    suspend fun deleteUser(userId: Long): Response<UserResponse>

    suspend fun getAllUsers(): Response<UsersResponse>

}