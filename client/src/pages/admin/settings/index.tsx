import { useEffect, useState } from "react";
import { Settings, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { toast } = useToast();
  const [siteName, setSiteName] = useState("Loja do Fiado");
  const [whatsappGroupUrl, setWhatsappGroupUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch("/api/settings");
        const data = await response.json();
        if (data.success && data.data) {
          setSiteName(data.data.siteName || "Loja do Fiado");
          setWhatsappGroupUrl(data.data.whatsappGroupUrl || "");
        }
      } catch {
        toast({
          title: "Erro ao carregar",
          description: "Não foi possível carregar as configurações.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [toast]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("auth_token")}`
        },
        body: JSON.stringify({
          siteName,
          whatsappGroupUrl
        })
      });
      const data = await response.json();
      if (data.success) {
        toast({
          title: "Configurações salvas",
          description: "As alterações foram salvas com sucesso."
        });
      } else {
        toast({
          title: "Erro ao salvar",
          description: data.error || "Não foi possível salvar as configurações.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="grid size-8 place-items-center rounded-lg border bg-primary text-primary-foreground">
                <span className="font-serif text-sm font-bold">LF</span>
              </div>
              <div>
                <div className="font-semibold">Painel Admin</div>
                <div className="text-xs text-muted-foreground">Loja do Fiado</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings className="size-5" />
              <CardTitle>Configurações do Site</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Nome da Loja</Label>
              <Input
                id="siteName"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                placeholder="Loja do Fiado"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsappGroupUrl">Link do Grupo do WhatsApp</Label>
              <Input
                id="whatsappGroupUrl"
                value={whatsappGroupUrl}
                onChange={(e) => setWhatsappGroupUrl(e.target.value)}
                placeholder="https://chat.whatsapp.com/..."
                disabled={loading}
              />
            </div>

            <Button onClick={handleSave} disabled={saving}>
              <Save className="size-4 mr-2" />
              {saving ? "Salvando..." : "Salvar Configurações"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
