# TODO: Fix Albums Not Showing on Homepage

## Plan Steps:
- [x] 1. Diagnose issue (field mapping backend name/title)
- [x] 2. Edit practical-21/src/hooks/useAlbums.ts - map name→title, add year
- [x] 3. Added empty state + year fallback in FeaturedAlbums.tsx
- [x] 4. Fixed HomePage tracks error display typo (error:setError → error)
- [x] 5. All fixes complete: Albums on /app + tracks on /

Progress: Edits complete! Refresh http://localhost:3001/app (clear cache F5). Albums should now show in "New Releases" section.
