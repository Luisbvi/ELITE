declare global {
  namespace NodeJS {
    interface ProcessEnv {
      botToken: string;
      clientId: string;
      color: string;
      mongo_uri: string;
      ticketParent: string;
      transcriptChannel: string;
      jobChannel: string;
      environment: "dev" | "prod" | "debug";
      guildId: string;
      owners: string;
      prefix: string;
      status: string;
      statusType: string;
    }
  }
}

export {};
