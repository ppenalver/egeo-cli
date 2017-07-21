// tslint:disable:max-classes-per-file
export class Parameter {
   public name: string = '';
   public type: string = '';
   public default: string = '';
   public required: boolean = false;
   public description: string = '';
}

export class ComponentInfo {
   public title: string = '';
   public description: string = '';
   public type: string = ''; // Component, directive, pipe, service, etc.
   public example: string = '';
   public inputs: Parameter[] = [];
   public outputs: Parameter[] = [];
}
