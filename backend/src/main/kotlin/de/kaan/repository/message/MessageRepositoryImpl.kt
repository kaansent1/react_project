package de.kaan.repository.message

import de.kaan.dao.message.MessageDao
import de.kaan.dao.message.MessageRow
import de.kaan.dao.message.MessageTable
import de.kaan.models.Message
import de.kaan.models.MessageResponse
import de.kaan.models.MessagesResponse
import de.kaan.utils.dbQuery
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.selectAll

class MessageRepositoryImpl(private val messageDao: MessageDao) : MessageRepository {
    override suspend fun createMessage(senderId: Long, receiverId: Long, content: String): MessageResponse {
        val messageRow = messageDao.createMessage(senderId, receiverId, content)
        return if (messageRow != null) {
            MessageResponse(success = true, message = messageRow.toMessage())
        } else {
            MessageResponse(success = false, errorMessage = "Failed to create message.")
        }
    }

    override suspend fun getUserMessages(loggedUserId: Long, recipientId: Long): MessagesResponse {
        val messages = messageDao.getUserMessages(loggedUserId, recipientId)
        return MessagesResponse(success = true, messages = messages.map { it.toMessage() })
    }

    override suspend fun saveMessage(body: String): Unit = dbQuery {
        MessageTable.insert { it[MessageTable.content] = body }
    }

    override suspend fun getMessages(): List<String> = dbQuery {
        MessageTable.selectAll().map { it[MessageTable.content] }
    }

    private fun MessageRow.toMessage(): Message {
        return Message(
            id = this.id,
            senderId = this.senderId,
            receiverId = this.receiverId,
            content = this.content,
            createdAt = this.createdAt
        )
    }
}