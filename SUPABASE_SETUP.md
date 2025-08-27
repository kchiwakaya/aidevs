# Supabase Setup Guide

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization and enter project details
4. Wait for the project to be created

## 2. Get Your Project Credentials

1. Go to your project dashboard
2. Navigate to Settings > API
3. Copy your Project URL and anon/public key

## 3. Configure Environment Variables

1. Copy `env.example` to `.env.local`
2. Replace the placeholder values with your actual Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 4. Set Up Database Schema

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase-schema.sql`
4. Run the SQL to create all tables, indexes, and policies

## 5. Test the Connection

1. Start your development server: `npm run dev`
2. Navigate to `/polls` - you should see the polls page
3. Try creating a new poll at `/polls/new`

## Database Schema Overview

- **polls**: Main poll information (title, description, etc.)
- **poll_options**: Individual options for each poll
- **votes**: Records of user votes (prevents duplicate voting)
- **auth.users**: Supabase's built-in user authentication

## Features Included

- ✅ Real-time polls with voting
- ✅ User authentication ready
- ✅ Row Level Security (RLS) policies
- ✅ Prevent duplicate voting
- ✅ Optimized database indexes
- ✅ TypeScript types for all data

## Next Steps

1. Implement user authentication using Supabase Auth
2. Add real-time updates using Supabase subscriptions
3. Create user profiles and poll management
4. Add analytics and poll statistics
