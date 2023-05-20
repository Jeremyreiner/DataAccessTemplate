// NOT IN USE ANYMORE BUT MAYBE IN THE FUTURE


// import { Injectable } from '@angular/core';
// import {HttpClient} from '@angular/common/http';
// import {of} from 'rxjs';
// import {tap} from 'rxjs/operators';
//
// interface CachedImage {
//   url: string;
//   blob: Blob;
// }
//
// @Injectable(
// )
//
//
// export class CacheService {
//
//   //tutorial from https://sonigaurav119.medium.com/cache-images-in-angular-43964e26ff62
//
//
//   private _cacheUrls: string[] = [];
//   private _cachedImages: CachedImage[] = [];
//
//   constructor(private http: HttpClient) { }
//
//   get cacheUrls(): string[] {
//     return this._cacheUrls;
//   }
//
//   set cacheUrls(urls: string[]) {
//     urls.forEach(a => this._cacheUrls.push(a));
//     this._cacheUrls = urls;
//   }
//
//   set cachedImages(image: CachedImage) {
//     this._cachedImages.push(image);
//   }
//
//   getImage(url: string) {
//     try {
//     const index = this._cachedImages.findIndex(image => image.url === url);
//     if (index !== -1) {
//       const image = this._cachedImages[index];
//       return of(URL.createObjectURL(image.blob));
//     }
//       return this.http.get(url, { responseType: 'blob' }).pipe(
//         tap(blob => this.checkAndCacheImage(url, blob))
//       );
//     } catch (e) {
//       console.log('bingo');
//     }
//   }
//
//   removeImageFromCache(url: string) {
//     const index = this._cachedImages.findIndex(image => image.url === url);
//     if(index !== -1) {
//       this._cachedImages.splice(index, 1);
//     }
//   }
//
//   checkAndCacheImage(url: string, blob: Blob) {
//     if (this._cacheUrls.indexOf(url) > -1) {
//       this._cachedImages.push({url, blob});
//     }
//   }
//
//   clearCache() {
//     this._cachedImages = [];
//     this._cacheUrls = [];
//   }
// }
