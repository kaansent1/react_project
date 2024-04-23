package de.kaan.repository.profile

import de.kaan.models.ProfileResponse
import de.kaan.models.UpdateUserParams
import de.kaan.utils.Response
import java.awt.Image

interface ProfileRepository {

    suspend fun getUserById(userId: Long, currentUserId: Long): Response<ProfileResponse>

    suspend fun updateUser(image: String?, updateUserParams: UpdateUserParams): Response<ProfileResponse>

    suspend fun deleteUser(userId: Long): Response<ProfileResponse>
}