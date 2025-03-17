
import { UserProfile } from '../../../types/auth';
import { ProfileType } from '../../../integrations/supabase/schema';

/**
 * Status of a profile after diagnostic verification
 */
export enum ProfileStatus {
  OK = 'ok',
  MISSING = 'missing',
  INCOMPLETE = 'incomplete',
  CORRUPT = 'corrupt',
  UNKNOWN = 'unknown'
}

/**
 * Result of a profile check
 */
export interface ProfileCheckResult {
  status: ProfileStatus;
  missingFields?: string[];
  corruptFields?: string[];
  canRepair: boolean;
}
