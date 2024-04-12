package de.kaan.dao.user

import de.kaan.models.RegisterCredentials
import de.kaan.security.hashPassword
import de.kaan.utils.dbQuery
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq


class UserDaoImpl : UserDao {

    override suspend fun insert(params: RegisterCredentials): UserRow? {
        return dbQuery {
            val insertStatement = UserTable.insert {
                it[username] = params.username
                it[email] = params.email
                it[password] = hashPassword(params.password)
            }

            insertStatement.resultedValues?.singleOrNull()?.let {
                rowToUser(it)
            }
        }
    }



    override suspend fun findByUsername(username: String): UserRow? {
        return dbQuery {
            UserTable.select { UserTable.username eq username }
                .map { rowToUser(it) }
                .singleOrNull()
        }
    }

    override suspend fun findById(userId: Long): UserRow? {
        return dbQuery {
            UserTable.select { UserTable.userId eq userId }
                .map { rowToUser(it) }
                .singleOrNull()
        }
    }

    override suspend fun updateUser(userId: Long, username: String, email: String): Boolean {
        return dbQuery {
            UserTable.update(where = { UserTable.userId eq userId }) {
                it[UserTable.username] = username
                it[UserTable.email] = email
            } > 0
        }
    }

    override suspend fun getUsers(ids: List<Long>): List<UserRow> {
        return dbQuery {
            UserTable.select(where = { UserTable.userId inList ids })
                .map { rowToUser(it) }
        }
    }

    override suspend fun deleteUser(userId: Long): Boolean {
        return dbQuery {
            UserTable.deleteWhere { UserTable.userId eq userId } > 0
        }
    }

    private fun rowToUser(row: ResultRow): UserRow {
        return UserRow(
            userId = row[UserTable.userId],
            username = row[UserTable.username],
            email = row[UserTable.email],
            password = row[UserTable.password],
            image = row[UserTable.image],
        )
    }
}
