import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DemoModule } from './app/app.module';
import { decorateModuleRef } from './app/environment';

platformBrowserDynamic()
   .bootstrapModule(DemoModule)
   .then(decorateModuleRef)
   .catch((err) => console.error(err));
