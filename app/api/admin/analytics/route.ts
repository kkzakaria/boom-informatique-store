import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '30d';

    // Calculate date range
    const now = new Date();
    let startDate: Date;

    switch (range) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get basic stats
    const [totalRevenue, totalOrders, totalProducts, totalUsers] = await Promise.all([
      prisma.order.aggregate({
        where: {
          createdAt: {
            gte: startDate,
          },
        },
        _sum: {
          total: true,
        },
      }),
      prisma.order.count({
        where: {
          createdAt: {
            gte: startDate,
          },
        },
      }),
      prisma.product.count({
        where: {
          isActive: true,
        },
      }),
      prisma.user.count(),
    ]);

    // Revenue by month
    const revenueByMonth = await prisma.$queryRaw<Array<{
      month: string;
      revenue: number;
      orders: number;
    }>>`
      SELECT
        DATE_TRUNC('month', "createdAt") as month,
        COALESCE(SUM(total), 0) as revenue,
        COUNT(*) as orders
      FROM orders
      WHERE "createdAt" >= ${startDate}
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY month DESC
      LIMIT 12
    `;

    // Format month data
    const formattedRevenueByMonth = revenueByMonth.map(item => ({
      month: new Date(item.month).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }),
      revenue: Number(item.revenue),
      orders: Number(item.orders),
    }));

    // Orders by status
    const ordersByStatus = await prisma.order.groupBy({
      by: ['status'],
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      _count: {
        status: true,
      },
    });

    const formattedOrdersByStatus = ordersByStatus.map(item => ({
      status: item.status,
      count: item._count.status,
    }));

    // Top products
    const topProducts = await prisma.$queryRaw<Array<{
      name: string;
      sold: number;
      revenue: number;
    }>>`
      SELECT
        p.name,
        COALESCE(SUM(oi.quantity), 0) as sold,
        COALESCE(SUM(oi.total), 0) as revenue
      FROM products p
      LEFT JOIN order_items oi ON p.id = oi."productId"
      LEFT JOIN orders o ON oi."orderId" = o.id AND o."createdAt" >= ${startDate}
      GROUP BY p.id, p.name
      HAVING COALESCE(SUM(oi.quantity), 0) > 0
      ORDER BY sold DESC
      LIMIT 10
    `;

    const formattedTopProducts = topProducts.map(item => ({
      name: item.name,
      sold: Number(item.sold),
      revenue: Number(item.revenue),
    }));

    // Recent activity (simplified - in a real app you'd have an audit log table)
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, email: true }
        },
      },
    });

    const recentActivity = recentOrders.map(order => ({
      type: 'Commande',
      description: `Nouvelle commande de ${order.user.name || order.user.email} - ${order.total}€`,
      date: order.createdAt.toISOString(),
    }));

    return NextResponse.json({
      totalRevenue: totalRevenue._sum.total || 0,
      totalOrders,
      totalProducts,
      totalUsers,
      revenueByMonth: formattedRevenueByMonth,
      ordersByStatus: formattedOrdersByStatus,
      topProducts: formattedTopProducts,
      recentActivity,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}