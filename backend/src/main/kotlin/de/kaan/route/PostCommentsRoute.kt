package de.kaan.route

import de.kaan.models.CommentResponse
import de.kaan.models.GetCommentsResponse
import de.kaan.models.NewCommentParams
import de.kaan.models.RemoveCommentParams
import de.kaan.repository.post_comments.PostCommentsRepository
import de.kaan.utils.getLongParameter
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.koin.ktor.ext.inject

fun Routing.postCommentsRouting() {
    val repository by inject<PostCommentsRepository>()

    route(path = "/post/comments") {

        post(path = "/create") {
            try {
                val params = call.receiveNullable<NewCommentParams>()

                if (params == null) {
                    call.respond(
                        status = HttpStatusCode.BadRequest,
                        message = CommentResponse(
                            success = false,
                            message = "Parameter ungültig"
                        )
                    )
                    return@post
                }

                val result = repository.addComment(params = params)
                call.respond(status = result.code, message = result.data)
            } catch (anyError: Throwable) {
                call.respond(
                    status = HttpStatusCode.InternalServerError,
                    message = CommentResponse(
                        success = false,
                        message = "Fehlgeschlagen"
                    )
                )
                return@post
            }
        }

        delete(path = "/delete") {
            try {
                val params = call.receiveNullable<RemoveCommentParams>()
                if (params == null) {
                    call.respond(
                        status = HttpStatusCode.BadRequest,
                        message = CommentResponse(
                            success = false,
                            message = "Parameter ungültig"
                        )
                    )
                    return@delete
                }

                val result = repository.removeComment(params = params)
                call.respond(status = result.code, message = result.data)
            } catch (error: Throwable) {
                call.respond(
                    status = HttpStatusCode.InternalServerError,
                    message = CommentResponse(
                        success = false,
                        message = "Fehlgeschlagen"
                    )
                )
                return@delete
            }
        }

        get(path = "/{postId}") {
            try {
                val postId = call.getLongParameter(name = "postId")

                val result = repository.getPostComments(postId = postId)
                call.respond(status = result.code, message = result.data)
            } catch (anyError: Throwable) {
                call.respond(
                    status = HttpStatusCode.InternalServerError,
                    message = GetCommentsResponse(
                        success = false,
                        message = "Fehlgeschlagen"
                    )
                )
                return@get
            }
        }
    }
}