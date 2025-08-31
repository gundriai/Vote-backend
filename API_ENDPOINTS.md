# MeroVote Backend API Documentation

This document describes all the API endpoints available in the MeroVote backend application.

## Base URL
```
http://localhost:3000
```

## Authentication
Most endpoints require JWT authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## API Endpoints

### 1. Polls API (`/api/polls`)

#### Create a new poll
- **POST** `/api/polls`
- **Auth**: Admin only
- **Body**: `CreatePollDto`
```json
{
  "title": "Sample Poll",
  "description": "This is a sample poll",
  "type": "daily_rating",
  "startDate": "2024-01-01T00:00:00Z",
  "endDate": "2024-01-31T23:59:59Z",
  "mediaUrl": "https://example.com/image.jpg",
  "createdBy": "user-uuid",
  "comments": {},
  "isHidden": false
}
```

#### Get all polls
- **GET** `/api/polls`
- **Auth**: Public
- **Response**: Array of all polls

#### Get active polls
- **GET** `/api/polls/active`
- **Auth**: Public
- **Response**: Array of currently active polls

#### Get polls by type
- **GET** `/api/polls/type/:type`
- **Auth**: Public
- **Params**: `type` - poll type (daily_rating, political_rating, face_to_face)
- **Response**: Array of polls of specified type

#### Get expired polls
- **GET** `/api/polls/expired`
- **Auth**: Public
- **Response**: Array of expired polls (visible only)

#### Get hidden polls (Admin only)
- **GET** `/api/polls/hidden`
- **Auth**: Admin only
- **Response**: Array of hidden polls

#### Get visible polls
- **GET** `/api/polls/visible`
- **Auth**: Public
- **Response**: Array of visible polls only

#### Get poll by ID
- **GET** `/api/polls/:id`
- **Auth**: Public
- **Params**: `id` - poll ID
- **Response**: Single poll object

#### Update poll
- **PATCH** `/api/polls/:id`
- **Auth**: Admin only
- **Params**: `id` - poll ID
- **Body**: `UpdatePollDto` (partial)

#### Toggle poll visibility
- **PATCH** `/api/polls/:id/toggle-visibility`
- **Auth**: Admin only
- **Params**: `id` - poll ID
- **Response**: Updated poll with toggled visibility

#### Delete poll
- **DELETE** `/api/polls/:id`
- **Auth**: Admin only
- **Params**: `id` - poll ID

### 2. Candidates API (`/api/candidates`)

#### Create a new candidate
- **POST** `/api/candidates`
- **Auth**: Admin only
- **Body**: `CreateCandidateDto`
```json
{
  "name": "John Doe",
  "description": "A great candidate",
  "photo": "https://example.com/photo.jpg"
}
```

#### Get all candidates
- **GET** `/api/candidates`
- **Auth**: Public
- **Response**: Array of all candidates

#### Search candidates by name
- **GET** `/api/candidates/search?name=john`
- **Auth**: Public
- **Query**: `name` - search term
- **Response**: Array of matching candidates

#### Get candidate by ID
- **GET** `/api/candidates/:id`
- **Auth**: Public
- **Params**: `id` - candidate UUID
- **Response**: Single candidate object

#### Update candidate
- **PATCH** `/api/candidates/:id`
- **Auth**: Admin only
- **Params**: `id` - candidate UUID
- **Body**: `UpdateCandidateDto` (partial)

#### Delete candidate
- **DELETE** `/api/candidates/:id`
- **Auth**: Admin only
- **Params**: `id` - candidate UUID

### 3. Poll Options API (`/api/poll-options`)

#### Create a new poll option
- **POST** `/api/poll-options`
- **Auth**: Admin only
- **Body**: `CreatePollOptionDto`
```json
{
  "pollId": "1",
  "label": "Option A",
  "candidateId": "candidate-uuid"
}
```

#### Get all poll options
- **GET** `/api/poll-options`
- **Auth**: Public
- **Response**: Array of all poll options with relations

#### Get poll options by poll ID
- **GET** `/api/poll-options/poll/:pollId`
- **Auth**: Public
- **Params**: `pollId` - poll ID
- **Response**: Array of options for specific poll

#### Get poll option by ID
- **GET** `/api/poll-options/:id`
- **Auth**: Public
- **Params**: `id` - option UUID
- **Response**: Single poll option object

#### Update poll option
- **PATCH** `/api/poll-options/:id`
- **Auth**: Admin only
- **Params**: `id` - option UUID
- **Body**: `UpdatePollOptionDto` (partial)

#### Delete poll option
- **DELETE** `/api/poll-options/:id`
- **Auth**: Admin only
- **Params**: `id` - option UUID

#### Delete all options for a poll
- **DELETE** `/api/poll-options/poll/:pollId`
- **Auth**: Admin only
- **Params**: `pollId` - poll ID

### 4. Votes API (`/api/votes`)

#### Cast a vote
- **POST** `/api/votes`
- **Auth**: Authenticated users
- **Body**: `CreateVoteDto`
```json
{
  "pollId": "1",
  "optionId": "option-uuid",
  "userId": "user-uuid"
}
```

#### Get all votes (Admin only)
- **GET** `/api/votes`
- **Auth**: Admin only
- **Response**: Array of all votes with relations

#### Get votes by poll ID
- **GET** `/api/votes/poll/:pollId`
- **Auth**: Public
- **Params**: `pollId` - poll ID
- **Response**: Array of votes for specific poll

#### Get votes by user ID
- **GET** `/api/votes/user/:userId`
- **Auth**: Authenticated users
- **Params**: `userId` - user UUID
- **Response**: Array of user's votes

#### Get vote statistics for a poll
- **GET** `/api/votes/statistics/:pollId`
- **Auth**: Public
- **Params**: `pollId` - poll ID
- **Response**: Vote statistics including counts and percentages

#### Get vote count by poll ID
- **GET** `/api/votes/count/poll/:pollId`
- **Auth**: Public
- **Params**: `pollId` - poll ID
- **Response**: Total vote count for poll

#### Get vote count by option ID
- **GET** `/api/votes/count/option/:optionId`
- **Auth**: Public
- **Params**: `optionId` - option UUID
- **Response**: Vote count for specific option

#### Get vote by ID
- **GET** `/api/votes/:id`
- **Auth**: Authenticated users
- **Params**: `id` - vote UUID
- **Response**: Single vote object

#### Update vote (Admin only)
- **PATCH** `/api/votes/:id`
- **Auth**: Admin only
- **Params**: `id` - vote UUID
- **Body**: `UpdateVoteDto` (partial)

#### Delete vote (Admin only)
- **DELETE** `/api/votes/:id`
- **Auth**: Admin only
- **Params**: `id` - vote UUID

### 5. Banners API (`/api/banners`)

#### Create a new banner
- **POST** `/api/banners`
- **Auth**: Admin only
- **Body**: `CreateBannerDto`
```json
{
  "image": "https://example.com/banner.jpg",
  "title": "Welcome to MeroVote",
  "subTitle": "Your voice matters",
  "button": {
    "label": "Get Started",
    "url": "/get-started"
  }
}
```

#### Get all banners
- **GET** `/api/banners`
- **Auth**: Public
- **Response**: Array of all banners

#### Get active banners
- **GET** `/api/banners/active`
- **Auth**: Public
- **Response**: Array of active banners

#### Get banner by ID
- **GET** `/api/banners/:id`
- **Auth**: Public
- **Params**: `id` - banner UUID
- **Response**: Single banner object

#### Update banner
- **PATCH** `/api/banners/:id`
- **Auth**: Admin only
- **Params**: `id` - banner UUID
- **Body**: `UpdateBannerDto` (partial)

#### Delete banner
- **DELETE** `/api/banners/:id`
- **Auth**: Admin only
- **Params**: `id` - banner UUID

#### Reorder banners
- **POST** `/api/banners/reorder`
- **Auth**: Admin only
- **Body**: Array of banner UUIDs in desired order
```json
["uuid1", "uuid2", "uuid3"]
```

## Data Types

### Poll Types
- `daily_rating` - Daily rating polls
- `political_rating` - Political rating polls
- `face_to_face` - Face to face comparison polls

### User Roles
- `normal_user` - Regular user
- `admin_user` - Administrator user

## Error Responses

All endpoints return appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

Error response format:
```json
{
  "statusCode": 400,
  "message": "Error description",
  "error": "Bad Request"
}
```

## Rate Limiting

API endpoints may be subject to rate limiting to prevent abuse. Check response headers for rate limit information.

## Pagination

For endpoints that return large datasets, pagination parameters may be added in future versions.

## WebSocket Support

Real-time updates for polls and votes may be implemented using WebSockets in future versions.
