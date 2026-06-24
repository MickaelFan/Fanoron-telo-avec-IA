import { useLocation, useNavigate } from "react-router-dom";
import BackgroundEffects from "../components/layout/BackgroundEffects";
import GameScreen from "../components/game/GameScreen";
import useFanoronGame from "../hooks/useFanoronGame";

export default function GamePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const mode = location.state?.mode || "human-human";
  const difficulty = location.state?.difficulty || "easy";

  const game = useFanoronGame({
    initialMode: mode,
    initialDifficulty: difficulty,
  });

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <BackgroundEffects />

      <GameScreen
        {...game}
        onBackToMenu={() => navigate("/")}
      />
    </main>
  );
}