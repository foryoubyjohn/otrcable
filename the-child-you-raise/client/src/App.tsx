import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { GameProvider, useGame } from "./contexts/GameContext";
import MainMenu from "./components/game/MainMenu";
import NewGame from "./components/game/NewGame";
import Dashboard from "./components/game/Dashboard";
import ChildProfile from "./components/game/ChildProfile";
import ParentProfile from "./components/game/ParentProfile";
import Household from "./components/game/Household";
import School from "./components/game/School";
import Timeline from "./components/game/Timeline";
import Endgame from "./components/game/Endgame";

function GameRouter() {
  const { state } = useGame();

  switch (state.currentScreen) {
    case 'menu':
      return <MainMenu />;
    case 'newgame':
      return <NewGame />;
    case 'dashboard':
      return <Dashboard />;
    case 'child':
      return <ChildProfile />;
    case 'parent':
      return <ParentProfile />;
    case 'household':
      return <Household />;
    case 'school':
      return <School />;
    case 'timeline':
      return <Timeline />;
    case 'endgame':
      return <Endgame />;
    default:
      return <MainMenu />;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <GameProvider>
            <GameRouter />
          </GameProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
