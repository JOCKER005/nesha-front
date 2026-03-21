// src/hooks/useProducts.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const useListProducts = (params?: { featured?: boolean; category?: string }) =>
  useQuery({
    queryKey: ["products", params],
    queryFn: () => api.products.list(params),
    staleTime: 1000 * 60 * 2,
  });

export const useGetProduct = (id: number) =>
  useQuery({
    queryKey: ["product", id],
    queryFn: () => api.products.get(id),
    enabled: !!id,
  });

// ─── Admin hooks ──────────────────────────────────────────────────────────────

export const useAdminProducts = () =>
  useQuery({
    queryKey: ["admin-products"],
    queryFn: () => api.admin.products.list(),
  });

// FIX #7: refetchInterval solo activo cuando isActive=true (tab de órdenes visible).
// Evita hacer polling innecesario mientras el admin está en otra tab.
export const useAdminOrders = (status?: string, isActive = false) =>
  useQuery({
    queryKey: ["admin-orders", status],
    queryFn: () => api.admin.orders.list(status),
    refetchInterval: isActive ? 30_000 : false,
  });

export const useCreateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.admin.products.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-products"] }),
  });
};

export const useUpdateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      api.admin.products.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useDeleteProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.admin.products.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-products"] }),
  });
};

export const useUpdateOrderStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      api.admin.orders.updateStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-orders"] }),
  });
};
