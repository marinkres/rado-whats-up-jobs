
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const Settings = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="pl-64">
        <div className="container mx-auto py-8 px-6">
          <h1 className="text-3xl font-bold mb-6">Postavke</h1>

          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Profil tvrtke</h2>
              <div className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-sm font-medium mb-1">Naziv tvrtke</label>
                  <Input defaultValue="Rado Demo" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <Input defaultValue="info@rado.ai" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Telefon</label>
                  <Input defaultValue="+385 1 234 5678" />
                </div>
                <Button>Spremi promjene</Button>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">WhatsApp integracija</h2>
              <div className="space-y-4 max-w-lg">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium text-green-800">Povezano</p>
                    <p className="text-sm text-green-600">+385 98 765 4321</p>
                  </div>
                  <Button variant="outline">Promijeni broj</Button>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Obavijesti</h2>
              <div className="space-y-4 max-w-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email obavijesti</p>
                    <p className="text-sm text-gray-500">Primajte obavijesti o novim prijavama</p>
                  </div>
                  <Button variant="outline">Isključeno</Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">WhatsApp obavijesti</p>
                    <p className="text-sm text-gray-500">Primajte obavijesti putem WhatsAppa</p>
                  </div>
                  <Button variant="outline">Uključeno</Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
