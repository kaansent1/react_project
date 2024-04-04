import de.kaan.models.Posts
import de.kaan.models.Users
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
            SchemaUtils.create(Users, Posts)
        }
    }

}