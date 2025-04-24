import { supabase } from '@/lib/supabase';

/**
 * Dohvaća ID trenutno prijavljenog poslodavca
 * @returns Promise koji se razrješava u employer_id ili null ako korisnik nije prijavljen
 */
export const getCurrentEmployerId = async (): Promise<string | null> => {
  try {
    console.log("Dohvaćam trenutnog poslodavca...");
    // Dohvati trenutnu sesiju
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user?.email) {
      console.log("Nema aktivne sesije ili email adrese korisnika");
      return null;
    }
    
    console.log("Email trenutnog korisnika:", session.user.email);
    
    // Dohvati employer_id na osnovu email adrese
    const { data: employer, error } = await supabase
      .from('employers')
      .select('id, company_name')
      .eq('email', session.user.email)
      .single();
    
    if (error) {
      console.error('Greška pri dohvaćanju employer ID-a:', error?.message, error);
      return null;
    }
    
    if (!employer) {
      console.log("Poslodavac nije pronađen za email:", session.user.email);
      return null;
    }
    
    console.log("Pronađen poslodavac:", employer.company_name, "ID:", employer.id);
    return employer.id;
  } catch (error: any) {
    console.error('Greška pri dohvaćanju ID-a trenutnog poslodavca:', error.message);
    return null;
  }
};

/**
 * Dohvaća ID trenutno prijavljenog poslodavca s podrškom za lokalno caching
 * @returns Promise koji se razrješava u employer_id ili null ako korisnik nije prijavljen
 */
export const getCurrentEmployerIdWithCache = async (): Promise<string | null> => {
  // Prvo provjeri cache u localStorage
  const cachedId = localStorage.getItem('currentEmployerId');
  if (cachedId) {
    console.log("Using cached employer ID:", cachedId);
    return cachedId;
  }
  
  // Ako nema u cacheu, dohvati iz baze
  const employerId = await getCurrentEmployerId();
  
  // Spremi u cache ako je dostupno
  if (employerId) {
    localStorage.setItem('currentEmployerId', employerId);
  }
  
  return employerId;
};

/**
 * Dohvaća podatke o trenutno prijavljenom poslodavcu
 * @returns Promise koji se razrješava u objekt s podacima o poslodavcu ili null
 */
export const getCurrentEmployer = async () => {
  try {
    // Dohvati trenutnu sesiju
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user?.email) {
      return null;
    }
    
    // Dohvati podatke o poslodavcu na osnovu email adrese
    const { data: employer, error } = await supabase
      .from('employers')
      .select('*')
      .eq('email', session.user.email)
      .single();
    
    if (error || !employer) {
      console.error('Greška pri dohvaćanju podataka o poslodavcu:', error?.message);
      return null;
    }
    
    return employer;
  } catch (error: any) {
    console.error('Greška pri dohvaćanju podataka o poslodavcu:', error.message);
    return null;
  }
};