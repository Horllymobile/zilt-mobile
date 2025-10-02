import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://jixeapwckxwxcskoieev.supabase.co";
const supabaseKey = "sb_publishable_zH9gfNFdumv_2L1SJMjwLQ_Fvssv0eP";
export const supabase = createClient(supabaseUrl, supabaseKey);
