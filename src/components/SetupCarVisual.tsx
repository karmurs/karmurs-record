const SETUP_CAR_VISUAL = 'racing/setup-car-top-view.svg';

function getPublicAssetPath(path: string) {
  const base = window.location.pathname.endsWith('/admin') ? '../' : import.meta.env.BASE_URL;
  return `${base}${path}`;
}

export default function SetupCarVisual() {
  return (
    <div className="setup-car-render">
      <img
        alt=""
        className="setup-car-image"
        draggable="false"
        src={getPublicAssetPath(SETUP_CAR_VISUAL)}
      />
    </div>
  );
}
