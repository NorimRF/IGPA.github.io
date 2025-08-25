// supabase.js
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// 🔑 Valores de tu proyecto Supabase
const SUPABASE_URL = "https://judgcgfijlhytvxgrzci.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1ZGdjZ2ZpamxoeGdyeiIsImV4cCI6MjA3MTcwODM2MX0.NcHHqZxlVjMVssNsbFalVqQk3cvbGOs28H9Uw5Nrv60";

// Cliente global de Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
