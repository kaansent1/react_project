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
    val userName: String,
    val userImage: String?
    )

object PostsTable : Table(name = "posts") {

    val postId = long("postId").uniqueIndex()
    val userId = long(name = "user_id").references(ref = UserTable.userId, onDelete = ReferenceOption.CASCADE)
    val text = varchar("text", 128)
    val image = varchar("image", 1024)
    val createdAt = datetime(name = "created_at").defaultExpression(defaultValue = CurrentDateTime)


    override val primaryKey = PrimaryKey(postId)

}