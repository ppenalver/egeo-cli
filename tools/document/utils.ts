export function hasValue(value: string): boolean {
   return isDefined(value) && typeof value === 'string' && value.trim().length > 0;
}

export function isDefined(value: any): boolean {
   return value !== undefined && value !== null;
}
