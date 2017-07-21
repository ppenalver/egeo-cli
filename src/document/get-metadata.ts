import { readFileSync } from 'fs';
import * as beautify from 'js-beautify';
import * as _ from 'lodash';

import { parser } from './parser';
import { DocParam, TAG_TYPES } from './parser.model';

import { isDefined, log } from '../utils';
import { ComponentInfo, Parameter } from './document.interfaces';

export function getMetadata(filePath: string): ComponentInfo {
   log(`[READ FILE]: ${filePath}`);
   const fileContent: string = readFileSync(filePath, 'utf-8');
   const comments: DocParam[] = parser(fileContent);
   const parsed: ComponentInfo = comments.reduce((prev, curr) => extractInfoFromTag(prev, curr), new ComponentInfo());
   return parsed;
}

function extractInfoFromTag(original: ComponentInfo, tag: DocParam): ComponentInfo {
   log(`[PARSE METADATA]........`);
   const componentInfo: ComponentInfo = _.cloneDeep(original);
   switch (tag.tag) {
      case TAG_TYPES.DESCRIPTION:
         componentInfo.type = tag.type;
         componentInfo.title = tag.name;
         componentInfo.description = tag.description;
         break;
      case TAG_TYPES.EXAMPLE:
         componentInfo.example = beautify.html_beautify(tag.example);
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
