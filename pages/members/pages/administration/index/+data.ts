import type { User } from "../types.js";
import { useConfig } from "vike-react/useConfig";

export type Data = Awaited<ReturnType<typeof data>>;

export const data = async () => {
  const config = useConfig();

  var response = await fetch("http://localhost:3000/users");
  var json = await response.json()

  const usersData = (json.data) as Users[];

  var response = await fetch("http://localhost:3000/groups");
  var json = await response.json()

  const groupsData = (json.data) as Groups[];

  config({
    title: `${usersData.length} Members of Charmed Scout`,
  });

  const users = usersData;
  const groups = groupsData;

  return { users, groups };
}
