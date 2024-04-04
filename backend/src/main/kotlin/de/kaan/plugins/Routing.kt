package de.kaan.plugins

import de.kaan.dao.*
import de.kaan.models.*
import io.ktor.http.*
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
                val userId = UserDao.addUser(user)
                call.respondText("User added successfully with ID: $userId", status = HttpStatusCode.Created)
            }

            put("/updateUser/{id}") {
                val id = call.parameters["userId"]?.toIntOrNull() ?: return@put call.respond("Invalid user ID")
                val user = call.receive<User>()
                UserDao.updateUser(id, user)
                call.respond("User updated successfully")
            }

            delete("/{id}") {
                val id = call.parameters["id"]?.toIntOrNull() ?: return@delete call.respond("Invalid user ID")
                val deleted = UserDao.deleteUser(id)
                if (deleted) {
                    call.respond("User deleted successfully")
                } else {
                    call.respond("User not found")
                }
            }

        }

        route("/posts") {
            get("/allPosts") {
                val posts = PostDao.allPosts()
                call.respond(posts)
            }

            post("/add") {
                val post = call.receive<Post>()
                val postId = PostDao.addPost(post)
                call.respondText("Post added successfully with ID: $postId", status = HttpStatusCode.Created)
            }

            put("/updatePost/{id}") {
                val id = call.parameters["postId"]?.toIntOrNull() ?: return@put call.respond("Invalid post ID")
                val post = call.receive<Post>()
                PostDao.updatePost(id, post)
                call.respond("Post updated successfully")
            }

            delete("/{id}") {
                val id = call.parameters["id"]?.toIntOrNull() ?: return@delete call.respond("Invalid post ID")
                val deleted = PostDao.deletePost(id)
                if (deleted) {
                    call.respond("Post deleted successfully")
                } else {
                    call.respond("Post not found")
                }
            }


        }
    }
}
