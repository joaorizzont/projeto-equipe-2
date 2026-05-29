import { AppDataSource } from "../config/data-source";
import { Ticket, TicketStatus } from "../models/Ticket";
import { Event } from "../models/Event";
import { User } from "../models/User";

export interface DashboardMetrics {
  revenue: number;
  ticketsSold: number;
  checkins: number;
  activeEvents: number;
  totalUsers: number;
  salesLast7Days: { date: string; count: number }[];
  recentActivity: { title: string; desc: string; at: string }[];
}

export class DashboardService {
  private ticketRepo = AppDataSource.getRepository(Ticket);
  private eventRepo = AppDataSource.getRepository(Event);
  private userRepo = AppDataSource.getRepository(User);

  public async getMetrics(): Promise<DashboardMetrics> {
    const now = new Date();

    const [ticketsSold, checkins, totalUsers, activeEvents] = await Promise.all([
      this.ticketRepo.count(),
      this.ticketRepo.count({ where: { status: TicketStatus.UTILIZADO } }),
      this.userRepo.count(),
      this.eventRepo
        .createQueryBuilder("event")
        .where("event.validAt > :now", { now })
        .getCount(),
    ]);

    // Receita real = soma do preço do evento por ingresso vendido (exclui cancelados)
    const revenueRow = await this.ticketRepo
      .createQueryBuilder("ticket")
      .innerJoin("ticket.event", "event")
      .where("ticket.status != :cancelado", { cancelado: TicketStatus.CANCELADO })
      .select("COALESCE(SUM(event.price), 0)", "total")
      .getRawOne<{ total: string }>();
    const revenue = Number(revenueRow?.total ?? 0);

    // Vendas dos últimos 7 dias (agrupadas em JS para ser agnóstico de SGBD)
    const since = new Date(now);
    since.setDate(since.getDate() - 6);
    since.setHours(0, 0, 0, 0);
    const recentTickets = await this.ticketRepo
      .createQueryBuilder("ticket")
      .leftJoinAndSelect("ticket.event", "event")
      .leftJoinAndSelect("ticket.user", "user")
      .where("ticket.created_at >= :since", { since })
      .orderBy("ticket.created_at", "DESC")
      .getMany();

    const buckets: Record<string, number> = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date(since);
      d.setDate(since.getDate() + i);
      buckets[d.toISOString().slice(0, 10)] = 0;
    }
    for (const t of recentTickets) {
      const key = new Date(t.createdAt).toISOString().slice(0, 10);
      if (key in buckets) buckets[key]++;
    }
    const salesLast7Days = Object.entries(buckets).map(([date, count]) => ({ date, count }));

    // Atividades recentes reais: últimas compras de ingresso
    const recentActivity = recentTickets.slice(0, 6).map((t) => ({
      title: t.status === TicketStatus.UTILIZADO ? "Ingresso utilizado" : "Compra de ingresso",
      desc: `${t.user?.nome ?? "Usuário"} — ${t.event?.title ?? "Evento"}`,
      at: new Date(t.createdAt).toISOString(),
    }));

    return {
      revenue,
      ticketsSold,
      checkins,
      activeEvents,
      totalUsers,
      salesLast7Days,
      recentActivity,
    };
  }
}
