import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Users, Calendar, TrendingUp, Activity } from 'lucide-react';
import { mockClients, mockSchedule } from '../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Link } from 'react-router';
import { Badge } from '../components/ui/badge';

export function Dashboard() {
  const activeClients = mockClients.filter(c => c.status === 'active').length;
  const todaySchedule = mockSchedule.filter(s => s.date === '2026-04-10').length;
  const totalWorkouts = mockClients.reduce((sum, c) => sum + c.workoutsCompleted, 0);

  // Dados para gráfico de treinos por semana
  const weeklyData = [
    { day: 'Seg', workouts: 12 },
    { day: 'Ter', workouts: 15 },
    { day: 'Qua', workouts: 18 },
    { day: 'Qui', workouts: 14 },
    { day: 'Sex', workouts: 20 },
    { day: 'Sáb', workouts: 8 },
    { day: 'Dom', workouts: 5 },
  ];

  // Dados de crescimento mensal
  const monthlyGrowth = [
    { month: 'Jan', clients: 15 },
    { month: 'Fev', clients: 18 },
    { month: 'Mar', clients: 22 },
    { month: 'Abr', clients: 25 },
  ];

  const upcomingSessions = mockSchedule
    .filter(s => s.status === 'scheduled')
    .slice(0, 5);

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Bem-vindo ao Personal Fit Service</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
            <Users className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeClients}</div>
            <p className="text-xs text-muted-foreground mt-1">
              +3 este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Sessões Hoje</CardTitle>
            <Calendar className="w-5 h-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todaySchedule}</div>
            <p className="text-xs text-muted-foreground mt-1">
              2 concluídas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de Treinos</CardTitle>
            <Activity className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWorkouts}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Este mês: 89
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Crescimento</CardTitle>
            <TrendingUp className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12%</div>
            <p className="text-xs text-muted-foreground mt-1">
              vs. mês anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Treinos por Dia da Semana</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="workouts" fill="#2ECC71" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Crescimento de Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="clients"
                  stroke="#3498DB"
                  strokeWidth={3}
                  dot={{ fill: '#3498DB', r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Próximas Sessões</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingSessions.map((session) => (
              <div
                key={session.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-muted/50 rounded-lg gap-3"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 text-primary p-3 rounded-lg">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <Link
                      to={`/clients/${session.clientId}`}
                      className="font-medium hover:text-primary transition-colors"
                    >
                      {session.clientName}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {new Date(session.date).toLocaleDateString('pt-BR')} às {session.time}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="self-start sm:self-auto">
                  {session.duration} min
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}