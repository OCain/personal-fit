import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Calendar as CalendarIcon, Plus, Clock, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { mockSchedule, mockClients } from '../data/mockData';
import type { ScheduleEvent } from '../types/index';
import { toast } from 'sonner';

export function Schedule() {
  const [events, setEvents] = useState<ScheduleEvent[]>(mockSchedule);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date('2026-04-10'));
  const [formData, setFormData] = useState({
    clientId: '',
    time: '',
    duration: '60',
  });

  // Calendar helpers
  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const previousMonth = () => {
    setSelectedDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const nextMonth = () => {
    setSelectedDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const getEventsForDate = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.date === dateStr);
  };

  const handleAddEvent = () => {
    if (!formData.clientId || !formData.time) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    const client = mockClients.find(c => c.id === formData.clientId);
    if (!client) return;

    const newEvent: ScheduleEvent = {
      id: String(events.length + 1),
      clientId: formData.clientId,
      clientName: client.name,
      date: selectedDate.toISOString().split('T')[0],
      time: formData.time,
      duration: Number(formData.duration),
      status: 'scheduled',
    };

    setEvents([...events, newEvent]);
    setIsAddDialogOpen(false);
    setFormData({ clientId: '', time: '', duration: '60' });
    toast.success('Sessão agendada com sucesso!');
  };

  const getTodayEvents = () => {
    const today = new Date('2026-04-10').toISOString().split('T')[0];
    return events
      .filter(e => e.date === today && e.status === 'scheduled')
      .sort((a, b) => a.time.localeCompare(b.time));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'scheduled':
        return 'bg-accent/10 text-accent border-accent/20';
      case 'cancelled':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted';
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl">Agenda</h1>
          <p className="text-muted-foreground mt-1">Gerencie seus horários e sessões</p>
        </div>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-primary hover:bg-primary/90 self-start"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nova Sessão
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{monthNames[currentMonth]} {currentYear}</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={previousMonth}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={nextMonth}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {/* Week days header */}
              {weekDays.map(day => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}

              {/* Empty cells for days before month starts */}
              {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}

              {/* Calendar days */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dayEvents = getEventsForDate(day);
                const isToday = day === 10; // Demo: April 10 is "today"

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(new Date(currentYear, currentMonth, day))}
                    className={`aspect-square p-2 rounded-lg border-2 transition-colors ${
                      isToday
                        ? 'border-primary bg-primary/5'
                        : 'border-transparent hover:border-muted'
                    } ${
                      selectedDate.getDate() === day && selectedDate.getMonth() === currentMonth
                        ? 'bg-accent/10 border-accent'
                        : ''
                    }`}
                  >
                    <div className="text-sm font-medium mb-1">{day}</div>
                    {dayEvents.length > 0 && (
                      <div className="flex gap-1 flex-wrap">
                        {dayEvents.slice(0, 3).map(event => (
                          <div
                            key={event.id}
                            className={`w-1.5 h-1.5 rounded-full ${
                              event.status === 'completed'
                                ? 'bg-primary'
                                : event.status === 'scheduled'
                                ? 'bg-accent'
                                : 'bg-muted-foreground'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Hoje - 10/04/2026</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getTodayEvents().length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Nenhuma sessão agendada
                </p>
              ) : (
                getTodayEvents().map(event => (
                  <div
                    key={event.id}
                    className={`p-4 rounded-lg border-2 ${getStatusColor(event.status)}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">{event.time}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {event.duration}min
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4" />
                      <span>{event.clientName}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Selected Date Events */}
      {selectedDate.getDate() !== 10 && (
        <Card>
          <CardHeader>
            <CardTitle>
              Sessões - {selectedDate.toLocaleDateString('pt-BR')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getEventsForDate(selectedDate.getDate()).length === 0 ? (
                <p className="text-muted-foreground col-span-full text-center py-8">
                  Nenhuma sessão agendada para este dia
                </p>
              ) : (
                getEventsForDate(selectedDate.getDate()).map(event => (
                  <div
                    key={event.id}
                    className={`p-4 rounded-lg border-2 ${getStatusColor(event.status)}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">{event.time}</span>
                      </div>
                      <Badge
                        variant={
                          event.status === 'completed'
                            ? 'default'
                            : event.status === 'scheduled'
                            ? 'outline'
                            : 'secondary'
                        }
                      >
                        {event.status === 'completed'
                          ? 'Concluída'
                          : event.status === 'scheduled'
                          ? 'Agendada'
                          : 'Cancelada'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4" />
                      <span>{event.clientName}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Duração: {event.duration} minutos
                    </p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Event Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agendar Nova Sessão</DialogTitle>
            <DialogDescription>
              Selecione o cliente, horário e duração da sessão
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Data Selecionada</Label>
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                <span>{selectedDate.toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="client">Cliente</Label>
              <Select value={formData.clientId} onValueChange={(value) => setFormData({ ...formData, clientId: value })}>
                <SelectTrigger id="client" className="bg-input-background">
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  {mockClients.filter(c => c.status === 'active').map(client => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Horário</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="bg-input-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duração (minutos)</Label>
              <Select value={formData.duration} onValueChange={(value) => setFormData({ ...formData, duration: value })}>
                <SelectTrigger id="duration" className="bg-input-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutos</SelectItem>
                  <SelectItem value="60">60 minutos</SelectItem>
                  <SelectItem value="90">90 minutos</SelectItem>
                  <SelectItem value="120">120 minutos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddEvent} className="bg-primary hover:bg-primary/90">
              Agendar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}