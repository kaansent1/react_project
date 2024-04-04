package de.kaan

import io.github.smiley4.ktorswaggerui.SwaggerUI
import de.kaan.plugins.*
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*

fun main() {
    embeddedServer(Netty, port = 8080, host = "0.0.0.0", module = Application::module)
        .start(wait = true)
}

fun Application.module() {
    DatabaseInitializer.init()
    configureSecurity()
    configureHTTP()
    configureSerialization()
    configureRouting()
    install(SwaggerUI) {
        swagger {
            swaggerUrl = "swagger-ui"
            forwardRoot = true
        }
        info {
            title = "Social-React Api"
            version = "latest"
            description = "API zur Verwaltung von Posts und Usern"
        }
        server {
            url = "http://localhost:8080"
            description = "Kaans Server"
        }
    }
}


