import chalk, { Chalk } from 'chalk';

/* tslint:disable:no-console */
export function log(message: string, severity: 'Warn' | 'Error' | 'Info' = 'Info'): void {

   const error: Chalk = chalk.bold.red;
   const warning: Chalk = chalk.yellow;
   const info: Chalk = chalk.blue;

   switch (severity) {
      case 'Warn': console.log(warning(message)); break;
      case 'Error': console.log(error(message)); break;
      case 'Info': console.log(info(message)); break;
      default: console.log(info(message)); break;
   }
}
/* tslint:enable */

export function hasValue(value: string): boolean {
   return isDefined(value) && typeof value === 'string' && value.trim().length > 0;
}

export function isDefined(value: any): boolean {
   return value !== undefined && value !== null;
}
