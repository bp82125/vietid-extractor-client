export interface ServerMessage {
  status: string;
  message: string;
  data?: Array<string>;
}

export interface ServerResponseProps {
  serverMessages: ServerMessage[];
}
