import { createClient } from "@supabase/supabase-js";

let browserClient: any = null;

export function getSupabaseBrowserClient() {
  if (browserClient) {
    return browserClient;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://yxgynsajxtnqhjqlhhpt.supabase.co";
  const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_BbuinIK2E3WpFeCjqgNynw_QHWNS0dU";

  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error("Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.");
  }

  browserClient = createClient<any>(supabaseUrl, supabasePublishableKey);
  return browserClient;
}
