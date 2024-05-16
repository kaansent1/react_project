import de.kaan.dao.follows.FollowsTable
import de.kaan.dao.message.MessageTable
import de.kaan.dao.post.PostsTable
import de.kaan.dao.post_comments.PostCommentsTable
import de.kaan.dao.post_likes.PostLikesTable
import de.kaan.dao.user.UserTable
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.transaction

object DatabaseInitializer {
    fun init() {
        val jdbcURL = "jdbc:postgresql://localhost:8000/postgres"
        val username = "myusername"
        val password = "password"
        val database = Database.connect(jdbcURL, "org.postgresql.Driver", user = username, password = password)

        transaction(database) {
            SchemaUtils.create(UserTable, PostsTable, PostLikesTable, PostCommentsTable, FollowsTable, MessageTable)
        }
    }

}