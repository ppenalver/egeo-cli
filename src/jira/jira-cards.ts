import { Answers, ChoiceType, prompt, Question } from "inquirer";
import { join } from "path";
import { CookieJar, jar } from "request";

// tslint:disable:no-var-requires
const JiraClient: any = require("jira-connector");
const FileCookieStore: any = require("tough-cookie-filestore");
// tslint:enable:no-var-requires

import { Project, UserPassConnection, Board, BoardResponse } from "./models";

export class JiraCards {
  private jiraClient: any;
  private readonly host: string = "stratio.atlassian.net";

  public async test(): Promise<void> {
    await this.initConnection("ppenalver", "pp3n4lv3r");
    const projectId: string = await this.showProjectList();

    const boards: Board[] = await this.getAllBoards([]);
    /* const boardsDetail: BoadDetail[] =  */
    await this.getBoardsDetail(boards);
    //  const response: any = await this.jiraClient.project.getProject({
    //    projectIdOrKey: Number.parseInt(projectId)
    //  });
    //  console.log(response);
  }

  private async initConnection(
    username?: string,
    password?: string
  ): Promise<void> {
    let userPass: UserPassConnection;
    if (username && password) {
      userPass = { username, password };
    } else {
      userPass = await this.askForUsernamePassword();
    }
    this.connect(userPass.username, userPass.password);
  }

  private async askForUsernamePassword(): Promise<UserPassConnection> {
    const user: Answers = await prompt([
      { name: "username", message: "Jira Username:" }
    ]);
    const pass: Answers = await prompt([
      { type: "password", name: "password", message: "Jira Password:" }
    ]);
    return { username: user.username, password: pass.password };
  }

  private async getAllBoards(partial: Board[]): Promise<Board[]> {
    const response: BoardResponse = await this.jiraClient.board.getAllBoards({
      type: "scrum"
    });
    if (!response.isLast) {
      this.getAllBoards(partial);
    }
    return [...partial, ...response.values];
  }

  private async getBoardsDetail(boards: Board[]): Promise<void> {
    const details: any[] = [];
    for (const board of boards) {
      details.push(await this.getBoardDetail(board));
    }
    console.log(details);
  }

  private async getBoardDetail(board: Board): Promise<any> {
    const response: any = await this.jiraClient.board.getBoard({ boardId: board.id });
    console.log(response);
    return response;
  }

  private connect(username: string, password: string): void {
    this.jiraClient = new JiraClient({
      basic_auth: {
        password,
        username
      },
      host: this.host
    });
  }

  private async getAllProjects(): Promise<Project[]> {
    const projects: any[] = await this.jiraClient.project.getAllProjects();
    return projects.map((_: any) => ({ name: _.name, key: _.key, id: _.id }));
    // return [];
  }

  private async showProjectList(): Promise<string> {
    const projects: Project[] = await this.getAllProjects();
    const choices: ChoiceType[] = projects.map((project: Project) => ({
      name: project.name,
      value: project.id.toString()
    }));
    const selected: Answers = await prompt([
      {
        choices,
        message: "Select your project:",
        name: "project",
        type: "list"
      }
    ]);
    return selected.project;
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
