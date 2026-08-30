import { Route, Router, Routes } from "@solidjs/router";
import Feed from "./pages/Feed";
import Reviewed from "./pages/Reviewed";
import Account from "./pages/Account";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" component={Feed} />
          <Route path="/reviewed" component={Reviewed} />
          <Route path="/account" component={Account} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}
