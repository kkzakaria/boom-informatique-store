"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Save, Store, Mail, CreditCard, Truck } from "lucide-react";

interface StoreSettings {
  name: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  currency: string;
  taxRate: number;
  shippingEnabled: boolean;
  maintenanceMode: boolean;
  allowGuestCheckout: boolean;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<StoreSettings>({
    name: "",
    description: "",
    email: "",
    phone: "",
    address: "",
    currency: "EUR",
    taxRate: 20,
    shippingEnabled: true,
    maintenanceMode: false,
    allowGuestCheckout: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/admin/settings");
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les paramètres",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Paramètres sauvegardés avec succès",
        });
      } else {
        throw new Error("Erreur lors de la sauvegarde");
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof StoreSettings, value: string | number | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Paramètres du Magasin</h2>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Paramètres du Magasin</h2>
        <Button onClick={handleSaveSettings} disabled={saving}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Sauvegarde..." : "Sauvegarder"}
        </Button>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Informations générales */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Store className="mr-2 h-5 w-5" />
              Informations Générales
            </CardTitle>
            <CardDescription>
              Informations de base sur votre magasin
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom du magasin</Label>
                <Input
                  id="name"
                  value={settings.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Boom Informatique"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email de contact</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="contact@boom-informatique.fr"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={settings.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Description de votre magasin..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  value={settings.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+33 1 23 45 67 89"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Devise</Label>
                <Input
                  id="currency"
                  value={settings.currency}
                  onChange={(e) => handleInputChange("currency", e.target.value)}
                  placeholder="EUR"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Adresse</Label>
              <Textarea
                id="address"
                value={settings.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Adresse complète du magasin..."
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Configuration e-commerce */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="mr-2 h-5 w-5" />
              Configuration E-commerce
            </CardTitle>
            <CardDescription>
              Paramètres de vente et de paiement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="taxRate">Taux de TVA (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  step="0.1"
                  value={settings.taxRate}
                  onChange={(e) => handleInputChange("taxRate", parseFloat(e.target.value))}
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Livraison activée</Label>
                  <p className="text-sm text-muted-foreground">
                    Permettre la livraison des commandes
                  </p>
                </div>
                <Switch
                  checked={settings.shippingEnabled}
                  onCheckedChange={(checked) => handleInputChange("shippingEnabled", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Commande sans compte</Label>
                  <p className="text-sm text-muted-foreground">
                    Permettre aux visiteurs de commander sans créer de compte
                  </p>
                </div>
                <Switch
                  checked={settings.allowGuestCheckout}
                  onCheckedChange={(checked) => handleInputChange("allowGuestCheckout", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Mode maintenance</Label>
                  <p className="text-sm text-muted-foreground">
                    Désactiver temporairement le magasin pour maintenance
                  </p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => handleInputChange("maintenanceMode", checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="mr-2 h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Configuration des notifications et emails
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifications de commande</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des notifications pour les nouvelles commandes
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Emails de confirmation</Label>
                  <p className="text-sm text-muted-foreground">
                    Envoyer automatiquement des emails de confirmation
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Rappels de stock</Label>
                  <p className="text-sm text-muted-foreground">
                    Notifications quand le stock est faible
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bouton de sauvegarde */}
        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Sauvegarde..." : "Sauvegarder tous les paramètres"}
          </Button>
        </div>
      </form>
    </div>
  );
}