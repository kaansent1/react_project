package de.kaan.repository.post

import de.kaan.dao.follows.FollowsDao
import de.kaan.dao.post.PostDao
import de.kaan.dao.post.PostRow
import de.kaan.dao.post_likes.PostLikesDao
import de.kaan.models.Post
import de.kaan.models.PostResponse
import de.kaan.models.PostTextParams
import de.kaan.models.PostsResponse
import de.kaan.utils.Response
import io.ktor.http.*

class PostRepositoryImpl(
    private val postDao: PostDao,
    private val postLikesDao: PostLikesDao,
    private val followsDao: FollowsDao

) : PostRepository {
    override suspend fun createPost(image: String, postTextParams: PostTextParams): Response<PostResponse> {
        val postIsCreated = postDao.createPost(
            text = postTextParams.text,
            image = image,
            userId = postTextParams.userId,
            username = postTextParams.username
        )

        return if (postIsCreated) {
            Response.Success(
                data = PostResponse(success = true)
            )
        } else {
            Response.Error(
                code = HttpStatusCode.InternalServerError,
                data = PostResponse(
                    success = false,
                    message = "Post could not be inserted in the db"
                )
            )
        }

    }

    override suspend fun getPostsByUser(postsOwnerId: Long, currentUserId: Long): Response<PostsResponse> {
        val postsRows = postDao.getPostByUser(userId = postsOwnerId)

        val posts = postsRows.map {
            toPost(
                postRow = it,
                isOwnPost = it.userId == currentUserId,
                isPostLiked = postLikesDao.isPostLikedByUser(postId = it.postId, userId = currentUserId)
            )
        }

        return Response.Success(
            data = PostsResponse(
                success = true,
                posts = posts
            )
        )
    }


    override suspend fun getPost(postId: Long, currentUserId: Long): Response<PostResponse> {
        val post = postDao.getPost(postId = postId)

        return if (post == null) {
            Response.Error(
                code = HttpStatusCode.InternalServerError,
                data = PostResponse(success = false, message = "Could not retrieve post from the database")
            )
        } else {
            val isPostLiked = postLikesDao.isPostLikedByUser(postId, currentUserId)
            val isOwnPost = post.userId == currentUserId
            Response.Success(
                data = PostResponse(success = true, toPost(post, isPostLiked = isPostLiked, isOwnPost = isOwnPost))
            )
        }
    }


    override suspend fun deletePost(postId: Long): Response<PostResponse> {
        val postIsDeleted = postDao.deletePost(
            postId = postId
        )

        return if (postIsDeleted) {
            Response.Success(
                data = PostResponse(success = true)
            )
        } else {
            Response.Error(
                code = HttpStatusCode.InternalServerError,
                data = PostResponse(
                    success = false,
                    message = "Post could not be deleted from the db"
                )
            )
        }
    }

    override suspend fun getAllPosts(): Response<PostsResponse> {
        val postsRows = postDao.getAllPosts()

        val posts = postsRows.map {
            toPost(
                postRow = it,
                isOwnPost = false,
                isPostLiked = postLikesDao.isPostLikedByUser(postId = it.postId, userId = it.userId),
            )
        }

        return Response.Success(
            data = PostsResponse(
                success = true,
                posts = posts
            )
        )
    }

    override suspend fun editPost(postId: Long, newText: String): Response<PostResponse> {
        val postIsEdited = postDao.editPost(postId, newText)

        return if (postIsEdited) {
            Response.Success(
                data = PostResponse(success = true)
            )
        } else {
            Response.Error(
                code = HttpStatusCode.InternalServerError,
                data = PostResponse(
                    success = false,
                    message = "Post could not be edited in the db"
                )
            )
        }
    }

    override suspend fun getFollowedUsers(userId: Long): List<Long> {
        return followsDao.getFollowing(userId)
    }


    override suspend fun getPostsByFollowedUsers(userId: Long, currentUserId: Long): Response<PostsResponse> {
        val followerUserIds = getFollowedUsers(userId)
        val postsRows = postDao.getFeedsPost(
            userIds = followerUserIds,
            currentUserId = currentUserId
        )

        val posts = postsRows.map {
            toPost(
                postRow = it,
                isPostLiked = postLikesDao.isPostLikedByUser(postId = it.postId, userId = userId),
                isOwnPost = it.userId == userId
            )
        }

        return Response.Success(
            data = PostsResponse(
                success = true,
                posts = posts
            )
        )
    }


    private fun toPost(postRow: PostRow, isOwnPost: Boolean, isPostLiked: Boolean): Post {
        return Post(
            postId = postRow.postId,
            text = postRow.text,
            image = postRow.image,
            createdAt = postRow.createdAt,
            userId = postRow.userId,
            userImage = postRow.userImage,
            username = postRow.username,
            isOwnPost = isOwnPost,
            isLiked = isPostLiked,
            likesCount = postRow.likesCount,
            commentsCount = postRow.commentsCount,
        )
    }
}
