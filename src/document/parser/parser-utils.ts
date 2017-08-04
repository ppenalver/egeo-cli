import { startsWith as _startsWith } from 'lodash';

export function removeStars(text: string): string {
   return text.split('*').map((_) => _.trim()).join('\n');
}

export function extractBlocks(text: string): string[] {
   const internalText: string = replaceExampleAts(text);
   const blocks: string[] = internalText.split('@');
   return blocks.map((block) =>  _startsWith(block, 'example') ?  `@${reinsertAts(block)}` : `@${block}`);
}

function replaceExampleAts(text: string): string {
   const regResult: RegExpMatchArray | null = text.match(/(```(.|[\r\n])*```)/);
   if (regResult) {
      const examplesNewValue: string = regResult[1].replace(/@/g, '~arroba~');
      return text.replace(/(```(.|[\r\n])*```)/, examplesNewValue);
   }
   return text;
}

function reinsertAts(text: string): string {
   return text.replace(/~arroba~/g, '@');
}
