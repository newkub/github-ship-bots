import {
  Link,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/solid-router";
import Footer from "./components/Footer";
import TopNav from "./components/TopNav";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import FeaturesPage from "./pages/FeaturesPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import CommandsPage from "./pages/CommandsPage";
import InstallPage from "./pages/InstallPage";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <TopNav />
      <main class="min-h-screen bg-zinc-950 text-zinc-50 font-sans antialiased pt-28 md:pt-32 pb-20 md:pb-0">
        <Outlet />
        <Footer />
      </main>
    </>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: AboutPage,
});

const featuresRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/features',
  component: FeaturesPage,
});

const howItWorksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/how-it-works',
  component: HowItWorksPage,
});

const commandsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/commands',
  component: CommandsPage,
});

const installRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/install',
  component: InstallPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  aboutRoute,
  featuresRoute,
  howItWorksRoute,
  commandsRoute,
  installRoute,
]);

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
});

declare module '@tanstack/solid-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}

export { Link };
