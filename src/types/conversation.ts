export interface Conversation {
  id: string;
  candidate_id: string;
  job_id: string;
  created_at: string;
  phone?: string | null;
  telegram_id?: string | null;
  channel?: 'whatsapp' | 'telegram' | null;
  job_listings?: {
    title: string;
  } | null;
  candidateDetails?: {
    id: string;
    name: string;
    phone?: string | null;
    telegram_id?: string | null;
  } | null;
}
