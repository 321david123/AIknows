import { signOut } from "next-auth/react";

const LogoutButton = () => (
  <button onClick={() => signOut()} className="linkedin-button other">
    Sign Out
  </button>
);

export default LogoutButton;