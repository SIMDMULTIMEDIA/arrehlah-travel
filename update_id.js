const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres:Salisu0030%40%23@db.wsgxpkcqqeyxapdzlbil.supabase.co:5432/postgres' });
async function run() {
  await client.connect();
  await client.query(`UPDATE "User" SET id = '36252280-aff7-450f-9fec-02e62e81aacd' WHERE email = 'admin@arrehlah.com'`);
  console.log('Updated user id via pg directly');
  await client.end();
}
run();
