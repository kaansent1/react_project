package de.kaan.dao.user

import kotlinx.serialization.Serializable
import org.jetbrains.exposed.sql.Table

@Serializable
data class UserRow(
    val userId: Long,
    val username: String,
    val password: String,
    val email: String,
    val image: String?,
    val followersCount: Int,
    val followingCount: Int

)

object UserTable : Table(name = "users") {
    val userId = long("userId").autoIncrement()
    val username = varchar("username", 32).uniqueIndex()
    val password = varchar("password", 64)
    val email = varchar("email", 64)
    val image = text(name = "image").nullable()
    val followersCount = integer(name = "followers_count").default(defaultValue = 0)
    val followingCount = integer(name = "following_count").default(defaultValue = 0)


    override val primaryKey: PrimaryKey
        get() = PrimaryKey(userId)
}
