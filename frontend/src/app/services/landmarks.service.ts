import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Landmark } from '../interfaces/landmark';

@Injectable({
  providedIn: 'root'
})

export class LandmarksService {

  private apiUrl = 'http://127.0.0.1:5000/api/landmarks'

  constructor(private http: HttpClient) { }

  getLandmarks(): Observable<Landmark[]> {
    return this.http.get<Landmark[]>(this.apiUrl);
  }
}
