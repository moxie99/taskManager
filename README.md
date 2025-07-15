# Task Manager App

A modern, full-stack task management application built with React, TypeScript, Tailwind CSS, and Supabase. Features user authentication, CRUD operations, real-time updates, and advanced task analytics through Edge Functions.

![Task Manager Preview](https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop)

## Features

- 🔐 **Authentication**: Secure email/password signup and login with Supabase Auth
- ✅ **Task Management**: Complete CRUD operations with real-time updates
- 🏷️ **Advanced Task Properties**: Status tracking, priority levels, due dates, and tags
- 📊 **Analytics Dashboard**: Task insights and completion metrics via Edge Functions
- 🔍 **Smart Filtering**: Filter by status with live counts and search functionality
- 📱 **Responsive Design**: Beautiful, modern UI that works on all devices
- 🔒 **Row Level Security**: Users can only access their own tasks
- ⚡ **Real-time Updates**: Instant synchronization across the application

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions)
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Styling**: Tailwind CSS with glassmorphism effects

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- A Supabase account ([sign up here](https://supabase.com))

### 1. Clone and Install

```bash
git clone <repository-url>
cd task-manager-app
npm install
```

### 2. Supabase Setup

1. **Create a new Supabase project** at [supabase.com](https://supabase.com)

2. **Get your project credentials**:
   - Go to Settings → API
   - Copy your `Project URL` and `anon public` key

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Fill in your Supabase credentials in `.env`:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### 3. Database Setup

The database schema will be automatically created when you connect to Supabase through the app. Alternatively, you can run the migration manually:

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the migration file content from `supabase/migrations/create_tasks_table.sql`

### 4. Edge Function Deployment

The Edge Function is automatically deployed to Supabase. The function code is located in `supabase/functions/task-insights/index.ts` and provides analytics about user tasks.

### 5. Run the Application

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

### 6. Authentication Setup

- Email confirmation is disabled by default for easier development
- Users can sign up with any email/password combination
- Authentication state is managed automatically

## Supabase Schema Description

### Tables

#### `tasks`
The main table storing all user tasks with the following structure:

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| `id` | `uuid` | Primary key | `DEFAULT gen_random_uuid()` |
| `title` | `text` | Task title | `NOT NULL` |
| `description` | `text` | Task description | Optional, `DEFAULT ''` |
| `status` | `text` | Task status | `CHECK (status IN ('pending', 'in-progress', 'done'))`, `DEFAULT 'pending'` |
| `extras` | `jsonb` | Additional task data | `DEFAULT '{}'` |
| `user_id` | `uuid` | Foreign key to auth.users | `NOT NULL`, `REFERENCES auth.users(id) ON DELETE CASCADE` |
| `created_at` | `timestamptz` | Creation timestamp | `DEFAULT now()` |
| `updated_at` | `timestamptz` | Last update timestamp | `DEFAULT now()` |

#### `extras` JSONB Structure
The `extras` column stores additional task metadata:

```json
{
  "tags": ["work", "urgent"],
  "due_date": "2024-01-15",
  "priority": "high"
}
```

**Supported fields**:
- `tags`: Array of strings for task categorization
- `due_date`: ISO date string for task deadline
- `priority`: String enum (`"low"`, `"medium"`, `"high"`)

### Indexes

- `idx_tasks_user_id`: Optimizes queries by user
- `idx_tasks_status`: Optimizes status filtering
- `idx_tasks_user_status`: Composite index for user + status queries

### Row Level Security (RLS)

All tables have RLS enabled with the following policies:

**`tasks` table policies**:
- `Users can read own tasks`: `SELECT` for `auth.uid() = user_id`
- `Users can insert own tasks`: `INSERT` with `auth.uid() = user_id`
- `Users can update own tasks`: `UPDATE` for `auth.uid() = user_id`
- `Users can delete own tasks`: `DELETE` for `auth.uid() = user_id`

### Triggers

- `update_tasks_updated_at`: Automatically updates `updated_at` timestamp on row modifications

### Edge Functions

#### `task-insights`
Located at `/functions/v1/task-insights`, this function provides analytics:

**Returns**:
```typescript
{
  totalTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  completionRate: number;
  mostRecentTask: string | null;
  tasksByMonth: { [key: string]: number };
  priorityDistribution: { [key: string]: number };
}
```

**Authentication**: Requires valid JWT token in Authorization header

## Development Notes

### What I'd Build Next If I Had More Time

#### 1. **Advanced Collaboration Features**
- **Team Workspaces**: Allow users to create teams and share tasks
- **Task Assignment**: Assign tasks to specific team members
- **Comments & Activity Feed**: Real-time commenting system with activity tracking
- **Mentions & Notifications**: @mention system with push notifications
- **Role-based Permissions**: Admin, member, and viewer roles with different access levels

#### 2. **Enhanced Task Management**
- **Subtasks & Dependencies**: Break down complex tasks into smaller subtasks with dependency tracking
- **Task Templates**: Create reusable task templates for common workflows
- **Recurring Tasks**: Set up tasks that automatically repeat on schedules
- **Time Tracking**: Built-in time tracking with productivity analytics
- **File Attachments**: Upload and attach files to tasks using Supabase Storage
- **Task Relationships**: Link related tasks and visualize connections

#### 3. **Advanced Analytics & Reporting**
- **Productivity Dashboard**: Comprehensive analytics with charts and trends
- **Custom Reports**: Generate custom reports with date ranges and filters
- **Time-based Analytics**: Track productivity patterns over time
- **Goal Setting & Tracking**: Set and monitor productivity goals
- **Export Functionality**: Export tasks and reports to CSV, PDF formats
- **Burndown Charts**: Visualize project progress over time

#### 4. **Mobile & Offline Experience**
- **Progressive Web App (PWA)**: Full offline functionality with service workers
- **Mobile App**: React Native app for iOS and Android
- **Offline Sync**: Robust offline-first architecture with conflict resolution
- **Push Notifications**: Real-time notifications for task updates and deadlines
- **Mobile-optimized UI**: Touch-friendly interface with swipe gestures

#### 5. **Integration & Automation**
- **Calendar Integration**: Sync with Google Calendar, Outlook, etc.
- **Email Integration**: Create tasks from emails, send task summaries
- **Slack/Discord Bots**: Manage tasks directly from chat platforms
- **Zapier Integration**: Connect with 1000+ apps for workflow automation
- **API Webhooks**: Real-time webhooks for external integrations
- **Import/Export**: Support for importing from other task management tools

#### 6. **AI & Smart Features**
- **Smart Task Suggestions**: AI-powered task recommendations based on patterns
- **Natural Language Processing**: Create tasks using natural language input
- **Automatic Categorization**: AI-powered tag and priority suggestions
- **Deadline Prediction**: Predict task completion times based on historical data
- **Smart Scheduling**: Optimal task scheduling based on priority and deadlines
- **Voice Commands**: Voice-to-text task creation and management

#### 7. **Performance & Scalability**
- **Real-time Subscriptions**: WebSocket connections for live updates
- **Advanced Caching**: Redis caching layer for improved performance
- **Database Optimization**: Query optimization and connection pooling
- **CDN Integration**: Global content delivery for faster loading
- **Monitoring & Logging**: Comprehensive application monitoring with Sentry
- **Load Testing**: Performance testing and optimization

#### 8. **Security & Compliance**
- **Two-Factor Authentication**: Enhanced security with 2FA
- **Audit Logs**: Complete audit trail for all user actions
- **Data Encryption**: End-to-end encryption for sensitive data
- **GDPR Compliance**: Full compliance with data protection regulations
- **SSO Integration**: Single sign-on with corporate identity providers
- **Security Scanning**: Automated vulnerability scanning and updates

#### 9. **User Experience Enhancements**
- **Dark Mode**: Complete dark theme implementation
- **Keyboard Shortcuts**: Power user keyboard navigation
- **Drag & Drop**: Intuitive drag-and-drop task management
- **Bulk Operations**: Select and modify multiple tasks at once
- **Advanced Search**: Full-text search with filters and saved searches
- **Customizable Views**: Kanban board, calendar view, timeline view
- **Themes & Customization**: Personalized themes and layout options

#### 10. **Developer Experience**
- **GraphQL API**: More flexible API with GraphQL
- **SDK Development**: Official SDKs for popular programming languages
- **Comprehensive Testing**: Unit, integration, and E2E test coverage
- **CI/CD Pipeline**: Automated testing and deployment
- **Documentation**: Interactive API documentation and developer guides
- **Monitoring Dashboard**: Real-time application health monitoring

### Technical Debt & Improvements

- **Error Boundary**: Implement React error boundaries for better error handling
- **Loading States**: More sophisticated loading states and skeleton screens
- **Optimistic Updates**: Implement optimistic UI updates for better UX
- **Code Splitting**: Implement route-based code splitting for better performance
- **Accessibility**: Full WCAG 2.1 AA compliance with screen reader support
- **Internationalization**: Multi-language support with i18n
- **Performance Monitoring**: Real-time performance tracking and optimization

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you have any questions or need help setting up the project, please open an issue or contact the development team.