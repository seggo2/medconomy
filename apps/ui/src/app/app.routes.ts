import { Route } from '@angular/router';
import { UsersListingComponent } from './users/listing/users-listing.component';
import { UsersDetailComponent } from './users/detail/users-detail.component';

export const appRoutes: Route[] = [
    { path: '', redirectTo: 'users', pathMatch: 'full' },
    { path: 'users', component: UsersListingComponent },
    { path: 'users/:id', component: UsersDetailComponent },
];
