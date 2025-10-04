# Supabase Integration Setup Guide

This guide will help you set up Supabase as the database backend for your NSS Volunteers System.

## Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com))
2. Node.js and npm installed on your system
3. Your existing NSS Volunteers System codebase

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `nss-volunteers-system` (or your preferred name)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose the region closest to your users
5. Click "Create new project"
6. Wait for the project to be set up (this may take a few minutes)

## Step 2: Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

## Step 3: Set Up Environment Variables

1. Copy the `env.example` file to `.env` in your project root:
   ```bash
   cp env.example .env
   ```

2. Edit the `.env` file and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## Step 4: Install Dependencies

Install the Supabase client library:
```bash
npm install @supabase/supabase-js
```

## Step 5: Set Up the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `database/supabase_schema.sql`
3. Paste it into the SQL Editor
4. Click "Run" to execute the schema

This will create all the necessary tables, indexes, and sample data.

## Step 6: Configure Row Level Security (RLS)

The schema includes basic RLS policies, but you may want to customize them based on your security requirements:

1. Go to **Authentication** → **Policies** in your Supabase dashboard
2. Review the policies for each table
3. Modify them as needed for your use case

## Step 7: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open your application in the browser
3. Try the following features to test Supabase integration:
   - Register a new user
   - Login with existing credentials
   - Create an event
   - Add achievements
   - Submit suggestions

## Step 8: Deploy to Production

When you're ready to deploy:

1. Update your production environment variables with your Supabase credentials
2. Deploy your application as usual
3. The application will automatically use Supabase instead of localStorage

## Troubleshooting

### Common Issues

1. **"Invalid API key" error**
   - Check that your `VITE_SUPABASE_ANON_KEY` is correct
   - Make sure there are no extra spaces or characters

2. **"Failed to fetch" error**
   - Check that your `VITE_SUPABASE_URL` is correct
   - Ensure your Supabase project is active

3. **Database connection issues**
   - Verify that the database schema was created successfully
   - Check the Supabase dashboard for any error messages

4. **RLS policy errors**
   - Review your Row Level Security policies
   - Make sure they allow the operations your app needs

### Debug Mode

To enable debug logging, add this to your `.env` file:
```env
VITE_SUPABASE_DEBUG=true
```

## Features Included

The Supabase integration includes:

- ✅ User management (registration, login, approval/rejection)
- ✅ Achievement tracking
- ✅ Certificate management
- ✅ Event management and registration
- ✅ Suggestion system
- ✅ Admin panel functionality
- ✅ Statistics and reporting
- ✅ QR code integration
- ✅ Fallback to localStorage if Supabase is unavailable

## Data Migration

If you have existing data in localStorage:

1. The application will automatically fall back to localStorage if Supabase is unavailable
2. To migrate existing data, you can export from localStorage and import into Supabase
3. The data adapter handles the conversion between formats automatically

## Security Considerations

1. **Environment Variables**: Never commit your `.env` file to version control
2. **RLS Policies**: Review and customize the Row Level Security policies
3. **API Keys**: Use the anon key for client-side operations
4. **Service Role Key**: Only use the service role key for server-side operations

## Support

If you encounter any issues:

1. Check the Supabase documentation: [docs.supabase.com](https://docs.supabase.com)
2. Review the console for error messages
3. Check the Supabase dashboard for database logs
4. Ensure all environment variables are set correctly

## Next Steps

After successful setup:

1. Customize the RLS policies for your security requirements
2. Set up database backups
3. Configure monitoring and alerts
4. Consider setting up authentication with Supabase Auth
5. Add real-time subscriptions for live updates

