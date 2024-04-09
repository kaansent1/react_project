package de.kaan.route

import de.kaan.models.AuthResponse
import de.kaan.models.LoginCredentials
import de.kaan.models.RegisterCredentials
import de.kaan.repository.auth.AuthRepository
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.koin.ktor.ext.inject


fun Routing.authRouting(){
    val repository by inject<AuthRepository>()

    route(path = "/register"){
        post {

            val params = call.receiveNullable<RegisterCredentials>()

            if (params == null){
                call.respond(
                    status = HttpStatusCode.BadRequest,
                    message = AuthResponse(
                        errorMessage = "Invalid credentials!"
                    )
                )

                return@post
            }

            val result = repository.register(params = params)
            call.respond(
                status = result.code,
                message = result.data
            )

        }
    }

    route(path = "/login"){
        post {

            val params = call.receiveNullable<LoginCredentials>()

            if (params == null){
                call.respond(
                    status = HttpStatusCode.BadRequest,
                    message = AuthResponse(
                        errorMessage = "Invalid credentials!"
                    )
                )

                return@post
            }

            val result = repository.login(params = params)
            call.respond(
                status = result.code,
                message = result.data
            )
        }
    }

}