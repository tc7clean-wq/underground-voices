const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Get our Supabase credentials from environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

console.log('Loading environment variables...');
console.log('SUPABASE_URL:', supabaseUrl ? 'Found' : 'NOT FOUND');
console.log('SUPABASE_ANON_KEY:', supabaseKey ? 'Found' : 'NOT FOUND');

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing environment variables. Please check your .env file.');
  console.error('Looking for .env at:', path.join(__dirname, '..', '.env'));
  process.exit(1);
}

// Create the Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to initialize database tables
async function initializeDatabase() {
  try {
    console.log('🔧 Setting up database tables...');
    
    // Create users table (if it doesn't exist)
    const { error: usersError } = await supabase.rpc('create_users_table');
    if (usersError && !usersError.message.includes('already exists')) {
      console.error('Error creating users table:', usersError);
    }
    
    // Create articles table
    const { error: articlesError } = await supabase.rpc('create_articles_table');
    if (articlesError && !articlesError.message.includes('already exists')) {
      console.error('Error creating articles table:', articlesError);
    }
    
    // Create storyboards table
    const { error: storyboardsError } = await supabase.rpc('create_storyboards_table');
    if (storyboardsError && !storyboardsError.message.includes('already exists')) {
      console.error('Error creating storyboards table:', storyboardsError);
    }
    
    console.log('✅ Database setup complete!');
  } catch (error) {
    console.error('❌ Database setup failed:', error);
  }
}

// Export the Supabase client and initialization function
module.exports = { supabase, initializeDatabase };
