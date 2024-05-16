package de.kaan.repository.post_comments

import de.kaan.models.CommentResponse
import de.kaan.models.GetCommentsResponse
import de.kaan.models.NewCommentParams
import de.kaan.models.RemoveCommentParams
import de.kaan.utils.Response

interface PostCommentsRepository {
    suspend fun addComment(params: NewCommentParams): Response<CommentResponse>

    suspend fun removeComment(params: RemoveCommentParams): Response<CommentResponse>

    suspend fun getPostComments(postId: Long): Response<GetCommentsResponse>
}