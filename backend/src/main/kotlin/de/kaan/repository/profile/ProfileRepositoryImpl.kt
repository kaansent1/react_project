package de.kaan.repository.profile

import de.kaan.dao.follows.FollowsDao
import de.kaan.dao.user.UserDao
import de.kaan.dao.user.UserRow
import de.kaan.models.*
import de.kaan.utils.Response
import io.ktor.http.*

class ProfileRepositoryImpl(
    private val userDao: UserDao,
    private val followsDao: FollowsDao
) : ProfileRepository {
    override suspend fun getUserById(userId: Long, currentUserId: Long): Response<ProfileResponse> {
        val userRow = userDao.findById(userId = userId)

        return if (userRow == null) {
            Response.Error(
                code = HttpStatusCode.NotFound,
                data = ProfileResponse(success = false, message = "Could not find user with id: $userId")
            )
        } else {
            val isFollowing = followsDao.isAlreadyFollowing(follower = currentUserId, following = userId)
            val isOwnProfile = userId == currentUserId


            Response.Success(
                data = ProfileResponse(success = true, profile = toProfile(userRow,  isFollowing, isOwnProfile))
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
            )

            return if (userUpdated) {
                Response.Success(
                    data = ProfileResponse(
                        success = true,
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

    override suspend fun updateUserImage(updateUserImageParams: UpdateUserImageParams): Response<ProfileResponse> {
        val userExists = userDao.findById(userId = updateUserImageParams.userId) != null

        if (userExists) {
            val userUpdated = userDao.updateUserImage(
                userId = updateUserImageParams.userId,
                image = updateUserImageParams.image
            )

            return if (userUpdated) {
                Response.Success(
                    data = ProfileResponse(
                        success = true,
                    )
                )
            } else {
                Response.Error(
                    code = HttpStatusCode.Conflict,
                    data = ProfileResponse(
                        success = false,
                        message = "Could not update user: ${updateUserImageParams.userId}"
                    )
                )
            }
        } else {
            return Response.Error(
                code = HttpStatusCode.NotFound,
                data = ProfileResponse(success = false, message = "Could not find user: ${updateUserImageParams.userId}")
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

    override suspend fun getAllUsers(): Response<UsersResponse> {
        val usersRows = userDao.getAllUsers()

        val users = usersRows.map {
            toProfile(
                userRow = it,
                isFollowing = followsDao.isAlreadyFollowing(follower = it.userId, following = it.userId),
                isOwnProfile = false
            )
        }

        return Response.Success(
            data = UsersResponse(
                success = true,
                users = users
            )
        )
    }


    private fun toProfile(userRow: UserRow, isFollowing: Boolean, isOwnProfile: Boolean): Profile{
        return Profile(
            userId = userRow.userId,
            username = userRow.username,
            email = userRow.email,
            image = userRow.image,
            followersCount = userRow.followersCount,
            followingCount = userRow.followingCount,
            isFollowing = isFollowing,
            isOwnProfile = isOwnProfile
        )
    }
}
