package de.kaan.utils

import de.mkammerer.snowflakeid.SnowflakeIdGenerator

private val generatorId = System.getenv("id.generator") ?: "1"

object IdGenerator {
    fun generateId(): Long {
        val generatorIdInt = generatorId.toIntOrNull() ?: 1
        return SnowflakeIdGenerator.createDefault(generatorIdInt).next()
    }
}
