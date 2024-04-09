package de.kaan.dao.post

import de.kaan.dao.user.UserTable
import de.kaan.utils.IdGenerator
import de.kaan.utils.dbQuery
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.SqlExpressionBuilder.inList

class PostDaoImpl : PostDao {

    private fun postToRow(row: ResultRow): PostRow{
        return PostRow(
            postId = row[PostsTable.postId],
            text = row[PostsTable.text],
            image = row[PostsTable.image],
            createdAt = row[PostsTable.createdAt].toString(),
            userId = row[PostsTable.userId],
            username = row[UserTable.username],
            userImage = row[UserTable.image]
        )
    }

    override suspend fun getPostByUser(userId: Long): List<PostRow> {
        return dbQuery {
            getPosts(users = listOf(userId))
        }
    }

    private fun getPosts(users: List<Long>): List<PostRow>{
        return PostsTable
            .join(
                otherTable = UserTable,
                onColumn = PostsTable.userId,
                otherColumn = UserTable.userId,
                joinType = JoinType.INNER
            )
            .select(where = PostsTable.userId inList users)
            .orderBy(column = PostsTable.createdAt, order = SortOrder.DESC)
            .map { postToRow(it) }
    }


    override suspend fun createPost(text: String, image: String, userId: Long): Boolean {
        return dbQuery{
            val insertStatement = PostsTable.insert {
                it[postId] = IdGenerator.generateId()
                it[PostsTable.text] = text
                it[PostsTable.image] = image
                it[PostsTable.userId] = userId
            }
            insertStatement.resultedValues?.singleOrNull() != null
        }
    }

    override suspend fun getPost(postId: Long): PostRow? {
        return dbQuery {
            PostsTable
                .join(
                    otherTable = UserTable,
                    onColumn = PostsTable.userId,
                    otherColumn = UserTable.userId,
                    joinType = JoinType.INNER
                )
                .select { PostsTable.postId eq postId }
                .singleOrNull()
                ?.let { postToRow(it) }
        }
    }

    override suspend fun deletePost(postId: Long): Boolean {
        return dbQuery {
            PostsTable.deleteWhere { PostsTable.postId eq postId } > 0
        }
    }

}