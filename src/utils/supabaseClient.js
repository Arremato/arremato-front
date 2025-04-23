import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://lefezafkheutkakdtlqd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlZmV6YWZraGV1dGtha2R0bHFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzNDgwNzcsImV4cCI6MjA2MDkyNDA3N30.VZ_ynrrAtxpgnA9oupH1_rvWErwZfHEG5VJReSjVz-w';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);