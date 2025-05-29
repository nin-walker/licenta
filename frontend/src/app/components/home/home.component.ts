import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LandmarksService } from '../../services/landmarks.service';
import { Landmark } from '../../interfaces/landmark';
import { FooterNavComponent } from '../footer-nav/footer-nav.component';
import { get } from 'http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    FooterNavComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  searchTerm: string = '';
  suggestedLandmarks: Landmark[] = [];
  recentlyViewedLandmarks: Landmark[] = [];

  constructor(private landmarksService: LandmarksService) { }

  ngOnInit(): void {
      this.getSuggestedLandmarks();
      this.getRecentlyViewedLandmarks();
  }

  getSuggestedLandmarks() {
        this.landmarksService.getLandmarks().subscribe(
          (data)=> {
           this.suggestedLandmarks = data.slice(0, 5); 
          },
          (error) => {
            console.error('Error fetching suggested landmarks:', error);
          }
        );
    }

    getRecentlyViewedLandmarks() {
      this.landmarksService.getLandmarks().subscribe(
        (data)=> {
          this.recentlyViewedLandmarks = data.slice(0, 5); 
        },
          (error) => {
          console.error('Error fetching recently viewed landmarks:', error);
        }
      );
    }

    performSearch(): void {
      console.log('Searching for:', this.searchTerm);
      //logica reala tba

      if(this.searchTerm) {
        this.suggestedLandmarks = this.suggestedLandmarks.filter(landmark =>
          landmark.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          landmark.location.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          landmark.short_description.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      }
      else {
        this.getSuggestedLandmarks();
      } 
    }
}
