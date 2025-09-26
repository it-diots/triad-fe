import { Button } from "@triad/ui";

export default function Header() {
  return (
    <header className="sticky left-0 right-0 top-0 z-50 flex h-[64px] items-center justify-between bg-zinc-950 px-16">
      <div className="text-lg font-bold tracking-widest text-white">TRIAD</div>

      <nav>
        <ul>
          <li className="flex items-center gap-4">
            <Button variant="link" className="text-gray-200">
              Home
            </Button>

            <Button variant="link" className="text-gray-200">
              About
            </Button>

            <Button variant="link" className="text-gray-200">
              Contact
            </Button>
          </li>
        </ul>
      </nav>

      <Button variant="secondary" size="sm" className="text-xs font-semibold">
        Contact Us
      </Button>
    </header>
  );
}
