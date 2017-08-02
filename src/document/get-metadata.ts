import { readFileSync } from 'fs';
import { html_beautify, js_beautify } from 'js-beautify';
import {
   cloneDeep as _cloneDeep
} from 'lodash';

import { DocExample } from './doc-example';
import { DocParam } from './doc-param';
import { parser } from './parser';
import { TAG_TYPES } from './parser.model';

import { isDefined, log } from '../utils';
import { ComponentInfo, Example, Parameter } from './document.interfaces';

export function getMetadata(filePath: string): ComponentInfo {
   log(`[READ FILE]: ${filePath}`);
   const fileContent: string = readFileSync(filePath, 'utf-8');
   const comments: DocParam[] = parser(fileContent);
   const parsed: ComponentInfo = comments.reduce((prev, curr) => extractInfoFromTag(prev, curr), new ComponentInfo());
   return parsed;
}

function extractInfoFromTag(original: ComponentInfo, tag: DocParam): ComponentInfo {
   log(`[PARSE METADATA]........`);
   const componentInfo: ComponentInfo = _cloneDeep(original);
   switch (tag.tag) {
      case TAG_TYPES.DESCRIPTION:
         componentInfo.type = tag.type;
         componentInfo.title = tag.name;
         componentInfo.description = tag.description;
         break;
      case TAG_TYPES.EXAMPLE:
         componentInfo.example = tag.example.map((example) => getBuildExample(example));
         break;
      case TAG_TYPES.INPUT:
         componentInfo.inputs.push(getParamInfo(tag));
         break;
      case TAG_TYPES.OUTPUT:
         componentInfo.outputs.push(getParamInfo(tag));
         break;
      default:
         log(`Tag not recognized"`, 'Warn');
         break;
   }
   return componentInfo;
}

function getBuildExample(example: DocExample): Example {
   const exampleCode: string = example.type === 'html' ?
      html_beautify(example.example, { wrap_attributes: 'force', wrap_attributes_indent_size: 6 }) :
      js_beautify(example.example);

   return {
      description: example.description ? example.description : '',
      example: exampleCode,
      name: example.title ? example.title : '',
      syntax: example.type ? example.type : ''
   };
}

function getParamInfo(tag: DocParam): Parameter {
   return {
      default: tag.defaultValue,
      description: tag.description,
      name: tag.name,
      required: tag.required,
      type: excapeTypes(tag.type)
   };
}

function excapeTypes(type: string): string {
   return type.replace(/\|/g, '\\|');
}
