import { useEffect, useMemo, useState } from 'react';
import { deleteRacingSetup, type RacingSetup } from '../data/racingSetups';
import RacingSetupForm from './RacingSetupForm';
import SetupCarVisual from './SetupCarVisual';

type RacingSetupsPanelProps = {
  adminUserId?: string;
  error: string | null;
  focusNewestNonce?: number;
  gameTitle?: string;
  onChanged?: () => void | Promise<void>;
  setups: RacingSetup[];
};

const gameLabels: Record<RacingSetup['game'], string> = {
  acc: 'ACC',
  ace: 'ACE',
  lmu: 'LMU'
};

function getUniqueOptions(setups: RacingSetup[], field: 'track' | 'vehicle') {
  return Array.from(new Set(setups.map((setup) => setup[field]).filter(Boolean))).sort((a, b) =>
    a.localeCompare(b)
  );
}

export default function RacingSetupsPanel({
  adminUserId,
  error,
  focusNewestNonce,
  gameTitle = '공개',
  onChanged,
  setups
}: RacingSetupsPanelProps) {
  const [expandedId, setExpandedId] = useState<string | null>(setups[0]?.id ?? null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [actionStatus, setActionStatus] = useState('');
  const [selectedTrack, setSelectedTrack] = useState('all');
  const [selectedVehicle, setSelectedVehicle] = useState('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const trackOptions = useMemo(() => getUniqueOptions(setups, 'track'), [setups]);
  const vehicleOptions = useMemo(() => getUniqueOptions(setups, 'vehicle'), [setups]);
  const filteredSetups = useMemo(
    () =>
      setups.filter((setup) => {
        const matchesTrack = selectedTrack === 'all' || setup.track === selectedTrack;
        const matchesVehicle = selectedVehicle === 'all' || setup.vehicle === selectedVehicle;

        return matchesTrack && matchesVehicle;
      }),
    [selectedTrack, selectedVehicle, setups]
  );

  useEffect(() => {
    setExpandedId((current) => {
      if (current && filteredSetups.some((setup) => setup.id === current)) {
        return current;
      }

      return filteredSetups[0]?.id ?? null;
    });
  }, [filteredSetups]);

  useEffect(() => {
    if (!focusNewestNonce) {
      return;
    }

    setSelectedTrack('all');
    setSelectedVehicle('all');
    setExpandedId(setups[0]?.id ?? null);
  }, [focusNewestNonce, setups]);

  const handleDelete = async (setup: RacingSetup) => {
    const shouldDelete = window.confirm(`"${setup.setupName}" 셋업을 삭제할까요?`);

    if (!shouldDelete) {
      return;
    }

    setActionStatus('');
    setDeletingId(setup.id);
    const result = await deleteRacingSetup(setup.id);
    setDeletingId(null);

    if (result.error) {
      setActionStatus(result.error);
      return;
    }

    if (expandedId === setup.id) {
      setExpandedId(null);
    }
    if (editingId === setup.id) {
      setEditingId(null);
    }
    await onChanged?.();
    setActionStatus('Setup deleted.');
  };

  return (
    <section className="racing-setups-panel" aria-label="Published racing setups">
      <div className="racing-setups-heading">
        <div>
          <p className="hero-kicker">setup sheets</p>
          <h2>{gameTitle} 차량 셋업</h2>
        </div>
        <span>{setups.length} saved</span>
      </div>

      <div className="setup-filter-bar" aria-label="Setup filters">
        <label>
          Track
          <select onChange={(event) => setSelectedTrack(event.target.value)} value={selectedTrack}>
            <option value="all">All tracks</option>
            {trackOptions.map((track) => (
              <option key={track} value={track}>
                {track}
              </option>
            ))}
          </select>
        </label>
        <label>
          Vehicle
          <select onChange={(event) => setSelectedVehicle(event.target.value)} value={selectedVehicle}>
            <option value="all">All vehicles</option>
            {vehicleOptions.map((vehicle) => (
              <option key={vehicle} value={vehicle}>
                {vehicle}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error ? <p className="remote-record-status">Racing setups could not be loaded: {error}</p> : null}
      {actionStatus ? <p className="admin-status">{actionStatus}</p> : null}

      {filteredSetups.length > 0 ? (
        <div className="racing-setup-card-grid">
          {filteredSetups.map((setup) => {
            const isExpanded = expandedId === setup.id;

            return (
              <article className={`racing-setup-card racing-accent-${setup.game}`} key={setup.id}>
                <div className="setup-card-visual" aria-label={`${setup.vehicle} setup layout`} role="img">
                  <SetupCarVisual />
                </div>
                <div className="setup-card-copy">
                  <span>{gameLabels[setup.game]} · {setup.track}</span>
                  <strong>{setup.setupName}</strong>
                  <p>{setup.vehicle}</p>
                  <div className="setup-card-values">
                    <span>FP {setup.setupData.tyres.frontPressure || '-'}</span>
                    <span>RP {setup.setupData.tyres.rearPressure || '-'}</span>
                    <span>BB {setup.setupData.brakes.brakeBias || '-'}</span>
                    <span>ABS {setup.setupData.brakes.abs || '-'}</span>
                    <span>TC {setup.setupData.brakes.tractionControl || '-'}</span>
                    <span>Wing {setup.setupData.aero.rearWing || '-'}</span>
                  </div>
                  <button
                    aria-expanded={isExpanded}
                    className="setup-card-expand"
                    onClick={() => setExpandedId(isExpanded ? null : setup.id)}
                    type="button"
                  >
                    {isExpanded ? '접기' : '자세히 보기'}
                  </button>
                  {adminUserId ? (
                    <div className="setup-card-admin-actions">
                      <button
                        className="setup-card-expand"
                        onClick={() => {
                          setExpandedId(setup.id);
                          setEditingId(setup.id);
                          setActionStatus('');
                        }}
                        type="button"
                      >
                        수정
                      </button>
                      <button
                        className="setup-card-expand setup-card-delete"
                        disabled={deletingId === setup.id}
                        onClick={() => void handleDelete(setup)}
                        type="button"
                      >
                        {deletingId === setup.id ? '삭제 중' : '삭제'}
                      </button>
                    </div>
                  ) : null}
                  {isExpanded ? (
                    <div className="setup-card-details">
                      {editingId === setup.id && adminUserId ? (
                        <RacingSetupForm
                          initialSetup={setup}
                          onCancel={() => setEditingId(null)}
                          onSaved={async () => {
                            setEditingId(null);
                            await onChanged?.();
                            setActionStatus('Setup updated.');
                          }}
                          userId={adminUserId}
                        />
                      ) : (
                        <div className="setup-card-dashboard">
                        <div className="setup-card-panel setup-card-panel-front-left">
                          <span>Front left</span>
                          <dl>
                            <div>
                              <dt>PSI</dt>
                              <dd>{setup.setupData.tyres.frontPressure || '-'}</dd>
                            </div>
                            <div>
                              <dt>Camber</dt>
                              <dd>{setup.setupData.alignment.frontCamber || '-'}</dd>
                            </div>
                          </dl>
                        </div>
                        <div className="setup-card-panel setup-card-panel-front-right">
                          <span>Front right</span>
                          <dl>
                            <div>
                              <dt>PSI</dt>
                              <dd>{setup.setupData.tyres.frontPressure || '-'}</dd>
                            </div>
                            <div>
                              <dt>Camber</dt>
                              <dd>{setup.setupData.alignment.frontCamber || '-'}</dd>
                            </div>
                          </dl>
                        </div>
                        <div className="setup-card-panel setup-card-panel-front-control">
                          <span>Front control</span>
                          <dl>
                            <div>
                              <dt>Brake bias</dt>
                              <dd>{setup.setupData.brakes.brakeBias || '-'}</dd>
                            </div>
                            <div>
                              <dt>ABS</dt>
                              <dd>{setup.setupData.brakes.abs || '-'}</dd>
                            </div>
                          </dl>
                        </div>
                        <div className="setup-card-dashboard-car" aria-hidden="true">
                          <SetupCarVisual />
                        </div>
                        <div className="setup-card-panel setup-card-panel-rear-left">
                          <span>Rear left</span>
                          <dl>
                            <div>
                              <dt>PSI</dt>
                              <dd>{setup.setupData.tyres.rearPressure || '-'}</dd>
                            </div>
                            <div>
                              <dt>Camber</dt>
                              <dd>{setup.setupData.alignment.rearCamber || '-'}</dd>
                            </div>
                          </dl>
                        </div>
                        <div className="setup-card-panel setup-card-panel-rear-right">
                          <span>Rear right</span>
                          <dl>
                            <div>
                              <dt>PSI</dt>
                              <dd>{setup.setupData.tyres.rearPressure || '-'}</dd>
                            </div>
                            <div>
                              <dt>Camber</dt>
                              <dd>{setup.setupData.alignment.rearCamber || '-'}</dd>
                            </div>
                          </dl>
                        </div>
                        <div className="setup-card-panel setup-card-panel-rear-control">
                          <span>Rear control</span>
                          <dl>
                            <div>
                              <dt>TC</dt>
                              <dd>{setup.setupData.brakes.tractionControl || '-'}</dd>
                            </div>
                            <div>
                              <dt>Fuel</dt>
                              <dd>{setup.setupData.fuel || '-'}</dd>
                            </div>
                            <div>
                              <dt>Wing</dt>
                              <dd>{setup.setupData.aero.rearWing || '-'}</dd>
                            </div>
                          </dl>
                        </div>
                      </div>
                      )}
                      {setup.notes ? <p className="setup-card-note">{setup.notes}</p> : null}
                    </div>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <p className="imported-empty-state">
          조건에 맞는 공개 셋업이 없습니다. 다른 트랙이나 차량 필터로 다시 확인해보세요.
        </p>
      )}
    </section>
  );
}
