"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export const formSchema = z.object({
  nome: z.string().min(2, {
    message: "O nome deve ter pelo menos 2 caracteres.",
  }),
  endereco: z.string().min(5, {
    message: "O endereço deve ter pelo menos 5 caracteres.",
  }),
  telefone: z.string().min(10, {
    message: "O telefone deve ter pelo menos 10 caracteres.",
  }),
});

interface ClienteFormProps {
  cliente?: {
    id?: number;
    nome: string;
    endereco: string;
    telefone: string;
  };
  onClose: () => void;
  onSubmit: (data: z.infer<typeof formSchema> & { id?: number }) => Promise<void>;
  onSave: () => void;
}

export function ClienteForm({ cliente, onClose, onSubmit }: ClienteFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: cliente?.nome || "",
      endereco: cliente?.endereco || "",
      telefone: cliente?.telefone || "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    if (cliente) {
      await onSubmit({ ...data, id: cliente.id });
    } else {
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
        onSubmit(newCliente);
      } else {
        console.error('Erro ao criar cliente:', response.status);
      }
    }
    onClose();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Digite o nome" {...field} />
              </FormControl>
              <FormDescription>Informe o nome do cliente.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="endereco"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endereço</FormLabel>
              <FormControl>
                <Input placeholder="Digite o endereço" {...field} />
              </FormControl>
              <FormDescription>Informe o endereço do cliente.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="telefone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <Input placeholder="Digite o telefone" {...field} />
              </FormControl>
              <FormDescription>Informe o telefone do cliente.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between mt-4">
        <Button type="button"className="bg-red-500 text-neutral-0 hover:bg-red-600" onClick={onClose}>Cancelar</Button>
        <Button  type="submit" className="bg-primary-4 text-neutral-0 hover:bg-primary-5 hover:text-neutral-1" >Confirmar</Button>
        </div>      
      </form>
    </Form>
  );
}
