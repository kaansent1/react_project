package de.kaan.repository.auth

import de.kaan.dao.user.UserDao
import de.kaan.models.AuthResponse
import de.kaan.models.AuthResponseData
import de.kaan.models.LoginCredentials
import de.kaan.models.RegisterCredentials
import de.kaan.utils.Response
import io.ktor.http.*
import org.mindrot.jbcrypt.BCrypt

class AuthRepositoryImpl(
    private val userDao: UserDao
) : AuthRepository {

    override suspend fun register(params: RegisterCredentials): Response<AuthResponse> {
        return if (userAlreadyExist(params.username)) {
            Response.Error(
                code = HttpStatusCode.Conflict,
                data = AuthResponse(
                    errorMessage = "A user with this username already exists!"
                )
            )
        } else {
            val insertedUser = userDao.insert(params)

            if (insertedUser == null) {
                Response.Error(
                    code = HttpStatusCode.InternalServerError,
                    data = AuthResponse(
                        errorMessage = "Could not register the user"
                    )
                )
            } else {
                Response.Success(
                    data = AuthResponse(
                        data = AuthResponseData(
                            userId = insertedUser.userId,
                            username = insertedUser.username,
                            email = insertedUser.email
                        )
                    )
                )
            }
        }
    }

    override suspend fun login(params: LoginCredentials): Response<AuthResponse> {
        val user = userDao.findByUsername(params.username)

        return if (user == null) {
            Response.Error(
                code = HttpStatusCode.NotFound,
                data = AuthResponse(
                    errorMessage = "Invalid credentials, no user with this username!"
                )
            )
        } else {

            if (BCrypt.checkpw(params.password, user.password)) {
                Response.Success(
                    data = AuthResponse(
                        data = AuthResponseData(
                            userId = user.userId,
                            username = user.username,
                            email = user.email,
                        )
                    )
                )
            } else {
                Response.Error(
                    code = HttpStatusCode.Forbidden,
                    data = AuthResponse(
                        errorMessage = "Invalid credentials, wrong password!"
                    )
                )
            }
        }
    }

    private suspend fun userAlreadyExist(username: String): Boolean {
        return userDao.findByUsername(username) != null
    }
}