package de.kaan.route

import de.kaan.models.ProfileResponse
import de.kaan.models.UpdateUserParams
import de.kaan.models.UsersResponse
import de.kaan.repository.profile.ProfileRepository
import de.kaan.utils.Constants
import de.kaan.utils.getLongParameter
import de.kaan.utils.saveFile
import io.ktor.http.*
import io.ktor.http.content.*
import io.ktor.server.application.*
import io.ktor.server.http.content.*
import io.ktor.server.plugins.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.json.Json
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
                        message = "Fehlgeschlagen"
                    )
                )
            }
        }

        put(path = "/update") {
            var fileName = ""
            var updateUserParams: UpdateUserParams? = null
            val multiPartData = call.receiveMultipart()

            try {
                multiPartData.forEachPart { partData ->
                    when (partData) {
                        is PartData.FileItem -> {
                            fileName = partData.saveFile(folderPath = Constants.PROFILE_IMAGES_FOLDER_PATH)
                        }

                        is PartData.FormItem -> {
                            if (partData.name == "profile_data") {
                                updateUserParams = Json.decodeFromString(partData.value)
                            }
                        }

                        else -> {}
                    }
                    partData.dispose()
                }

                val imageUrl = "http://192.168.1.125:8080/static/profile_images/$fileName"

                val result = repository.updateUser(imageUrl, updateUserParams!!)
                call.respond(status = result.code, message = result.data)
            } catch (anyError: Throwable) {
                if (fileName.isNotEmpty()) {
                    File("${Constants.PROFILE_IMAGES_FOLDER_PATH}/$fileName").delete()
                }
                call.respond(
                    status = HttpStatusCode.InternalServerError,
                    message = ProfileResponse(
                        success = false,
                        message = "Fehlgeschlagen"
                    )
                )
            }
        }

        get(path = "/all") {
            try {
                val result = repository.getAllUsers()
                call.respond(
                    status = result.code,
                    message = result.data
                )
            } catch (anyError: Throwable) {
                call.respond(
                    status = HttpStatusCode.InternalServerError,
                    message = UsersResponse(
                        success = false,
                        message = "Fehlgeschlagen"
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
                        message = "Fehlgeschlagen"
                    )
                )
            }
        }
    }
}
