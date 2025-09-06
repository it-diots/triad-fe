import { Button } from "@triad/ui";

export default function Home() {
  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 sm:p-20">
      <main className="row-start-2 flex flex-col items-center gap-8 sm:items-start">
        <h1 className="text-4xl font-bold">Welcome to Triad</h1>
        <p className="text-lg">Your Next.js 15 app is running!</p>
        <Button>asd</Button>
      </main>
    </div>
  );
}
