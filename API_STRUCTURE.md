# MeroVote Backend API Structure

## Overview
This document provides an overview of the complete API structure implemented in the MeroVote backend application.

## Directory Structure
```
src/
├── api/                           # Main API module
│   ├── polls/                     # Polls management
│   │   ├── dto/
│   │   │   ├── create-poll.dto.ts
│   │   │   ├── update-poll.dto.ts
│   │   │   └── index.ts
│   │   ├── polls.controller.ts
│   │   ├── polls.service.ts
│   │   └── polls.module.ts
│   ├── candidates/                # Candidates management
│   │   ├── dto/
│   │   │   ├── create-candidate.dto.ts
│   │   │   ├── update-candidate.dto.ts
│   │   │   └── index.ts
│   │   ├── candidates.controller.ts
│   │   ├── candidates.service.ts
│   │   └── candidates.module.ts
│   ├── poll-options/             # Poll options management
│   │   ├── dto/
│   │   │   ├── create-poll-option.dto.ts
│   │   │   ├── update-poll-option.dto.ts
│   │   │   └── index.ts
│   │   ├── poll-options.controller.ts
│   │   ├── poll-options.service.ts
│   │   └── poll-options.module.ts
│   ├── votes/                     # Voting system
│   │   ├── dto/
│   │   │   ├── create-vote.dto.ts
│   │   │   ├── update-vote.dto.ts
│   │   │   └── index.ts
│   │   ├── votes.controller.ts
│   │   ├── votes.service.ts
│   │   └── votes.module.ts
│   ├── banners/                   # Banner management
│   │   ├── dto/
│   │   │   ├── create-banner.dto.ts
│   │   │   ├── update-banner.dto.ts
│   │   │   └── index.ts
│   │   ├── banners.controller.ts
│   │   ├── banners.service.ts
│   │   └── banners.module.ts
│   ├── api.module.ts              # Main API module
│   └── index.ts                   # API exports
├── auth/                          # Authentication system
│   ├── guards/
│   │   ├── jwt-auth.guard.ts
│   │   └── roles.guard.ts
│   ├── decorators/
│   │   └── roles.decorator.ts
│   ├── auth.module.ts
│   ├── auth.service.ts
│   └── auth.controller.ts
├── entities/                      # Database entities
│   ├── poll.entity.ts
│   ├── candidate.entity.ts
│   ├── pollOption.entity.ts
│   ├── vote.entity.ts
│   ├── banner.entity.ts
│   └── admin.entity.ts
├── users/                         # User management
│   ├── user.entity.ts
│   ├── users.module.ts
│   └── users.service.ts
├── types/                         # Type definitions
│   └── enums.ts
└── app.module.ts                  # Main application module
```

## API Modules

### 1. Polls Module (`/api/polls`)
- **Purpose**: Manage voting polls
- **Features**: CRUD operations, active/expired polls, type-based filtering, visibility control
- **Access Control**: Create/Update/Delete - Admin only, Read - Public (visible polls only)

### 2. Candidates Module (`/api/candidates`)
- **Purpose**: Manage poll candidates
- **Features**: CRUD operations, name-based search
- **Access Control**: Create/Update/Delete - Admin only, Read - Public

### 3. Poll Options Module (`/api/poll-options`)
- **Purpose**: Manage poll voting options
- **Features**: CRUD operations, poll-specific options
- **Access Control**: Create/Update/Delete - Admin only, Read - Public

### 4. Votes Module (`/api/votes`)
- **Purpose**: Handle voting operations
- **Features**: Vote casting, statistics, user/poll-based queries
- **Access Control**: Vote casting - Authenticated users, Statistics - Public, Admin operations - Admin only

### 5. Banners Module (`/api/banners`)
- **Purpose**: Manage application banners
- **Features**: CRUD operations, reordering
- **Access Control**: Create/Update/Delete - Admin only, Read - Public

## Authentication & Authorization

### Guards
- **JwtAuthGuard**: Protects routes requiring authentication
- **RolesGuard**: Implements role-based access control

### Decorators
- **@Roles()**: Specifies required user roles for endpoints

### User Roles
- `normal_user`: Regular application user
- `admin_user`: Administrator with full access

## Data Transfer Objects (DTOs)

### Validation
- Uses `class-validator` for input validation
- All DTOs include proper validation decorators
- Supports partial updates for PATCH operations

### Structure
- **Create DTOs**: Required fields for entity creation
- **Update DTOs**: Partial DTOs extending create DTOs

## Database Entities

### Core Entities
1. **Polls**: Voting polls with types, dates, and metadata
2. **Candidates**: People/options that can be voted for
3. **PollOptions**: Specific voting options within polls
4. **Votes**: Individual user votes with timestamps
5. **Banners**: Application banners for UI
6. **Users**: Application users with authentication
7. **Admin**: Administrative users

### Relationships
- Polls → PollOptions → Candidates
- Users → Votes → PollOptions
- Polls → Votes (through PollOptions)

## API Features

### Public Endpoints
- Poll listing and details (visible polls only)
- Candidate information
- Poll options for active polls
- Vote statistics and counts
- Banner display

### Protected Endpoints
- Poll creation and management (Admin)
- Candidate management (Admin)
- Vote casting (Authenticated users)
- Banner management (Admin)

### Business Logic
- Vote validation (one vote per user per poll)
- Poll status checking (active/expired)
- Poll visibility filtering (hidden polls not shown to public)
- Vote statistics calculation
- Role-based access control

## Error Handling
- Comprehensive error responses
- Proper HTTP status codes
- Validation error messages
- Business logic error handling

## Future Enhancements
- Pagination for large datasets
- Rate limiting
- WebSocket support for real-time updates
- Advanced search and filtering
- Audit logging
- Caching strategies

## Dependencies Added
- `class-validator`: Input validation
- `class-transformer`: Object transformation
- `@nestjs/mapped-types`: DTO utilities

## Testing
- Unit tests for services
- Integration tests for controllers
- E2E tests for complete workflows

## Security Features
- JWT-based authentication
- Role-based authorization
- Input validation and sanitization
- SQL injection prevention (TypeORM)
- CORS configuration
