package de.kaan.dao.post

import de.kaan.utils.dbQuery
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.transactions.transaction

interface PostDao {
    suspend fun createPost(text: String, image: String, userId: Long, username: String): Boolean

    suspend fun getPostByUser(userId: Long): List<PostRow>

    suspend fun getPost(postId: Long): PostRow?

    suspend fun deletePost(postId: Long): Boolean

    suspend fun getAllPosts(): List<PostRow>

}
