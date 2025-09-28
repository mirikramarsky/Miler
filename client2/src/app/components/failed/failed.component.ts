import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-failed',
  templateUrl: './failed.component.html',
  styleUrls: ['./failed.component.css']
})
export class FailedComponent {
  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/']); // חזרה לעמוד הראשי
  }

  tryAgain() {
    this.router.navigate(['/cart']); // הפניה לדף תשלום מחדש
  }
}
