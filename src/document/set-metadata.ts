import { writeFileSync } from 'fs';
import { basename, join } from 'path';

/* tslint:disable */
const table = require('markdown-table');
/* tslint:enable */

import { hasValue, log } from '../utils';
import { DocExample, DocLink, DocModel, DocParam } from './code-parser';
import { CommentParsed } from './parser';

export function saveMetadata(componentPath: string, metadata: CommentParsed): void {
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

function generateReadme(metadata: CommentParsed): string {
   log(`[BUILD README]........`);
   const title: string = getMainDescription(metadata);
   const inputs: string = generateInputOutputTable(metadata.inputs, 'Inputs', true);
   const outputs: string = generateInputOutputTable(metadata.outputs, 'Outputs', false);
   const example: string = getExample(metadata);
   const models: string = getModels(metadata.models);
   const links: string = getLinks(metadata.links);
   return title + inputs + outputs + example + models + links;
}

function generateInputOutputTable(paramenters: DocParam[], title: string, inputs: boolean): string {
   if (paramenters && paramenters.length > 0) {
      const lines: string[][] = paramenters.map((param) => {
         const optionalValue: string = capitalizeFirstLetter(Boolean(param.required).toString());
         const type: string = capitalizeFirstLetter(param.type);
         return inputs ? [param.name, type, optionalValue, param.description, param.defaultValue] :
            [param.name, type, param.description];
      }
      );
      return inputs ? `## ${title}\n\n${table([['Property', 'Type', 'Req', 'Description', 'Default'], ...lines])}\n\n` :
         `## ${title}\n\n${table([['Property', 'Type', 'Description'], ...lines])}\n\n`;
   }
   return '';
}

function getMainDescription(metadata: CommentParsed): string {
   const title: string = hasValue(metadata.globalInfo.name) ? metadata.globalInfo.name : '{TITLE}';
   const type: string = hasValue(metadata.globalInfo.type) ? metadata.globalInfo.type : '{TYPE}';
   const description: string = hasValue(metadata.globalInfo.description) ? metadata.globalInfo.description : '{Component description}';
   return `# ${title} (${type})\n\n   ${description}\n\n`;
}

function getExample(metadata: CommentParsed): string {
   return metadata.examples && metadata.examples.length > 0 ?
      `## Example\n\n${metadata.examples.map((example) => buildExample(example)).join('\n')}\n` : '';
}

function buildExample(example: DocExample): string {
   return `${getTitle(example.name, example.description)}\n\`\`\`${getType(example)}\n${example.example}\n\`\`\`\n`;
}

function getType(example: DocExample): string {
   return example.type === 'ts' ? 'typescript' : example.type;
}

function getTitle(title: string, description: string, subtitle?: string): string {
   let name: string = title ? `*${title}*${subtitle ? ' (' + subtitle + ')' : ''}\n` : '';
   if (description) {
      name += `${description}\n`;
   }
   return name;
}

function capitalizeFirstLetter(value: string): string {
   return value.charAt(0).toUpperCase() + value.slice(1);
}

function getModels(models: DocModel[]): string {
   return models && models.length > 0 ?
      `## Models\n\n${models.map((model) => buildModel(model)).join('\n')}\n` : '';
}

function buildModel(model: DocModel): string {
   return `${getTitle(model.name, model.description, model.modelName)}\n\`\`\`typescript\n${model.modelCode}\n\`\`\`\n`;
}

function getLinks(links: DocLink[]): string {
   return links && links.length > 0 ?
      `## Links\n${links.map((link) => buildLink(link)).join('\n')}\n` : '';
}

function buildLink(link: DocLink): string {
   return `- [${link.linkName}](${link.link})\n`;
}
