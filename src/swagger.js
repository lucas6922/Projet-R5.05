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
    // --- Common ---
    Error: {
      error: 'Error description',
      detail: 'Additional details'
    },

    // --- Users/Admin (if your docs reference them) ---
    User: {
      userMail: 'user@example.com',
      userName: 'Doe',
      userFirstname: 'John',
      userStatus: 'VALIDATED',
      aproId: 1
    },

    // --- Auth ---
    RegisterRequest: {
      userMail: 'user@example.com',
      userName: 'Doe',
      userFirstname: 'John',
      userPass: 'securePassword123',
      aproId: 1
    },

    RegisterResponse: {
      message: 'user created',
      user: { id: 1 },
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
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

    VerifyEmailTokenRequest: {
      token: 'jwt-token-here'
    },

    // --- Collections ---
    Collection: {
      collId: 'uuid',
      userId: 'uuid-or-int',
      collTitle: 'My collection',
      collDesc: 'Collection description',
      collVisibility: 'PUBLIC'
    },

    CollectionInput: {
      collTitle: 'New collection',
      collDesc: 'Optional description',
      collVisibility: 'PUBLIC'
    },

    SearchCollectionRequest: {
      search: 'javascript'
    },

    SearchCollectionResponse: {
      message: 'Public collection retrieve successfully',
      data: [
        { collTitle: 'JavaScript Basics', collDesc: 'Learn the fundamentals of JavaScript programming' }
      ]
    },

    // --- Flashcards ---
    Flashcard: {
      flcaId: 'uuid-or-int',
      flcaRecto: 'Front side content',
      flcaVerso: 'Back side content',
      flcaUrlRecto: 'https://example.com/front-image.jpg',
      flcaUrlVerso: 'https://example.com/back-image.jpg',
      collId: 'uuid'
    },

    FlashcardCreateRequest: {
      flcaRecto: 'Front side content',
      flcaVerso: 'Back side content',
      flcaUrlRecto: 'https://example.com/front-image.jpg',
      flcaUrlVerso: 'https://example.com/back-image.jpg'
    },

    FlashcardCreateResponse: {
      message: 'Flashcard created successfully',
      data: {
        flcaId: 42,
        flcaRecto: 'Front side content',
        flcaVerso: 'Back side content',
        collId: 1
      }
    },

    UpdateFlashcardRequest: {
      flcaRecto: 'New recto',
      flcaVerso: 'New verso',
      flcaUrlRecto: 'https://example.com/new-recto.png',
      flcaUrlVerso: 'https://example.com/new-verso.png'
    },

    UpdateFlashcardResponse: {
      message: 'Flashcard updated successfully',
      data: {
        flcaId: 10,
        flcaRecto: 'New recto',
        flcaVerso: 'New verso',
        flcaUrlRecto: 'https://example.com/new-recto.png',
        flcaUrlVerso: 'https://example.com/new-verso.png'
      }
    },

    // --- Revision ---
    CardToTrain: {
      flcaId: 10,
      flcaRecto: 'Recto text',
      flcaVerso: 'Verso text',
      flcaUrlRecto: 'https://example.com/recto.png',
      flcaUrlVerso: 'https://example.com/verso.png',
      collId: 3,
      reviId: 55,
      reviLastDate: '2026-01-10T20:15:00.000Z',
      leveCooldown: 2
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
    }
  }
};

const outputFile = '../docs/swagger-output.json';
const routes = ['src/index.js'];

swaggerAutogen()(outputFile, routes, doc);
