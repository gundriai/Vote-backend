# Aggregated Polls API

## Overview

The Aggregated Polls API provides a comprehensive view of polls with all related data aggregated into a single response. This API is designed to match the frontend's mock data structure and provides all necessary information for rendering polls in the UI.

## Base URL
```
/api/aggregated-polls
```

## Endpoints

### 1. Get All Aggregated Polls
**GET** `/api/aggregated-polls`

Returns all visible polls with aggregated data including candidates, votes, comments, and statistics.

**Query Parameters:**
- `category` (optional): Filter polls by category (e.g., "Political", "Daily", "FaceToFace")

**Response:**
```json
{
  "polls": [
    {
      "id": "uuid",
      "title": "Poll Title",
      "description": "Poll Description",
      "type": "daily_rating" | "political_rating" | "comparison_voting" | "face_to_face" | "activities",
      "category": ["Political", "Daily"],
      "mediaUrl": "https://example.com/image.jpg",
      "startDate": "2024-01-01T00:00:00Z",
      "endDate": "2024-12-31T23:59:59Z",
      "isHidden": false,
      "comments": [
        {
          "id": "comment-id",
          "pollId": "poll-id",
          "content": "Comment content",
          "author": "Author name",
          "createdAt": "2024-01-01T00:00:00Z",
          "gajjabCount": 5,
          "bekarCount": 2,
          "furiousCount": 1
        }
      ],
      "candidates": [
        {
          "id": "candidate-id",
          "pollId": "poll-id",
          "name": "Candidate Name",
          "description": "Candidate Description",
          "imageUrl": "https://example.com/photo.jpg",
          "voteCount": 150
        }
      ],
      "voteCounts": {
        "excellent": 23,
        "good": 67,
        "average": 145,
        "poor": 89
      },
      "totalComments": 5,
      "totalVotes": 324,
      "updatedAt": "2024-01-01T00:00:00Z",
      "createdBy": "admin-uuid",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "totalPolls": 6,
  "totalVotes": 1538,
  "totalComments": 25,
  "categories": {
    "Political": 4,
    "Daily": 1,
    "FaceToFace": 1
  },
  "types": {
    "daily_rating": 1,
    "political_rating": 1,
    "comparison_voting": 3,
    "face_to_face": 1
  }
}
```

### 2. Get Aggregated Polls by Category
**GET** `/api/aggregated-polls/category/{category}`

Returns polls filtered by a specific category.

**Path Parameters:**
- `category`: Category name (e.g., "Political", "Daily", "FaceToFace")

**Response:** Same as above, but filtered by category.

### 3. Get Single Aggregated Poll
**GET** `/api/aggregated-polls/{id}`

Returns a single poll with all aggregated data.

**Path Parameters:**
- `id`: Poll UUID

**Response:** Single poll object (same structure as polls array item above).

## Data Structure

### Poll Types
- `daily_rating`: Daily rating polls with vote counts by rating
- `political_rating`: Political rating polls with vote counts by rating
- `comparison_voting`: Comparison polls with candidates
- `face_to_face`: Face-to-face polls with candidates
- `activities`: Activity polls

### Categories
- `Political`: Political polls
- `Daily`: Daily polls
- `FaceToFace`: Face-to-face polls
- `All`: All polls (used for filtering)

### Vote Counts
For rating polls (`daily_rating`, `political_rating`), the `voteCounts` object contains:
- Rating labels as keys
- Vote counts as values

For comparison polls (`comparison_voting`, `face_to_face`), the `candidates` array contains:
- Candidate information
- Individual vote counts per candidate

## Features

### 1. **Complete Data Aggregation**
- Polls with all related data in a single request
- Candidates with vote counts
- Comments with reaction counts
- Vote statistics by type

### 2. **Category Filtering**
- Filter by specific categories
- Support for multiple categories per poll
- Category statistics in response

### 3. **Type-based Data Structure**
- Different data structures based on poll type
- Rating polls show vote counts by rating
- Comparison polls show candidates with individual counts

### 4. **Statistics**
- Total polls, votes, and comments
- Breakdown by category and type
- Real-time aggregated counts

## Usage Examples

### Frontend Integration
```typescript
// Get all polls
const response = await fetch('/api/aggregated-polls');
const data = await response.json();

// Get political polls only
const politicalPolls = await fetch('/api/aggregated-polls/category/Political');
const politicalData = await politicalPolls.json();

// Get single poll
const poll = await fetch('/api/aggregated-polls/poll-uuid-here');
const pollData = await poll.json();
```

### React Component Usage
```typescript
const [polls, setPolls] = useState([]);
const [selectedCategory, setSelectedCategory] = useState('All');

useEffect(() => {
  const fetchPolls = async () => {
    const url = selectedCategory === 'All' 
      ? '/api/aggregated-polls'
      : `/api/aggregated-polls/category/${selectedCategory}`;
    
    const response = await fetch(url);
    const data = await response.json();
    setPolls(data.polls);
  };
  
  fetchPolls();
}, [selectedCategory]);
```

## Performance Considerations

- **Single Query**: Reduces multiple API calls
- **Efficient Joins**: Uses optimized database queries
- **Caching Ready**: Response structure supports caching
- **Pagination Ready**: Can be extended with pagination

## Error Handling

- **404**: Poll not found (for single poll endpoint)
- **500**: Server error
- **400**: Invalid category parameter

## Security

- Only returns visible polls (`isHidden = false`)
- No authentication required for public endpoints
- Admin endpoints require authentication

## Migration from Mock Data

This API is designed to be a drop-in replacement for the frontend's mock data:

1. **Same Structure**: Matches `MockPoll` interface exactly
2. **Same Fields**: All fields from mock data are present
3. **Same Types**: Uses same enums and data types
4. **Same Logic**: Category filtering works the same way

The frontend can switch from mock data to this API with minimal changes!
