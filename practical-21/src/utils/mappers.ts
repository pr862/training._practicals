import { getImageUrl } from './imageHelper';
import type { Album, Artist, FavouriteTrack, Playlist, Track } from '../types/api';
import type {
  BackendAlbum,
  BackendArtist,
  BackendFavouriteTrack,
  BackendPlaylist,
  BackendTrack,
} from '../types/backendTypes';

type TrackSource = Track | BackendTrack;
type ArtistSource = Artist | BackendArtist;
type AlbumSource = Album | BackendAlbum;
type PlaylistSource = Playlist | BackendPlaylist;
type FavouriteSource = FavouriteTrack | BackendFavouriteTrack;

const hasBackendTrackShape = (track: TrackSource): track is BackendTrack =>
  'name' in track || 'track_url' in track || 'image_url' in track || 'album_id' in track;

const hasBackendArtistShape = (artist: ArtistSource): artist is BackendArtist =>
  'image_url' in artist;

const hasBackendAlbumShape = (album: AlbumSource): album is BackendAlbum =>
  'name' in album || 'artist_id' in album || 'image_url' in album;

const hasBackendPlaylistShape = (playlist: PlaylistSource): playlist is BackendPlaylist =>
  'name' in playlist || 'user_id' in playlist || 'image_url' in playlist;

const hasBackendFavouriteShape = (favourite: FavouriteSource): favourite is BackendFavouriteTrack =>
  'track_id' in favourite || 'user_id' in favourite;

export const mapTrack = (track: TrackSource): Track => {
  if (!hasBackendTrackShape(track)) {
    return track;
  }

  return {
    id: track.id,
    title: track.name,
    image: getImageUrl(track.image_url),
    audioUrl: track.track_url ?? '',
    artistId: track.album?.artist?.id,
    artistName: track.artist?.name ?? track.album?.artist?.name ?? 'Unknown Artist',
    albumId: track.album_id,
    albumTitle: track.album?.name ?? 'Unknown Album',
    duration: track.duration,
    plays: track.plays,
  };
};

export const mapArtist = (artist: ArtistSource): Artist => {
  if (!hasBackendArtistShape(artist)) {
    return artist;
  }

  return {
    id: artist.id,
    name: artist.name,
    image: getImageUrl(artist.image_url),
    description: artist.description,
    totalTracks: artist.total_tracks,
    tracks: Array.isArray(artist.tracks) ? artist.tracks.map(mapTrack) : [],
  };
};

export const mapAlbum = (album: AlbumSource): Album => {
  if (!hasBackendAlbumShape(album)) {
    return album;
  }

  return {
    id: album.id,
    title: album.name,
    artistId: album.artist_id,
    artistName: album.artist?.name ?? 'Unknown Artist',
    image: getImageUrl(album.image_url),
    year: album.published_at ? new Date(album.published_at).getFullYear() : undefined,
    tracks: Array.isArray(album.tracks) ? album.tracks.map(mapTrack) : [],
  };
};

export const mapPlaylist = (playlist: PlaylistSource): Playlist => {
  if (!hasBackendPlaylistShape(playlist)) {
    return playlist;
  }

  const mappedTracks = Array.isArray(playlist.tracks) ? playlist.tracks.map(mapTrack) : [];

  return {
    id: playlist.id,
    title: playlist.name,
    userId: playlist.user_id,
    image: getImageUrl(playlist.image_url),
    tracks: mappedTracks,
    createdAt: playlist.createdAt,
    updatedAt: playlist.updatedAt,
  };
};

export const mapFavourite = (favourite: FavouriteSource): FavouriteTrack => {
  if (!hasBackendFavouriteShape(favourite)) {
    return favourite;
  }

  return {
    id: favourite.id,
    userId: favourite.user_id,
    trackId: favourite.track_id,
    track: favourite.track ? mapTrack(favourite.track) : {
      id: favourite.track_id,
      title: 'Unknown Title',
      image: '',
      audioUrl: '',
      artistName: 'Unknown Artist',
    },
    createdAt: favourite.createdAt ?? '',
  };
};
