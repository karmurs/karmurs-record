import { getSupabaseClient } from '../lib/supabaseClient';
import type { RacingGameId } from './racingRecords';

export type RacingSetupVisibility = 'public' | 'private' | 'draft';

export type RacingSetupFormState = {
  game: RacingGameId;
  track: string;
  vehicle: string;
  setupName: string;
  visibility: RacingSetupVisibility;
  notes: string;
  frontPressure: string;
  rearPressure: string;
  frontCamber: string;
  rearCamber: string;
  brakeBias: string;
  abs: string;
  tractionControl: string;
  rearWing: string;
  fuel: string;
};

export type RacingSetupData = {
  tyres: {
    frontPressure: string;
    rearPressure: string;
  };
  alignment: {
    frontCamber: string;
    rearCamber: string;
  };
  aero: {
    rearWing: string;
  };
  brakes: {
    brakeBias: string;
    abs: string;
    tractionControl: string;
  };
  fuel: string;
};

export type RacingSetupInsert = {
  game: RacingGameId;
  track: string;
  vehicle: string;
  setup_name: string;
  visibility: RacingSetupVisibility;
  notes: string;
  setup_data: RacingSetupData;
  created_by: string;
};

export type RacingSetupUpdate = Omit<RacingSetupInsert, 'created_by'>;

export type RacingSetup = {
  id: string;
  game: RacingGameId;
  track: string;
  vehicle: string;
  setupName: string;
  visibility: RacingSetupVisibility;
  notes: string;
  setupData: RacingSetupData;
  createdAt: string;
};

type RacingSetupRow = {
  id: string;
  game: RacingGameId;
  track: string;
  vehicle: string;
  setup_name: string;
  visibility: RacingSetupVisibility;
  notes: string;
  setup_data: RacingSetupData;
  created_at: string;
};

export const defaultRacingSetupFormState: RacingSetupFormState = {
  game: 'acc',
  track: '',
  vehicle: '',
  setupName: '',
  visibility: 'draft',
  notes: '',
  frontPressure: '',
  rearPressure: '',
  frontCamber: '',
  rearCamber: '',
  brakeBias: '',
  abs: '',
  tractionControl: '',
  rearWing: '',
  fuel: ''
};

export function buildRacingSetupInsert(
  formState: RacingSetupFormState,
  userId: string
): RacingSetupInsert {
  return {
    ...buildRacingSetupUpdate(formState),
    created_by: userId
  };
}

export function buildRacingSetupUpdate(formState: RacingSetupFormState): RacingSetupUpdate {
  return {
    game: formState.game,
    track: formState.track.trim(),
    vehicle: formState.vehicle.trim(),
    setup_name: formState.setupName.trim(),
    visibility: formState.visibility,
    notes: formState.notes.trim(),
    setup_data: {
      tyres: {
        frontPressure: formState.frontPressure.trim(),
        rearPressure: formState.rearPressure.trim()
      },
      alignment: {
        frontCamber: formState.frontCamber.trim(),
        rearCamber: formState.rearCamber.trim()
      },
      aero: {
        rearWing: formState.rearWing.trim()
      },
      brakes: {
        brakeBias: formState.brakeBias.trim(),
        abs: formState.abs.trim(),
        tractionControl: formState.tractionControl.trim()
      },
      fuel: formState.fuel.trim()
    }
  };
}

export function mapRacingSetup(row: RacingSetupRow): RacingSetup {
  return {
    id: row.id,
    game: row.game,
    track: row.track,
    vehicle: row.vehicle,
    setupName: row.setup_name,
    visibility: row.visibility,
    notes: row.notes,
    setupData: row.setup_data,
    createdAt: row.created_at
  };
}

export function racingSetupToFormState(setup: RacingSetup): RacingSetupFormState {
  return {
    game: setup.game,
    track: setup.track,
    vehicle: setup.vehicle,
    setupName: setup.setupName,
    visibility: setup.visibility,
    notes: setup.notes,
    frontPressure: setup.setupData.tyres.frontPressure,
    rearPressure: setup.setupData.tyres.rearPressure,
    frontCamber: setup.setupData.alignment.frontCamber,
    rearCamber: setup.setupData.alignment.rearCamber,
    brakeBias: setup.setupData.brakes.brakeBias,
    abs: setup.setupData.brakes.abs,
    tractionControl: setup.setupData.brakes.tractionControl,
    rearWing: setup.setupData.aero.rearWing,
    fuel: setup.setupData.fuel
  };
}

export async function saveRacingSetup(formState: RacingSetupFormState, userId: string) {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return { error: 'Supabase env is not configured.' };
  }

  const payload = buildRacingSetupInsert(formState, userId);
  const { error } = await supabase.from('racing_setups').insert(payload);

  return { error: error?.message ?? null };
}

export async function updateRacingSetup(setupId: string, formState: RacingSetupFormState) {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return { error: 'Supabase env is not configured.' };
  }

  const payload = buildRacingSetupUpdate(formState);
  const { error } = await supabase.from('racing_setups').update(payload).eq('id', setupId);

  return { error: error?.message ?? null };
}

export async function deleteRacingSetup(setupId: string) {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return { error: 'Supabase env is not configured.' };
  }

  const { error } = await supabase.from('racing_setups').delete().eq('id', setupId);

  return { error: error?.message ?? null };
}

export async function fetchPublicRacingSetups() {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return { setups: [] as RacingSetup[], error: null };
  }

  const { data, error } = await supabase
    .from('racing_setups')
    .select('id,game,track,vehicle,setup_name,visibility,notes,setup_data,created_at')
    .eq('visibility', 'public')
    .order('created_at', { ascending: false });

  if (error) {
    return { setups: [] as RacingSetup[], error: error.message };
  }

  return {
    setups: ((data ?? []) as RacingSetupRow[]).map(mapRacingSetup),
    error: null
  };
}
