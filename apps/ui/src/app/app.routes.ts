import { Route } from '@angular/router';
import { UsersListingComponent } from './users/listing/users-listing.component';

export const appRoutes: Route[] = [
    { path: 'users', component: UsersListingComponent }

];
