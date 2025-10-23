# MangaReader

MangaReader is a cross-platform mobile manga reader built with React Native (Expo). It fetches chapters from a manga API, displays pages with auto-sized images, caches chapter metadata locally using SQLite, and persists reading progress (last page + completed state) so users can resume reading.

## Tech Stack
- React Native (Expo)
- React Navigation
- SQLite via `expo-sqlite`
- JavaScript (React 18+)

## Key features
- Browse manga and fetch chapters
- Reader with auto-sized images and paginated scrolling (FlatList)
- Local caching of chapters when a manga is added to library
- Persisted reading history: `lastPage`, `completed`, `lastRead`
- Resume reading: a "Read" button opens the last-read chapter/page for a manga
- Completed chapters are visually indicated in the manga details screen

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

## Demo steps
- Open a manga details screen and tap "Read" — the app will open the last-read chapter/page if available.
- Scroll a few pages, go back to details, then press "Read" again to confirm resume behavior.
- Read to the last page of a chapter — on return the chapter row should show as completed.

## Notes
- Image caching is not implemented; consider `react-native-fast-image` for production.
- The History tab is not fully implemented in this version.

