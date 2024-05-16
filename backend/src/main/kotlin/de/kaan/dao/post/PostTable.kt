package de.kaan.dao.post

import de.kaan.dao.user.UserTable
import kotlinx.serialization.Serializable
import org.jetbrains.exposed.sql.ReferenceOption
import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.javatime.CurrentDateTime
import org.jetbrains.exposed.sql.javatime.datetime

@Serializable
data class PostRow(
    val postId: Long,
    val userId: Long,
    val text: String,
    val image: String? = null,
    val createdAt: String,
    val username: String,
    val userImage: String?,
    val likesCount: Int,
    val commentsCount: Int,
    )

object PostsTable : Table(name = "posts") {

    val postId = long("postId").autoIncrement()
    val userId = long("userId").references(ref = UserTable.userId, onDelete = ReferenceOption.CASCADE)
    val username = varchar("username", 32).references(ref = UserTable.username, onUpdate = ReferenceOption.CASCADE)
    val text = varchar("text", 512)
    val image = varchar("image", 1024)
    val createdAt = datetime(name = "created_at").defaultExpression(defaultValue = CurrentDateTime)
    val likesCount = integer(name = "likes_count")
    val commentsCount = integer(name = "comments_count")


    override val primaryKey = PrimaryKey(postId)

}