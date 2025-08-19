import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jftramutcivefgkdorhy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmdHJhbXV0Y2l2ZWZna2Rvcmh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2MTcyNTMsImV4cCI6MjA3MDE5MzI1M30.5k0UGACllZojdNJrQItynlAthFGjcMZeAjsbxQjpvmg';
 
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
