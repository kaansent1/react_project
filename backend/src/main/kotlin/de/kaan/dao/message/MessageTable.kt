package de.kaan.dao.message

import kotlinx.serialization.Serializable
import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.javatime.CurrentDateTime
import org.jetbrains.exposed.sql.javatime.datetime

@Serializable
data class MessageRow(
    val id: Long,
    val senderId: Long,
    val receiverId: Long,
    val content: String,
    val createdAt: String

)

object MessageTable : Table(name = "messages") {
    val id = long("id").autoIncrement()
    val senderId = long("senderId")
    val receiverId = long("receiverId")
    val content = varchar("content", 255)
    val createdAt = datetime(name = "created_at").defaultExpression(defaultValue = CurrentDateTime)

    override val primaryKey = PrimaryKey(id)
}