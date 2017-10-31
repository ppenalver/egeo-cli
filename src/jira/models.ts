export interface UserPassConnection {
   username: string;
   password: string;
}

export interface Project {
   name: string;
   id: number;
   key: string;
}

export interface Board {
   name: string;
   type: string;
   id: number;
}

export interface BoardResponse {
   maxResults: number;
   startAt: number;
   isLast: boolean;
   values: Board[];
}
