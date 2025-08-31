# Postman Collection Setup Guide

## Overview
This guide explains how to import and use the MeroVote API Postman collection for testing all endpoints.

## Import Instructions

### 1. Download the Collection
- The collection file is located at: `MeroVote_API_Collection.json`
- This file contains all API endpoints organized by module

### 2. Import into Postman
1. Open Postman
2. Click **Import** button (top left)
3. Select **Upload Files** tab
4. Choose `MeroVote_API_Collection.json`
5. Click **Import**

### 3. Configure Environment Variables
The collection uses the following variables:
- `baseUrl`: Set to `http://localhost:3000` (default)
- `jwtToken`: Will be automatically set when you authenticate

## Collection Structure

### 📊 **Polls Module** (12 endpoints)
- **Public Endpoints:**
  - `GET /api/polls` - Get all polls
  - `GET /api/polls/active` - Get active polls
  - `GET /api/polls/visible` - Get visible polls only
  - `GET /api/polls/type/:type` - Get polls by type
  - `GET /api/polls/expired` - Get expired polls
  - `GET /api/polls/:id` - Get poll by ID

- **Admin Endpoints:**
  - `GET /api/polls/hidden` - Get hidden polls
  - `POST /api/polls` - Create new poll
  - `PATCH /api/polls/:id` - Update poll
  - `PATCH /api/polls/:id/toggle-visibility` - Toggle visibility
  - `DELETE /api/polls/:id` - Delete poll

### 👥 **Candidates Module** (6 endpoints)
- **Public Endpoints:**
  - `GET /api/candidates` - Get all candidates
  - `GET /api/candidates/search?name=john` - Search candidates
  - `GET /api/candidates/:id` - Get candidate by ID

- **Admin Endpoints:**
  - `POST /api/candidates` - Create candidate
  - `PATCH /api/candidates/:id` - Update candidate
  - `DELETE /api/candidates/:id` - Delete candidate

### 🗳️ **Poll Options Module** (7 endpoints)
- **Public Endpoints:**
  - `GET /api/poll-options` - Get all options
  - `GET /api/poll-options/poll/:pollId` - Get options by poll
  - `GET /api/poll-options/:id` - Get option by ID

- **Admin Endpoints:**
  - `POST /api/poll-options` - Create option
  - `PATCH /api/poll-options/:id` - Update option
  - `DELETE /api/poll-options/:id` - Delete option
  - `DELETE /api/poll-options/poll/:pollId` - Delete all options for poll

### 🗳️ **Votes Module** (10 endpoints)
- **Public Endpoints:**
  - `GET /api/votes/poll/:pollId` - Get votes by poll
  - `GET /api/votes/statistics/:pollId` - Get vote statistics
  - `GET /api/votes/count/poll/:pollId` - Get vote count by poll
  - `GET /api/votes/count/option/:optionId` - Get vote count by option

- **Authenticated Endpoints:**
  - `GET /api/votes/user/:userId` - Get user's votes
  - `GET /api/votes/:id` - Get vote by ID
  - `POST /api/votes` - Cast vote

- **Admin Endpoints:**
  - `GET /api/votes` - Get all votes
  - `PATCH /api/votes/:id` - Update vote
  - `DELETE /api/votes/:id` - Delete vote

### 🎨 **Banners Module** (7 endpoints)
- **Public Endpoints:**
  - `GET /api/banners` - Get all banners
  - `GET /api/banners/active` - Get active banners
  - `GET /api/banners/:id` - Get banner by ID

- **Admin Endpoints:**
  - `POST /api/banners` - Create banner
  - `PATCH /api/banners/:id` - Update banner
  - `DELETE /api/banners/:id` - Delete banner
  - `POST /api/banners/reorder` - Reorder banners

## Testing Workflow

### 1. Start the Backend
```bash
cd Vote-backend
npm run start:dev
```

### 2. Test Public Endpoints First
Start with endpoints that don't require authentication:
- `GET /api/polls/visible`
- `GET /api/candidates`
- `GET /api/banners`

### 3. Test Admin Endpoints
For admin endpoints, you'll need to:
1. Set up authentication (JWT token)
2. Use the "Set JWT Token" request in the Authentication folder
3. The token will be automatically stored in the `jwtToken` variable

### 4. Test Complete Workflows
**Create a Poll Workflow:**
1. Create a candidate: `POST /api/candidates`
2. Create a poll: `POST /api/polls`
3. Create poll options: `POST /api/poll-options`
4. Cast votes: `POST /api/votes`
5. Check statistics: `GET /api/votes/statistics/:pollId`

## Sample Data

### Create Poll
```json
{
  "title": "Best Programming Language 2024",
  "description": "Vote for your favorite programming language",
  "type": "daily_rating",
  "startDate": "2024-01-01T00:00:00Z",
  "endDate": "2024-12-31T23:59:59Z",
  "mediaUrl": "https://example.com/poll-image.jpg",
  "createdBy": "admin-user-uuid",
  "comments": {},
  "isHidden": false
}
```

### Create Candidate
```json
{
  "name": "JavaScript",
  "description": "The language of the web",
  "photo": "https://example.com/js-logo.png"
}
```

### Create Poll Option
```json
{
  "pollId": "1",
  "label": "JavaScript",
  "candidateId": "candidate-uuid"
}
```

### Cast Vote
```json
{
  "pollId": "1",
  "optionId": "option-uuid",
  "userId": "user-uuid"
}
```

## Error Handling

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

### Validation Errors
When you get a `400` error, the response will include validation details:
```json
{
  "statusCode": 400,
  "message": ["title should not be empty"],
  "error": "Bad Request"
}
```

## Tips for Testing

### 1. Use Collection Variables
- Update `baseUrl` if your server runs on a different port
- The `jwtToken` will be automatically managed

### 2. Test Data Flow
- Create entities in the correct order (candidates → polls → options → votes)
- Use the returned IDs in subsequent requests

### 3. Test Edge Cases
- Try creating polls with invalid dates
- Test voting multiple times (should fail)
- Test accessing admin endpoints without authentication

### 4. Monitor Database
- Check your PostgreSQL database to see created records
- Verify relationships between entities

## Troubleshooting

### Connection Issues
- Ensure the backend is running on `http://localhost:3000`
- Check if PostgreSQL is running and accessible
- Verify environment variables are set correctly

### Authentication Issues
- Make sure you have a valid JWT token
- Check if the token has the required role (admin_user for admin endpoints)
- Verify the token hasn't expired

### Data Issues
- Check if required fields are provided
- Ensure date formats are correct (ISO 8601)
- Verify UUID formats for entity references

## Next Steps

1. **Import the collection** into Postman
2. **Start the backend** application
3. **Test public endpoints** first
4. **Set up authentication** for admin endpoints
5. **Run complete workflows** to test the full application
6. **Customize requests** with your own data

The collection is ready to use and will help you thoroughly test all API functionality! 🚀
