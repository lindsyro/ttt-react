import { Outlet, useMatches } from "react-router-dom";

import { Header } from "./components/Header";

interface RouteHandle {
  title?: string;
}

function App() {
  const matches = useMatches();

  const currentMatch = matches.find((m) => (m.handle as RouteHandle)?.title);
  const title =
    (currentMatch?.handle as RouteHandle)?.title || "Крестики-нолики";

  return (
    <>
      <Header title={title} />
      <main className="main-content">
        <Outlet />
      </main>
    </>
  );
}
export default App;
