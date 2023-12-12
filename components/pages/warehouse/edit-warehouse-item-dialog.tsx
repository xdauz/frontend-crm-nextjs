import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Supplier, WarehouseItem } from "./schema";
import { warehouseService } from "@/services/warehouseService";
import AutocompleteInput from "@/components/pages/warehouse/autocomplete";
import { Textarea } from "@/components/ui/textarea";

const FormSchema = z.object({
  name: z.coerce.string({
    required_error: "Название керак ока",
  }),
  price: z.coerce.number({
    required_error: "Выберите приходную цену.",
  }),
  currency: z.string({
    required_error: "Выберите валюту.",
  }),
  supplier_id: z.string({
    required_error: "Выберите поставщика.",
  }),
  serial_number: z.string({
    required_error: "Не указан серийный номер"
  }),
  status_key: z.string({
    required_error: "Не указан статус"
  })
});

interface EditWarehouseItemDialogProps {
  isOpen: boolean;
  warehouseItemId: string;
  onClose: () => void;
}

export function EditWarehouseItemDialog({ isOpen, warehouseItemId, onClose }: EditWarehouseItemDialogProps) {
  const { toast } = useToast();
  const [warehouseItem, setWarehouseItem] = useState<WarehouseItem | null>(null);

  // Set form default values
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  // Make request to get warehouse/items/{id}
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make a call to get the item data based on the id
        const itemData = await warehouseService.getWarehouseItem(warehouseItemId);

        // Pre-fill the form fields with the retrieved data
        form.reset({
          name: itemData.name,
          price: itemData.price,
          currency: itemData.currency,
          serial_number: itemData.serial_number,
          supplier_id: itemData.supplier.id.toString(),
          status_key: itemData.status_key
        });

        setWarehouseItem(itemData);
      } catch (error) {
        console.error('Error fetching warehouse item:', error);
        // Handle the error, show a message, etc.
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen, warehouseItemId, form]);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      // Make a call to update the item with the new data
      await warehouseService.updateWarehouseItem(warehouseItemId, data);

      toast({
        title: "Success",
        description:
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ,
      });
    } catch (error) {
      console.error("Error updating item:", error);
      // Handle error, show toast or other user feedback
    }
  };

  const fetchSuppliers = async (inputValue?: string): Promise<Supplier[]> => {
    return warehouseService.getSuppliers(inputValue);
  };

  const fetchWarehouseItems = async (inputValue?: string): Promise<WarehouseItem[]> => {
    return warehouseService.getWarehouseItems(inputValue);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle>Редактирование товара</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid w-full grid-cols-4 gap-2 gap-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="col-span-3">
                  <FormLabel>Название товара</FormLabel>
                  <AutocompleteInput<WarehouseItem>
                    fetchSuggestions={fetchWarehouseItems}
                    placeholder="Select..."
                    field={field}
                    renderItem={(item) => item.name}
                    getKey={(item) => item.id.toString()}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status_key"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel>Статус</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem defaultChecked value="IN_STOCK">В наличии</SelectItem>
                        <SelectItem value="SOLD">Продано</SelectItem>
                        <SelectItem value="REFUND">Брак/Возврат</SelectItem>
                      </SelectContent>
                    </Select>
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
              name="currency"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel>Валюта</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem defaultChecked value="USD">USD</SelectItem>
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
              name="supplier_id"
              render={({ field }) => (
                <FormItem className="col-span-4">
                  <FormLabel>Поставщик</FormLabel>
                  <AutocompleteInput<Supplier>
                    fetchSuggestions={fetchSuppliers}
                    placeholder="Select..."
                    field={field}
                    renderItem={(item) => item.name}
                    getKey={(item) => item.id.toString()}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="serial_number"
              render={({ field }) => (
                <FormItem className="col-span-4">
                  <FormLabel>Серийный номер</FormLabel>
                  <FormControl>
                    <Textarea placeholder="100-12341654" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="col-span-4">
              <Button type="submit">
                Сохранить
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}