import { db } from './database.js'
import { tAppRole, tUser, tCollection, tFlashCard, tLevel, tRevision } from './schema.js'
import { faker } from '@faker-js/faker'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { eq, and, inArray } from 'drizzle-orm'
import {ANONYMOUS_USER_ID} from '../constants.js'

async function seed(){
    console.log('Seeding database...');

    await db.delete(tRevision);
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
    await seedRevision();

    console.log("Database has been seeded.");
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
    const anonymousUser = {
        userId: ANONYMOUS_USER_ID,
        userName: "Anonyme",
        userFirstname: "Anonyme",
        userMail: "anonyme@anonyme.com",
        userPass: await bcrypt.hash(crypto.randomUUID(), 12),
        userStatus: "VALIDATED",
        aproId: 3
    };
    
    console.log("fixed user : ", fixedUser);
    console.log("password: 12345")
    users.push(fixedUser);
    users.push(anonymousUser);

    await db.insert(tUser).values(users);
}

async function seedRole(){
    const appRole = [{aproId: 1, aproLabel: "USER"}, {aproId: 2, aproLabel: "ADMIN"}, {aproId: 3, aproLabel: "ANONYMOUS"}];
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

async function seedRevision() {
    const revisions = [];
    
    const users = await db.select().from(tUser);
    const levels = await db.select().from(tLevel);
    
    const totoUser = users.find(u => u.userMail === 'toto@example.com');
    
    const programmingColl = await db.select()
        .from(tCollection)
        .where(and(
            eq(tCollection.userId, totoUser.userId),
            eq(tCollection.collTitle, 'History')
        ));
    
    if (programmingColl.length > 0) {
        const programmingCards = await db.select()
            .from(tFlashCard)
            .where(eq(tFlashCard.collId, programmingColl[0].collId));
            
        const halfCount = Math.floor(programmingCards.length / 2);
        
        
        for (let i = 0; i < halfCount; i++) {
            revisions.push({
                reviLastDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), 
                userId: totoUser.userId,
                flcaId: programmingCards[i].flcaId,
                leveId: 2 
            });
        }
        
        for (let i = halfCount; i < programmingCards.length; i++) {
            revisions.push({
                reviLastDate: new Date(), 
                userId: totoUser.userId,
                flcaId: programmingCards[i].flcaId,
                leveId: 1 
            });
        }
    }
    
    for (const user of users) {
        const publicCollections = await db.select()
            .from(tCollection)
            .where(and(
                eq(tCollection.collVisibility, 'PUBLIC'),
            ));
        
        const publicCollectionIds = publicCollections.map(c => c.collId);
        let availableCards = [];
        
        if (publicCollectionIds.length > 0) {
            availableCards = await db.select()
                .from(tFlashCard)
                .where(inArray(tFlashCard.collId, publicCollectionIds));
        }
        
        const ownCollections = await db.select()
            .from(tCollection)
            .where(eq(tCollection.userId, user.userId));
        
        const ownCollectionIds = ownCollections.map(c => c.collId);
        
        if (ownCollectionIds.length > 0) {
            const ownCards = await db.select()
                .from(tFlashCard)
                .where(inArray(tFlashCard.collId, ownCollectionIds));
            
            availableCards = [...availableCards, ...ownCards];
        }
        
        if (availableCards.length > 0) {
            const numRevisionsToCreate = faker.number.int({ 
                min: Math.floor(availableCards.length * 0.3), 
                max: Math.floor(availableCards.length * 0.7) 
            });
            
            const selectedCards = faker.helpers.arrayElements(availableCards, numRevisionsToCreate);
            
            for (const card of selectedCards) {
                const daysAgo = faker.number.int({ min: 0, max: 30 });
                const level = faker.helpers.arrayElement(levels);
                
                revisions.push({
                    reviLastDate: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
                    userId: user.userId,
                    flcaId: card.flcaId,
                    leveId: level.leveId
                });
            }
        }
    }
    
    await db.insert(tRevision).values(revisions);
}





seed();