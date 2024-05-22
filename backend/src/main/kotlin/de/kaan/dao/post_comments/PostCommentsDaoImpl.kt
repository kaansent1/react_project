package de.kaan.dao.post_comments

import de.kaan.dao.post_comments.PostCommentsTable.commentId
import de.kaan.dao.user.UserTable
import de.kaan.utils.dbQuery
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

private val dateFormatter = DateTimeFormatter.ofPattern("HH:mm dd.MM.yyyy")

private fun formatDate(dateTime: LocalDateTime): String {
    return dateTime.format(dateFormatter)
}

class PostCommentsDaoImpl : PostCommentsDao {

    private fun toPostCommentRow(resultRow: ResultRow): PostCommentRow {
        return PostCommentRow(
            commentId = resultRow[commentId],
            content = resultRow[PostCommentsTable.content],
            postId = resultRow[PostCommentsTable.postId],
            userId = resultRow[PostCommentsTable.userId],
            username = resultRow[UserTable.username],
            image = resultRow[UserTable.image],
            createdAt = formatDate(resultRow[PostCommentsTable.createdAt]),
        )
    }

    override suspend fun addComment(postId: Long, userId: Long, content: String): PostCommentRow? {
        return dbQuery {

            PostCommentsTable.insert {
                it[PostCommentsTable.postId] = postId
                it[PostCommentsTable.userId] = userId
                it[PostCommentsTable.content] = content
            }

            PostCommentsTable
                .join(
                    otherTable = UserTable,
                    onColumn = PostCommentsTable.userId,
                    otherColumn = UserTable.userId,
                    joinType = JoinType.INNER
                )
                .select { (PostCommentsTable.postId eq postId) and (commentId eq commentId) }
                .singleOrNull()
                ?.let { toPostCommentRow(it) }
        }
    }

    override suspend fun removeComment(commentId: Long, postId: Long): Boolean {
        return dbQuery {
            PostCommentsTable.deleteWhere {
                (PostCommentsTable.commentId eq commentId) and (PostCommentsTable.postId eq postId)
            } > 0
        }
    }

    override suspend fun findComment(commentId: Long, postId: Long): PostCommentRow? {
        return dbQuery {
            PostCommentsTable
                .join(
                    otherTable = UserTable,
                    onColumn = PostCommentsTable.userId,
                    otherColumn = UserTable.userId,
                    joinType = JoinType.INNER
                )
                .select { (PostCommentsTable.postId eq postId) and (PostCommentsTable.commentId eq commentId) }
                .singleOrNull()
                ?.let { toPostCommentRow(it) }
        }
    }

    override suspend fun getComments(postId: Long): List<PostCommentRow> {
        return dbQuery {
            PostCommentsTable
                .join(
                    otherTable = UserTable,
                    onColumn = PostCommentsTable.userId,
                    otherColumn = UserTable.userId,
                    joinType = JoinType.INNER
                )
                .select(where = { PostCommentsTable.postId eq postId })
                .orderBy(column = PostCommentsTable.createdAt, SortOrder.DESC)
                .map { toPostCommentRow(it) }
        }
    }
}
