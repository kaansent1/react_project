package de.kaan.route

import de.kaan.models.ProfileResponse
import de.kaan.models.UpdateUserParams
import de.kaan.repository.profile.ProfileRepository
import de.kaan.utils.getLongParameter
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.http.content.*
import io.ktor.server.plugins.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.koin.ktor.ext.inject
import java.io.File


fun Routing.profileRouting() {
    val repository by inject<ProfileRepository>()

    route(path = "/profile") {
        staticFiles("/static", File("/assets"))

        get(path = "/{userId}") {
            try {
                val profileOwnerId = call.getLongParameter(name = "userId")
                val currentUserId = call.getLongParameter(name = "currentUserId", isQueryParameter = true)

                val result = repository.getUserById(userId = profileOwnerId, currentUserId = currentUserId)
                call.respond(status = result.code, message = result.data)
            } catch (badRequestError: BadRequestException) {
                return@get
            } catch (anyError: Throwable) {
                call.respond(
                    status = HttpStatusCode.InternalServerError,
                    message = ProfileResponse(
                        success = false,
                        message = "Unexpected error"
                    )
                )
            }
        }

        put(path = "/{userId}") {
            try {
                val userId = call.getLongParameter(name = "userId")
                val params = call.receive<UpdateUserParams>()

                val result = repository.updateUser(params.copy(userId = userId))

                call.respond(status = result.code, message = result.data)
            } catch (badRequestError: BadRequestException) {
                return@put
            } catch (anyError: Throwable) {
                call.respond(
                    status = HttpStatusCode.InternalServerError,
                    message = ProfileResponse(
                        success = false,
                        message = "Unexpected error"
                    )
                )
            }
        }

        delete(path = "/{userId}") {
            try {
                val userId = call.getLongParameter(name = "userId")
                val result = repository.deleteUser(userId = userId)
                call.respond(
                    status = result.code,
                    message = result.data
                )
            } catch (badRequestError: BadRequestException) {
                return@delete
            } catch (anyError: Throwable) {
                call.respond(
                    status = HttpStatusCode.InternalServerError,
                    message = ProfileResponse(
                        success = false,
                        message = "Unexpected error"
                    )
                )
            }
        }
    }
}
