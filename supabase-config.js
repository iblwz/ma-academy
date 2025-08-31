// supabase-config.js (browser)
// Make sure this tag is loaded before any script using `supabase`:
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

const supabaseUrl = 'https://wviklrksdokairgllrzp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2aWtscmtzZG9rYWlyZ2xscnpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMjI5MjIsImV4cCI6MjA3MTg5ODkyMn0.pTNb6KBnjkSXsQVeZJqE5EsnQDmu_qr_pAfiepugFNA';

// Create client and expose globally as supabaseClient
if (typeof window.supabase === 'undefined' || typeof window.supabase.createClient !== 'function') {
  console.error('Supabase library not loaded! Make sure to include the Supabase script tag before this file.');
} else {
  try {
    window.supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);
    // For backward compatibility, also assign supabaseClient to window.supabase if not already a client
    if (!window.supabase.from) {
      window.supabase = window.supabaseClient;
    }
    console.log('Supabase client initialized successfully');
  } catch (error) {
    console.error('Error initializing Supabase client:', error);
  }
}