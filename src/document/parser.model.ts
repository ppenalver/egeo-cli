import * as _ from 'lodash';

import { log } from '../utils';
import { applyRegexp, normalizeText } from './parser-utils';

export enum TAG_TYPES { DESCRIPTION, EXAMPLE, INPUT, OUTPUT, MODEL, METHOD, INJECTION, PARAM, UNKNOWN }

export class DocParam {
   public tag: TAG_TYPES = TAG_TYPES.UNKNOWN;
   public example: string;
   public type: string;
   public name: string;
   public defaultValue: string;
   public required: boolean = false;
   public description: string;

   constructor(comment: string) {
      this.parseComment(comment);
   }

   private parseComment(text: string): void {
      let partial: [string, string] = ['', text];
      partial = applyRegexp(partial[1].trim(), /@(.*?)\s/igm, 1);
      this.tag = this.getTag(normalizeText(partial[0]));

      if (this.tag === TAG_TYPES.EXAMPLE) {
         partial = applyRegexp(partial[1].trim(), /((.|[\r\n])+)/igm, 1);
         this.example = normalizeText(partial[0]);
      } else {
         // Var type
         partial = applyRegexp(partial[1].trim(), /{(.*?)}/igm, 1);
         this.type = _.escape(normalizeText(partial[0]));

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
      if (!_.isNil(result)) {
         if (result.length >= 1) {
            return result[0];
         }
      }
      return '';
   }

   private getDefault(text: string): string {
      const result: string[] = text.split('=');
      if (!_.isNil(result)) {
         if (result.length >= 2) {
            return result[1];
         }
      }
      return '';
   }

   private isRequired(text: string): boolean {
      return _.startsWith(text.trim(), '^');
   }

   private getTag(type: string): TAG_TYPES {
      switch (_(type).defaultTo('').toString().toLowerCase()) {
         case 'description': return TAG_TYPES.DESCRIPTION;
         case 'example': return TAG_TYPES.EXAMPLE;
         case 'injection': return TAG_TYPES.INJECTION;
         case 'input': return TAG_TYPES.INPUT;
         case 'method': return TAG_TYPES.METHOD;
         case 'model': return TAG_TYPES.MODEL;
         case 'output': return TAG_TYPES.OUTPUT;
         case 'param': return TAG_TYPES.PARAM;
         default:
            log(`Tag ${type} not recognized"`, 'Warn');
            return TAG_TYPES.UNKNOWN;
      }
   }
}
