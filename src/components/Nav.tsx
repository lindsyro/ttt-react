import { NavLink } from "react-router-dom";

export const Nav = () => {
  return (
    <nav className="flex gap-[15px]">
      <NavLink to="/games" end className={navLinkClass}>
        Список игр
      </NavLink>
      <NavLink to="/create" className={navLinkClass}>
        Создать игру
      </NavLink>
      <NavLink to="/games/history" className={navLinkClass}>
        История игр
      </NavLink>
      <NavLink to="/users/leaderboard" className={navLinkClass}>
        Рейтинг игроков
      </NavLink>
    </nav>
  );
};

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `cursor-pointer no-underline text-[#666] hover:text-black hover:underline ${
    isActive ? "underline" : ""
  }`;
