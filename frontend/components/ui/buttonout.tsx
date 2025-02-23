import { signOut } from "next-auth/react";

const LogoutButton = () => (
  <button onClick={() => signOut()}>
    Sign Out
  </button>
);

export default LogoutButton;