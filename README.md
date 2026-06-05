# Personal Fit - README.md

## Visão Geral do Projeto

O **Personal Fit** é um MVP (Produto Mínimo Viável) de um sistema de gestão para Personal Trainers, desenvolvido em Python com o framework Django e banco de dados SQLite. O objetivo da plataforma é fornecer uma interface segura, robusta e amigável para que o profissional possa gerenciar seus alunos, acompanhar o progresso dos treinos e organizar sua agenda.

### Funcionalidades Atuais:
- **Autenticação e Perfis de Acesso:** Sistema de login seguro, separando o acesso do Personal Trainer e de seus Alunos.
- **Gestão de Alunos:** Criação, edição e exclusão de perfis de alunos, com informações detalhadas (como CPF, endereço e vínculo ao Personal Trainer).
- **Treinos e Agendamentos:** Base estruturada para a definição de cronogramas de treinos e acompanhamento da evolução dos alunos.

---

## Como Executar

Siga os passos abaixo para configurar e executar o projeto localmente.

## Pré-requisitos
- [Python](https://www.python.org/downloads/) instalado (Certifique-se de marcar a opção "Add Python to PATH" durante a instalação no Windows).

## Passo a Passo

1. **Abra o terminal** e navegue até a raiz do projeto:
   ```bash
   cd caminho/para/personal-fit
   ```

2. **Crie o ambiente virtual:**
   ```bash
   python -m venv venv
   ```

3. **Ative o ambiente virtual:**
   - No Windows:
     ```bash
     venv\Scripts\activate
     ```
   - No Mac/Linux:
     ```bash
     source venv/bin/activate
     ```

4. **Instale as dependências:**
   ```bash
   pip install django
   ```

5. **Execute as migrações do banco de dados:**
   ```bash
   python manage.py migrate
   ```

6. **Inicie o servidor local:**
   ```bash
   python manage.py runserver
   ```

7. **Acesse o sistema:**
   Abra o navegador e acesse: [http://127.0.0.1:8000](http://127.0.0.1:8000)

8. **Credenciais Padrão (Para Teste):**
   - **Usuário:** `personal_admin`
   - **Senha:** `senha123`

---

## Como encerrar
Para parar o servidor, vá ao terminal onde ele está rodando e pressione `Ctrl + C`. Da próxima vez que for iniciar o projeto, basta ativar o ambiente virtual (passo 3) e iniciar o servidor (passo 6).
