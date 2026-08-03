import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  try {
    const body = await req.json().catch(() => ({}));
    const action = body.action;

    switch (action) {
      case "list_users": {
        // Get all users
        const response = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
          headers: {
            "apikey": supabaseServiceKey,
            "Authorization": `Bearer ${supabaseServiceKey}`,
          },
        });
        const data = await response.json();
        return new Response(JSON.stringify(data, null, 2), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "create_test_user": {
        const email = body.email || `test${Date.now()}@example.com`;
        const password = body.password || "Test123456!";
        const name = body.name || "Test User";

        // Create user via admin API
        const response = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
          method: "POST",
          headers: {
            "apikey": supabaseServiceKey,
            "Authorization": `Bearer ${supabaseServiceKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
            email_confirm: true, // Auto-confirm email
            user_metadata: { full_name: name },
          }),
        });

        const data = await response.json();
        return new Response(JSON.stringify({
          success: !data.error,
          email,
          response: data
        }, null, 2), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "test_login": {
        const { email, password } = body;

        // Test login via token endpoint
        const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
          method: "POST",
          headers: {
            "apikey": Deno.env.get("SUPABASE_ANON_KEY")!,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        return new Response(JSON.stringify({
          success: !!data.access_token,
          status: response.status,
          response: data
        }, null, 2), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      default:
        return new Response(JSON.stringify({
          error: "Unknown action",
          available_actions: ["list_users", "create_test_user", "test_login"]
        }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
