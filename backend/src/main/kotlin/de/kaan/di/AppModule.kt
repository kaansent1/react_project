package de.kaan.di

import de.kaan.dao.follows.FollowsDao
import de.kaan.dao.follows.FollowsDaoImpl
import de.kaan.dao.post.PostDao
import de.kaan.dao.post.PostDaoImpl
import de.kaan.dao.post_likes.PostLikesDao
import de.kaan.dao.post_likes.PostLikesDaoImpl
import de.kaan.dao.user.UserDao
import de.kaan.dao.user.UserDaoImpl
import de.kaan.repository.auth.AuthRepository
import de.kaan.repository.auth.AuthRepositoryImpl
import de.kaan.repository.follows.FollowsRepository
import de.kaan.repository.follows.FollowsRepositoryImpl
import de.kaan.repository.post.PostRepository
import de.kaan.repository.post.PostRepositoryImpl
import de.kaan.repository.post_likes.PostLikesRepository
import de.kaan.repository.post_likes.PostLikesRepositoryImpl
import de.kaan.repository.profile.ProfileRepository
import de.kaan.repository.profile.ProfileRepositoryImpl
import org.koin.dsl.module

val appModule = module {
    single<AuthRepository> { AuthRepositoryImpl(get()) }
    single<UserDao> { UserDaoImpl() }
    single<PostDao> { PostDaoImpl() }
    single<PostRepository> { PostRepositoryImpl(get(), get(), get()) }
    single<ProfileRepository> { ProfileRepositoryImpl(get(), get()) }
    single<PostLikesDao> { PostLikesDaoImpl() }
    single<PostLikesRepository> { PostLikesRepositoryImpl(get(), get()) }
    single<FollowsDao> { FollowsDaoImpl() }
    single<FollowsRepository> { FollowsRepositoryImpl(get(), get())}
}