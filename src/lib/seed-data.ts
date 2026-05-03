import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const firstNames = ['Aarav', 'Aditi', 'Siddharth', 'Ishani', 'Vikram', 'Ananya', 'Arjun', 'Priya', 'Raj', 'Sonia', 'Kevin', 'Sarah', 'Chen', 'Mei', 'Ahmed', 'Fatima', 'Hans', 'Ingrid', 'Luca', 'Giulia'];
const lastNames = ['Patel', 'Iyer', 'Sharma', 'Reddy', 'Gupta', 'Singh', 'Chen', 'Wang', 'Dubois', 'Muller', 'Smith', 'Johnson', 'Garcia', 'Martinez', 'Ali', 'Khan', 'Rossi', 'Bianchi', 'Tanaka', 'Sato'];
const wards = ['Ward 4', 'ICU 1', 'ER', 'Cardiac Wing', 'Neuro ICU', 'Post-Op'];

async function seedData() {
  console.log('Starting data injection...');

  for (let i = 0; i < 30; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const mrn = `MRN-${Math.floor(100000 + Math.random() * 900000)}`;
    const status = Math.random() > 0.8 ? 'CRITICAL' : (Math.random() > 0.6 ? 'WATCH' : 'STABLE');
    
    try {
      const { data: patient, error: pError } = await supabase
        .from('patients')
        .insert({
          mrn,
          first_name: firstName,
          last_name: lastName,
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
          date_of_birth: new Date(1950 + Math.floor(Math.random() * 50), 0, 1).toISOString(),
          gender: Math.random() > 0.5 ? 'M' : 'F',
          ward: wards[Math.floor(Math.random() * wards.length)],
          bed_no: `${Math.floor(1 + Math.random() * 20)}`,
          status: status,
          severity_score: status === 'CRITICAL' ? 80 + Math.floor(Math.random() * 20) : (status === 'WATCH' ? 50 + Math.floor(Math.random() * 20) : Math.floor(Math.random() * 30))
        })
        .select()
        .single();

      if (pError) throw pError;

      // Add vitals
      await supabase.from('vitals').insert({
        patient_id: patient.id,
        heart_rate: 60 + Math.floor(Math.random() * 40 + (status === 'CRITICAL' ? 30 : 0)),
        blood_pressure_sys: 110 + Math.floor(Math.random() * 40 + (status === 'CRITICAL' ? 20 : 0)),
        blood_pressure_dia: 70 + Math.floor(Math.random() * 20),
        sp_o2: 90 + Math.floor(Math.random() * 10 - (status === 'CRITICAL' ? 5 : 0)),
        temperature: 36.5 + (Math.random() * 2 + (status === 'CRITICAL' ? 1 : 0)),
        respiration_rate: 12 + Math.floor(Math.random() * 8 + (status === 'CRITICAL' ? 10 : 0))
      });

      console.log(`Injected ${firstName} ${lastName}`);
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (e) {
      console.error(`Error injecting patient ${i}:`, e);
    }
  }

  console.log('Injection complete.');
}

seedData();
