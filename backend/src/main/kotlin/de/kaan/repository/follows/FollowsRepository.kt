package de.kaan.repository.follows

import de.kaan.models.FollowAndUnfollowResponse
import de.kaan.models.GetFollowsResponse
import de.kaan.utils.Response

interface FollowsRepository {
    suspend fun followUser(follower: Long, following: Long): Response<FollowAndUnfollowResponse>

    suspend fun unfollowUser(follower: Long, following: Long): Response<FollowAndUnfollowResponse>

    suspend fun getFollowers(userId: Long): Response<GetFollowsResponse>

    suspend fun getFollowing(userId: Long): Response<GetFollowsResponse>
}