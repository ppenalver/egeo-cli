import { DocBase } from './doc';
import { extractDefaultValue, extractRequired } from './doc-parser-utils';

export class DocParam extends DocBase {

   public defaultValue: string = '';
   public required: boolean = false;

   constructor(text: string) {
      super(text);
      this.defaultValue = extractDefaultValue(text);
      this.required = extractRequired(text);
      this.type = this.escapeTypes(this.type);
   }

   public toString(): string {
      return `
        ${super.toString()}
        DefaultValue: ${this.defaultValue}
        Required: ${this.required ? 'YES' : 'NO'}
      `;
   }

   private escapeTypes(type: string): string {
      return type.replace(/\|/g, '\\|');
   }
}

export function buildDocParam(text: string): DocParam {
   return new DocParam(text);
}
