import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import SetupCarVisual from './SetupCarVisual';
import {
  getCarDisplayName,
  getTrackDisplayName,
  racingCarCatalog,
  racingTrackCatalog
} from '../data/racingCatalog';
import {
  defaultRacingSetupFormState,
  racingSetupToFormState,
  saveRacingSetup,
  updateRacingSetup,
  type RacingSetup,
  type RacingSetupFormState,
  type RacingSetupVisibility
} from '../data/racingSetups';
import type { RacingGameId } from '../data/racingRecords';

type RacingSetupFormProps = {
  initialSetup?: RacingSetup;
  onCancel?: () => void;
  onSaved?: (savedSetup: Pick<RacingSetupFormState, 'game' | 'visibility'>) => void | Promise<void>;
  userId: string;
};

const gameOptions: Array<{ label: string; value: RacingGameId }> = [
  { label: 'ACC', value: 'acc' },
  { label: 'ACE', value: 'ace' },
  { label: 'LMU', value: 'lmu' }
];

const visibilityOptions: Array<{ label: string; value: RacingSetupVisibility }> = [
  { label: 'Draft', value: 'draft' },
  { label: 'Private', value: 'private' },
  { label: 'Public', value: 'public' }
];

export default function RacingSetupForm({ initialSetup, onCancel, onSaved, userId }: RacingSetupFormProps) {
  const [formState, setFormState] = useState<RacingSetupFormState>(
    initialSetup ? racingSetupToFormState(initialSetup) : defaultRacingSetupFormState
  );
  const [status, setStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const isEditing = Boolean(initialSetup);
  const trackOptions = racingTrackCatalog.filter((track) => track.gameId === formState.game);
  const carOptions = racingCarCatalog.filter((car) => car.gameId === formState.game);

  useEffect(() => {
    setFormState(initialSetup ? racingSetupToFormState(initialSetup) : defaultRacingSetupFormState);
    setStatus('');
  }, [initialSetup]);

  const updateForm = (field: keyof RacingSetupFormState, value: string) => {
    setFormState((current) => ({ ...current, [field]: value }));
  };

  const updateGame = (game: RacingGameId) => {
    setFormState((current) => ({ ...current, game, track: '', vehicle: '' }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setStatus('');

    const result = initialSetup
      ? await updateRacingSetup(initialSetup.id, formState)
      : await saveRacingSetup(formState, userId);

    setIsSaving(false);

    if (result.error) {
      setStatus(result.error);
      return;
    }

    setStatus(
      isEditing
        ? 'Setup updated.'
        : formState.visibility === 'public'
          ? 'Public setup saved.'
          : 'Setup draft saved.'
    );
    await onSaved?.({ game: formState.game, visibility: formState.visibility });
    if (!isEditing) {
      setFormState({ ...defaultRacingSetupFormState, game: formState.game });
    }
  };

  return (
    <form className="admin-card racing-setup-form" onSubmit={handleSubmit}>
      <div className="admin-card-heading">
        <span className="admin-card-kicker">racing setup</span>
        <strong>{isEditing ? '차량 셋업 수정' : '차량 셋업 입력'}</strong>
      </div>

      <div className="racing-setup-workbench">
        <div className="racing-setup-fields">
          <fieldset className="admin-choice-field">
            <legend>Game</legend>
            <div className="admin-choice-group" role="group" aria-label="Racing setup game">
              {gameOptions.map((option) => (
                <button
                  aria-pressed={formState.game === option.value}
                  className="admin-choice-button"
                  key={option.value}
                  onClick={() => updateGame(option.value)}
                  type="button"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="admin-choice-field">
            <legend>Visibility</legend>
            <div className="admin-choice-group" role="group" aria-label="Racing setup visibility">
              {visibilityOptions.map((option) => (
                <button
                  aria-pressed={formState.visibility === option.value}
                  className="admin-choice-button"
                  key={option.value}
                  onClick={() => updateForm('visibility', option.value)}
                  type="button"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </fieldset>

          <label>
            Setup name
            <input
              onChange={(event) => updateForm('setupName', event.target.value)}
              required
              value={formState.setupName}
            />
          </label>
          <label>
            Track
            <select
              onChange={(event) => updateForm('track', event.target.value)}
              required
              value={formState.track}
            >
              <option value="">Select track</option>
              {trackOptions.map((track) => (
                <option
                  key={`${track.gameId}-${track.name}-${track.layout ?? 'default'}`}
                  value={getTrackDisplayName(track)}
                >
                  {getTrackDisplayName(track)}
                </option>
              ))}
            </select>
          </label>
          <label>
            Vehicle
            <select
              onChange={(event) => updateForm('vehicle', event.target.value)}
              required
              value={formState.vehicle}
            >
              <option value="">Select vehicle</option>
              {carOptions.map((car) => (
                <option key={`${car.gameId}-${car.brand}-${car.name}`} value={getCarDisplayName(car)}>
                  {car.brand} · {car.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className={`setup-dashboard racing-accent-${formState.game}`}>
        <div className="setup-dashboard-panel setup-dashboard-front-left">
          <span>Front left</span>
          <div className="setup-panel-telemetry" aria-hidden="true">
            <span className="setup-damper" />
            <span className="setup-mini-bars" />
          </div>
          <label>
            PSI
            <input onChange={(event) => updateForm('frontPressure', event.target.value)} value={formState.frontPressure} />
          </label>
          <label>
            Camber
            <input onChange={(event) => updateForm('frontCamber', event.target.value)} value={formState.frontCamber} />
          </label>
        </div>

        <div className="setup-dashboard-panel setup-dashboard-front-right">
          <span>Front right</span>
          <div className="setup-panel-telemetry" aria-hidden="true">
            <span className="setup-damper" />
            <span className="setup-mini-bars" />
          </div>
          <label>
            PSI
            <input onChange={(event) => updateForm('frontPressure', event.target.value)} value={formState.frontPressure} />
          </label>
          <label>
            Camber
            <input onChange={(event) => updateForm('frontCamber', event.target.value)} value={formState.frontCamber} />
          </label>
        </div>

        <div className="setup-car-diagram" aria-label="Vehicle setup layout" role="img">
          <SetupCarVisual />
          <span className="setup-label setup-label-front">Front</span>
          <span className="setup-label setup-label-rear">Rear</span>
        </div>

        <div className="setup-dashboard-panel setup-dashboard-front-center">
          <span>Front control</span>
          <label>
            Brake bias
            <input onChange={(event) => updateForm('brakeBias', event.target.value)} value={formState.brakeBias} />
          </label>
          <label>
            ABS
            <input onChange={(event) => updateForm('abs', event.target.value)} value={formState.abs} />
          </label>
        </div>

        <div className="setup-dashboard-panel setup-dashboard-rear-left">
          <span>Rear left</span>
          <div className="setup-panel-telemetry" aria-hidden="true">
            <span className="setup-damper" />
            <span className="setup-mini-bars" />
          </div>
          <label>
            PSI
            <input onChange={(event) => updateForm('rearPressure', event.target.value)} value={formState.rearPressure} />
          </label>
          <label>
            Camber
            <input onChange={(event) => updateForm('rearCamber', event.target.value)} value={formState.rearCamber} />
          </label>
        </div>

        <div className="setup-dashboard-panel setup-dashboard-rear-right">
          <span>Rear right</span>
          <div className="setup-panel-telemetry" aria-hidden="true">
            <span className="setup-damper" />
            <span className="setup-mini-bars" />
          </div>
          <label>
            PSI
            <input onChange={(event) => updateForm('rearPressure', event.target.value)} value={formState.rearPressure} />
          </label>
          <label>
            Camber
            <input onChange={(event) => updateForm('rearCamber', event.target.value)} value={formState.rearCamber} />
          </label>
        </div>

        <div className="setup-dashboard-panel setup-dashboard-rear-center">
          <span>Rear control</span>
          <label>
            TC
            <input onChange={(event) => updateForm('tractionControl', event.target.value)} value={formState.tractionControl} />
          </label>
          <label>
            Fuel
            <input onChange={(event) => updateForm('fuel', event.target.value)} value={formState.fuel} />
          </label>
          <label>
            Rear wing
            <input onChange={(event) => updateForm('rearWing', event.target.value)} value={formState.rearWing} />
          </label>
        </div>
      </div>

      <label>
        Notes
        <textarea onChange={(event) => updateForm('notes', event.target.value)} rows={4} value={formState.notes} />
      </label>

      <div className="setup-form-actions">
        <button className="admin-submit" disabled={isSaving} type="submit">
          {isSaving ? 'Saving...' : isEditing ? 'Update setup' : 'Save setup'}
        </button>
        {isEditing && onCancel ? (
          <button className="setup-card-expand" disabled={isSaving} onClick={onCancel} type="button">
            취소
          </button>
        ) : null}
      </div>
      {status ? <p className="admin-status">{status}</p> : null}
    </form>
  );
}
