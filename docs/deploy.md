# Deployment

Karmurs' Record is a static Vite site. Build output is written to `dist/` and can be uploaded to any static host.

Planned GitHub repository:

- Owner: `kams227-cyber`
- Owner: `karmurs`
- Repository: `karmurs-record`
- Public URL: `https://karmurs.github.io/karmurs-record/`

## Quick Check

```powershell
npm test
npm run build
npm run preview
```

Open the preview URL and confirm the homepage, section cards, archive, and detail pages work.

## GitHub Pages

1. Create a GitHub repository named `karmurs-record` under `karmurs`.
2. In GitHub, open `Settings > Secrets and variables > Actions`.
3. Add repository variable `VITE_SUPABASE_URL` with the project base URL, for example `https://PROJECT_REF.supabase.co`.
4. Add repository secret `VITE_SUPABASE_ANON_KEY` with the Supabase publishable/anon key.
5. Open `Settings > Pages`.
6. Set the source to `GitHub Actions`.
7. Push this project to `main`.

The workflow at `.github/workflows/deploy.yml` will build the site and publish `dist/`.
It intentionally fails before build if the Supabase values are missing, so the deployed site does not silently lose public records, images, or admin connectivity.

Do not add `CODEX_DEVLOG_ADMIN_EMAIL` or `CODEX_DEVLOG_ADMIN_PASSWORD` to the Pages workflow. Those values are only for the local daily Devlog draft uploader or a separate trusted automation, never for the public frontend build.

## Netlify

Use these settings:

- Build command: `npm run build`
- Publish directory: `dist`

## Cloudflare Pages

Use these settings:

- Framework preset: `Vite`
- Build command: `npm run build`
- Build output directory: `dist`

## Privacy Note

The first version includes a `noindex,nofollow` robots meta tag in `index.html`, so the site asks search engines not to index it. This is not access control. For private records, keep them out of the public build or use a host with password protection.
