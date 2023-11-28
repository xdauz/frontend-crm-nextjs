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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CaretSortIcon, PlusCircledIcon } from "@radix-ui/react-icons"
import { CheckIcon } from "lucide-react"
import React, { ChangeEvent, useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useToast } from "@/components/ui/use-toast"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Supplier, WarehouseItem } from "./schema"
import { warehouseService } from "@/services/warehouseService"
import AutocompleteInput from "@/components/pages/warehouse/autocomplete"
import { debounce } from "lodash"



const FormSchema = z.object({
  supplier: z.number({
    required_error: "Выберите поставщика.",
  }),
  quantity: z.coerce.number({
    required_error: "Выберите количество.",
  }),
  currency: z.string({
    required_error: "Выберите валюту.",
  }),
  purchase_price: z.coerce.number({
    required_error: "Выберите приходную цену.",
  }),
  name: z.string({
    required_error: "Название керак ока",
  }),
});

export function AddWarehouseItemDialog() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      quantity: undefined,
      currency: "",
      purchase_price: undefined,
      supplier: undefined,
      // other filed must have their default states here, similar to building a controlled form using useState hook
    },
  });

  const { toast } = useToast();

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "Success",
      description: `Товар: ${data.name}, успешно добавлен`,
    });

    form.reset();
  }

  const [open, setOpen] = React.useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [warehouseItems, setWarehouseItems] = useState<WarehouseItem[]>([]);

  useEffect(() => {
    warehouseService
      .getSuppliers()
      .then(setSuppliers)
      .catch((error) => {
        console.error('Error fetching suppliers:', error);
      });
  }, []);

  const fetchSuppliers = async (query: string) => {
    warehouseService
      .getSuppliers(query)
      .then(setSuppliers)
      .catch((error) => {
        console.error('Error fetching suppliers:', error);
      });
  };

  const fetchWarehouseItems = async (inputValue: string): Promise<WarehouseItem[]> => {
    const data = warehouseService.getWarehouseItems(inputValue);
    return data;
  };

  const [currentInput, setCurrentInput] = useState('');
  const debouncedFetchSuppliers = debounce(fetchSuppliers, 300);
  const debouncedFetchWarehouseItems = debounce(fetchWarehouseItems, 300);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setCurrentInput(value);
    debouncedFetchSuppliers(value);
    debouncedFetchWarehouseItems(value);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="ml-2">
          <PlusCircledIcon className="mr-2 h-4 w-4" />
          Добавить товар
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Добавление товара</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid w-full grid-cols-4 gap-2 gap-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="col-span-3">
                  <FormLabel>Название товара</FormLabel>
                  <AutocompleteInput fetchSuggestions={fetchWarehouseItems} placeholder="Search..." field={field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel>Количество</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="10" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="purchase_price"
              render={({ field }) => (
                <FormItem className="col-span-3">
                  <FormLabel>Приходная цена</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="15" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel>Валюта</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="UZS">UZS</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                          className={cn("w-[200px] justify-between", !field.value && "text-muted-foreground")}
                        >
                          {field.value ? suppliers.find((supplier) => supplier.id === field.value)?.name : 'Выбор поставщика'}
                          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command onChange={handleInputChange}>
                        <CommandInput placeholder="Поиск поставщика..." className="h-9" />
                        <CommandEmpty>No supplier found.</CommandEmpty>
                        <CommandGroup>
                          {suppliers.map((supplier) => (
                            <CommandItem
                              key={supplier.id}
                              value={supplier.name}
                              onSelect={() => {
                                form.setValue("supplier", supplier.id);
                                setOpen(false);
                              }}
                            >
                              {supplier.name}
                              <CheckIcon
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  supplier.id === field.value ? "opacity-100" : "opacity-0"
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

            <DialogFooter className="col-span-4">
            </DialogFooter>
            <Button type="submit">
              Добавить
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}