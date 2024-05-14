package de.kaan.dao.message

interface MessageDao {
    suspend fun createMessage(senderId: Long, receiverId: Long, content: String): MessageRow?

    suspend fun getUserMessages(loggedUserId: Long, recipientId: Long): List<MessageRow>

}