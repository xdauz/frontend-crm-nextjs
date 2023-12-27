"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"

import { statuses } from "@/components/pages/warehouse/data"
import { DataTableColumnHeader } from "@/components/pages/warehouse/data-table-column-header"
import { DataTableRowActions } from "@/components/pages/warehouse/data-table-row-actions"
import { WarehouseItem } from "./schema"

export const columns: ColumnDef<WarehouseItem>[] = [
    //Название
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <DataTableColumnHeader column={column} title="Название" />
            )
        },
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    <span className="max-w-[500px] truncate font-medium">
                        {row.original.product.name}
                    </span>
                </div>
            )
        },
    },
    //Серийный номер
    {
        accessorKey: "serial_number",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Серийный номер" />
        ),
        cell: ({ row }) => <div className="w-[80px]">{row.original.serial_number}</div>,
        enableSorting: false,
        enableHiding: false,
    },
    //Статус
    {
        accessorKey: "status_key",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Статус" />
        ),
        cell: ({ row }) => {
            const status = statuses.find(
                (status) => status.value === row.original.status_key
            )

            if (!status) {
                return null
            }

            let statusColor = '';
            switch (status.color) {
                case 'default':
                    statusColor = 'bg-primary text-primary-foreground'
                    break;
                case 'secondary':
                    statusColor = 'bg-secondary text-secondary-foreground'
                    break;
                case 'desctructive':
                    statusColor = 'bg-desctructive text-desctructive-foreground'
                    break;
            }

            return (
                <div className="flex w-[100px] items-center">
                    <Badge variant="outline" className={statusColor}>{status.label}</Badge>
                </div>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    //Цена
    {
        accessorKey: "price",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Цена" />
        ),
        cell: ({ row }) => <div className="w-[80px]">{row.original.price} {row.original.currency_key}</div>,
        enableSorting: false,
        enableHiding: false,
    },
    //Дата прихода
    {
        accessorKey: "date",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Дата прихода" />
        ),
        cell: ({ row }) => <div className="w-[80px]">{row.getValue("date")}</div>,
        enableSorting: false,
        enableHiding: false,
    },
    //Поставщик
    {
        accessorKey: "supplier",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Поставщик" />
        ),
        cell: ({ row }) => <div className="w-[130px]">{row.original.supplier.name}</div>,
        enableSorting: false,
        enableHiding: false,
    },
    //Действие
    {
        id: "actions",
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
]