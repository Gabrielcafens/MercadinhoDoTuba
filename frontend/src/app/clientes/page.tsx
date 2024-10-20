"use client";

import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { TrashIcon, Pencil1Icon, ChevronUpIcon, ChevronDownIcon } from '@radix-ui/react-icons';
import { Dialog, DialogContent, DialogHeader, DialogTrigger, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import Pagination from '@/components/Pagination';
import { ClienteForm, formSchema  } from '@/components/ClienteForm';
import { z } from 'zod';

interface Cliente {
  id: number;
  nome: string;
  endereco: string;
  telefone: string;
}

const ClientesPage = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | undefined>(undefined);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const [paginaAtual, setPaginaAtual] = useState(1);
  const clientesPorPagina = 6;

  const [sortField, setSortField] = useState<keyof Cliente>('nome');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const fetchClientes = async () => {
    try {
      const response = await fetch('http://localhost:3000/clientes');
      const data = await response.json();
      setClientes(data);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const ordenarClientes = (field: keyof Cliente, direction: 'asc' | 'desc') => {
    const sortedClientes = [...clientes].sort((a, b) => {
      if (a[field] < b[field]) return direction === 'asc' ? -1 : 1;
      if (a[field] > b[field]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sortedClientes;
  };

  const handleSort = (field: keyof Cliente) => {
    const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);
    const sortedClientes = ordenarClientes(field, newDirection);
    setClientes(sortedClientes);
  };
  const handleFormSubmit = async (data: z.infer<typeof formSchema> & { id?: number }) => {
  if (data.id) {
    if (data.id !== undefined) {
      await updateCliente(data as z.infer<typeof formSchema> & { id: number });
    }
  } else {
    await createCliente(data);
  }
};

const createCliente = async (data: z.infer<typeof formSchema>) => {
    const response = await fetch('http://localhost:3000/clientes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  
    if (response.ok) {
      const newCliente = await response.json();
      console.log('Cliente criado:', newCliente);
      fetchClientes();
    } else {
      console.error('Erro ao criar cliente:', response.status);
    }
  };
  
  const updateCliente = async (data: z.infer<typeof formSchema> & { id: number }) => {
    const { id, ...dataWithoutId } = data; // Remove o campo id
    
    const response = await fetch(`http://localhost:3000/clientes/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataWithoutId), // Envia apenas os dados sem o id
    });

    const responseText = await response.text();
    console.log('Resposta do servidor:', responseText);

    if (!response.ok) {
        throw new Error('Erro ao atualizar cliente: ' + responseText);
    }

    return JSON.parse(responseText); // Analisa a resposta como JSON
};


  
  const deletarCliente = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3000/clientes/${id}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        console.log(`Cliente ${id} deletado com sucesso.`);
        fetchClientes();
      } else {
        console.error('Erro ao deletar cliente:', response.status);
      }
    } catch (error) {
      console.error('Erro ao deletar cliente:', error);
    }
  };

  const indexOfLastCliente = paginaAtual * clientesPorPagina;
  const indexOfFirstCliente = indexOfLastCliente - clientesPorPagina;
  const clientesAtuais = clientes.slice(indexOfFirstCliente, indexOfLastCliente);
  const totalPaginas = Math.ceil(clientes.length / clientesPorPagina);

  const renderMobileTable = () => (
    <div className="space-y-4">
      {clientesAtuais.map((cliente) => (
        <div
          key={cliente.id}
          className="bg-white shadow-md rounded-lg p-4 cursor-pointer"
          onClick={() => setClienteSelecionado(cliente)}
        >
          <div className="flex justify-between">
            <span className="font-semibold text-lg">{cliente.nome}</span>
          </div>
          <div className="text-gray-500">{cliente.endereco}</div>
          <div className="text-gray-500">{cliente.telefone}</div>
          <div className="flex justify-between mt-2">
            <Button variant="outline" onClick={() => {
              setClienteSelecionado(cliente);
              setIsFormVisible(true);
            }}>
              <Pencil1Icon className="h-4 w-4" />
            </Button>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)} className="bg-red-500 text-neutral-0 hover:bg-red-600 hover:text-neutral-0">
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                  <AlertDialogDescription>Você tem certeza que deseja excluir este cliente?</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-red-500 text-neutral-0 hover:bg-red-600" onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</AlertDialogCancel>
                  <AlertDialogAction className="bg-primary-4 text-neutral-0 hover:bg-primary-5 hover:text-neutral-1" onClick={() => deletarCliente(cliente.id)}>Excluir</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      ))}
    </div>
  );

  const renderDesktopTable = () => (
    <Table className="bg-neutral-0 rounded-lg shadow-md overflow-hidden">
      <TableHeader>
        <TableRow>
          <th className="text-center cursor-pointer" onClick={() => handleSort('nome')}>
            Nome
            {sortField === 'nome' && (
              sortDirection === 'asc' ? (
                <ChevronUpIcon className="inline h-4 w-4 text-primary-6" />
              ) : (
                <ChevronDownIcon className="inline h-4 w-4 text-primary-6" />
              )
            )}
          </th>
          <th className="text-center cursor-pointer" onClick={() => handleSort('endereco')}>
            Endereço
            {sortField === 'endereco' && (
              sortDirection === 'asc' ? (
                <ChevronUpIcon className="inline h-4 w-4 text-primary-6" />
              ) : (
                <ChevronDownIcon className="inline h-4 w-4 text-primary-6" />
              )
            )}
          </th>
          <th className="text-center">Telefone</th>
          <th className="text-center">Ações</th>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clientesAtuais.length > 0 ? (
          clientesAtuais.map((cliente) => (
            <TableRow
              key={cliente.id}
              className="cursor-pointer"
              onClick={() => setClienteSelecionado(cliente)}
            >
              <TableCell className="text-center">{cliente.nome}</TableCell>
              <TableCell className="text-center">{cliente.endereco}</TableCell>
              <TableCell className="text-center">{cliente.telefone}</TableCell>
              <TableCell className="flex justify-center space-x-2">
                <Button variant="outline" onClick={() => {
                  setClienteSelecionado(cliente);
                  setIsFormVisible(true);
                }}>
                  <Pencil1Icon className="h-4 w-4" />
                </Button>

                <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)} className="bg-red-500 text-neutral-0 hover:bg-red-600 hover:text-neutral-0">
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                      <AlertDialogDescription>Você tem certeza que deseja excluir este cliente?</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-red-500 text-neutral-0 hover:bg-red-600" onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</AlertDialogCancel>
                      <AlertDialogAction className="bg-primary-4 text-neutral-0 hover:bg-primary-5 hover:text-neutral-1" onClick={() => deletarCliente(cliente.id)}>Excluir</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={4} className="text-center">Nenhum cliente encontrado.</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Clientes</h1>
      <Button  className="bg-primary-4 text-neutral-0 hover:bg-primary-5 hover:text-neutral-1" onClick={() => {
        setClienteSelecionado(undefined);
        setIsFormVisible(true); 
      }}>
       +
      </Button>

      <div className="mt-4">
        <div className="hidden lg:block">
            {renderDesktopTable()}
        </div>

        <div className="block lg:hidden">
            {renderMobileTable()}
        </div>
     </div>

      <Pagination
        currentPage={paginaAtual}
        onPageChange={setPaginaAtual}
        totalPages={totalPaginas}
      />

    <Dialog open={isFormVisible} onOpenChange={setIsFormVisible}>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>{clienteSelecionado ? 'Editar Cliente' : 'Adicionar Cliente'}</DialogTitle>
            <DialogDescription>
                {clienteSelecionado ? 'Edite os dados do cliente.' : 'Preencha as informações do novo cliente.'}
            </DialogDescription>
            </DialogHeader>
            <ClienteForm
                     cliente={clienteSelecionado}
                     onClose={() => setIsFormVisible(false)}
                     onSubmit={async (data) => {
                       console.log('Form submitted:', data);
                       try {
                         if (data.id) {
                           await updateCliente(data as z.infer<typeof formSchema> & { id: number });
                         } else {
                           await createCliente(data);
                         }
                         fetchClientes();
                         setIsFormVisible(false);
                       } catch (error) {
                         console.error('Erro ao salvar cliente:', error);
                       }
                     }}
                     onSave={() => {
                       console.log('Cliente salvo');
                     }}
                   />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientesPage;
