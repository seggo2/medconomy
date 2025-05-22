import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { UserService, User } from '../services/user.service';
import { UserTableComponent } from '../table/users-table.component';
import { tap } from 'rxjs';

@Component({
  selector: 'app-users-listing',
  imports: [CommonModule,UserTableComponent],
  templateUrl: './users-listing.component.html',
  styleUrl: './users-listing.component.css',
  template: `
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-4">Benutzerliste</h2>
    <app-user-table [users]="users()" [onSelect]="goToDetail" />
  </div>
`,
})
export class UsersListingComponent {
  private userService = inject(UserService);
  private router = inject(Router);

  users = signal<User[]>([]);

  ngOnInit(): void {
    this.userService.getAll()
      .pipe(tap((data) => this.users.set(data)))
      .subscribe();
  }

  goToDetail = (user: User) => {
    this.router.navigate(['/users', user.id]);
  };
}
