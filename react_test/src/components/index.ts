import {faker} from "@faker-js/faker/locale/de"

export interface User {
    id: string
    firstname: string
    lastname: string
    username: string
    email: string
    birthdate: Date
    avatarUrl?: string
}

export function getUsers(count: number = 10): User[] {
    return Array.from({length: count}, () => getUser())
}

export function getUser(): User {
    const firstname = faker.person.firstName()
    const lastname = faker.person.lastName()
    return {
        id: faker.string.numeric(4),
        firstname,
        lastname,
        username: faker.internet.userName(firstname, lastname),
        email: faker.internet.email(firstname, lastname),
        birthdate: faker.date.birthdate({min: 18, max: 30, mode: "age"}),
        avatarUrl: faker.image.avatar(),
    }

}