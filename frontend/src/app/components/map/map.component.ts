import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FooterNavComponent } from '../footer-nav/footer-nav.component';
import { Landmark } from '../../interfaces/landmark';
import { LandmarksService } from '../../services/landmarks.service';
import { Router } from '@angular/router';

declare var google: any;

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [
    CommonModule,
    FooterNavComponent
  ],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapContainer', { static: false }) gmap!: ElementRef;
  map: any;
  landmarks: Landmark[] = [];
  private dataLoaded = false;
  private mapInitialized = false;
  
  constructor(
    private landmarksService: LandmarksService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    this.landmarksService.getLandmarks().subscribe(
      data => {
        this.landmarks = data;
        this.dataLoaded = true;
        this.tryInitializeMap();
      },
      error => {
        console.error('Error fetching landmarks for map:', error);
        this.dataLoaded = true;
        this.tryInitializeMap();
      }
    );
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('googleMapsApiLoaded', this.onGoogleMapsApiLoaded);

      if (typeof google !== 'undefined' && google.maps) {
        this.onGoogleMapsApiLoaded();
      }
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) { 
      window.removeEventListener('googleMapsApiLoaded', this.onGoogleMapsApiLoaded);
    }
    this.map = null;
    this.mapInitialized = false;
    console.log('MapComponent destroyed, Google Maps API listener removed.');
  }

  private onGoogleMapsApiLoaded = (): void => {
    console.log('Google Maps API ready, attempting to initialize map.');
    this.tryInitializeMap();
  }

  tryInitializeMap(): void {
    if (this.mapInitialized) {
      return;
    }

    if (isPlatformBrowser(this.platformId)) { 
      if (typeof google !== 'undefined' && google.maps &&
          this.dataLoaded &&
          this.gmap && this.gmap.nativeElement &&
          !this.map
      ) {
        const mapOptions: any = {
          center: new google.maps.LatLng(45.943161, 24.966760),
          zoom: 7,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        this.map = new google.maps.Map(this.gmap.nativeElement, mapOptions);
        this.mapInitialized = true;
        console.log('Google Map initialized successfully and only once.');

        if (this.landmarks.length > 0) {
          this.addMarkers();
        } else {
          console.warn('No landmarks available to display on the map.');
        }
      } else {
        if (!this.mapInitialized) {
        }
      }
    }
  }

  addMarkers(): void {
    if (!isPlatformBrowser(this.platformId) || !this.map) {
      console.error('Cannot add markers: Not in browser environment or map not initialized.');
      return;
    }
    this.landmarks.forEach(landmark => {
     if (typeof landmark.latitude === 'number' && typeof landmark.longitude === 'number') {
       const marker = new google.maps.Marker({
         position: new google.maps.LatLng(landmark.latitude, landmark.longitude),
         map: this.map,
         title: landmark.name
       });

       const infowindow = new google.maps.InfoWindow({
         content: `
           <div style="padding: 5px;">
             <strong>${landmark.name}</strong><br>
             <span class="math-inline">\{landmark\.location\}<br\>
<a href\="/landmark/</span>{landmark.id}" style="margin-top: 5px; display: inline-block; color: #007bff; text-decoration: none;">Vezi Detalii</a>
           </div>
         `
       });

       marker.addListener('click', () => {
         infowindow.open(this.map, marker);
       });
     } else {
         console.warn(`Landmark ${landmark.name} (ID: ${landmark.id}) has invalid coordinates: Lat ${landmark.latitude}, Lng ${landmark.longitude}`);
     }
   });
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}