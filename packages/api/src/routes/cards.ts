import { Elysia } from "elysia";
import read from "./cards/read";
import write from "./cards/write";
import create from "./cards/create";

const cards = new Elysia({ prefix: "/api/cards" })
  .use(read)
  .use(write)
  .use(create);

export default cards;
