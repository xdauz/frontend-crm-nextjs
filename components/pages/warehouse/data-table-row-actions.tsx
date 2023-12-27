import React, { useState } from 'react';
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Row } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { EditWarehouseItemDialog } from './edit-warehouse-item-dialog'; // Импортируем новый компонент
import { WarehouseItem } from './schema';
import { warehouseService } from '@/services/warehouseService';
import { useRouter } from 'next/router';

interface DataTableRowActionsProps<WarehouseItem> {
  row: Row<WarehouseItem>
}

export function DataTableRowActions<WarehouseItem>({
  row,
}: DataTableRowActionsProps<WarehouseItem>) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEditClick = () => {
    setIsEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
  };

  const router = useRouter();
  const handleDeleteClick = async () => {
    await warehouseService.deleteWarehouseItem(row.original?.id);
    router.reload();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Открыть меню</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={handleEditClick}>Редактировать</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDeleteClick}>
            Удалить
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditWarehouseItemDialog warehouseItemId={row.original?.id} isOpen={isEditDialogOpen} onClose={handleEditDialogClose} />
    </>
  );
}