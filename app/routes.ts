import { type RouteConfig, index, route, layout } from "@react-router/dev/routes"

export default [
  index("routes/home.tsx"),
  layout("layouts/main.tsx", [
    route("home", "routes/dashboard.tsx")
  ]),
] satisfies RouteConfig
