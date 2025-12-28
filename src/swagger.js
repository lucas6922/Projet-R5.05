import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'R5.05 Project API',
    description: 'RESTful API for flashcard management and spaced repetition learning',
    version: '1.0.0'
  },
  host: 'localhost:3000',
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
      description: 'JWT token in the format: Bearer {token}'
    }
  },
  definitions: {
    RegisterRequest: {
      userMail: 'user@example.com',
      userName: 'Doe',
      userFirstname: 'John',
      userPass: 'securePassword123',
      aproId: 1
    },
    LoginRequest: {
      userMail: 'user@example.com',
      userPass: 'securePassword123'
    },
    AuthResponse: {
      message: 'User logged in',
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      userData: {
        id: 1,
        email: 'user@example.com',
        username: 'Doe'
      }
    },
    RegisterResponse: {
      message: 'user created',
      user: {
        id: 1
      },
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
    },
    VerifyEmailResponse: {
      message: 'Email verified successfully'
    },
    Collection: {
      collId: 1,
      userId: 1,
      collTitle: 'My collection',
      collDescription: 'Collection description',
      collVisibility: 'public',
      createdAt: '2025-12-18T12:00:00Z'
    },
    CollectionInput: {
      collTitle: 'New collection',
      collDescription: 'Optional description',
      collVisibility: 'private'
    },
    Flashcard: {
      cardId: 1,
      collId: 1,
      cardFront: 'Question or front side',
      cardBack: 'Answer or back side',
      cardFrontUrl: 'https://example.com/image.jpg',
      cardBackUrl: 'https://example.com/image2.jpg',
      cardLevel: 1,
      cardLastReview: '2025-12-18T12:00:00Z',
      cardNextReview: '2025-12-19T12:00:00Z'
    },
    FlashcardInput: {
      collId: 1,
      cardFront: 'Question',
      cardBack: 'Answer',
      cardFrontUrl: 'https://example.com/image.jpg',
      cardBackUrl: null
    },
    FlashcardCreateRequest: {
      flcaTitle: 'Card title',
      flcaRecto: 'Front side content',
      flcaVerso: 'Back side content',
      flcaUrlRecto: 'https://example.com/front-image.jpg',
      flcaUrlVerso: 'https://example.com/back-image.jpg',
      collId: 1
    },
    FlashcardCreateResponse: {
      message: 'Flashcard created successfully',
      data: {
        cardId: 42,
        title: 'Card title',
        collectionId: 1
      }
    },
    FlashcardDetail: {
      message: 'Flashcard retrieved successfully',
      data: {
        flcaId: 1,
        flcaTitle: 'Card title',
        flcaRecto: 'Front side content',
        flcaVerso: 'Back side content',
        flcaUrlRecto: 'https://example.com/front-image.jpg',
        flcaUrlVerso: 'https://example.com/back-image.jpg',
        collId: 1
      }
    },
    ReviewRequest: {
      revisionLevel: 3
    },
    ReviewResponse: {
      message: 'Revision updated successfully',
      data: {
        revisionId: 42,
        level: 3,
        lastReviewDate: '2025-12-28T17:01:00.000Z',
        isNew: false
      }
    },
    Error: {
      error: 'Error description',
      detail: 'Additional details'
    }
  }
};

const outputFile = '../docs/swagger-output.json';
const routes = ['src/index.js'];

swaggerAutogen()(outputFile, routes, doc);
