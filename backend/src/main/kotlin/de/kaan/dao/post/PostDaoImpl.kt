package de.kaan.dao.post

import de.kaan.dao.user.UserTable
import de.kaan.utils.dbQuery
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.SqlExpressionBuilder.inList
import org.jetbrains.exposed.sql.SqlExpressionBuilder.plus
import org.jetbrains.exposed.sql.transactions.transaction
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

private val dateFormatter = DateTimeFormatter.ofPattern("HH:mm dd.MM.yyyy")

private fun formatDate(dateTime: LocalDateTime): String {
    return dateTime.format(dateFormatter)
}

class PostDaoImpl : PostDao {

    private fun postToRow(row: ResultRow): PostRow {
        return PostRow(
            postId = row[PostsTable.postId],
            text = row[PostsTable.text],
            image = row[PostsTable.image],
            createdAt = formatDate(row[PostsTable.createdAt]),
            userId = row[UserTable.userId],
            username = row[UserTable.username],
            userImage = row[UserTable.image],
            likesCount = row[PostsTable.likesCount],
            commentsCount = row[PostsTable.commentsCount],
            )
    }

    override suspend fun getPostByUser(userId: Long): List<PostRow> {
        return dbQuery {
            getPosts(users = listOf(userId))
        }
    }

    private fun getPosts(users: List<Long>): List<PostRow> {
        return PostsTable
            .join(
                otherTable = UserTable,
                onColumn = PostsTable.userId,
                otherColumn = UserTable.userId,
                joinType = JoinType.INNER
            )
            .select(where = PostsTable.userId inList users)
            .orderBy(column = PostsTable.createdAt, order = SortOrder.DESC)
            .map { postToRow(it) }
    }

    override suspend fun createPost(text: String, image: String, userId: Long, username: String): Boolean {
        return dbQuery {
            val insertStatement = PostsTable.insert {
                it[PostsTable.text] = text
                it[PostsTable.image] = image
                it[UserTable.userId] = userId
                it[UserTable.username] = username
                it[likesCount] = 0
                it[commentsCount] = 0

            }
            insertStatement.resultedValues?.singleOrNull() != null
        }
    }

    override suspend fun getPost(postId: Long): PostRow? {
        return dbQuery {
            PostsTable
                .join(
                    otherTable = UserTable,
                    onColumn = PostsTable.userId,
                    otherColumn = UserTable.userId,
                    joinType = JoinType.INNER
                )
                .select { PostsTable.postId eq postId }
                .singleOrNull()
                ?.let { postToRow(it) }
        }
    }

    override suspend fun deletePost(postId: Long): Boolean {
        return dbQuery {
            PostsTable.deleteWhere { PostsTable.postId eq postId } > 0
        }
    }

    override suspend fun getAllPosts(): List<PostRow> {
        return dbQuery {
            PostsTable
                .join(
                    otherTable = UserTable,
                    onColumn = PostsTable.userId,
                    otherColumn = UserTable.userId,
                    joinType = JoinType.INNER
                )
                .selectAll()
                .orderBy(column = PostsTable.createdAt, order = SortOrder.DESC)
                .map { postToRow(it) }
        }
    }

    override suspend fun editPost(postId: Long, newText: String): Boolean {
        return transaction {
            PostsTable.update({ PostsTable.postId eq postId }) {
                it[text] = newText
            } > 0
        }
    }

    override suspend fun getFeedsPost(userIds: List<Long>, currentUserId: Long): List<PostRow> {
        return dbQuery {
            val followedAndCurrentUserIds = userIds + currentUserId

            PostsTable
                .join(
                    otherTable = UserTable,
                    onColumn = PostsTable.userId,
                    otherColumn = UserTable.userId,
                    joinType = JoinType.INNER
                )
                .select { PostsTable.userId inList followedAndCurrentUserIds }
                .orderBy(column = PostsTable.createdAt, order = SortOrder.DESC)
                .map { postToRow(it) }
        }
    }


    override suspend fun updateLikesCount(postId: Long, decrement: Boolean): Boolean {
        return dbQuery {
            val value = if (decrement) -1 else 1
            PostsTable.update(where = { PostsTable.postId eq postId }) {
                it.update(column = likesCount, value = likesCount.plus(value))
            } > 0
        }
    }

    override suspend fun updateCommentsCount(postId: Long, decrement: Boolean): Boolean {
        return dbQuery {
            val value = if (decrement) -1 else 1
            PostsTable.update(where = { PostsTable.postId eq postId }) {
                it.update(column = commentsCount, value = commentsCount.plus(value))
            } > 0
        }
    }
}
