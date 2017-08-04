import { DocBase } from './doc';
import { getAllResults } from './doc-parser-utils';

export class DocLink extends DocBase {

   public link: string = '';
   public linkName: string = '';

   constructor(text: string, originalFilePath: string) {
      super(text);
      this.link = this.type;
      this.linkName = this.name;
   }

   public toString(): string {
      return `
        ${super.toString()}
        Link: ${this.link}
        LinkName: ${this.linkName}
      `;
   }
}

export function buildDocLinkCode(text: string, originalFilePath: string): DocLink[] {
   const parts: string[] = getAllResults(text, /((\[.*?\]|\{.*?\})(\s|[\r\n])*?(\[.*?\]|\{.*?\}))/gi, 1);
   const completeParts: string[] = parts.map((_) => `@link ${_}`.replace(/[\r\n]/g, ''));
   return completeParts.map((linkText) => new DocLink(linkText, originalFilePath));
}
