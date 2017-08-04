import { DocBase } from './doc';
import { extractExample, getAllResults, removeEmptyFromList } from './doc-parser-utils';

export class DocExample extends DocBase {
   public example: string = '';

   constructor(text: string) {
      super(text);
      this.example = extractExample(text, this.type);
   }

   public toString(): string {
      return `
         ${super.toString()}
         example: ${this.example}`;
   }
}

export function buildDocExamples(text: string): DocExample[] {
   const internalText: string = text.replace(/@example/g, '');
   const examples: string[] = removeEmptyFromList(getAllResults(internalText, /((.|[\r\n])+?```(.|[\r\n])+?```)/ig, 1));
   return examples.map((example) => new DocExample(`@example\n${example}`));
}
