package de.kaan.dao.message

import io.ktor.http.*

interface MessageDao {
    suspend fun createMessage(senderId: Long, receiverId: Long, content: String): MessageRow?

    suspend fun getUserMessages(loggedUserId: Long, recipientId: Long): List<MessageRow>

}