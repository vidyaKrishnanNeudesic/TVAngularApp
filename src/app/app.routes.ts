import { Routes } from '@angular/router';
import { ShowDetails } from './component/show-details/show-details';
import { HomeComponent } from './component/home/home';
import { CastCrew } from './component/cast-crew/cast-crew';
import { Episodes } from './component/episodes/episodes';
import { Reviews } from './component/reviews/reviews';
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'show/:id', component: ShowDetails },
  { path: 'show/:id/cast', component: CastCrew },
  { path: 'show/:id/episodes', component: Episodes },
  // { path: 'show/:id/reviews', component: Reviews }
];
