import { describe, expect, it } from 'vitest';
import {
  buildRacingSetupInsert,
  buildRacingSetupUpdate,
  mapRacingSetup,
  racingSetupToFormState
} from '../data/racingSetups';

describe('racing setups', () => {
  it('builds a setup insert payload with visual setup groups', () => {
    expect(
      buildRacingSetupInsert(
        {
          game: 'acc',
          track: 'Spa-Francorchamps',
          vehicle: 'BMW M4 GT3',
          setupName: 'Stable race setup',
          visibility: 'public',
          notes: 'Long stint balance',
          frontPressure: '26.8',
          rearPressure: '26.5',
          frontCamber: '-3.6',
          rearCamber: '-3.2',
          brakeBias: '54.2',
          abs: '3',
          tractionControl: '4',
          rearWing: '8',
          fuel: '62L'
        },
        'user-123'
      )
    ).toEqual({
      game: 'acc',
      track: 'Spa-Francorchamps',
      vehicle: 'BMW M4 GT3',
      setup_name: 'Stable race setup',
      visibility: 'public',
      notes: 'Long stint balance',
      setup_data: {
        tyres: {
          frontPressure: '26.8',
          rearPressure: '26.5'
        },
        alignment: {
          frontCamber: '-3.6',
          rearCamber: '-3.2'
        },
        aero: {
          rearWing: '8'
        },
        brakes: {
          brakeBias: '54.2',
          abs: '3',
          tractionControl: '4'
        },
        fuel: '62L'
      },
      created_by: 'user-123'
    });
  });

  it('maps public setup rows for the racing page', () => {
    expect(
      mapRacingSetup({
        id: 'setup-id',
        game: 'ace',
        track: 'Brands Hatch Indy',
        vehicle: 'Hyundai i30 N Hatchback',
        setup_name: 'Rotation test',
        visibility: 'public',
        notes: '',
        setup_data: {
          tyres: { frontPressure: '31', rearPressure: '30' },
          alignment: { frontCamber: '-2.0', rearCamber: '-1.5' },
          aero: { rearWing: '0' },
          brakes: { brakeBias: '58', abs: '2', tractionControl: '3' },
          fuel: '25L'
        },
        created_at: '2026-05-18T16:00:00+09:00'
      })
    ).toMatchObject({
      id: 'setup-id',
      game: 'ace',
      setupName: 'Rotation test',
      setupData: {
        tyres: { frontPressure: '31', rearPressure: '30' }
      }
    });
  });

  it('converts a saved setup back into editable form state', () => {
    expect(
      racingSetupToFormState({
        id: 'setup-id',
        game: 'acc',
        track: 'Brands Hatch',
        vehicle: 'Lamborghini Huracan GT3',
        setupName: 'Race balance',
        visibility: 'public',
        notes: 'Stable on exits',
        setupData: {
          tyres: { frontPressure: '27.2', rearPressure: '26.9' },
          alignment: { frontCamber: '-3.7', rearCamber: '-3.3' },
          aero: { rearWing: '7' },
          brakes: { brakeBias: '54.8', abs: '2', tractionControl: '4' },
          fuel: '54L'
        },
        createdAt: '2026-05-18T16:00:00+09:00'
      })
    ).toEqual({
      game: 'acc',
      track: 'Brands Hatch',
      vehicle: 'Lamborghini Huracan GT3',
      setupName: 'Race balance',
      visibility: 'public',
      notes: 'Stable on exits',
      frontPressure: '27.2',
      rearPressure: '26.9',
      frontCamber: '-3.7',
      rearCamber: '-3.3',
      brakeBias: '54.8',
      abs: '2',
      tractionControl: '4',
      rearWing: '7',
      fuel: '54L'
    });
  });

  it('builds an update payload without creation-only fields', () => {
    expect(
      buildRacingSetupUpdate({
        game: 'lmu',
        track: 'Fuji Speedway',
        vehicle: 'Oreca 07 Gibson',
        setupName: 'Low drag race',
        visibility: 'private',
        notes: 'Draft before publishing',
        frontPressure: '24.1',
        rearPressure: '23.9',
        frontCamber: '-3.1',
        rearCamber: '-2.4',
        brakeBias: '53.0',
        abs: '1',
        tractionControl: '2',
        rearWing: '4',
        fuel: ''
      })
    ).toEqual({
      game: 'lmu',
      track: 'Fuji Speedway',
      vehicle: 'Oreca 07 Gibson',
      setup_name: 'Low drag race',
      visibility: 'private',
      notes: 'Draft before publishing',
      setup_data: {
        tyres: {
          frontPressure: '24.1',
          rearPressure: '23.9'
        },
        alignment: {
          frontCamber: '-3.1',
          rearCamber: '-2.4'
        },
        aero: {
          rearWing: '4'
        },
        brakes: {
          brakeBias: '53.0',
          abs: '1',
          tractionControl: '2'
        },
        fuel: ''
      }
    });
  });
});
