import { useParams, Link } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  TrendingUp,
  Activity,
  Target,
  CheckCircle2,
} from 'lucide-react';
import { mockClients, mockProgressData } from '../data/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export function ClientProfile() {
  const { id } = useParams();
  const client = mockClients.find(c => c.id === id);

  if (!client) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl">Cliente não encontrado</h2>
        <Link to="/clients">
          <Button className="mt-4">Voltar para Clientes</Button>
        </Link>
      </div>
    );
  }

  // Mock workout data
  const currentWorkout = {
    name: 'Treino A - Peito e Tríceps',
    exercises: [
      { name: 'Supino Reto', sets: 4, reps: 12, completed: 4 },
      { name: 'Supino Inclinado', sets: 3, reps: 12, completed: 3 },
      { name: 'Crossover', sets: 3, reps: 15, completed: 2 },
      { name: 'Tríceps Testa', sets: 3, reps: 12, completed: 0 },
      { name: 'Tríceps Corda', sets: 3, reps: 15, completed: 0 },
    ],
  };

  const completionPercentage = Math.round(
    (currentWorkout.exercises.reduce((sum, ex) => sum + ex.completed, 0) /
      currentWorkout.exercises.reduce((sum, ex) => sum + ex.sets, 0)) *
      100
  );

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/clients">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl">{client.name}</h1>
          <p className="text-muted-foreground mt-1">Perfil do Cliente</p>
        </div>
        <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
          {client.status === 'active' ? 'Ativo' : 'Inativo'}
        </Badge>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="bg-accent/10 p-3 rounded-lg">
                <Mail className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">E-mail</p>
                <p className="font-medium">{client.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-3 rounded-lg">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Telefone</p>
                <p className="font-medium">{client.phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="bg-accent/10 p-3 rounded-lg">
                <Calendar className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cliente desde</p>
                <p className="font-medium">
                  {new Date(client.joinDate).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Treinos Realizados</CardTitle>
            <Activity className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{client.workoutsCompleted}</div>
            <p className="text-xs text-muted-foreground mt-1">Total acumulado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Meta Mensal</CardTitle>
            <Target className="w-5 h-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12/16</div>
            <Progress value={75} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Frequência Semanal</CardTitle>
            <TrendingUp className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4x</div>
            <p className="text-xs text-muted-foreground mt-1">Média semanal</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="progress" className="space-y-4">
        <TabsList className="grid w-full md:w-auto grid-cols-2">
          <TabsTrigger value="progress">Evolução</TabsTrigger>
          <TabsTrigger value="workout">Treino Atual</TabsTrigger>
        </TabsList>

        {/* Progress Tab */}
        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Evolução Física</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={mockProgressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="date"
                    stroke="var(--muted-foreground)"
                    tickFormatter={(value) => new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                  />
                  <YAxis stroke="var(--muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#3498DB"
                    strokeWidth={2}
                    name="Peso (kg)"
                    dot={{ fill: '#3498DB', r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="bodyFat"
                    stroke="#e74c3c"
                    strokeWidth={2}
                    name="Gordura (%)"
                    dot={{ fill: '#e74c3c', r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="muscleMass"
                    stroke="#2ECC71"
                    strokeWidth={2}
                    name="Massa Muscular (kg)"
                    dot={{ fill: '#2ECC71', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Peso Atual</p>
                  <p className="text-3xl font-bold mt-2">72.5 kg</p>
                  <p className="text-sm text-primary mt-1">-5.5 kg</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">% Gordura</p>
                  <p className="text-3xl font-bold mt-2">16.5%</p>
                  <p className="text-sm text-primary mt-1">-5.5%</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Massa Muscular</p>
                  <p className="text-3xl font-bold mt-2">39 kg</p>
                  <p className="text-sm text-primary mt-1">+4 kg</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Workout Tab */}
        <TabsContent value="workout" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{currentWorkout.name}</CardTitle>
                <Badge variant="outline">{completionPercentage}% completo</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={completionPercentage} className="mb-6" />
              <div className="space-y-3">
                {currentWorkout.exercises.map((exercise, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {exercise.completed === exercise.sets ? (
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-muted-foreground" />
                      )}
                      <div>
                        <p className="font-medium">{exercise.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {exercise.sets} séries x {exercise.reps} repetições
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {exercise.completed}/{exercise.sets} séries
                      </p>
                      <Progress
                        value={(exercise.completed / exercise.sets) * 100}
                        className="w-20 mt-1"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex gap-3">
                <Button className="flex-1 bg-primary hover:bg-primary/90">
                  Marcar Série Concluída
                </Button>
                <Button variant="outline" className="flex-1">
                  Ver Histórico
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}