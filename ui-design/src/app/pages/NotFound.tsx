import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Home } from 'lucide-react';

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-primary">404</h1>
          <h2 className="text-2xl">Página não encontrada</h2>
          <p className="text-muted-foreground">
            A página que você está procurando não existe.
          </p>
        </div>
        <Link to="/">
          <Button className="bg-primary hover:bg-primary/90">
            <Home className="w-4 h-4 mr-2" />
            Voltar ao Início
          </Button>
        </Link>
      </div>
    </div>
  );
}
