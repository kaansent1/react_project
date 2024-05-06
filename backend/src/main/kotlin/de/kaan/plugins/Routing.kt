package de.kaan.plugins

import de.kaan.route.*
import io.ktor.server.application.*
import io.ktor.server.http.content.*
import io.ktor.server.routing.*
import java.io.File

fun Application.configureRouting() {
    routing {
        authRouting()
        postRouting()
        followsRouting()
        messageRouting()
        postLikesRouting()
        profileRouting()
        staticFiles("/static", File("/home/kaans/react_project/backend/src/main/kotlin/de/kaan/assets"))
    }
}