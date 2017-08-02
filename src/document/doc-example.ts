export class DocExample {

   constructor(
      public type: string,
      public title: string,
      public example: string,
      public description: string
   ) { }

   public toString(): string {
      return `
         title: ${this.title}
         type: ${this.type}
         example: ${this.example}`;
   }
}
