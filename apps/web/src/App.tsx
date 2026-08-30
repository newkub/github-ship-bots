import { Route, Router, Routes } from "@solidjs/router";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import Layout from "./components/Layout";
import Cards from "./pages/Cards";
import Repos from "./pages/Repos";
import Billing from "./pages/Billing";
import Inspector from "./pages/Inspector";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" component={Layout}>
            <Route path="/" component={Cards} />
            <Route path="/repos" component={Repos} />
            <Route path="/billing" component={Billing} />
            <Route path="/inspector" component={Inspector} />
            <Route path="/settings" component={Settings} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}
