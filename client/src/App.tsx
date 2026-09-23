import { Route, Switch } from "wouter";
import PrototypeHome from "./pages/PrototypeHome";
import NotFound from "./pages/NotFound";

function Router() {
  return (
    <Switch>
      <Route path="/" component={PrototypeHome} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return <Router />;
}
