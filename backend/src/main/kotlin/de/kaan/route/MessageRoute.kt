package de.kaan.route

import de.kaan.models.MessageTextParams
import de.kaan.repository.message.MessageRepository
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.websocket.*
import io.ktor.websocket.*
import kotlinx.coroutines.channels.ClosedReceiveChannelException
import kotlinx.serialization.Serializable
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import org.koin.ktor.ext.inject

@Serializable
data class Message(
    val message: String
)

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
                    call.respond(
                        HttpStatusCode.InternalServerError,
                        response.errorMessage ?: "Failed to retrieve messages."
                    )
                }
            } catch (e: Exception) {
                call.respond(HttpStatusCode.InternalServerError, "Failed to retrieve messages.")
            }
        }

        webSocket("/chat") {
            try {
                val user = call.principal<UserIdPrincipal>()
                if (user != null) {
                    val greetingMessage = Message("Willkommen im Chat, ${user.name}!")
                    val jsonGreetingMessage = Json.encodeToString(greetingMessage)
                    outgoing.send(Frame.Text(jsonGreetingMessage))

                    for (frame in incoming) {
                        if (frame is Frame.Text) {
                            val message = frame.readText()
                            val userMessage = "${user.name}: $message" // Benutzername vor der Nachricht
                            val jsonMessage = Json.encodeToString(Message(userMessage))
                            outgoing.send(Frame.Text(jsonMessage))
                        }
                    }
                } else {
                    outgoing.send(Frame.Text("Unauthorized"))
                }
            } catch (e: ClosedReceiveChannelException) {
                println("WebSocket connection closed")
            } catch (e: Exception) {
                println("Error in WebSocket communication: ${e.message}")
            }
        }
    }
}