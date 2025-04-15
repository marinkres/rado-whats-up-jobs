import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { cn } from "@/lib/utils";

const Chat = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main
        className={cn(
          "transition-all duration-300",
          "md:pl-64", // Add padding when the sidebar is open on desktop
          "pl-0" // No padding on mobile
        )}
      >
        <div className="container mx-auto py-8 px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="p-4">
              <h2 className="text-lg font-semibold mb-4">Razgovori</h2>
              <div className="space-y-4">
                <Input placeholder="Pretraži razgovore..." />

                <div className="space-y-2">
                  {["Ana Kovačić", "Marko Horvat", "Ivan Novak", "Petra Babić", "Tomislav Kralj"].map((name) => (
                    <div key={name} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
                      <div className="w-10 h-10 rounded-full bg-gray-200" />
                      <div>
                        <p className="font-medium">{name}</p>
                        <p className="text-sm text-gray-500">Online</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <Card className="col-span-2 p-4">
              <div className="flex flex-col h-[600px]">
                <div className="flex-1 overflow-auto space-y-4 mb-4">
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0" />
                    <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                      <p className="text-sm">Pozdrav! Zanima me pozicija konobara u Splitu.</p>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <div className="bg-purple-100 rounded-lg p-3 max-w-[80%]">
                      <p className="text-sm">Naravno! Recite mi malo više o vašem iskustvu.</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-purple-200 flex-shrink-0" />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Input placeholder="Napišite poruku..." className="flex-1" />
                  <button className="p-2 rounded-lg bg-purple-600 text-white">
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;
