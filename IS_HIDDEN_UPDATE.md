# Poll Entity isHidden Field Implementation

## Overview
Added an `isHidden` boolean field to the poll entity to control poll visibility. Hidden polls are not shown to the public but can be managed by administrators.

## Changes Made

### 1. Entity Update
- **File**: `src/entities/poll.entity.ts`
- **Change**: Added `isHidden` field with default value `false`
```typescript
@Column({ default: false })
isHidden: boolean;
```

### 2. DTO Updates
- **File**: `src/api/polls/dto/create-poll.dto.ts`
- **Change**: Added optional `isHidden` field
```typescript
@IsOptional()
isHidden?: boolean;
```

### 3. Service Updates
- **File**: `src/api/polls/polls.service.ts`
- **Changes**:
  - Updated `create()` method to handle `isHidden` field
  - Modified `findActive()` to exclude hidden polls
  - Modified `findExpired()` to exclude hidden polls
  - Added `findVisible()` method for visible polls only
  - Added `findHidden()` method for admin use
  - Added `toggleVisibility()` method to toggle poll visibility

### 4. Controller Updates
- **File**: `src/api/polls/polls.controller.ts`
- **New Endpoints**:
  - `GET /api/polls/visible` - Get visible polls (public)
  - `GET /api/polls/hidden` - Get hidden polls (admin only)
  - `PATCH /api/polls/:id/toggle-visibility` - Toggle poll visibility (admin only)

### 5. Documentation Updates
- **Files**: `API_ENDPOINTS.md`, `API_STRUCTURE.md`
- **Changes**: Added documentation for new endpoints and functionality

## New API Endpoints

### Get Visible Polls
```
GET /api/polls/visible
Auth: Public
Response: Array of visible polls only
```

### Get Hidden Polls (Admin Only)
```
GET /api/polls/hidden
Auth: Admin only
Response: Array of hidden polls
```

### Toggle Poll Visibility (Admin Only)
```
PATCH /api/polls/:id/toggle-visibility
Auth: Admin only
Response: Updated poll with toggled visibility
```

## Business Logic Changes

### Public Endpoints
- `GET /api/polls` - Now returns all polls (including hidden ones)
- `GET /api/polls/active` - Only returns visible active polls
- `GET /api/polls/expired` - Only returns visible expired polls
- `GET /api/polls/type/:type` - Only returns visible polls of specified type

### Admin Endpoints
- All CRUD operations remain the same
- New visibility management endpoints
- Hidden polls can be viewed and managed by admins

## Database Impact

### New Field
- `isHidden` column added to `polls` table
- Default value: `false` (visible by default)
- Type: `boolean`

### Migration
- No manual migration needed
- TypeORM will automatically add the column due to `synchronize: true`

## Security Considerations

### Public Access
- Hidden polls are completely hidden from public endpoints
- No information about hidden polls is leaked to public users

### Admin Access
- Only users with `admin_user` role can:
  - View hidden polls
  - Toggle poll visibility
  - Access hidden poll data

## Usage Examples

### Creating a Hidden Poll
```json
POST /api/polls
{
  "title": "Hidden Test Poll",
  "description": "This poll is hidden",
  "type": "daily_rating",
  "startDate": "2024-01-01T00:00:00Z",
  "endDate": "2024-01-31T23:59:59Z",
  "isHidden": true
}
```

### Toggling Visibility
```bash
PATCH /api/polls/1/toggle-visibility
# Changes isHidden from false to true or vice versa
```

### Getting Visible Polls Only
```bash
GET /api/polls/visible
# Returns only polls where isHidden = false
```

## Benefits

1. **Content Management**: Admins can hide polls without deleting them
2. **User Experience**: Public users only see relevant, active polls
3. **Flexibility**: Easy to show/hide polls as needed
4. **Data Preservation**: Hidden polls retain all their data and relationships
5. **Security**: Hidden polls are completely isolated from public access

## Future Enhancements

1. **Bulk Operations**: Hide/show multiple polls at once
2. **Scheduled Visibility**: Automatically show/hide polls based on dates
3. **Audit Logging**: Track visibility changes
4. **Conditional Visibility**: Show polls based on user roles or other criteria
