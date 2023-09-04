import UnauthenticatedApp from "./components/views/UnauthenticatedApp";
import AuthenticatedApp from "./components/views/AuthenticatedApp";
import { useAuth } from "./hooks/useAuth";

function App() {
  const { isAuthenticated } = useAuth();
  return (
    <div data-theme="dark">
      {isAuthenticated ? <AuthenticatedApp /> : <UnauthenticatedApp />}
    </div>
  );
}

export default App;
