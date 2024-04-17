package de.kaan.dao.post_likes

import de.kaan.dao.post.PostsTable
import de.kaan.dao.user.UserTable
import org.jetbrains.exposed.sql.ReferenceOption
import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.javatime.CurrentDateTime
import org.jetbrains.exposed.sql.javatime.datetime

object PostLikesTable: Table(name = "post_likes"){
    val likeId = long(name = "like_id").autoIncrement()
    val postId = long(name = "postId").references(ref = PostsTable.postId, onDelete = ReferenceOption.CASCADE)
    val userId = long(name = "userId").references(ref = UserTable.userId, onDelete = ReferenceOption.CASCADE)
    val likeDate = datetime(name = "like_date").defaultExpression(defaultValue = CurrentDateTime)
}