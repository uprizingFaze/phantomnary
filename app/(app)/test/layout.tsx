import { TextHoverEffect } from "@/components/ui/text-hover-effect";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="">
      <div className="h-max">
        <div className="h-2 min-h-screen bg-black border rounded-lg">
          <div className="h-[25rem] fixed flex justify-center z-0 w-full">
            <TextHoverEffect text="CHAT" />
          </div>
          <div className="mt-72 z-10">{children}</div>
        </div>
      </div>
    </main>
  );
}
