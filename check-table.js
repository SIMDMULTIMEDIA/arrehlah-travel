const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data, error } = await supabase.from('User').select('*').limit(1);
  if (error) {
    console.error("Error querying User:", error);
  } else {
    console.log("User exists!", data);
  }
}
check();
