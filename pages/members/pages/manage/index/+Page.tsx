import React from "react";
import { useData } from "vike-react/useData";
import type { Data } from "./+data.js"

export default function Page() {
  const users = useData<Data>();

  return (
    <>
      <h1>Members - Manage</h1>
      These are our Charmed Scout Member

      <ol>
        {users.map(({ id, firstName, lastName }) => (
          <li key={id}>
            {firstName} {lastName}
          </li>
        ))}
      </ol>
    </>
  );
}
