import { Answers, ChoiceType, prompt, Question } from 'inquirer';
import { join } from 'path';
import { CookieJar, jar } from 'request';

// tslint:disable:no-var-requires
const JiraClient: any = require('jira-connector');
const FileCookieStore: any = require('tough-cookie-filestore');
// tslint:enable:no-var-requires

import { Project, UserPassConnection } from './models';

export class JiraCards {
   jarReq: CookieJar = jar(new FileCookieStore(join(__dirname, 'cookies.json')));
   jiraClient: any;
   readonly host: string = 'stratio.atlassian.net';

   async test(): Promise<void> {
      await this.connect();
      await this.showProjectList();
   }

   private async connect(): Promise<void> {
      // if (!this.jiraClient) {
         // this.reconnect();
         // if (!this.jiraClient.status) {
            const userPass: UserPassConnection = await this.askForUsernamePassword();
            this.initialConnect(userPass.username, userPass.password);
         // }
      // }
   }

   private async askForUsernamePassword(): Promise<UserPassConnection> {
      const user: Answers = await prompt([{name: 'username', message: 'Jira Username:' }]);
      const pass: Answers = await prompt([{type: 'password', name: 'password', message: 'Jira Password:' }]);
      return { username: user.username, password: pass.password };
   }

   private initialConnect(username: string, password: string): void {
      this.jiraClient = new JiraClient({
         basic_auth: {
            password,
            username
         },
         cookie_jar: this.jarReq,
         host: this.host,
      });
   }

   private reconnect(): void {
      this.jiraClient = new JiraClient({
         cookie_jar: this.jarReq,
         host: this.host
      });
   }

   private async getAllProjects(): Promise<Project[]> {
      const projects: any[] = await this.jiraClient.project.getAllProjects();
      return projects.map((_: any) => ({ name: _.name, key: _.key, id: _.id }));
      // return [];
   }

   private async showProjectList(): Promise<void> {
      const projects: Project[] = await this.getAllProjects();
      const choices: ChoiceType[] = projects.map((project: Project) => ({ name: project.name, value: project.id.toString() }));
      await prompt([{
         choices,
         message: 'Select your project:',
         name: 'project',
         type: 'list'
      }]);
   }
   // .board.getIssuesForBoard({ boardId: 211})
}

// Funcionalidad deseada

/*
// Get cards
1º Connectar con la api y obtener token
2º Reconectar en cada peticion para pedir cosas

3º Get de projectos y guardado en interfaz
4º Mostrar una lista de proyectos a elegir

*/
