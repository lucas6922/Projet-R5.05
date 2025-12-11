import { db } from './database.js'
import { tAppRole, tUser, tCollection, tFlashCard, tLevel, tRevision } from './schema.js'
import { faker } from '@faker-js/faker'
import bcrypt from 'bcrypt'

async function seed(){
    console.log('Seeding database...');

    await db.delete(tFlashCard);
    await db.delete(tCollection);
    await db.delete(tUser);
    await db.delete(tAppRole);
    await db.delete(tLevel);

    await seedRole();
    await seedUser();
    await seedLevel();
    await seedCollection();
    await seedCard();

    console.log("Database has been seed");
}

async function seedUser(){
    const users = [];
    
    for (let i = 0; i < 3; i++){
        const password = await bcrypt.hash(faker.internet.password(), 12);
        const user = {
            userName: faker.person.fullName(),
            userFirstname: faker.person.firstName(),
            userMail: faker.internet.email(),
            userPass: password,
            userStatus: "PENDING",
            aproId: 1
        };
        users.push(user);
    }

    const fixedUser = {
        userName: "toto",
        userFirstname: "toto",
        userMail: "toto@example.com",
        userPass: await bcrypt.hash("12345", 12),
        userStatus: "VALIDATED",
        aproId: 2
    };
    
    console.log("fixed user : ", fixedUser);
    console.log("password: 12345")
    users.push(fixedUser);

    await db.insert(tUser).values(users);
}

async function seedRole(){
    const appRole = [{aproId: 1, aproLabel: "USER"}, {aproId: 2, aproLabel: "ADMIN"}];
    await db.insert(tAppRole).values(appRole);
}

async function seedLevel(){
    const levels = []

    for(let i = 0; i < 5; i++){
        const level = {
            levelId: i + 1,
            leveCooldown: 2**i
        };
        levels.push(level);
    }

    await db.insert(tLevel).values(levels);
}

async function seedCollection(){
    const collections = []

    const users = await db.select().from(tUser);

    for (const user of users){
        const numCollections = faker.number.int({ min: 2, max: 3 });
        
        for(let i = 0; i < numCollections; i++){
            const collection = {
                collTitle: faker.helpers.arrayElement([
                    'Programming',
                    'English',
                    'Mathematics',
                    'History',
                    'Science',
                    'Geography',
                    'Algorithms'
                ]),
                collDesc: faker.lorem.sentence(),
                collVisibility: faker.helpers.arrayElement(['PUBLIC', 'PRIVATE']),
                userId: user.userId
            };
            collections.push(collection);
        }
    }

    await db.insert(tCollection).values(collections)
}

async function seedCard(){
    const flashcards = [];
    
    const collections = await db.select().from(tCollection);
    
    for(const collection of collections){
        const numCards = faker.number.int({ min: 5, max: 10 });
        
        for(let i = 0; i < numCards; i++){
            const card = {
                flcaRecto: faker.lorem.sentence({ min: 3, max: 8 }),
                flcaVerso: faker.lorem.paragraph(1),
                flcaUrlRecto: faker.helpers.arrayElement(['', faker.image.url()]),
                flcaUrlVerso: faker.helpers.arrayElement(['', faker.image.url()]),
                collId: collection.collId
            };
            flashcards.push(card);
        }
    }

    await db.insert(tFlashCard).values(flashcards);
}

seed();