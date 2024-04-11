package de.kaan.dao.user

import de.kaan.models.RegisterCredentials

interface UserDao {
        suspend fun insert(params: RegisterCredentials): UserRow?
        suspend fun findByUsername(username: String): UserRow?

        suspend fun findById(userId: Long): UserRow?

        suspend fun updateUser(userId: Long, username: String, email: String): Boolean

        suspend fun getUsers(ids: List<Long>): List<UserRow>

        suspend fun deleteUser(userId: Long): Boolean
}
