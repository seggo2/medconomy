import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService, User, Company } from '../services/user.service';
import { FormBuilder, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-users-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './users-detail.component.html',
  styleUrls: ['./users-detail.component.css'],
})
export class UsersDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  public router = inject(Router);
  private userService = inject(UserService);
  private fb = inject(FormBuilder);

  userId = Number(this.route.snapshot.paramMap.get('id'));
  user = signal<User | null>(null);
  users = signal<User[]>([]);
  companies = signal<Company[]>([]);
  coworkers = signal<User[]>([]); 

  form = this.fb.group({
    name: this.fb.control<string | null>(null, Validators.required),
    email: this.fb.control<string | null>(null, [Validators.required, Validators.email]),
    address: this.fb.control<string | null>(null),
    companyId: this.fb.control<number | null>(null),
    relatedCoworkers: this.fb.array<number>([]),
  });

  ngOnInit() {
    this.loadUsersAndCompanies();
    this.loadUser();

    this.form.get('companyId')?.valueChanges.subscribe((companyId) => {
      if (companyId) {
        this.filterCoworkers(companyId);
      } else {
        this.coworkers.set([]);
      }
    });
  }

  private loadUsersAndCompanies() {
    this.userService.getAll().pipe(take(1)).subscribe((allUsers) => {
      this.users.set(allUsers.filter(u => u.id !== this.userId));

      const uniqueCompanies = new Map<number, Company>();
      allUsers.forEach(u => {
        if (u.company && !uniqueCompanies.has(u.company.id)) {
          uniqueCompanies.set(u.company.id, u.company);
        }
      });
      this.companies.set(Array.from(uniqueCompanies.values()));
    });
  }

  private loadUser() {
    this.userService.getOne(this.userId).pipe(take(1)).subscribe(user => {
      this.user.set(user);

      this.form.patchValue({
        name: user.name,
        email: user.email,
        address: user.address,
        companyId: user.company?.id ?? null,
      });

      const coworkerIds = user.relatedCoworkers?.map(u => u.id) ?? [];
      const arr = this.form.get('relatedCoworkers') as FormArray;
      arr.clear();
      coworkerIds.forEach(id => arr.push(this.fb.control(id)));

      // Mitarbeiter derselben Firma setzen
      if (user.company?.id) {
        this.filterCoworkers(user.company.id);
      }
    });
  }

  private filterCoworkers(companyId: number) {
    const filtered = this.users().filter(
      u => u.company?.id === companyId && u.id !== this.userId
    );
    this.coworkers.set(filtered);
  }

  toggleCoworker(id: number, checked: boolean) {
    const arr = this.form.get('relatedCoworkers') as FormArray;
    if (checked) {
      arr.push(this.fb.control(id));
    } else {
      const idx = arr.controls.findIndex(c => c.value === id);
      if (idx > -1) arr.removeAt(idx);
    }
  }

  onCheckboxChange(id: number, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.toggleCoworker(id, checked);
  }

  private buildUpdateData(): Partial<User> {
    const coworkerIds = (this.form.get('relatedCoworkers') as FormArray).value as number[];
    const coworkerUsers = this.users().filter(u => coworkerIds.includes(u.id));

    return {
      name: this.form.value.name ?? undefined,
      email: this.form.value.email ?? undefined,
      address: this.form.value.address ?? undefined,
      company: this.companies().find(c => c.id === this.form.value.companyId) ?? null,
      relatedCoworkers: coworkerUsers.length > 0 ? coworkerUsers : null,
    };
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const updateData = this.buildUpdateData();

    this.userService.update(this.userId, updateData).pipe(take(1)).subscribe(() => {
      this.router.navigate(['/users']);
    });
  }
}
