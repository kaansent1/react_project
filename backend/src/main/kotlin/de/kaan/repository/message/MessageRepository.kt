package de.kaan.repository.message

import de.kaan.models.MessageResponse
import de.kaan.models.MessagesResponse

interface MessageRepository {
        suspend fun createMessage(senderId: Long, receiverId: Long, content: String): MessageResponse

        suspend fun getUserMessages(loggedUserId: Long, recipientId: Long): MessagesResponse

        suspend fun saveMessage(body: String)

        suspend fun getMessages(): List<String>
}
