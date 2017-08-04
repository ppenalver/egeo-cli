import { DocBase } from './doc';

export class DocGeneral extends DocBase {

   constructor(text: string) {
      super(text);
   }

   public toString(): string {
      return super.toString();
   }
}

export function buildDocGeneral(text: string): DocGeneral {
   return new DocGeneral(text);
}
