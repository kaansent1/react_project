package de.kaan.route

import de.kaan.models.LikeParams
import de.kaan.models.LikeResponse
import de.kaan.repository.post_likes.PostLikesRepository
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.koin.ktor.ext.inject

fun Routing.postLikesRouting() {
    val repository by inject<PostLikesRepository>()

    route(path = "post/likes") {
        post(path = "/add") {
            try {
                val params = call.receiveNullable<LikeParams>()
                if (params == null) {
                    call.respond(
                        status = HttpStatusCode.BadRequest,
                        message = LikeResponse(
                            success = false,
                            message = "Parameter nicht gültig"
                        )
                    )
                    return@post
                }

                val result = repository.addLike(params = params)
                call.respond(status = result.code, message = result.data)
            } catch (error: Throwable) {
                call.respond(
                    status = HttpStatusCode.InternalServerError,
                    message = LikeResponse(
                        success = false,
                        message = "Fehlgeschlagen"
                    )
                )
            }
        }

        delete(path = "/remove") {
            try {
                val params = call.receiveNullable<LikeParams>()
                if (params == null) {
                    call.respond(
                        status = HttpStatusCode.BadRequest,
                        message = LikeResponse(
                            success = false,
                            message = "Parameter nicht gültig"
                        )
                    )
                    return@delete
                }

                val result = repository.removeLike(params = params)
                call.respond(status = result.code, message = result.data)
            } catch (error: Throwable) {
                call.respond(
                    status = HttpStatusCode.InternalServerError,
                    message = LikeResponse(
                        success = false,
                        message = "Fehlgeschlagen"
                    )
                )
            }
        }
    }
}