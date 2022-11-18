import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ArtistData } from '../data/artist-data';
import { AlbumData } from '../data/album-data';
import { TrackData } from '../data/track-data';
import { ResourceData } from '../data/resource-data';
import { ProfileData } from '../data/profile-data';
import { TrackFeature } from '../data/track-feature';


@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
	expressBaseUrl:string = 'http://localhost:8888';

  constructor(private http:HttpClient) { }

  private sendRequestToExpress(endpoint:string):Promise<any> {
    return Promise.resolve(this.http.get(this.expressBaseUrl+ endpoint).toPromise());
  }

  aboutMe():Promise<ProfileData> {
    return this.sendRequestToExpress('/me').then((data) => {
      return new ProfileData(data);
    });
  }

  searchFor(category:string, resource:string):Promise<ResourceData[]> {
    return this.sendRequestToExpress('/search/' + category + '/' + encodeURIComponent(resource)).then((data) => {
      if (category == 'artist') {
        let resources:ArtistData[];
        resources = data['artists']['items'].map((artist) => {
          return new ArtistData(artist);
        });

        return resources;
      }

      else if (category == 'album') {
        let resources:AlbumData[];
        resources = data['albums']['items'].map((album) => {
          return new AlbumData(album);
        });

        return resources;
      }

      else {
        let resources:TrackData[];
        resources = data['tracks']['items'].map((track) =>{
          return new TrackData(track);
        });

        return resources;
      }
    });
  }

  getArtist(artistId:string):Promise<ArtistData> {
    return this.sendRequestToExpress('/artist/' + encodeURIComponent(artistId)).then((data) => {
      return new ArtistData(data);
    });
  }

  getRelatedArtists(artistId:string):Promise<ArtistData[]> {
    let relatedArtistData:ArtistData[];

    return this.sendRequestToExpress('/artist-related-artists/' + encodeURIComponent(artistId)).then((data) => {
      
      relatedArtistData = data['artists'].map((track) => {
        return new ArtistData(track);
      });

      return relatedArtistData;
    });
  }

  getTopTracksForArtist(artistId:string):Promise<TrackData[]> {
    let trackData:TrackData[];

    return this.sendRequestToExpress('/artist-top-tracks/' + encodeURIComponent(artistId)).then((data) => {

      trackData = data['tracks'].map((track) => {
        return new TrackData(track);
      });

      return trackData;
    });
  }

  getAlbumsForArtist(artistId:string):Promise<AlbumData[]> {
    let albumData:AlbumData[];

    return this.sendRequestToExpress('/artist-albums/' + encodeURIComponent(artistId)).then((data) => {
      albumData = data['items'].map((track) => {
        return new AlbumData(track);
      });

      return albumData;
    });
  }

  getAlbum(albumId:string):Promise<AlbumData> {
    return this.sendRequestToExpress('/album/' + albumId);
  }

  getTracksForAlbum(albumId:string):Promise<TrackData[]> {
    let trackData:TrackData[];

    return this.sendRequestToExpress('/album-tracks/' + albumId).then((data) => {
      trackData = data['items'].map((track) => {
        return new TrackData(track);
      });

      return trackData;
    })
  }

  getTrack(trackId:string):Promise<TrackData> {
    return this.sendRequestToExpress('/track/' + trackId);
  }

  getAudioFeaturesForTrack(trackId:string):Promise<TrackFeature[]> {
    let trackFeature:TrackFeature[];
    trackFeature = [];

    return this.sendRequestToExpress('/track-audio-features/' + trackId).then((data) => {
        
      trackFeature.push(new TrackFeature('acousticness', data.acousticness));
      trackFeature.push(new TrackFeature('danceability', data.danceability));
      trackFeature.push(new TrackFeature('energy', data.energy));
      trackFeature.push(new TrackFeature('instrumentalness', data.instrumentalness));
      trackFeature.push(new TrackFeature('liveness', data.liveness));
      trackFeature.push(new TrackFeature('speechiness', data.speechiness));
      trackFeature.push(new TrackFeature('valence', data.valence));

      return trackFeature;
    })
  }
}
