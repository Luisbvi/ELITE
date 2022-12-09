import { ExtendedClient } from "../classes/Client";

export class AntiCrash {
  public async loadAntiCrash(client: ExtendedClient) {
    process.removeAllListeners();

    process.on("unhandledRejection", (reason, p) => {
      console.log("[ANTICRASH] - ERROR FOUND");
      console.log(reason, p);
    });

    process.on("uncaughtException", (error, origin) => {
      console.log("[ANTICRASH] - ERROR FOUND");
      console.log(error, origin);
    });

    process.on("uncaughtExceptionMonitor", (error, origin) => {
      console.log("[ANTICRASH] - ERROR FOUND");
      console.log(error, origin);
    });

    process.on("multipleResolves", () => {});
  }
}
