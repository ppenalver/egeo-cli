import * as _ from 'lodash';

export enum TAG_TYPES { DESCRIPTION, EXAMPLE, INPUT, OUTPUT, MODEL, METHOD, INJECTION, PARAM, UNKNOWN }
export enum GROUP_TYPE { DOC_TAG, DOC_TYPE, DOC_NAME, DOC_DEFAULT, DOC_REQUIRED, DOC_DESC }

export class DocParam {
   public tag: TAG_TYPES;

   public parseComment(text: string): void {
      const tag: string = this.applyRegexp(text, /@(.*?)\s/igm, 1);
      const type: string = this.applyRegexp(text, /{(.*?)}/igm, 1);

      const prename: string = this.applyRegexp(text, /\[(.*?)\]/igm, 1);
      const name: string = this.getName(prename);
      const def: string = this.getDefault(prename);
      const required: boolean = this.isRequired(prename);
      const desc: string = this.applyRegexp(text, /\]((.|[\r\n])+?)@?$/igm, 1);
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
      return _.startsWith('^');
   }

   private applyRegexp(text: string, reg: RegExp, valueToTake: number): string {
      const result: RegExpMatchArray | null = text.match(reg);
      if (result !== null) {
         return result[valueToTake];
      }
      return '';
   }
}
