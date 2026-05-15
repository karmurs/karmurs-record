# Karmurs' Record Design

## Goal

Karmurs' Record is a link-access personal homepage and record space. It should feel like a personal site on first visit, then work as an archive once the visitor enters deeper sections.

The site is not limited to racing or evidence collection. It can hold journal entries, photos, casual notes, links, files, racing records, project notes, screenshots, and other saved pieces.

## Audience And Access

The site is intended for people who receive the link. It should not be designed as a fully public SEO-oriented blog at first.

Initial access model:

- Link-access only.
- Avoid search indexing.
- No sensitive private data on public pages.
- Admin or editing flows can be added later.

## Visual Direction

The chosen direction is dark editorial with a personal handwritten accent.

Core visual traits:

- Large dark hero area.
- Ivory and warm brown highlights.
- Free handwritten-style main phrase.
- Clean readable sans-serif text for menus, cards, and body copy.
- Large clickable cards that feel like an editorial portfolio or gallery.
- Floating pill navigation near the bottom of the hero.

The main title area should not feel grid-perfect. The handwritten phrase can be tilted, staggered, or freely placed. This should be used only for the hero accent so the rest of the site stays readable.

## Site Name

Primary site name:

`Karmurs' Record`

Hero phrase draft:

`Things worth keeping`

Supporting handwritten phrase draft:

`in my record`

The hero phrase may remain in English because English script fonts look more natural than many Korean handwriting fonts. Korean explanatory text should sit nearby in readable type.

## Homepage Structure

The homepage should show:

1. Top navigation.
2. Large dark hero.
3. Free handwritten hero phrase.
4. Short Korean explanation of the site.
5. Three primary cards:
   - Journal
   - Gallery
   - Racing
6. Small discovery prompts:
   - today
   - random
   - timeline
7. Floating pill navigation:
   - 오늘
   - 사진
   - 레이싱
   - 기록함

The first screen should make visitors want to click. Avoid generic explanation cards. Cards should look like actual record entrances.

## Primary Cards

### Journal

Purpose:

Personal writing, diary-like notes, short thoughts, longer posts, and small memory fragments.

Card label:

`생각, 일기, 짧은 문장`

### Gallery

Purpose:

Photos, screenshots, saved images, mood images, and visual collections.

Card label:

`사진, 캡처, 분위기 이미지`

### Racing

Purpose:

Racing-game records such as lap times, sessions, tracks, car notes, screenshots, telemetry summaries, setup notes, and project-related records.

Card label:

`랩타임, 세션, 트랙 메모`

## Secondary Sections

Archive remains part of the site, but it does not need to be one of the three homepage hero cards initially.

Secondary sections:

- Archive: links, files, saved references, captures, evidence-style records.
- Projects: app builds, experiments, tools, and longer project pages.
- Timeline: all records in date order.
- Random: opens or recommends an old saved record.

## Data Model Draft

All records should share a base shape:

- id
- title
- type
- date
- summary
- body
- tags
- visibility
- createdAt
- updatedAt

Record types:

- journal
- gallery
- racing
- link
- file
- project
- evidence
- note

Optional fields:

- images
- attachments
- sourceUrl
- externalLinks
- racingTrack
- racingCar
- racingSessionType
- lapTime
- capturedAt

## MVP Scope

The first implementation should focus on a static or lightly dynamic frontend that proves the experience.

MVP should include:

- Homepage matching the selected v7 direction.
- Journal list/detail page.
- Gallery list/detail page.
- Racing list/detail page.
- Archive/timeline page with simple filtering.
- Local seed data for sample records.
- Responsive desktop and mobile layout.

MVP can skip:

- Login.
- Live database.
- Upload UI.
- Automated Chrome capture import.
- Full text search.
- Comments or guestbook.

These can be added after the core browsing experience feels right.

## Implementation Notes

Recommended first build:

- React or Next.js frontend.
- Local JSON or markdown-backed content for the first version.
- Later migration to a database when editing and upload flows are needed.
- Deploy to Vercel, Netlify, or GitHub Pages depending on chosen stack.

For link-access behavior:

- Add `noindex` metadata.
- Avoid public sitemap submission.
- Use obscure but shareable URL only for the first version.

## Open Questions

- Should the hero handwritten phrase remain English, or should a custom Korean image logo be created later?
- Should Racing stay as a permanent hero card, or rotate with Archive/Projects depending on current focus?
- Should record editing happen through files first, or through a browser admin UI later?
- Which deployment target should be used for the first public version?
