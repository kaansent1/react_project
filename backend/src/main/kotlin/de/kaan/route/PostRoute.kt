package de.kaan.route

import de.kaan.models.PostResponse
import de.kaan.models.PostTextParams
import de.kaan.models.PostsResponse
import de.kaan.repository.post.PostRepository
import de.kaan.utils.Constants
import de.kaan.utils.getLongParameter
import de.kaan.utils.saveFile
import io.ktor.http.*
import io.ktor.http.content.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.plugins.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.json.Json
import org.koin.ktor.ext.inject
import java.io.File

fun Routing.postRouting() {
    val postRepository by inject<PostRepository>()

    route(path = "/post") {
        post(path = "/create") {
            var fileName = ""
            var postTextParams: PostTextParams? = null
            val multiPartData = call.receiveMultipart()

            multiPartData.forEachPart { partData ->
                when (partData) {
                    is PartData.FileItem -> {
                        fileName = partData.saveFile(folderPath = Constants.POST_IMAGES_FOLDER_PATH)
                    }

                    is PartData.FormItem -> {
                        if (partData.name == "post_data") {
                            postTextParams = Json.decodeFromString(partData.value)
                        }
                    }

                    else -> {}
                }
                partData.dispose()
            }

            val imageUrl = "${Constants.BASE_URL}${Constants.POST_IMAGES_FOLDER}$fileName"

            if (postTextParams == null) {
                File("${Constants.POST_IMAGES_FOLDER_PATH}/$fileName").delete()

                call.respond(
                    status = HttpStatusCode.BadRequest,
                    message = PostResponse(
                        success = false,
                        message = "Could not parse post data"
                    )
                )
            } else {
                val result = postRepository.createPost(imageUrl, postTextParams!!)
                call.respond(result.code, message = result.data)
            }
        }

        get(path = "/{postId}") {
            try {
                val postId = call.getLongParameter(name = "postId")
                val currentUserId = call.getLongParameter(name = "currentUserId", isQueryParameter = true)

                val result = postRepository.getPost(postId = postId, currentUserId = currentUserId)
                call.respond(status = result.code, message = result.data)
            } catch (badRequestError: BadRequestException) {
                return@get
            } catch (anyError: Throwable) {
                call.respond(
                    status = HttpStatusCode.InternalServerError,
                    message = PostResponse(
                        success = false,
                        message = "Unexpected error"
                    )
                )
            }
        }

        delete(path = "/{postId}") {
            try {
                val postId = call.getLongParameter(name = "postId")
                val result = postRepository.deletePost(postId = postId)
                call.respond(
                    status = result.code,
                    message = result.data
                )
            } catch (badRequestError: BadRequestException) {
                return@delete
            } catch (anyError: Throwable) {
                call.respond(
                    status = HttpStatusCode.InternalServerError,
                    message = PostResponse(
                        success = false,
                        message = "Unexpected error"                    )
                )
            }
        }
    }

    route(path = "/posts") {
        get(path = "/{userId}") {
            try {
                val postsOwnerId = call.getLongParameter(name = "userId")
                val currentUserId = call.getLongParameter(name = "currentUserId", isQueryParameter = true)


                val result = postRepository.getPostsByUser(
                    postsOwnerId = postsOwnerId,
                    currentUserId = currentUserId,

                    )
                call.respond(
                    status = result.code,
                    message = result.data
                )
            } catch (badRequestError: BadRequestException) {
                return@get
            } catch (anyError: Throwable) {
                call.respond(
                    status = HttpStatusCode.InternalServerError,
                    message = PostsResponse(
                        success = false,
                        message = "Unexpected error"                    )
                )
            }
        }

        get(path = "/all") {
            try {
                val result = postRepository.getAllPosts()
                call.respond(
                    status = result.code,
                    message = result.data
                )
            } catch (anyError: Throwable) {
                call.respond(
                    status = HttpStatusCode.InternalServerError,
                    message = PostsResponse(
                        success = false,
                        message = "Unexpected error"
                    )
                )
            }
        }
    }
}
