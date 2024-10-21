# Mercadinho do Tuba

Este é um sistema para gerenciamento de pedidos de um mercadinho, desenvolvido com **Express** no backend e **Next.js** no frontend. O projeto permite que usuários visualizem produtos, realizem pedidos e acompanhem o status dos pedidos, além de cadastrar e gerenciar clientes.

## Índice
- [Visão Geral](#visão-geral)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Arquitetura do Projeto](#arquitetura-do-projeto)
- [Instalação e Configuração](#instalação-e-configuração)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Uso](#uso)
  - [Rotas da API](#rotas-da-api)
  - [Frontend](#frontend)
- [Banco de Dados](#banco-de-dados)
- [ Videos de Demonstação ](#Videos-de-Demonstação)
- [Licença](#licença)
- [Autor](#autor)

## Visão Geral
O **Mercadinho do Tuba** permite que o usuário:
- Visualize produtos e clientes.
- Realize pedidos associando produtos e clientes.
- Gerencie o estoque.
- Acompanhe o status dos pedidos.

### Funcionalidades
- **Gerenciamento de Produtos**: Cadastro, edição, visualização e remoção (em desenvolvimento).
- **Gerenciamento de Clientes**: Cadastro, edição, visualização e remoção.
- **Gerenciamento de Pedidos**: Criação e acompanhamento do status de pedidos.
- **Estoque**: Controle da quantidade de itens disponíveis (em desenvolvimento).

## Tecnologias Utilizadas
### Backend
- **Node.js** com **Express**
- **PostgreSQL** para o banco de dados
- **dotenv** para variáveis de ambiente
- **pg** para integração com o PostgreSQL
- **Joi** para validação de dados
- **CORS**

### Frontend
- **Next.js** para o desenvolvimento da interface do usuário
- **Tailwind CSS** para estilização
- **Shadcn/ui** para componentes UI

## Arquitetura do Projeto

O projeto está dividido em duas partes principais:
- **Backend**: Pasta `backend` com a API REST construída em **Express**.
- **Frontend**: Pasta `frontend` com o cliente web desenvolvido em **Next.js**.

### Estrutura do Backend
A estrutura das pastas do backend é a seguinte:
```
backend/
├── config/
│   └── db.js
├── controllers/
│   ├── categoriasController.js
│   ├── clientesController.js
│   └── ...
├── middleware/
│   ├── categorias.js
│   ├── clientes.js
│   └── ...
├── models/
│   ├── categoriasModel.js
│   ├── clientesModel.js
│   └── ...
├── routes/
│   ├── categoriasRoutes.js
│   ├── clientesRoutes.js
│   └── ...
├── validations/
│   ├── categoriasValidations.js
│   ├── clientesValidations.js
│   └── ...
├── app.js
├── package.json
└── .env
```

### Estrutura do Frontend
A estrutura das pastas do frontend é a seguinte:
```
frontend/
├── components/            # Componentes reutilizáveis da interface
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── HamburguerMenu.tsx
│   
├── clientes/              # Página de clientes
│   └── page.tsx
├── pedidos/               # Página de pedidos
│   └── page.tsx
├── public/                # Arquivos públicos como imagens e ícones
└── .env                   # Variáveis de ambiente
```

## Instalação e Configuração

### Pré-requisitos
- **Node.js** e **npm**
- **PostgreSQL**

### Backend
1. Clone o repositório e entre na pasta `backend`:
   ```bash
   git clone https://github.com/Gabrielcafens/MercadinhoDoTuba.git
   cd backend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie um arquivo `.env` com as seguintes variáveis:
   ```env
   DB_USER=postgres
   DB_PASSWORD=sua_senha
   DB_HOST=localhost
   DB_PORT=1996
   DB_NAME=mercadinho_do_tuba
   ```
4. Inicie o servidor:
   ```bash
   node app.js
   ```

### Frontend
1. Entre na pasta `frontend`:
   ```bash
   cd frontend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## Uso

### Rotas da API
A API possui as seguintes rotas para cada recurso (clientes, produtos, etc.):

| Método | Endpoint                 | Descrição                      |
|--------|--------------------------|--------------------------------|
| GET    | `/categorias`             | Lista todas as categorias      |
| POST   | `/categorias`             | Cria uma nova categoria        |
| PUT    | `/categorias/:id`         | Atualiza uma categoria         |
| DELETE | `/categorias/:id`         | Remove uma categoria           |
| ...    |                          |                                |

### Frontend
No frontend, você pode controlar a lista de compras dos seus clientes, anotar pedidos e gerenciar os dados de clientes. As funções prontas incluem: 
- **Compras**: Selecione um cliente e os produtos. Altere a quantidade e finalize o pedido.
- **Pedidos**: Após a finalização, você pode alterar o status de "pendente" para "entregue".
- **Clientes**: Visualize os clientes cadastrados e suas informações.

## Banco de Dados
O banco de dados PostgreSQL possui as seguintes tabelas:
- **Categorias**: Id e nome.
- **Clientes**: Nome, endereço e telefone.
- **Estoque**: Quantidade de produtos em estoque.
- **Itens de Pedido**: Produtos em cada pedido.
- **Pedidos**: Status e cliente associado.
- **Produtos**: Nome, categoria, unidade e preço.

## Vídeos de Demonstração

Aqui estão os vídeos que demonstram o funcionamento do backend e frontend do projeto:

- **Parte 1: Demonstração do Backend**
  - [Link para o vídeo](https://drive.google.com/file/d/19kAgrMDKtlQg7jth1E7mirZ4XiqtNqhd/view?usp=sharing)

- **Parte 2: Demonstração do Backend com um pouco do Frontend**
  - [Link para o vídeo](https://drive.google.com/file/d/1n2gADNnOMODbfb1THxZCMEf2iExPt9n4/view?usp=sharing)

- **Parte 3: Demonstração do Backend e Frontend**
  - [Link para o vídeo](https://drive.google.com/file/d/1X1mJZETeV2rGhcBZ_wZSOiV1EQaHqJmf/view?usp=drive_link)

- **Parte 4: Demonstração Final do Backend e Frontend**
  - [Link para o vídeo](https://drive.google.com/file/d/1Gy3QBK14X05eqlT8Hy2xKVTThajG1NCa/view?usp=sharing)

## Licença
Este projeto está licenciado sob a licença MIT.

## 🖋️ Autor

Desenvolvido por **[Gabrielcafens](https://github.com/Gabrielcafens)**.


```                         ___

                          ___
                      .-'   `'.
                     /         \
                     |         ;
                     |         |           ___.--,
            _.._     |(0) = (0)|    _.---'`__.-( (_.
     __.--'`_.. '.__.\    '--. \_.-' ,.--'`     `""`
    ( ,.--'`   ',__ /./;   ;, '.__.'`    __
    _`) )  .---.__.' / |   |\   \__..--""  """--.,_
   `---' .'.''-._.-'`_./  /\ '.  \ _.--''````'''--._`-.__.'
         | |  .' _.-' |  |  \  \  '.               `----`
          \ \/ .'     \  \   '. '-._)
           \/ /        \  \    `=.__`'-.
           / /\         `) )    / / `"".`\
     , _.-'.'\ \        / /    ( (     / /
      `--'`   ) )    .-'.'      '.'.  | (
             (/`    ( (`          ) )  '-;    
            
  ( (                ( (                 ( (                
   ) )                ) )                 ) )               
.........           .........         .........           
|       |]         |       |]         |       |]                
\       /           \       /         \       /              
 `-----'             `-----'           `-----'  
