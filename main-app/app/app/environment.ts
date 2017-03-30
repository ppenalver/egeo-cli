import { enableDebugTools, disableDebugTools } from '@angular/platform-browser';
import { ApplicationRef, enableProdMode } from '@angular/core';


let _decorateModuleRef = <T>(value: T): T => { return value; };

  enableProdMode();

  // Production
  _decorateModuleRef = (modRef: any) => {
    disableDebugTools();

    return modRef;
  };

export const decorateModuleRef = _decorateModuleRef;
