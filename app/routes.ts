import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("api/suggestions", "routes/api-suggestions.tsx"),
] satisfies RouteConfig;
