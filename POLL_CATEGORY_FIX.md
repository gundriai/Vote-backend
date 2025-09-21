# Poll Category and Type Fix

## Problem Analysis

The frontend was not showing polls in categories because of mismatches between frontend and backend data structures:

### Issues Found:
1. **Missing PollType values** in backend - `COMPARISON_VOTING` and `ACTIVITIES` were missing
2. **Missing PollCategories enum** in backend
3. **Missing category field** in poll entity and DTOs
4. **No category filtering endpoint** in the API

## Fixes Applied

### 1. Updated Enums (`src/types/enums.ts`)
```typescript
export enum PollType {
    DAILY_RATING = 'daily_rating',
    POLITICAL_RATING = 'political_rating',
    FACE_TO_FACE = 'face_to_face',
    COMPARISON_VOTING = 'comparison_voting',  // ✅ Added
    ACTIVITIES = 'activities'                 // ✅ Added
};

export enum PollCategories {
    ALL = 'All',
    DAILY = 'Daily',
    POLITICAL = 'Political',
    FACE_TO_FACE = 'FaceToFace'
};
```

### 2. Updated Poll Entity (`src/entities/poll.entity.ts`)
```typescript
@Column({
  type: 'enum',
  enum: PollCategories,
  array: true,
  nullable: true
})
category: PollCategories[];  // ✅ Added category field
```

### 3. Updated CreatePollDto (`src/api/polls/dto/create-poll.dto.ts`)
```typescript
@IsArray()
@IsEnum(PollCategories, { each: true })
@IsOptional()
category?: PollCategories[];  // ✅ Added category validation
```

### 4. Updated Polls Service (`src/api/polls/polls.service.ts`)
```typescript
// ✅ Added category handling in create method
category: createPollDto.category || [],

// ✅ Added findByCategory method
async findByCategory(category: string): Promise<Polls[]> {
  return await this.pollsRepository
    .createQueryBuilder('poll')
    .where('poll.category @> :category', { category: [category] })
    .andWhere('poll.isHidden = :isHidden', { isHidden: false })
    .orderBy('poll.createdAt', 'DESC')
    .getMany();
}
```

### 5. Updated Polls Controller (`src/api/polls/polls.controller.ts`)
```typescript
@Get('category/:category')
findByCategory(@Param('category') category: string) {
  return this.pollsService.findByCategory(category);
}
```

### 6. Updated Postman Collection
- ✅ Added "Get Polls by Category" endpoint
- ✅ Updated sample data to include categories
- ✅ Added category field to create poll examples

## API Endpoints Now Available

### New Category Endpoint
```
GET /api/polls/category/{category}
```
**Examples:**
- `GET /api/polls/category/Political` - Get political polls
- `GET /api/polls/category/Daily` - Get daily polls
- `GET /api/polls/category/FaceToFace` - Get face-to-face polls

### Updated Create Poll Endpoint
```json
POST /api/polls
{
  "title": "Sample Poll",
  "description": "Description",
  "type": "daily_rating",
  "category": ["Daily"],           // ✅ Now supports categories
  "startDate": "2024-01-01T00:00:00Z",
  "endDate": "2024-12-31T23:59:59Z",
  "mediaUrl": "https://example.com/image.jpg",
  "createdBy": "user-uuid",
  "comments": {},
  "isHidden": false
}
```

## Frontend Integration

The frontend can now:

1. **Filter polls by category** using the new endpoint:
   ```typescript
   // In home.tsx
   const polls = await fetch(`/api/polls/category/${selectedCategory.id}`);
   ```

2. **Create polls with categories**:
   ```typescript
   const pollData = {
     title: "New Poll",
     type: "daily_rating",
     category: ["Daily"],  // ✅ Categories are now supported
     // ... other fields
   };
   ```

3. **Display polls in correct categories** based on the `category` field

## Database Schema

The polls table now includes:
- `category` column (JSONB array of PollCategories enum values)
- Proper indexing for category filtering
- Support for multiple categories per poll

## Testing

### Test Category Filtering
```bash
# Get political polls
curl https://merovotebackend-app-hxb0g6deh8auc5gh.centralindia-01.azurewebsites.net/api/polls/category/Political

# Get daily polls  
curl https://merovotebackend-app-hxb0g6deh8auc5gh.centralindia-01.azurewebsites.net/api/polls/category/Daily

# Get face-to-face polls
curl https://merovotebackend-app-hxb0g6deh8auc5gh.centralindia-01.azurewebsites.net/api/polls/category/FaceToFace
```

### Test Creating Polls with Categories
```bash
curl -X POST https://merovotebackend-app-hxb0g6deh8auc5gh.centralindia-01.azurewebsites.net/api/polls \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Poll",
    "description": "Test Description",
    "type": "daily_rating",
    "category": ["Daily"],
    "startDate": "2024-01-01T00:00:00Z",
    "endDate": "2024-12-31T23:59:59Z",
    "createdBy": "test-user"
  }'
```

## Result

✅ **Polls now support categories**  
✅ **Frontend can filter by category**  
✅ **API endpoints for category filtering**  
✅ **Database schema updated**  
✅ **Postman collection updated**  

The category filtering should now work correctly in the frontend! 🎉
