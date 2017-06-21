import { join, basename } from 'path';
import { writeFileSync } from 'fs';
const table = require('markdown-table');

import { ComponentInfo, Parameter } from './document.interfaces';
import { hasValue, isDefined } from './utils';

export function saveMetadata(componentPath: string, metadata: ComponentInfo): void {
   let readme: string = generateReadme(metadata);
   writeReadme(componentPath, readme);
}

function writeReadme(componentPath: string, doc: string): void {
   // Generate readme path
   let path: string = componentPath.replace(basename(componentPath), '');
   path = join(path, 'README.md');
   console.log(`[WRITE FILE]: ${path}`);
   // Write readme
   writeFileSync(path, doc);
}

function generateReadme(metadata: ComponentInfo): string {
   console.log(`[BUILD README]........`);
   return `
# ${metadata.title}

   ${metadata.description}

${generateInputOutputTable(metadata.inputs, 'Inputs')}
${generateInputOutputTable(metadata.outputs, 'Outputs')}

## Example

   \`\`\`
   ${metadata.example}
   \`\`\`
`;
}

function generateInputOutputTable(paramenters: Parameter[], title: string): string {
   if (paramenters && paramenters.length > 0) {
      let lines: string[][] = paramenters.map(param => [`\`${param.name}\``, capitalizeFirstLetter(param.type), capitalizeFirstLetter(Boolean(!param.optional).toString()), getDescription(param)]);
      return `
## ${title}

${table([['Property','Type','Required','Description'], ...lines])}

`
   }
   return '';
}

function getDescription(parameter: Parameter): string {
   return hasValue(parameter.default) ? `${parameter.description}, default: ${parameter.default}` : parameter.description;
}

function capitalizeFirstLetter(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
}
