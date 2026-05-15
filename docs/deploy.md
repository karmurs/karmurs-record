# Deployment

Karmurs' Record is a static Vite site. Build output is written to `dist/` and can be uploaded to any static host.

## Quick Check

```powershell
npm test
npm run build
npm run preview
```

Open the preview URL and confirm the homepage, section cards, archive, and detail pages work.

## GitHub Pages

1. Create a GitHub repository.
2. Push this project to the repository.
3. In GitHub, open `Settings > Pages`.
4. Set the source to `GitHub Actions`.
5. Push to `main`.

The workflow at `.github/workflows/deploy.yml` will build the site and publish `dist/`.

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
