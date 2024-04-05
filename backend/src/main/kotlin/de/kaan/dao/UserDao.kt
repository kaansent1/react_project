package de.kaan.dao

import de.kaan.models.*
import de.kaan.utils.dbQuery
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.transactions.transaction
import org.mindrot.jbcrypt.BCrypt

object UserDao {

    private fun resultRowToUser(row: ResultRow) = User(
        userId = row[Users.userId],
        username = row[Users.username],
        password = row[Users.password],
        email = row[Users.email]
    )

    private fun hashPassword(password: String): String {
        return BCrypt.hashpw(password, BCrypt.gensalt())
    }

    suspend fun allUsers(): List<User> = dbQuery {
        Users.selectAll().map(::resultRowToUser)
    }

    suspend fun addUser(user: User): Int = dbQuery {
        Users.insert {
            it[username] = user.username
            it[password] = hashPassword(user.password)
            it[email] = user.email
        } get Users.userId
    }

    suspend fun updateUser(id: Int, user: User): Int = dbQuery {
        Users.update({ Users.userId eq id }) {
            it[username] = user.username
            it[password] = hashPassword(user.password)
            it[email] = user.email
        }
    }

    suspend fun deleteUser(id: Int): Boolean = dbQuery {
        transaction {
            Users.deleteWhere { userId eq id } > 0
        }
    }
}
