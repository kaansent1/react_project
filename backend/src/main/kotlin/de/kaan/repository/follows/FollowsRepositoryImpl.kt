package de.kaan.repository.follows

import de.kaan.dao.follows.FollowsDao
import de.kaan.dao.user.UserDao
import de.kaan.dao.user.UserRow
import de.kaan.models.FollowAndUnfollowResponse
import de.kaan.models.FollowUserData
import de.kaan.models.GetFollowsResponse
import de.kaan.utils.Response
import io.ktor.http.*

class FollowsRepositoryImpl(
    private val userDao: UserDao,
    private val followDao: FollowsDao
) : FollowsRepository {
    override suspend fun followUser(follower: Long, following: Long): Response<FollowAndUnfollowResponse> {
        return if (followDao.isAlreadyFollowing(follower, following)) {
            Response.Error(
                code = HttpStatusCode.Forbidden,
                data = FollowAndUnfollowResponse(
                    success = false,
                    message = "You are already following this user"
                )
            )
        } else {
            val success = followDao.followUser(follower, following)

            if (success) {
                userDao.updateFollowsCount(follower, following, isFollowing = true)
                Response.Success(
                    data = FollowAndUnfollowResponse(success = true)
                )
            } else {
                Response.Error(
                    code = HttpStatusCode.InternalServerError,
                    data = FollowAndUnfollowResponse(
                        success = false,
                        message = "error"
                    )
                )
            }
        }
    }

    override suspend fun unfollowUser(follower: Long, following: Long): Response<FollowAndUnfollowResponse> {
        val success = followDao.unfollowUser(follower, following)

        return if (success) {
            userDao.updateFollowsCount(follower, following, isFollowing = false)
            Response.Success(
                data = FollowAndUnfollowResponse(success = true)
            )
        } else {
            Response.Error(
                code = HttpStatusCode.InternalServerError,
                data = FollowAndUnfollowResponse(
                    success = false,
                    message = "error"
                )
            )
        }
    }

    override suspend fun getFollowers(userId: Long): Response<GetFollowsResponse> {
        val followersIds = followDao.getFollowers(userId)
        val followersRows = userDao.getUsers(ids = followersIds)
        val followers = followersRows.map { followerRow ->
            val isFollowing = followDao.isAlreadyFollowing(follower = userId, following = followerRow.userId)
            toFollowUserData(userRow = followerRow, isFollowing = isFollowing)
        }
        return Response.Success(
            data = GetFollowsResponse(success = true, follows = followers)
        )
    }

    override suspend fun getFollowing(userId: Long): Response<GetFollowsResponse> {
        val followingIds = followDao.getAllFollowing(userId)
        val followingRows = userDao.getUsers(ids = followingIds)
        val following = followingRows.map { followingRow ->
            val isFollowing = followDao.isAlreadyFollowing(follower = followingRow.userId, following = userId)
            toFollowUserData(userRow = followingRow, isFollowing = isFollowing)
        }
        return Response.Success(
            data = GetFollowsResponse(success = true, follows = following)
        )
    }



    private fun toFollowUserData(userRow: UserRow, isFollowing: Boolean): FollowUserData {
        return FollowUserData(
            id = userRow.userId,
            name = userRow.username,
            email = userRow.email,
            image = userRow.image,
            isFollowing = isFollowing
        )
    }
}
