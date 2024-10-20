import { Button, buttonStyles, Link } from "@/components/ui";

export default function Home() {
  return (
    <section className="bg-inherit">
      <div>hola</div>
      <Link href="/chat">
        <Button>Chat</Button>
      </Link>
    </section>
  );
}
