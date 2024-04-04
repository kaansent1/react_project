package de.kaan.models

import kotlinx.serialization.Serializable
import org.jetbrains.exposed.sql.Table

@Serializable
data class User (
    val userId: Int? = null,
    val username: String,
    val firstname: String,
    val lastname: String,
    val email: String

)

object Users : Table() {
    val userId = integer("userId").autoIncrement()
    val username = varchar("username", 32)
    val firstname = varchar("firstname", 64)
    val lastname = varchar("lastname", 64)
    val email = varchar("email", 64)

    override val primaryKey = PrimaryKey(userId)
}