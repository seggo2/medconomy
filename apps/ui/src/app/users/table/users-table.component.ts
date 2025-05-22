import { Component, Input } from '@angular/core';
import { User } from '../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <table class="w-full border border-gray-300 rounded-md">
      <thead class="bg-gray-100 text-left">
        <tr>
          <th class="p-2">Name</th>
          <th class="p-2">Email</th>
          <th class="p-2">Firma</th>
          <ng-content select="th[extra]"></ng-content>
        </tr>
      </thead>
      <tbody>
        <tr
          *ngFor="let user of users"
          class="border-t hover:bg-gray-50 cursor-pointer"
          (click)="onSelect?.(user)"
        >
          <td class="p-2">{{ user.name }}</td>
          <td class="p-2">{{ user.email }}</td>
          <td class="p-2">{{ user.company?.name || '–' }}</td>
          <ng-content select="[row-extra]" [ngTemplateOutletContext]="{ $implicit: user }"></ng-content>
        </tr>
      </tbody>
    </table>
  `,
  styles: [],
})
export class UserTableComponent {
  @Input() users: User[] = [];
  @Input() onSelect?: (user: User) => void;
}
