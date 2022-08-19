import { AppStateProvider } from "context";

import { AppNavigator } from "navigation";

export default function App() {
  return (
    <AppStateProvider>
      <AppNavigator />
    </AppStateProvider>
  );
}
