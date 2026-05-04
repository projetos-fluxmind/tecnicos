import { z } from "zod";

export const listQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  sort_by: z.string().default("id"),
  order: z.enum(["asc", "desc"]).default("desc"),
  data_inicio: z.string().optional(),
  data_fim: z.string().optional(),
  tecnico_id: z.string().optional(),
  placa_moto: z.string().optional()
});

export type ListQuery = z.infer<typeof listQuerySchema>;

export function emptyPaginatedResponse(query: ListQuery) {
  return {
    data: [],
    pagination: {
      total_items: 0,
      total_pages: 1,
      current_page: query.page,
      items_per_page: query.limit,
      next_page: null,
      prev_page: null
    }
  };
}
