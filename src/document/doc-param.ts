import {
   escape as _escape,
   isNil as _isNil,
   startsWith as _startsWith
} from 'lodash';

import { DocExample } from './doc-example';
import { applyRegexp, normalizeText, parseExample } from './parser-utils';
import { CommentBlock, TAG_TYPES } from './parser.model';

export class DocParam {
   public tag: TAG_TYPES = TAG_TYPES.UNKNOWN;
   public example: DocExample[];
   public type: string;
   public name: string;
   public defaultValue: string;
   public required: boolean = false;
   public description: string;

   constructor(comment: CommentBlock) {
      this.tag = comment.blockType;
      this.parseComment(comment.blockContent);
   }

   public toString(): string {
      return `
        Block type: ${this.convertTypeToString()}
        Example: ${this.example ? '[ ' + this.example.map((_) => _.toString()).join('\n') + '\n     ]' : ''}
        Type: ${this.type}
        Name: ${this.name}
        DefaultValue: ${this.defaultValue}
        Required: ${this.required ? 'YES' : 'NO'}
        Description: ${this.description}
      `;
   }

   private parseComment(text: string): void {
      let partial: [string, string] = ['', text];

      if (this.tag === TAG_TYPES.EXAMPLE) {
         this.example = parseExample(text);
      } else {
         // Var type
         partial = applyRegexp(partial[1].trim(), /{(.*?)}/igm, 1);
         this.type = _escape(normalizeText(partial[0]));

         // Var name, required and default value
         partial = applyRegexp(partial[1].trim(), /\[(.*?)\]/igm, 1);
         const prename: string = normalizeText(partial[0]);
         this.defaultValue = normalizeText(this.getDefault(prename));
         this.required = this.isRequired(prename);
         this.name = normalizeText(this.getName(prename));
         if (this.required) {
            this.name = this.name.substring(1);
         }

         // Var description
         partial = applyRegexp(partial[1].trim(), /((.|[\r\n])+)/igm, 1);
         this.description = normalizeText(partial[0], true);
      }
   }

   private getName(text: string): string {
      const result: string[] = text.split('=');
      if (!_isNil(result)) {
         if (result.length >= 1) {
            return result[0];
         }
      }
      return '';
   }

   private getDefault(text: string): string {
      const result: string[] = text.split('=');
      if (!_isNil(result)) {
         if (result.length >= 2) {
            return result[1];
         }
      }
      return '';
   }

   private isRequired(text: string): boolean {
      return _startsWith(text.trim(), '^');
   }

   private convertTypeToString(): string {
      switch (this.tag) {
         case TAG_TYPES.DESCRIPTION: return 'Description';
         case TAG_TYPES.EXAMPLE: return 'Example';
         case TAG_TYPES.INJECTION: return 'Injection';
         case TAG_TYPES.INPUT: return 'Input';
         case TAG_TYPES.METHOD: return 'Method';
         case TAG_TYPES.MODEL: return 'Model';
         case TAG_TYPES.OUTPUT: return 'Output';
         case TAG_TYPES.PARAM: return 'Param';
         case TAG_TYPES.UNKNOWN: return 'Unknown';
         default:
            return '';
      }
   }
}
