
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

const envPath = path.resolve(process.cwd(), '.env');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const supabaseUrl = envConfig.VITE_SUPABASE_URL
const supabaseAnonKey = envConfig.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function createAdmin() {
    const email = 'aline@gmail.com'.trim();
    const password = '28072330'.trim();

    console.log(`Email length: ${email.length}`);
    console.log(`Email chars: ${email.split('').map(c => c.charCodeAt(0))}`);

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: 'Admin User'
            }
        }
    })

    if (error) {
        console.error('Error creating user:', error.message, error.status)
    } else {
        console.log('User created successfully:', data)
    }
}

createAdmin()
