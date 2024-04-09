package de.kaan.plugins

import de.kaan.route.authRouting
import de.kaan.route.postRouting
import de.kaan.route.profileRouting
import io.ktor.server.application.*
import io.ktor.server.http.content.*
import io.ktor.server.routing.*

fun Application.configureRouting() {
    routing {
        authRouting()
        postRouting()
        profileRouting()
        static {
            resources("static")
        }
    }
}