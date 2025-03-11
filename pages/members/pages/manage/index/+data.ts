import type { User } from "../types.js";
import { useConfig } from "vike-react/useConfig";

export type Data = Awaited<ReturnType<typeof data>>;

export const data = async () => {
  const config = useConfig();

  const response = await fetch("http://localhost:3000/users");
  const json = await response.json()

  const usersData = (json.data) as Users[];

  config({
    title: `${usersData.length} Members of Charmed Scout`,
  });

  const users = usersData;

  return users;
}
