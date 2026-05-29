export interface DashboardResponse {
  revenue: number;
  ticketsSold: number;
  checkins: number;
  activeEvents: number;
  totalUsers: number;
  salesLast7Days: { date: string; count: number }[];
  recentActivity: { title: string; desc: string; at: string }[];
}
