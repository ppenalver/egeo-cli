import { TAG_TYPES } from '../parser';

import { extractDescription, extractName, extractTag, extractType } from './doc-parser-utils';

export class DocBase {
   public tag: TAG_TYPES;
   public name: string;
   public description: string;
   public type: string;

   constructor(text: string) {
      this.tag = extractTag(text);
      this.type = extractType(text);
      this.name = extractName(text);
      this.description = extractDescription(text);
   }

   public toString(): string {
      return `
        Tag: ${this.tagToString()}
        Name: ${this.name}
        Description: ${this.description}
        Type: ${this.type}
      `;
   }

   private tagToString(): string {
      switch (this.tag) {
         case TAG_TYPES.DESCRIPTION: return 'Description';
         case TAG_TYPES.EXAMPLE: return 'Example';
         case TAG_TYPES.INPUT: return 'Input';
         case TAG_TYPES.OUTPUT: return 'Output';
         case TAG_TYPES.MODEL: return 'Model';
         case TAG_TYPES.LINK: return 'Link';
         case TAG_TYPES.UNKNOWN: return 'Unknown';
         default:
            return '';
      }
   }
}
