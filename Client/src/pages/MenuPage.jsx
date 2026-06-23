import BackgroundEffects from "../components/layout/BackgroundEffects";
import MenuScreen from "../components/menu/MenuScreen";

export default function MenuPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <BackgroundEffects />
      <MenuScreen />
    </main>
  );
}