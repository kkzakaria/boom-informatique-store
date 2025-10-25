import { Suspense } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/utils/supabase/server";

async function getDashboardStats() {
  const supabase = await createClient();

  const [totalProductsResult, totalOrdersResult, totalUsersResult, recentOrdersResult, totalRevenueResult, pendingOrdersResult] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase
      .from('orders')
      .select(`
        *,
        user:users(name, email),
        items:order_items(
          quantity,
          product:products(name)
        )
      `)
      .order('createdAt', { ascending: false })
      .limit(5),
    supabase
      .from('orders')
      .select('total'),
    supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'PENDING')
  ]);

  const totalRevenue = totalRevenueResult.data?.reduce((sum, order) => sum + Number(order.total), 0) || 0;

  return {
    totalProducts: totalProductsResult.count || 0,
    totalOrders: totalOrdersResult.count || 0,
    totalUsers: totalUsersResult.count || 0,
    totalRevenue,
    pendingOrders: pendingOrdersResult.count || 0,
    recentOrders: recentOrdersResult.data || []
  };
}

function StatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-1" />
            <Skeleton className="h-3 w-20" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function RecentOrdersSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

async function DashboardStats() {
  const stats = await getDashboardStats();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Produits</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.83z" />
            <line x1="7" x2="7" y1="7" y2="7" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalProducts}</div>
          <p className="text-xs text-muted-foreground">
            Produits en stock
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Commandes</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <line x1="2" x2="22" y1="10" y2="10" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalOrders}</div>
          <p className="text-xs text-muted-foreground">
            {stats.pendingOrders} en attente
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Revenus Totaux</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalRevenue.toFixed(2)} €</div>
          <p className="text-xs text-muted-foreground">
            Chiffre d&apos;affaires total
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalUsers}</div>
          <p className="text-xs text-muted-foreground">
            Utilisateurs inscrits
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

async function RecentOrders() {
  const stats = await getDashboardStats();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Commandes Récentes</CardTitle>
        <CardDescription>
          Les 5 dernières commandes passées sur la plateforme
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stats.recentOrders.map((order) => (
            <div key={order.id} className="flex items-center space-x-4">
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {order.user.name || order.user.email}
                </p>
                <p className="text-sm text-muted-foreground">
                  {order.items.length} article{order.items.length > 1 ? 's' : ''} • {order.total.toFixed(2)} €
                </p>
              </div>
              <Badge variant={order.status === 'DELIVERED' ? 'default' : order.status === 'PENDING' ? 'secondary' : order.status === 'CANCELLED' || order.status === 'REFUNDED' ? 'destructive' : 'outline'}>
                {order.status}
              </Badge>
            </div>
          ))}
          {stats.recentOrders.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Aucune commande récente
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  // Admin authentication is handled by middleware

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Tableau de Bord</h2>
      </div>

      <Suspense fallback={<StatsSkeleton />}>
        <DashboardStats />
      </Suspense>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <Suspense fallback={<RecentOrdersSkeleton />}>
            <RecentOrders />
          </Suspense>
        </div>
        <div className="col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Actions Rapides</CardTitle>
              <CardDescription>
                Accès rapide aux fonctionnalités principales
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <a
                href="/admin/products"
                className="block w-full p-3 text-left border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="font-medium">Gérer les Produits</div>
                <div className="text-sm text-muted-foreground">Ajouter, modifier ou supprimer des produits</div>
              </a>
              <a
                href="/admin/orders"
                className="block w-full p-3 text-left border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="font-medium">Gérer les Commandes</div>
                <div className="text-sm text-muted-foreground">Voir et traiter les commandes</div>
              </a>
              <a
                href="/admin/users"
                className="block w-full p-3 text-left border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="font-medium">Gérer les Utilisateurs</div>
                <div className="text-sm text-muted-foreground">Administrer les comptes utilisateurs</div>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}