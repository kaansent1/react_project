package de.kaan.dao.post_comments

import de.kaan.dao.post.PostsTable
import de.kaan.dao.user.UserTable
import org.jetbrains.exposed.sql.ReferenceOption
import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.javatime.CurrentDateTime
import org.jetbrains.exposed.sql.javatime.datetime

object PostCommentsTable : Table(name = "post_comments") {
    val commentId = long(name = "commentId").autoIncrement()
    val postId = long(name = "postId").references(ref = PostsTable.postId, onDelete = ReferenceOption.CASCADE)
    val userId = long(name = "userId").references(ref = UserTable.userId, onDelete = ReferenceOption.CASCADE)
    val content = varchar(name = "content", length = 300)
    val createdAt = datetime(name = "created_at").defaultExpression(defaultValue = CurrentDateTime)

    override val primaryKey = PrimaryKey(commentId)
}

data class PostCommentRow(
    val commentId: Long,
    val content: String,
    val postId: Long,
    val userId: Long,
    val username: String,
    val image: String?,
    val createdAt: String
)
