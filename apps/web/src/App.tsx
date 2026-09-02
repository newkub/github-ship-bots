import { Route, Router } from "@solidjs/router";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import Layout from "./components/Layout";
import Cards from "./pages/Cards";
import Repos from "./pages/Repos";
import Billing from "./pages/Billing";
import Inspector from "./pages/Inspector";
import Marketplace from "./pages/Marketplace";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router base="/dashboard">
        <Route path="/" component={Layout}>
          <Route path="/" component={Cards} />
          <Route path="/repos" component={Repos} />
          <Route path="/billing" component={Billing} />
          <Route path="/inspector" component={Inspector} />
          <Route path="/marketplace" component={Marketplace} />
          <Route path="/settings" component={Settings} />
        </Route>
      </Router>
    </QueryClientProvider>
  );
}
