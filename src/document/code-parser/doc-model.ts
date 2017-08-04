import { readFileSync } from 'fs';
import { js_beautify } from 'js-beautify';
import { dirname, join } from 'path';

import { DocBase } from './doc';
import { extractText, getAllResults, normalizeText } from './doc-parser-utils';

export class DocModel extends DocBase {

   public modelCode: string = '';
   public modelName: string = '';

   constructor(text: string, originalFilePath: string) {
      super(text);
      this.recoverModel(originalFilePath);
   }

   public toString(): string {
      return `
        ${super.toString()}
        modelName: ${this.modelName}
        modelCode: ${this.modelCode}
      `;
   }

   private recoverModel(originalFilePath: string): void {
      const [file, modelName]: string[] = this.type.split('#');
      const fileContent: string = readFileSync(this.getFolderPath(originalFilePath, file), 'utf-8');
      this.modelName = modelName;
      this.modelCode = js_beautify(this.extractModel(fileContent, modelName));
   }

   private extractModel(text: string, modelName: string): string {
      const reg: RegExp = new RegExp(`(^|[\\r\\n])(.*?${modelName.trim()}\\s*?{(.|[\\r\\n])*?})`);
      return normalizeText(extractText(text, reg, 2));
   }

   private getFolderPath(originalFilePath: string, relativePathFromFile: string): string {
      return join(dirname(originalFilePath), relativePathFromFile);
   }
}

export function buildDocModelCode(text: string, originalFilePath: string): DocModel[] {
   const parts: string[] = getAllResults(text, /((\[.*?\]|\{.*?\})(\s|[\r\n])*?(\[.*?\]|\{.*?\}))/gi, 1);
   const completeParts: string[] = parts.map((_) => `@model ${_}`.replace(/[\r\n]/g, ''));
   return completeParts.map((modelText) => new DocModel(modelText, originalFilePath));
}
