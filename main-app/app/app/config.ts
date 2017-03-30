import { Routes } from '@angular/router';

import { FakeComponent } from './fake.component';
import { getPaths } from 'demo';


export function getRouter(): Routes {
   let routes: Routes = [
       { path: '', component: FakeComponent, children: [] }
   ]
   if (getPaths && typeof getPaths === 'function') {
      routes = routes[0].children.concat(getPaths(FakeComponent));
   }
   return routes;
}
