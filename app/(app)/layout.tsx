import Navbar from "@/components/navbar";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="">
      <Navbar >
        
      </Navbar>
      <div className="h-[25rem] fixed flex justify-center z-0 w-full">
        <TextHoverEffect text="CHAT" />
      </div>
      <div className="mt-24 z-10">{children}</div>
    </main>
  );
}
