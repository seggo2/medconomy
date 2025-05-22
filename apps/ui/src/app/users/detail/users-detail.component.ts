import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService, User, Company } from '../services/user.service';
import { FormBuilder, FormArray, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-users-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './users-detail.component.html',
  styleUrls: ['./users-detail.component.css'],
})
export class UsersDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private userService = inject(UserService);
  private fb = inject(FormBuilder);

  userId = Number(this.route.snapshot.paramMap.get('id'));
  user = signal<User | null>(null);
  users = signal<User[]>([]); // alle User für Coworkers und Firmenliste
  companies = signal<Company[]>([]);

  form = this.fb.group({
    name: [''],
    email: [''],
    address: [''],
    companyId: [null as number | null],
    relatedCoworkers: this.fb.array([]),
  });

  ngOnInit() {
    this.userService.getAll().subscribe((allUsers) => {
      this.users.set(allUsers.filter((u) => u.id !== this.userId));

      const uniqueCompaniesMap = new Map<number, Company>();
      allUsers.forEach((u) => {
        if (u.company && !uniqueCompaniesMap.has(u.company.id)) {
          uniqueCompaniesMap.set(u.company.id, u.company);
        }
      });
      this.companies.set(Array.from(uniqueCompaniesMap.values()));
    });

    this.userService.getOne(this.userId).subscribe((user) => {
      this.user.set(user);

      this.form.patchValue({
        name: user.name ?? undefined,
        email: user.email ?? undefined,
        address: user.address ?? undefined,
        companyId: user.company?.id ?? null,
      });

      const coworkerIds = user.relatedCoworkers?.map((u) => u.id) ?? [];
      const arr = this.form.get('relatedCoworkers') as FormArray;
      arr.clear();
      coworkerIds.forEach((id) => arr.push(this.fb.control(id)));
    });
  }

  toggleCoworker(id: number, checked: boolean) {
    const arr = this.form.get('relatedCoworkers') as FormArray;
    if (checked) {
      arr.push(this.fb.control(id));
    } else {
      const idx = arr.controls.findIndex((c) => c.value === id);
      if (idx > -1) arr.removeAt(idx);
    }
  }

  onCheckboxChange(id: number, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.toggleCoworker(id, checked);
  }
  


  save() {
    if (this.form.invalid) return;

    const coworkerIds = (this.form.get('relatedCoworkers') as FormArray).value as number[];
    const coworkerUsers = this.users().filter((u) => coworkerIds.includes(u.id));

    const updateData: Partial<User> = {
      name: this.form.value.name ?? undefined,
      email: this.form.value.email ?? undefined,
      address: this.form.value.address ?? undefined,
      company: this.companies().find((c) => c.id === this.form.value.companyId) ?? null,
      relatedCoworkers: coworkerUsers.length > 0 ? coworkerUsers : null,
    };

    this.userService.update(this.userId, updateData).subscribe(() => this.router.navigate(['/users']));
  }
}
