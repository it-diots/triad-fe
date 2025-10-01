import { Header } from "./header";
import Hero from "./hero";

export default function Home() {
  return (
    <main className="relative h-screen w-full overflow-hidden bg-zinc-950 px-6 pt-[64px] sm:px-12 md:px-16">
      <Header />

      <Hero />
    </main>
  );
}
