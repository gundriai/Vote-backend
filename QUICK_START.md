# MeroVote Backend - Quick Start Guide

## Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn package manager

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Vote-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_NAME=vote_backend
   
   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=24h
   
   # Admin Configuration
   ROOT_ADMIN_EMAIL=admin@example.com
   
   # OAuth Configuration (if using social login)
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   FACEBOOK_APP_ID=your_facebook_app_id
   FACEBOOK_APP_SECRET=your_facebook_app_secret
   ```

4. **Database Setup**
   ```bash
   # Create PostgreSQL database
   createdb vote_backend
   
   # The application will automatically create tables on first run
   # due to synchronize: true in TypeORM config
   ```

## Running the Application

### Development Mode
```bash
npm run start:dev
```
The application will start on `http://localhost:3000`

### Production Build
```bash
npm run build
npm run start:prod
```

## API Testing

### 1. Test Public Endpoints
```bash
# Get all polls
curl http://localhost:3000/api/polls

# Get active polls
curl http://localhost:3000/api/polls/active

# Get all candidates
curl http://localhost:3000/api/candidates

# Get all banners
curl http://localhost:3000/api/banners
```

### 2. Test Protected Endpoints (Requires Authentication)
```bash
# First, get a JWT token through authentication
# Then use it in subsequent requests

# Create a poll (Admin only)
curl -X POST http://localhost:3000/api/polls \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Poll",
    "description": "A test poll",
    "type": "daily_rating",
    "startDate": "2024-01-01T00:00:00Z",
    "endDate": "2024-01-31T23:59:59Z",
    "createdBy": "user-uuid"
  }'
```

## Database Schema

The application automatically creates the following tables:
- `users` - User accounts
- `admins` - Administrative users
- `polls` - Voting polls
- `candidates` - Poll candidates
- `pollOption` - Poll voting options
- `votes` - User votes
- `banner` - Application banners

## Key Features

### Authentication
- JWT-based authentication
- Social login (Google, Facebook)
- Role-based access control

### Poll Management
- Create, read, update, delete polls
- Different poll types (daily_rating, political_rating, face_to_face)
- Active/expired poll filtering

### Voting System
- One vote per user per poll
- Real-time vote statistics
- Vote validation and security

### Admin Features
- Full CRUD operations for all entities
- User role management
- System configuration

## Development Workflow

### 1. Adding New Endpoints
1. Create DTOs in the appropriate module
2. Add service methods
3. Create controller endpoints
4. Update module configuration
5. Add to main API module

### 2. Database Changes
1. Modify entity files
2. Update DTOs if needed
3. Restart application (tables will auto-sync)

### 3. Testing
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Common Issues & Solutions

### Database Connection Issues
- Ensure PostgreSQL is running
- Check database credentials in `.env`
- Verify database exists

### JWT Authentication Issues
- Check JWT_SECRET in `.env`
- Ensure token is not expired
- Verify token format in Authorization header

### CORS Issues
- Check CORS configuration in main.ts
- Ensure frontend origin is allowed

## API Documentation

For detailed API documentation, see:
- `API_ENDPOINTS.md` - Complete endpoint reference
- `API_STRUCTURE.md` - Architecture overview

## Contributing

1. Follow NestJS conventions
2. Add proper validation to DTOs
3. Implement proper error handling
4. Add tests for new features
5. Update documentation

## Support

For issues and questions:
1. Check existing documentation
2. Review error logs
3. Check database connectivity
4. Verify environment configuration
