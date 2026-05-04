import { createClient } from "@supabase/supabase-js";

let browserClient: any = null;

export function getSupabaseBrowserClient() {
  if (browserClient) {
    return browserClient;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error("Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.");
  }

  browserClient = createClient<any>(supabaseUrl, supabasePublishableKey);
  return browserClient;
}
