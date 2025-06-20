export type GroupRole = "pin" | "wapin" | "juruuang" | "member"

export type Group = {
  id: string;
  name: string;
  type: string;
  members: {
    member_id: string;
    role: GroupRole;
  }[];
};
