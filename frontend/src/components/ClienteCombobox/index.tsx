"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Cliente {
  id: string;
  nome: string;
}

interface ClienteComboboxProps {
  onSelect: (cliente: Cliente) => void;
}

export const ClienteCombobox = ({ onSelect }: ClienteComboboxProps) => {
  const [open, setOpen] = React.useState(false);
  const [clientes, setClientes] = React.useState<Cliente[]>([]);
  const [selectedCliente, setSelectedCliente] = React.useState<Cliente | null>(null);

  const fetchClientes = async () => {
    try {
      const response = await fetch("http://localhost:3000/clientes");
      const data = await response.json();
      setClientes(data);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    }
  };

  React.useEffect(() => {
    fetchClientes();
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between border-primary-4 text-neutral-1 hover:bg-primary-3"
        >
          {selectedCliente ? selectedCliente.nome : "Selecione um cliente..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 bg-neutral-0 text-neutral-1">
        <Command>
          <CommandInput className="border-b border-neutral-1" placeholder="Buscar cliente..." />
          <CommandList>
            <CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>
            <CommandGroup>
              {clientes.map((cliente) => (
                <CommandItem
                  key={cliente.id}
                  onSelect={() => {
                    setSelectedCliente(cliente);
                    onSelect(cliente);
                    setOpen(false);
                  }}
                  className="hover:bg-primary-3"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedCliente?.id === cliente.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {cliente.nome}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
