import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Dumbbell } from 'lucide-react';
import { toast } from 'sonner';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock login - em produção, validaria credenciais
    if (email && password) {
      toast.success('Login realizado com sucesso!');
      navigate('/');
    } else {
      toast.error('Por favor, preencha todos os campos');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="bg-primary rounded-full p-4">
              <Dumbbell className="w-10 h-10 text-white" />
            </div>
          </div>
          <div>
            <CardTitle className="text-3xl">Personal Fit Service</CardTitle>
            <CardDescription className="mt-2">
              Sistema de gestão para Personal Trainers
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-input-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-input-background"
              />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
              Entrar
            </Button>
            <div className="text-center">
              <button
                type="button"
                className="text-sm text-muted-foreground hover:text-accent transition-colors"
              >
                Esqueceu sua senha?
              </button>
            </div>
          </form>
          <div className="mt-6 pt-6 border-t border-border text-center text-sm text-muted-foreground">
            <p>Credenciais de demonstração:</p>
            <p className="mt-1">Email: demo@fittrainer.com</p>
            <p>Senha: qualquer senha</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}