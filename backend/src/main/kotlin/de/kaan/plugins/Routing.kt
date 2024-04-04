package de.kaan.plugins

import de.kaan.dao.*
import de.kaan.models.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*



fun Application.configureRouting() {
    routing {
        route("/users") {
            get("/allUsers") {
                val users = UserDao.allUsers()
                call.respond(users)
            }

            post("/add") {
                val user = call.receive<User>()
                UserDao.addUser(user)
                call.respond("User added successfully")
            }

            get("/{id}") {
                val id = call.parameters["id"]?.toIntOrNull() ?: return@get call.respond("Invalid user ID")
                val user = call.receive<User>()
                UserDao.updateUser(id, user)
                call.respond("User updated successfully")
            }

            /*
            delete("/{id}") {
                val id = call.parameters["id"]?.toIntOrNull() ?: return@delete call.respondBadRequest("Invalid user ID")
                UserDao.deleteUser(id)
                call.respond("User deleted successfully")
            }

             */
        }

        route("/posts") {
            get("/allPosts") {
                val posts = PostDao.allPosts()
                call.respond(posts)
            }

            post("/add") {
                val post = call.receive<Post>()
                PostDao.addPost(post)
                call.respond("Post added successfully")
            }

            get("/{id}") {
                val id = call.parameters["id"]?.toIntOrNull() ?: return@get call.respond("Invalid post ID")
                val post = call.receive<Post>()
                PostDao.updatePost(id, post)
                call.respond("Post updated successfully")
            }

            /*
            delete("/{id}") {
                val id = call.parameters["id"]?.toIntOrNull() ?: return@delete call.respondBadRequest("Invalid post ID")
                PostDao.deletePost(id)
                call.respond("Post deleted successfully")
            }

             */
        }
    }
}