import type { Group } from "../types.js";
import { useConfig } from "vike-react/useConfig";

export type Data = Awaited<ReturnType<typeof data>>;

export const data = async () => {
  const config = useConfig();

  const response = await fetch("http://localhost:3000/groups");
  const json = await response.json()

  const groupsData = (json.data) as Groups[];

  config({
    title: `${groupsData.length} Groups of Charmed Scout`,
  });

  const groups = groupsData;

  return groups;
}
