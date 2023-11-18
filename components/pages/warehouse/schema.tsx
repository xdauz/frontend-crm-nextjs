import { z } from "zod"

export const warehouseItemSchema = z.object({
    id: z.number(),
    name: z.string(),
    serial_number: z.string(),
    status_key: z.string(),
    purchase_price: z.number(),
    purchase_date: z.string(),
    purchase_currency: z.string(),
    supplier: z.object({
        id: z.number(),
        name: z.string()
    }),
})

export const supplierSchema = z.object({
    id: z.number(),
    name: z.string(),
})

export type WarehouseItem = z.infer<typeof warehouseItemSchema>
export type Supplier = z.infer<typeof supplierSchema>
 