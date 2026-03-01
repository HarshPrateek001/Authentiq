-- Run this in your Supabase SQL Editor to create the contact_messages table

CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Optional: Enable Row Level Security (RLS) but allow inserts from anon
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public inserts to contact_messages" 
ON public.contact_messages 
FOR INSERT 
WITH CHECK (true);

-- Only authenticated admins can view (assuming you have a way to identify admins, or just use the dashboard)
CREATE POLICY "Allow authenticated users to read contact_messages" 
ON public.contact_messages 
FOR SELECT 
USING (auth.role() = 'authenticated');
