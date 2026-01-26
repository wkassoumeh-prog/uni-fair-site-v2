# Vercel Deployment Guide

## Fixed Issues

1. ✅ Updated `.gitignore` to exclude `.next/` directory
2. ✅ Fixed build-time errors in `app/actions/contact.ts` - no longer throws during build

## Required Environment Variables

Make sure to set these in your Vercel project settings (Settings → Environment Variables):

### Required for Build:
- None (build will succeed without these)

### Required for Runtime:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (for server actions)
- `RESEND_API_KEY` - Your Resend API key for sending emails
- `CONTACT_EMAIL` - Email address to receive contact form submissions

## Build Configuration

The project is configured to:
- Build successfully even if environment variables are missing
- Check for environment variables at runtime and show appropriate errors
- Use Next.js 15.5.9 with React 19

## Notes

- The `.next` directory is now properly ignored in `.gitignore`
- Server actions will gracefully handle missing environment variables
- All TypeScript types are properly configured
