import { writeFileSync } from 'fs';
import { basename, join } from 'path';

/* tslint:disable */
const table = require('markdown-table');
/* tslint:enable */

import { hasValue, isDefined, log } from '../utils';
import { ComponentInfo, Example, Parameter } from './document.interfaces';

export function saveMetadata(componentPath: string, metadata: ComponentInfo): void {
   const readme: string = generateReadme(metadata);
   writeReadme(componentPath, readme);
}

function writeReadme(componentPath: string, doc: string): void {
   // Generate readme path
   let path: string = componentPath.replace(basename(componentPath), '');
   path = join(path, 'README.md');
   log(`[WRITE FILE]: ${path}`);
   // Write readme
   writeFileSync(path, doc);
}

function generateReadme(metadata: ComponentInfo): string {
   log(`[BUILD README]........`);
   const title: string = getMainDescription(metadata);
   const inputs: string = generateInputOutputTable(metadata.inputs, 'Inputs');
   const outputs: string = generateInputOutputTable(metadata.outputs, 'Outputs');
   const example: string = getExample(metadata);
   return title + inputs + outputs + example;
}

function generateInputOutputTable(paramenters: Parameter[], title: string): string {
   if (paramenters && paramenters.length > 0) {
      const lines: string[][] = paramenters.map((param) => {
         const optionalValue: string = capitalizeFirstLetter(Boolean(param.required).toString());
         const desc: string = getParamDescription(param);
         const type: string = capitalizeFirstLetter(param.type);
         return [param.name, type, optionalValue, desc];
      }
      );
      return `## ${title}\n\n${table([['Property', 'Type', 'Required', 'Description'], ...lines])}\n\n`;
   }
   return '';
}

function getParamDescription(parameter: Parameter): string {
   return hasValue(parameter.default) ?
      `${parameter.description}, default: ${parameter.default}` : parameter.description;
}

function getMainDescription(metadata: ComponentInfo): string {
   const title: string = hasValue(metadata.title) ? metadata.title : '{TITLE}';
   const type: string = hasValue(metadata.type) ? metadata.type : '{TYPE}';
   const description: string = hasValue(metadata.description) ? metadata.description : '{Component description}';
   return `# ${title} (${type})\n\n   ${description}\n\n`;
}

function getExample(metadata: ComponentInfo): string {
      return metadata.example && metadata.example.length > 0 ?
         `## Example\n${metadata.example.map((example) => buildExample(example)).join('\n')}` : '';
}

function buildExample(example: Example): string {
   return `${getTitle(example)}\`\`\`${example.syntax}\n${example.example}\n\`\`\`\``;
}

function getTitle(example: Example): string {
   let name: string = example.name ? `*${example.name}*\n` : '';
   if (example.description) {
      name += `${example.description}\n`;
   }
   return name;
}

function capitalizeFirstLetter(value: string): string {
   return value.charAt(0).toUpperCase() + value.slice(1);
}
