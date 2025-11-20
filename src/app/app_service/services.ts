import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from '../models/photos';

@Injectable({
  providedIn: 'root',
})
export class Service {
  private url = "https://jsonplaceholder.typicode.com/photos";

  constructor(private http : HttpClient){}

  
  get(): Observable<Post[]> {    
    return this.http.get<Post[]>(this.url)
  }

  add(post: Post):Observable<Post>{
    return this.http.post<Post>(this.url,post)
  }
  update(id: number, post: Post): Observable<Post>{
    return this.http.put<Post>(this.url + '/' + post.id, post)
  }
  delete(id: number): Observable<void>{
    return this.http.delete<void>(this.url + '/' + id)
  }
}
