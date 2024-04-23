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
            Response.Success(
                data = ProfileResponse(success = true, profile = toProfile(userRow))
            )
        }
    }

    override suspend fun updateUser(image: String?, updateUserParams: UpdateUserParams): Response<ProfileResponse> {
        val userExists = userDao.findById(userId = updateUserParams.userId) != null

        if (userExists) {
            val userUpdated = userDao.updateUser(
                userId = updateUserParams.userId,
                username = updateUserParams.username,
                email = updateUserParams.email,
                image = image
            )

            return if (userUpdated) {
                Response.Success(
                    data = ProfileResponse(
                        success = true,
                        profile = Profile(
                            userId = updateUserParams.userId,
                            username = updateUserParams.username,
                            email = updateUserParams.email,
                            image = image
                        )
                    )
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

    override suspend fun deleteUser(userId: Long): Response<ProfileResponse> {
        val userIsDeleted = userDao.deleteUser(
            userId = userId
        )

        return if (userIsDeleted) {
            Response.Success(
                data = ProfileResponse(success = true)
            )
        } else {
            Response.Error(
                code = HttpStatusCode.InternalServerError,
                data = ProfileResponse(
                    success = false,
                    message = "User could not be deleted from the db"
                )
            )
        }
    }


    private fun toProfile(userRow: UserRow): Profile {
        return Profile(
            userId = userRow.userId,
            username = userRow.username,
            email = userRow.email,
            image = userRow.image
        )
    }
}
