package de.kaan.dao.user

import kotlinx.serialization.Serializable
import org.jetbrains.exposed.sql.Table

@Serializable
data class UserRow (
    val userId: Long,
    val username: String,
    val password: String,
    val email: String,
    val image: String?,

)

object UserTable : Table(name = "users") {
    val userId = long("userId").autoIncrement()
    val username = varchar("username", 32)
    val password = varchar("password", 64)
    val email = varchar("email", 64)
    val image= text(name = "image").nullable()


    override val primaryKey: PrimaryKey
        get() = PrimaryKey(userId)
}