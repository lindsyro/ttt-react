import React from "react";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../store/useAuthStore";

import { Nav } from "./Nav";
import { UserIcon } from "./UserIcon";

interface HeaderProps {
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title = "Крестики-нолики",
}) => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-10 box-border flex w-full items-center justify-between border-b border-[#ccc] bg-[#e0e0e0] px-5 py-[15px]">
      <div className="flex items-center gap-[30px]">
        <span className="text-[#666]">{title}</span>
        {user?.uuid && <Nav />}
      </div>

      {user?.uuid && (
        <div className="flex items-center text-[#666]">
          <div className="mr-[10px] flex size-7 shrink-0 items-center">
            <UserIcon />
          </div>
          <span className="text-gray-600">
            Игрок:
            <strong className="font-bold"> {user.login} </strong>
          </span>

          <button
            onClick={handleLogout}
            className="ml-2.5 cursor-pointer rounded-[5px] border-none bg-[#d9534f] px-5 py-2.5 text-[16px] text-white hover:bg-[#c9302c]"
          >
            Выход
          </button>
        </div>
      )}
    </header>
  );
};
