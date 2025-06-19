import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer-nav.component.html',
  styleUrls: ['./footer-nav.component.css']
})
export class FooterNavComponent {
  constructor (private router: Router) { }

  navigateTo(path: string): void {
    console.log(`Navigating to ${path}`);
    this.router.navigate([path]);
  }
}
