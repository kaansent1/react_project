package de.kaan.models

import kotlinx.serialization.Serializable
import org.jetbrains.exposed.sql.Table

@Serializable
data class User (
    val userId: Int? = null,
    val username: String,
    val password: String,
    val email: String

)

object Users : Table() {
    val userId = integer("userId").autoIncrement()
    val username = varchar("username", 32)
    val password = varchar("password", 64)
    val email = varchar("email", 64)

    override val primaryKey = PrimaryKey(userId)
}