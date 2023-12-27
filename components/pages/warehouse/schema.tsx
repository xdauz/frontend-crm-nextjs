import { z } from "zod"

export const warehouseItemSchema = z.object({
    id: z.number(),
    name: z.string(),
    serial_number: z.string(),
    status_key: z.string(),
    price: z.number(),
    date: z.string(),
    currency_key: z.string(),
    product: z.object({
        id: z.number(),
        name: z.string()
    }),
    supplier: z.object({
        id: z.number(),
        name: z.string()
    }),
})

export const supplierSchema = z.object({
    id: z.number(),
    name: z.string(),
})

export const productSchema = z.object({
    id: z.number(),
    name: z.string(),
})

export type WarehouseItem = z.infer<typeof warehouseItemSchema>
export type Supplier = z.infer<typeof supplierSchema>
export type Product = z.infer<typeof productSchema>