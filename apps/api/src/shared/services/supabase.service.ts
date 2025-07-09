import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { EnvKeys } from '../constants/env.const';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      process.env[EnvKeys.SUPABASE_URL]!,
      process.env[EnvKeys.SUPABASE_SERVICE_ROLE_KEY]!,
    );
  }

  async getUser(id: string) {
    return this.supabase.auth.admin.getUserById(id);
  }
}
