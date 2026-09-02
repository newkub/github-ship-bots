import { Route, Router } from "@solidjs/router";
import Feed from "./pages/Feed";
import Reviewed from "./pages/Reviewed";
import Alerts from "./pages/Alerts";
import Account from "./pages/Account";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Route path="/" component={Feed} />
        <Route path="/reviewed" component={Reviewed} />
        <Route path="/alerts" component={Alerts} />
        <Route path="/account" component={Account} />
      </Router>
    </QueryClientProvider>
  );
}
