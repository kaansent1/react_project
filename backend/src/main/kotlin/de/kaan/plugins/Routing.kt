package de.kaan.plugins

import de.kaan.route.authRouting
import de.kaan.route.postLikesRouting
import de.kaan.route.postRouting
import de.kaan.route.profileRouting
import io.ktor.server.application.*
import io.ktor.server.http.content.*
import io.ktor.server.routing.*
import java.io.File

fun Application.configureRouting() {
    routing {
        authRouting()
        postRouting()
        postLikesRouting()
        profileRouting()
        staticFiles("/static", File("/home/kaans/react_project/backend/src/main/kotlin/de/kaan/assets"))
    }
}