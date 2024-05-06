package de.kaan.route

import de.kaan.models.MessageTextParams
import de.kaan.repository.message.MessageRepository
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.koin.ktor.ext.inject

fun Routing.messageRouting() {
    val repository by inject<MessageRepository>()

    route("/messages") {
        post("/send") {
            try {
                val params = call.receive<MessageTextParams>()
                val senderId = params.senderId
                val receiverId = params.receiverId
                val content = params.content

                val response = repository.createMessage(senderId, receiverId, content)

                if (response.success) {
                    call.respond(response.message ?: "Message sent successfully.")
                } else {
                    call.respond(HttpStatusCode.InternalServerError, response.errorMessage ?: "Failed to send message.")
                }
            } catch (e: Exception) {
                call.respond(HttpStatusCode.BadRequest, "Invalid message parameters.")
            }
        }

        get("/get") {
            try {
                val loggedUserId = call.parameters["loggedUserId"]?.toLongOrNull()
                val recipientId = call.parameters["recipientId"]?.toLongOrNull()

                if (loggedUserId == null || recipientId == null) {
                    call.respond(HttpStatusCode.BadRequest, "Invalid user IDs.")
                    return@get
                }

                val response = repository.getUserMessages(loggedUserId, recipientId)

                if (response.success) {
                    call.respond(response.messages)
                } else {
                    call.respond(HttpStatusCode.InternalServerError, response.errorMessage ?: "Failed to retrieve messages.")
                }
            } catch (e: Exception) {
                call.respond(HttpStatusCode.InternalServerError, "Failed to retrieve messages.")
            }
        }
    }
}
