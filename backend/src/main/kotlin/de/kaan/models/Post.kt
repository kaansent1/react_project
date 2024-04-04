package de.kaan.models

import kotlinx.serialization.Serializable
import org.jetbrains.exposed.sql.Table

@Serializable
data class Post(
    val postId: Int? = null,
    val userId: Int,
    val text: String,
    val image: String? = null,
)

object Posts : Table() {

    val postId = integer("postId").autoIncrement()
    val userId = integer("userId").references(Users.userId)
    val text = varchar("text", 128)
    val image = varchar("image", 1024)

    override val primaryKey = PrimaryKey(postId)

}