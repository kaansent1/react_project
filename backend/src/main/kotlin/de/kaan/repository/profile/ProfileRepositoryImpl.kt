package de.kaan.repository.profile

import de.kaan.dao.user.UserDao
import de.kaan.dao.user.UserRow
import de.kaan.models.Profile
import de.kaan.models.ProfileResponse
import de.kaan.models.UpdateUserParams
import de.kaan.utils.Response
import io.ktor.http.*

class ProfileRepositoryImpl(
    private val userDao: UserDao,
) : ProfileRepository {
    override suspend fun getUserById(userId: Long, currentUserId: Long): Response<ProfileResponse> {
        val userRow = userDao.findById(userId = userId)

        return if (userRow == null) {
            Response.Error(
                code = HttpStatusCode.NotFound,
                data = ProfileResponse(success = false, message = "Could not find user with id: $userId")
            )
        } else {
            val isOwnProfile = userId == currentUserId

            Response.Success(
                data = ProfileResponse(success = true, profile = toProfile(userRow, isOwnProfile))
            )
        }
    }

    override suspend fun updateUser(updateUserParams: UpdateUserParams): Response<ProfileResponse> {
        val userExists = userDao.findById(userId = updateUserParams.userId) != null

        if (userExists) {
            val userUpdated = userDao.updateUser(
                userId = updateUserParams.userId,
                username = updateUserParams.username,
                email = updateUserParams.email,
                image = updateUserParams.image
            )

            return if (userUpdated) {
                Response.Success(
                    data = ProfileResponse(success = true)
                )
            } else {
                Response.Error(
                    code = HttpStatusCode.Conflict,
                    data = ProfileResponse(
                        success = false,
                        message = "Could not update user: ${updateUserParams.userId}"
                    )
                )
            }
        } else {
            return Response.Error(
                code = HttpStatusCode.NotFound,
                data = ProfileResponse(success = false, message = "Could not find user: ${updateUserParams.userId}")
            )
        }
    }

    private fun toProfile(userRow: UserRow, isOwnProfile: Boolean): Profile {
        return Profile(
            id = userRow.userId,
            username = userRow.username,
            email = userRow.email,
            image = userRow.image,
            isOwnProfile = isOwnProfile
        )
    }
}