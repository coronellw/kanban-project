import { type RouteConfig, index, route, layout } from "@react-router/dev/routes"

export default [
  index("routes/home.tsx"),
  layout("layouts/main.tsx", [
    route("home", "routes/dashboard.tsx")
  ]),
  // Handle Chrome DevTools and other .well-known requests
  route("/.well-known/*", "routes/well-known.tsx"),
] satisfies RouteConfig
