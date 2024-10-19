'use client';

import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TrashIcon, Pencil1Icon } from '@radix-ui/react-icons';
import { Dialog, DialogContent, DialogHeader, DialogTrigger, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface Pedido {
  id: number;
  cliente_id: number;
  cliente_nome: string;
  data_pedido: string;
  status: string;
  produtos: Produto[];
}

interface Produto {
  id: number;
  nome: string;
  quantidade: number;
}

const PedidosPage = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [pedidoSelecionado, setPedidoSelecionado] = useState<Pedido | null>(null);
  const [novoStatus, setNovoStatus] = useState<string>('pendente');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const fetchPedidos = async () => {
    try {
      const response = await fetch('http://localhost:3000/pedidos');
      const data = await response.json();

      const pedidosComClientes = await Promise.all(
        data.map(async (pedido: Pedido) => {
          const clienteResponse = await fetch(`http://localhost:3000/clientes/${pedido.cliente_id}`);
          const clienteData = await clienteResponse.json();
          return { ...pedido, cliente_nome: clienteData.nome };
        })
      );

      setPedidos(pedidosComClientes);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  const alterarStatus = async () => {
    if (!pedidoSelecionado) return;

    const { cliente_id, data_pedido } = pedidoSelecionado;

    const updatedPedido = {
      cliente_id,
      data_pedido,
      status: novoStatus,
    };

    console.log('Alterar status do pedido:', pedidoSelecionado);
    console.log('Novo status:', novoStatus);
    console.log('Dados enviados para a API:', updatedPedido);

    try {
      const response = await fetch(`http://localhost:3000/pedidos/${pedidoSelecionado.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPedido),
      });

      if (response.ok) {
        console.log('Status atualizado com sucesso.');
        setPedidos(prev => prev.map(p => (p.id === pedidoSelecionado.id ? { ...p, status: novoStatus } : p)));
        setPedidoSelecionado(null);
      } else {
        const errorResponse = await response.json();
        console.error('Erro ao atualizar status:', errorResponse);
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const deletarPedido = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3000/pedidos/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log(`Pedido ${id} deletado com sucesso.`);
        setPedidos(prev => prev.filter(pedido => pedido.id !== id));
      } else {
        console.error('Erro ao deletar pedido:', response.status);
      }
    } catch (error) {
      console.error('Erro ao deletar pedido:', error);
    }
  };

  return (
    <div className="w-full p-6">
      <h1 className="text-4xl font-bold text-center mb-4">Lista de Pedidos</h1>
      <Table className="bg-neutral-0">
        <TableHeader>
          <TableRow>
            <th className="text-center">Cliente</th>
            <th className="text-center">Data do Pedido</th>
            <th className="text-center">Status</th>
            <th className="text-center">Ações</th>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pedidos.length > 0 ? (
            pedidos.map((pedido) => (
              <TableRow key={pedido.id} className="cursor-pointer" onClick={() => setPedidoSelecionado(pedido)}>
                <TableCell className="text-center">{pedido.cliente_nome}</TableCell>
                <TableCell className="text-center">{new Date(pedido.data_pedido).toLocaleString()}</TableCell>
                <TableCell className="text-center">
                  <Badge variant={pedido.status === 'pendente' ? 'secondary' : 'default'}>
                    {pedido.status}
                  </Badge>
                </TableCell>
                <TableCell className="flex justify-center space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Pencil1Icon className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Alterar Status</DialogTitle>
                        <DialogDescription>Selecione o novo status do pedido.</DialogDescription>
                      </DialogHeader>
                      <Select onValueChange={setNovoStatus} defaultValue={pedido.status}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pendente">Pendente</SelectItem>
                          <SelectItem value="entregue">Entregue</SelectItem>
                        </SelectContent>
                      </Select>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setPedidoSelecionado(null)}>Cancelar</Button>
                        <Button onClick={alterarStatus}>Confirmar</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                        <AlertDialogDescription>Você tem certeza que deseja excluir este pedido?</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deletarPedido(pedido.id)}>Excluir</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center">Nenhum pedido encontrado</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PedidosPage;
