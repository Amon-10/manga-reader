# MangaReader

MangaReader is a cross-platform mobile manga reader built with React Native (Expo). It fetches chapters from the MangaDex API, displays pages with auto-sized images, caches chapter metadata locally using SQLite, and persists reading progress (last page + completed state) so users can resume reading.

This repository is a personal project intended to demonstrate mobile app engineering with React Native, local persistence, and attention to UX edge cases (scrolling, viewability, and hooks-order correctness).

## Tech Stack
- React Native (Expo)
- React Navigation
- SQLite via `expo-sqlite`
- JavaScript (React 19)

## Key features
- Browse manga and fetch chapters from MangaDex
- Reader with auto-sized images and paginated scrolling (FlatList)
- Local caching of chapters when a manga is added to library
- Persisted reading history: `lastPage`, `completed`, `lastRead`
- Resume reading: a "Read" button opens the last-read chapter/page for a manga
- Completed chapters are visually indicated in the manga details screen

## Recent important fixes (what changed)
- Fixed a React Hooks order issue in `ChapterReaderScreen` by ensuring hooks are declared unconditionally.
- Implemented viewability-based history updates (`onViewableItemsChanged`) so `lastPage` is correctly stored.
- Added safe DB wrapper checks and `INSERT OR IGNORE` plus a fix to set `mangaId` on older history rows.
- Added `getItemLayout` and `onScrollToIndexFailed` fallback to make `scrollToIndex` reliable for jumping to saved pages.
- MangaDetails now passes `mangaId` with chapter navigation and grays out completed chapters.

## Run locally
1. Install dependencies

```bash
npm install
```

2. Start Expo

```bash
npm run start
```

3. Open on device or simulator
- `npm run ios` (macOS with Xcode)
- `npm run android`
- Or scan the Metro QR code with Expo Go on your phone

Note: this project uses `expo-sqlite` for local persistence. The first run will create `Library.db` and the tables declared in `App.js`.

## Demo instructions (short text to use in README / portfolio)
- Open the app and navigate to a manga details screen.
- Tap "Read" — the app opens the last-read chapter and page if you have a history, otherwise the first chapter.
- Scroll a few pages, go back to details, then press "Read" again to confirm resume behavior.
- Read to the last page of a chapter — on return the chapter row should be grayed out indicating it's completed.

## How to record a short GIF demo (recommended)
1. macOS: use QuickTime > File > New Screen Recording to capture the simulator or device screen.
2. Android: use `adb` screenrecord (or use the Expo Go recording tools) and convert to GIF using `ffmpeg`.
3. Keep the recording short (10–30s): show open app → open a chapter → read a few pages → back → press Read → resume page.
4. Optional: annotate with a caption like "Resume reading at last saved page". Export as GIF or MP4 and add to README or portfolio.

Example `ffmpeg` command to convert an MP4 to GIF (optional):

```bash
ffmpeg -i demo.mp4 -vf "fps=10,scale=600:-1:flags=lanczos" -y demo.gif
```

## Notes & limitations
- Image caching is not implemented (consider `react-native-fast-image` for better performance and caching).
- The `History` tab is small/placeholder — you can remove it or implement a fuller history view. The per-chapter history used by the details screen is the main feature.
- Tests and CI are not included in this repository yet.

## What I would add next
- Proper image caching + prefetching
- Better error/retry UI when network fails
- A completed-chapter icon and a small animation on mark-complete
- Unit tests for DB helpers and small functions

## Contact / Demo
If you want a live demo or recorded screencast, I can provide a short GIF and a hosted Expo preview link on request.
