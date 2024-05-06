package de.kaan.dao.message

import de.kaan.utils.dbQuery
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.ResultRow
import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.sql.or
import org.jetbrains.exposed.sql.select
import org.jetbrains.exposed.sql.transactions.transaction
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

class MessageDaoImpl : MessageDao {

    private val dateFormatter = DateTimeFormatter.ofPattern("HH:mm dd.MM.yyyy")

    private fun formatDate(dateTime: LocalDateTime): String {
        return dateTime.format(dateFormatter)
    }

    override suspend fun createMessage(senderId: Long, receiverId: Long, content: String): MessageRow? {
        return dbQuery {
            val insertStatement = MessageTable.insert {
                it[MessageTable.senderId] = senderId
                it[MessageTable.receiverId] = receiverId
                it[MessageTable.content] = content
            }

            insertStatement.resultedValues?.singleOrNull()?.let {
                rowToMessage(it)
            }
        }
    }

    override suspend fun getUserMessages(loggedUserId: Long, recipientId: Long): List<MessageRow> {
        return dbQuery {
            transaction {
                val messages = MessageTable.select {
                    ((MessageTable.senderId eq loggedUserId) and (MessageTable.receiverId eq recipientId)) or
                            ((MessageTable.senderId eq recipientId) and (MessageTable.receiverId eq loggedUserId))
                }.map { rowToMessage(it) }

                messages
            }
        }
    }

    private fun rowToMessage(row: ResultRow): MessageRow {
        return MessageRow(
            id = row[MessageTable.id],
            senderId = row[MessageTable.senderId],
            receiverId = row[MessageTable.receiverId],
            content = row[MessageTable.content],
            createdAt = formatDate(row[MessageTable.createdAt]),
        )
    }
}
