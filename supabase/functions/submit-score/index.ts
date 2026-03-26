import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SCORE_SECRET = Deno.env.get("SCORE_SECRET")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, content-type, apikey",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(body: object, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function generateSignature(wpm: number, score: number, secret: string): Promise<string> {
  const data = `${wpm}:${score}:${secret}`;
  const encoder = new TextEncoder();
  const buffer = await crypto.subtle.digest("SHA-256", encoder.encode(data));
  const hashArray = Array.from(new Uint8Array(buffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  // Verify user JWT
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return jsonResponse({ error: "Non authentifié" }, 401);
  }

  const supabaseAuth = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const token = authHeader.replace("Bearer ", "");
  const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(token);

  if (authError || !user) {
    return jsonResponse({ error: "Token invalide" }, 401);
  }

  // Parse body
  const { mode, score, wpm, errors, accuracy } = await req.json();

  if (mode == null || score == null || wpm == null || errors == null || accuracy == null) {
    return jsonResponse({ error: "Champs manquants" }, 400);
  }

  // Generate signature server-side
  const signature = await generateSignature(wpm, score, SCORE_SECRET);

  // Insert with service role (bypasses RLS)
  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const username = user.user_metadata?.username || user.email?.split("@")[0] || "anonyme";

  const { error: insertError } = await supabaseAdmin.from("leaderboard").insert({
    user_id: user.id,
    username,
    mode: String(mode),
    score,
    wpm,
    errors,
    accuracy,
    signature,
  });

  if (insertError) {
    return jsonResponse({ error: insertError.message }, 500);
  }

  return jsonResponse({ success: true });
});
