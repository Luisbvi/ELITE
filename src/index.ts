import { ExtendedClient } from "./structures/classes/Client";
import { config } from "dotenv";
import Colors from "colors"
Colors
config();

export const client = new ExtendedClient();


console.clear();
client.start();
