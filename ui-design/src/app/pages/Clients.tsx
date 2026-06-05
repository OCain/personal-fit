import { useState } from 'react';
import { Link } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Search, Plus, Edit, Trash2, UserCircle } from 'lucide-react';
import { mockClients } from '../data/mockData';
import type { Client } from '../types/index';
import { toast } from 'sonner';

export function Clients() {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddClient = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    const newClient: Client = {
      id: String(clients.length + 1),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      joinDate: new Date().toISOString().split('T')[0],
      status: 'active',
      workoutsCompleted: 0,
    };

    setClients([...clients, newClient]);
    setIsAddDialogOpen(false);
    setFormData({ name: '', email: '', phone: '' });
    toast.success('Cliente cadastrado com sucesso!');
  };

  const handleEditClient = () => {
    if (!selectedClient || !formData.name || !formData.email || !formData.phone) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    const updatedClients = clients.map(client =>
      client.id === selectedClient.id
        ? { ...client, name: formData.name, email: formData.email, phone: formData.phone }
        : client
    );

    setClients(updatedClients);
    setIsEditDialogOpen(false);
    setSelectedClient(null);
    setFormData({ name: '', email: '', phone: '' });
    toast.success('Cliente atualizado com sucesso!');
  };

  const handleDeleteClient = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      setClients(clients.filter(client => client.id !== id));
      toast.success('Cliente excluído com sucesso!');
    }
  };

  const openEditDialog = (client: Client) => {
    setSelectedClient(client);
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone,
    });
    setIsEditDialogOpen(true);
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl">Clientes</h1>
          <p className="text-muted-foreground mt-1">Gerencie seus alunos</p>
        </div>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-primary hover:bg-primary/90 self-start"
        >
          <Plus className="w-5 h-5 mr-2" />
          Novo Cliente
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou e-mail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-input-background"
            />
          </div>
        </CardContent>
      </Card>

      {/* Clients Table - Desktop */}
      <Card className="hidden md:block">
        <CardHeader>
          <CardTitle>Lista de Clientes ({filteredClients.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Data de Ingresso</TableHead>
                <TableHead>Treinos</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    <Link
                      to={`/clients/${client.id}`}
                      className="font-medium hover:text-primary transition-colors flex items-center gap-2"
                    >
                      <UserCircle className="w-5 h-5" />
                      {client.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{client.email}</div>
                      <div className="text-muted-foreground">{client.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(client.joinDate).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>{client.workoutsCompleted}</TableCell>
                  <TableCell>
                    <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
                      {client.status === 'active' ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(client)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClient(client.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Clients Cards - Mobile */}
      <div className="md:hidden space-y-4">
        {filteredClients.map((client) => (
          <Card key={client.id}>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <Link
                    to={`/clients/${client.id}`}
                    className="font-medium hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <UserCircle className="w-5 h-5" />
                    {client.name}
                  </Link>
                  <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
                    {client.status === 'active' ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
                <div className="text-sm space-y-1">
                  <p className="text-muted-foreground">{client.email}</p>
                  <p className="text-muted-foreground">{client.phone}</p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-sm text-muted-foreground">
                    {client.workoutsCompleted} treinos
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(client)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClient(client.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Client Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Cliente</DialogTitle>
            <DialogDescription>
              Preencha os dados do novo cliente
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-input-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-input-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-input-background"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddClient} className="bg-primary hover:bg-primary/90">
              Cadastrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Client Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
            <DialogDescription>
              Atualize os dados do cliente
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nome Completo</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-input-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">E-mail</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-input-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Telefone</Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-input-background"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditClient} className="bg-primary hover:bg-primary/90">
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}