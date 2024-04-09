package de.kaan.repository.profile

import de.kaan.models.ProfileResponse
import de.kaan.models.UpdateUserParams
import de.kaan.utils.Response

interface ProfileRepository {

    suspend fun getUserById(userId: Long, currentUserId: Long): Response<ProfileResponse>

    suspend fun updateUser(updateUserParams: UpdateUserParams): Response<ProfileResponse>
}