# Especificação da API - YourTale

## Entidades

### User
- id: UUID
- name: string
- email: string
- password: string (hashed)
- avatar: string (URL)
- created_at: datetime
- updated_at: datetime

### Session
- id: UUID
- title: string
- description: string
- is_public: boolean
- join_after_start: boolean
- player_limit: integer
- is_ai_master: boolean
- start_date: datetime
- status: enum(not_started, active, ended)
- creator_id: UUID
- created_at: datetime
- updated_at: datetime

### Character
- id: UUID
- name: string
- status: json (ex: { "hp": 10, "mana": 5 })
- user_id: UUID
- session_id: UUID
- created_at: datetime
- updated_at: datetime

### Message
- id: UUID
- sender_id: UUID
- session_id: UUID
- content: string
- timestamp: datetime
- type: enum(user, ai, system)
- chat_type: enum(general, master)

### Note
- id: UUID
- session_id: UUID
- author_id: UUID
- content: string
- created_at: datetime

## Rotas e Retornos

### POST /auth/register
**Body:** { name, email, password }  
**Response:**
{
  "id": "uuid",
  "name": "Ian",
  "email": "ian@example.com",
  "avatar": null
}

### POST /auth/login
**Body:** { email, password }  
**Response:**
{
  "token": "jwt_token",
  "user": {
    "id": "uuid",
    "name": "Ian",
    "email": "ian@example.com",
    "avatar": null
  }
}

### GET /users/me
**Response:**
{
  "id": "uuid",
  "name": "Ian",
  "email": "ian@example.com",
  "avatar": null
}

### PATCH /users/me
**Body:** { name?, avatar? }  
**Response:** igual ao GET /users/me

### POST /sessions
**Body:**
{
  "title": "Minha Campanha",
  "description": "Aventura em terras sombrias",
  "is_public": true,
  "join_after_start": false,
  "player_limit": 5,
  "is_ai_master": false,
  "start_date": "2025-07-20T18:00:00Z"
}
**Response:** objeto Session

### GET /sessions/my
**Response:**
[
  {
    "id": "uuid",
    "title": "Dungeon Run",
    "status": "active",
    "start_date": "2025-07-15T18:00:00Z",
    "last_access": "2025-07-16T10:23:00Z",
    "is_master": false
  }
]

### GET /sessions/public
**Response:**
[
  {
    "id": "uuid",
    "title": "Batalha do Reino",
    "description": "Campanha pública",
    "is_ai_master": true,
    "created_at": "2025-07-14T12:00:00Z"
  }
]

### GET /sessions/:id
**Response:** objeto Session

### PATCH /sessions/:id
**Body:** qualquer campo editável  
**Response:** objeto Session atualizado

### POST /sessions/:id/join
**Body:** { code: string }  
**Response:**
{
  "message": "Joined session successfully",
  "session_id": "uuid"
}

### GET /sessions/:id/players
**Response:**
[
  {
    "user": {
      "id": "uuid",
      "name": "Jogador 1",
      "avatar": null
    },
    "character": {
      "id": "uuid",
      "name": "Thorgar",
      "status": { "hp": 10, "mana": 5 }
    }
  }
]

### POST /characters
**Body:** { name, session_id }  
**Response:** objeto Character

### GET /characters/:id
**Response:** objeto Character

### PATCH /characters/:id/status
**Body:** { status: { hp: 5, mana: 10 } }  
**Response:** objeto Character atualizado

### GET /sessions/:id/messages
**Response:**
[
  {
    "id": "uuid",
    "sender_id": "uuid",
    "type": "user",
    "content": "Vamos em frente!",
    "timestamp": "2025-07-16T21:30:00Z"
  }
]

### POST /sessions/:id/messages
**Body:** { content: string, type: "user" | "ai" }  
**Response:** objeto Message criado

### GET /sessions/:id/notes
**Response:**
[
  {
    "id": "uuid",
    "author_id": "uuid",
    "content": "Inimigo escondido na floresta",
    "created_at": "2025-07-16T21:00:00Z"
  }
]

### POST /sessions/:id/notes
**Body:** { content: string }  
**Response:** objeto Note criado

### PATCH /notes/:id
**Body:** { content: string }  
**Response:** objeto Note atualizado