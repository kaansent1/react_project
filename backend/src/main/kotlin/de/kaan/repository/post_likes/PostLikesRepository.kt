package de.kaan.repository.post_likes

import de.kaan.models.LikeParams
import de.kaan.models.LikeResponse
import de.kaan.utils.Response

interface PostLikesRepository {
    suspend fun addLike(params: LikeParams): Response<LikeResponse>

    suspend fun removeLike(params: LikeParams): Response<LikeResponse>
}