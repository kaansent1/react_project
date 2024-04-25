package de.kaan.route

import de.kaan.models.FollowAndUnfollowResponse
import de.kaan.models.FollowsParams
import de.kaan.repository.follows.FollowsRepository
import de.kaan.utils.getLongParameter
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.plugins.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.koin.ktor.ext.inject

fun Routing.followsRouting() {
    val repository by inject<FollowsRepository>()

    route(path = "/follows") {
        post(path = "/follow") {
            try {
                val params = call.receiveNullable<FollowsParams>()

                if (params == null) {
                    call.respond(
                        status = HttpStatusCode.BadRequest,
                        message = FollowAndUnfollowResponse(
                            success = false,
                            message = "missing parameters"
                        )
                    )
                    return@post
                }

                val result = repository.followUser(follower = params.follower, following = params.following)

                call.respond(
                    status = result.code,
                    message = result.data
                )
            } catch (anyError: Throwable) {
                call.respond(
                    status = HttpStatusCode.InternalServerError,
                    message = FollowAndUnfollowResponse(
                        success = false,
                        message = "unexpected error"
                    )
                )
            }
        }

        post(path = "/unfollow") {
            try {
                val params = call.receiveNullable<FollowsParams>()
                if (params == null) {
                    call.respond(
                        status = HttpStatusCode.BadRequest,
                        message = FollowAndUnfollowResponse(
                            success = false,
                            message = "missing parameters"
                        )
                    )
                    return@post
                }

                val result = repository.unfollowUser(follower = params.follower, following = params.following)
                call.respond(
                    status = result.code,
                    message = result.data
                )
            } catch (anyError: Throwable) {
                call.respond(
                    status = HttpStatusCode.InternalServerError,
                    message = "unexpected error"
                )
            }
        }

        get(path = "/followers") {
            try {
                val userId = call.getLongParameter(name = "userId", isQueryParameter = true)

                val result = repository.getFollowers(userId = userId)
                call.respond(
                    status = result.code,
                    message = result.data
                )

            } catch (badRequestError: BadRequestException) {
                call.respond(
                    status = HttpStatusCode.BadRequest,
                    message = "missing parameters"
                )
            } catch (anyError: Throwable) {
                call.respond(
                    status = HttpStatusCode.InternalServerError,
                    message = "unexpected error"
                )
            }
        }

        get(path = "/following") {
            try {
                val userId = call.getLongParameter(name = "userId", isQueryParameter = true)

                val result = repository.getFollowing(userId = userId)
                call.respond(
                    status = result.code,
                    message = result.data
                )
            } catch (badRequestException: BadRequestException) {
                call.respond(
                    status = HttpStatusCode.BadRequest,
                    message = "missing parameters"
                )
            } catch (anyError: Throwable) {
                call.respond(
                    status = HttpStatusCode.InternalServerError,
                    message = "unexpected error"
                )
            }
        }
    }
}