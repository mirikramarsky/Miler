// src/app/admin-login/admin-login.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
})
// src/app/admin-login/admin-login.component.ts
export class AdminLoginComponent {
  username = '';
  password = '';
  showPassword = false; // משתנה לשליטה על הצגת הסיסמה

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.auth.login(this.username, this.password).subscribe({
      next: (res) => {
        this.auth.saveToken(res.token);
        this.router.navigate(['/admin']);
      },
      error: () => alert('שם משתמש או סיסמה שגויים'),
    });
  }
}


