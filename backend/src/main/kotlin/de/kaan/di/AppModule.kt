package de.kaan.di

import de.kaan.dao.follows.FollowsDao
import de.kaan.dao.follows.FollowsDaoImpl
import de.kaan.dao.message.MessageDao
import de.kaan.dao.message.MessageDaoImpl
import de.kaan.dao.post.PostDao
import de.kaan.dao.post.PostDaoImpl
import de.kaan.dao.post_comments.PostCommentsDao
import de.kaan.dao.post_comments.PostCommentsDaoImpl
import de.kaan.dao.post_likes.PostLikesDao
import de.kaan.dao.post_likes.PostLikesDaoImpl
import de.kaan.dao.user.UserDao
import de.kaan.dao.user.UserDaoImpl
import de.kaan.repository.auth.AuthRepository
import de.kaan.repository.auth.AuthRepositoryImpl
import de.kaan.repository.follows.FollowsRepository
import de.kaan.repository.follows.FollowsRepositoryImpl
import de.kaan.repository.message.MessageRepository
import de.kaan.repository.message.MessageRepositoryImpl
import de.kaan.repository.post.PostRepository
import de.kaan.repository.post.PostRepositoryImpl
import de.kaan.repository.post_comments.PostCommentsRepository
import de.kaan.repository.post_comments.PostCommentsRepositoryImpl
import de.kaan.repository.post_likes.PostLikesRepository
import de.kaan.repository.post_likes.PostLikesRepositoryImpl
import de.kaan.repository.profile.UserRepository
import de.kaan.repository.profile.UserRepositoryImpl
import org.koin.dsl.module

val appModule = module {
    single<AuthRepository> { AuthRepositoryImpl(get()) }
    single<UserDao> { UserDaoImpl() }
    single<PostDao> { PostDaoImpl() }
    single<PostRepository> { PostRepositoryImpl(get(), get(), get()) }
    single<UserRepository> { UserRepositoryImpl(get(), get()) }
    single<PostLikesDao> { PostLikesDaoImpl() }
    single<PostLikesRepository> { PostLikesRepositoryImpl(get(), get()) }
    single<FollowsDao> { FollowsDaoImpl() }
    single<FollowsRepository> { FollowsRepositoryImpl(get(), get()) }
    single<MessageDao> { MessageDaoImpl() }
    single<MessageRepository> { MessageRepositoryImpl(get()) }
    single<PostCommentsDao> { PostCommentsDaoImpl() }
    single<PostCommentsRepository> { PostCommentsRepositoryImpl(get(), get()) }

}