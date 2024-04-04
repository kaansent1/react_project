package de.kaan.dao

import de.kaan.models.*
import de.kaan.utils.dbQuery
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.transactions.transaction

object PostDao {

    private fun resultRowToPost(row: ResultRow) = Post(
        postId = row[Posts.postId],
        text = row[Posts.text],
        userId = row[Posts.userId],
        image = row[Posts.image],
    )

    suspend fun allPosts(): List<Post> = dbQuery {
        Posts.selectAll().map(::resultRowToPost)
    }

    suspend fun addPost(post: Post): Int = dbQuery {
        Posts.insert {
            it[userId] = post.userId
            it[text] = post.text
            it[image] = post.image ?: ""
        } get Posts.postId
    }

    suspend fun updatePost(id: Int, post: Post): Int = dbQuery {
        Posts.update({ Posts.postId eq id }) {
            it[text] = post.text
            it[image] = post.image ?: ""
        }
    }

    suspend fun deletePost(id: Int): Boolean = dbQuery {
        transaction {
            Posts.deleteWhere { postId eq id } > 0
        }
    }

}
