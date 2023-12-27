"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import React, { useEffect } from "react"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useToast } from "@/components/ui/use-toast"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Product, Supplier, WarehouseItem } from "./schema"
import { warehouseService } from "@/services/warehouseService"
import AutocompleteInput from "@/components/pages/warehouse/autocomplete"
import { PlusCircledIcon } from "@radix-ui/react-icons"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/router"

const FormSchema = z.object({
  name: z.coerce.string({
    required_error: "Название керак ока",
  }),
  quantity: z.coerce.number().optional(),
  price: z.coerce.number({
    required_error: "Выберите приходную цену.",
  }),
  currency_key: z.string({
    required_error: "Выберите валюту.",
  }),
  supplier: z.coerce.string({
    required_error: "Выберите поставщика.",
  }),
  serial_numbers: z.string().optional()
});

interface FormValues {
  name: string;
  quantity: string | undefined;
  price: number;
  currency_key: string;
  supplier: string;
  serial_numbers: string | undefined;
}

export function AddWarehouseItemDialog() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: undefined,
      quantity: undefined,
      currency_key: undefined,
      price: undefined,
      supplier: undefined,
      serial_numbers: undefined,
    },
  });

  const [open, setOpen] = React.useState(false);
  const initialFormValuesRef = React.useRef<FormValues>(form.getValues());

  useEffect(() => {
    // Capture initial form values when the component mounts
    initialFormValuesRef.current = form.getValues();
  }, []);

  const { toast } = useToast();
  const router = useRouter();

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      // Make a call to update the item with the new data
      await warehouseService.storeWarehouseItem(data);

      toast({
        title: "Success",
        description:
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ,
      });      
      
      // Reset the form state
      form.reset();

      //Close dialog
      setOpen(false);

      //Reload page
      router.reload();
    } catch (error) {
      console.error("Error updating item:", error);
      // Handle error, show toast or other user feedback
    }
  }

  const fetchSuppliers = async (inputValue?: string): Promise<Supplier[]> => {
    const data = await warehouseService.getSuppliers(inputValue);
    return data.data
  };

  const fetchProducts = async (inputValue?: string): Promise<Product[]> => {
    const data = await warehouseService.getProducts(inputValue);
    return data.data
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
                  <AutocompleteInput<Product>
                    fetchSuggestions={fetchProducts}
                    placeholder="Select..."
                    field={field}
                    renderItem={(item) => item.name}
                    getKey={(item) => item.name}
                  />
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
              name="price"
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
              name="currency_key"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel>Валюта</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="UZS">UZS</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="supplier"
              render={({ field }) => (
                <FormItem className="col-span-4">
                  <FormLabel>Поставщик</FormLabel>
                  <AutocompleteInput<Supplier>
                    fetchSuggestions={fetchSuppliers}
                    placeholder="Select..."
                    field={field}
                    renderItem={(item) => item.name}
                    getKey={(item) => item.name}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="serial_numbers"
              render={({ field }) => (
                <FormItem className="col-span-4">
                  <FormLabel>Серийные номеры</FormLabel>
                  <FormControl>
                    <Textarea placeholder="100-12341654" {...field} />
                  </FormControl>
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