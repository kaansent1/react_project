package de.kaan.models

import kotlinx.serialization.Serializable

@Serializable
data class MessageTextParams(
    val senderId: Long,
    val receiverId: Long,
    val content: String
)

@Serializable
data class Message(
    val id: Long,
    val senderId: Long,
    val receiverId: Long,
    val content: String,
    val createdAt: String
)

@Serializable
data class MessageResponse(
    val success: Boolean,
    val message: Message? = null,
    val errorMessage: String? = null
)

@Serializable
data class MessagesResponse(
    val success: Boolean,
    val messages: List<Message> = listOf(),
    val errorMessage: String? = null
)
