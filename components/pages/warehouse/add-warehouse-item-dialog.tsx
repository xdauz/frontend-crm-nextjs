import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CaretSortIcon, PlusCircledIcon } from "@radix-ui/react-icons"
import { CheckIcon } from "lucide-react"
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "@/components/ui/use-toast"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Supplier, WarehouseItem } from "./schema"
import { warehouseService } from "@/services/warehouseService"

const FormSchema = z.object({
  supplier: z.number({
    required_error: "Please select a language.",
  }),
  quantity: z.number({
    required_error: "Please specify a quantity.",
  }),
  currency: z.string({
    required_error: "Please select a currency.",
  }),
  purchase_price: z.number({
    required_error: "Please select a purchase_price.",
  }),
  name: z.number({
    required_error: "Please select a name.",
  }),
})

const debounce = (func: (...args: any[]) => void, wait: number) => {
  let timeout: NodeJS.Timeout | null;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout!);
      func(...args);
    };
    clearTimeout(timeout!);
    timeout = setTimeout(later, wait);
  };
};

export function AddWarehouseItemDialog() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  const [open, setOpen] = React.useState(false)
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [warehouseItems, setWarehouseItems] = useState<WarehouseItem[]>([]);

  useEffect(() => {
    warehouseService.getSuppliers()
      .then(setSuppliers)
      .catch(error => {
        console.error('Error fetching suppliers:', error);
      });
  }, []);

  const fetchSuppliers = async (query: string) => {
    warehouseService.getSuppliers(query)
      .then(setSuppliers)
      .catch(error => {
        console.error('Error fetching suppliers:', error);
      });
  };

  const fetchWarehouseItems = async (query: string) => {
    warehouseService.getWarehouseItems(query)
      .then(setWarehouseItems)
      .catch(error => {
        console.error('Error fetching warehouse items:', error);
      });
  };

  const [currentInput, setCurrentInput] = useState('');
  const debouncedFetchSuppliers = debounce(fetchSuppliers, 300);
  const debouncedFetchWarehouseItems = debounce(fetchWarehouseItems, 300);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setCurrentInput(value);
    debouncedFetchSuppliers(event.target.value);
    debouncedFetchWarehouseItems(event.target.value);
  };

  const [selectedValue, setSelectedValue] = useState<number>();
  const handleSelect = (value: number) => {
    setSelectedValue(value);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="ml-2" >
          <PlusCircledIcon className="mr-2 h-4 w-4" />
          Добавить товар
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Добавление товара</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="grid w-full grid-cols-4 gap-2 gap-4 py-4">
          <Form {...form}>
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem className="col-span-3">
                <FormLabel>Название товара</FormLabel>
                <Command onChange={handleInputChange}>
                  <CommandInput
                    placeholder="Search product..."
                    value={currentInput}
                  />
                  {warehouseItems.length === 0 ? (
                    <CommandEmpty>No matches found for "{currentInput}". Use as value.</CommandEmpty>
                  ) : (
                    <CommandList>
                      {warehouseItems.map((warehouseItem) => (
                        <CommandItem
                          key={warehouseItem.id}
                          onSelect={() => handleSelect(warehouseItem.id)}
                        >
                          {warehouseItem.name}
                        </CommandItem>
                      ))}
                    </CommandList>
                  )}
                </Command>
              </FormItem>
            )} />

            <FormField control={form.control} name="quantity" render={({ field }) => (
              <FormItem className="col-span-1">
                <FormLabel>Количество</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="10" {...field} />
                </FormControl>
              </FormItem>
            )} />

            <FormField control={form.control} name="purchase_price" render={({ field }) => (
              <FormItem className="col-span-3">
                <FormLabel>Приходная цена</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="15" {...field} />
                </FormControl>
              </FormItem>
            )} />

            <FormField control={form.control} name="currency" render={({ field }) => (
              <FormItem className="col-span-1">
                <FormLabel>Валюта</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-[80px]">
                      <SelectValue placeholder="USD" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="usd">USD</SelectItem>
                    <SelectItem value="uzs">UZS</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )} />

            <FormField
              control={form.control}
              name="supplier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Поставщик</FormLabel>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[200px] justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? suppliers.find(supplier => supplier.id === field.value)?.name : 'Выбор поставщика'}
                          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command onChange={handleInputChange}>
                        <CommandInput
                          placeholder="Поиск поставщика..."
                          className="h-9"
                        />
                        <CommandEmpty>No supplier found.</CommandEmpty>
                        <CommandGroup>
                          {suppliers.map((supplier) => (
                            <CommandItem
                              value={supplier.name}
                              key={supplier.id}
                              onSelect={() => {
                                form.setValue("supplier", supplier.id)
                                setOpen(false)
                              }}
                            >
                              {supplier.name}
                              <CheckIcon
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  supplier.id === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Form>

          <DialogFooter className="col-span-4">
            <Button type="submit">Добавить</Button>
          </DialogFooter>
        </form>

      </DialogContent>

    </Dialog>
  )
}
