"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { UserRole, type IUser } from "@/types/user";
import { formatCustomerSince } from "@/lib/constants";
import { getUserDisplayName } from "@/lib/user/display-name";
import { Eye, Pencil, Trash, TriangleAlert } from "lucide-react";

const DEFAULT_LIMIT = 10;

type CustomersListResponse = {
  success: boolean;
  message?: string;
  data?: {
    users: IUser[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export default function Userslist() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    const loadCustomers = async () => {
      setLoading(true);

      try {
        const params = new URLSearchParams({
          role: UserRole.USER,
          page: String(page),
          limit: String(DEFAULT_LIMIT),
        });

        if (search.trim()) {
          params.set("search", search.trim());
        }

        const response = await fetch(
          `/api/admin/customers?${params.toString()}`,
          { signal: controller.signal },
        );
        const data = (await response.json().catch(
          () => ({}),
        )) as CustomersListResponse;

        if (!active) return;

        if (!response.ok || !data.success || !data.data) {
          toast.error(data.message ?? "Failed to load customers.");
          setUsers([]);
          return;
        }

        setUsers(data.data.users);
        setTotal(data.data.total);
        setTotalPages(data.data.totalPages);
      } catch (error) {
        if (!active || controller.signal.aborted) return;
        toast.error(
          error instanceof Error ? error.message : "Failed to load customers.",
        );
        setUsers([]);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadCustomers();

    return () => {
      active = false;
      controller.abort();
    };
  }, [page, search, reloadToken]);

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  const refreshAfterDelete = () => {
    if (users.length === 1 && page > 1) {
      setPage((current) => current - 1);
    } else {
      setReloadToken((current) => current + 1);
    }
  };

  const handleDelete = async (user: IUser, force = false) => {
    if (!user.id) return;

    const name = getUserDisplayName(user);
    const confirmed = force
      ? window.confirm(
          `FORCE DELETE "${name}"?\n\nThis permanently removes:\n- All orders linked to this customer\n- All products they created (including storage images)\n- Their account and profile\n\nThis cannot be undone.`,
        )
      : window.confirm(
          `Delete customer "${name}"? This cannot be undone.`,
        );

    if (!confirmed) return;

    setDeletingId(user.id);

    try {
      const url = force
        ? `/api/admin/customers/${user.id}?force=true`
        : `/api/admin/customers/${user.id}`;

      const response = await fetch(url, { method: "DELETE" });
      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        toast.error(data.message ?? "Failed to delete customer.");
        return;
      }

      toast.success(data.message ?? "Customer deleted.");
      refreshAfterDelete();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete customer.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const startItem = total === 0 ? 0 : (page - 1) * DEFAULT_LIMIT + 1;
  const endItem = Math.min(page * DEFAULT_LIMIT, total);

  return (
    <div className="rounded-lg border border-default-200">
      <div className="p-6">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <form className="relative lg:flex hidden" onSubmit={handleSearchSubmit}>
            <input
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              className="ps-12 pe-4 py-2.5 block w-64 bg-default-50/0 text-default-600 border-default-200 rounded-lg text-sm ring-0 focus:border-primary focus:ring-primary"
              placeholder="Search name, email, phone..."
            />
            <span className="absolute start-4 top-2.5">
              <i data-lucide="search" className="w-5 h-5 text-default-600" />
            </span>
          </form>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/admin/customers/add"
              className="px-6 py-2.5 inline-flex text-white text-sm rounded-md bg-primary"
            >
              <i
                data-lucide="plus"
                className="w-5 h-5 inline-flex align-middle me-2"
              />
              Add a New Customer
            </Link>
          </div>
        </div>
      </div>

      <div className="relative overflow-x-auto border-t border-default-200">
        <div className="min-w-full inline-block align-middle">
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-default-200">
              <thead className="bg-default-100">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-4 text-start whitespace-nowrap text-sm font-medium text-default-500"
                  >
                    Customer ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-start whitespace-nowrap text-sm font-medium text-default-500"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-start whitespace-nowrap text-sm font-medium text-default-500"
                  >
                    First Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-start whitespace-nowrap text-sm font-medium text-default-500"
                  >
                    Last Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-start whitespace-nowrap text-sm font-medium text-default-500"
                  >
                    Phone
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-start whitespace-nowrap text-sm font-medium text-default-500"
                  >
                    Country
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-start whitespace-nowrap text-sm font-medium text-default-500"
                  >
                    State
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-start whitespace-nowrap text-sm font-medium text-default-500"
                  >
                    Zip Code
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-start whitespace-nowrap text-sm font-medium text-default-500"
                  >
                    Description
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-start whitespace-nowrap text-sm font-medium text-default-500"
                  >
                    User Role
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-start whitespace-nowrap text-sm font-medium text-default-500"
                  >
                    Created At
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-start whitespace-nowrap text-sm font-medium text-default-500"
                  >
                    Updated At
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-end whitespace-nowrap text-sm font-medium text-default-500"
                  >
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-default-200">
                {loading ? (
                  <tr>
                    <td
                      colSpan={13}
                      className="px-6 py-10 text-center text-sm text-default-500"
                    >
                      Loading customers...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={13}
                      className="px-6 py-10 text-center text-sm text-default-500"
                    >
                      <i data-lucide="search" className="w-5 h-5 text-default-600" />
                      <span className="text-sm text-default-500">
                        No customers found.
                      </span>
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">
                        #{user.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">
                        {user.email || "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">
                        {user.first_name || "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">
                        {user.last_name || "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">
                        {user.phone || "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">
                        {user.country || "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">
                        {user.state || "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">
                        {user.zip_code || "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">
                        {user.description || "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">
                        {user.role || "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">
                        {formatCustomerSince(user.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-base text-default-800">
                        {formatCustomerSince(user.updated_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/customers/${user.id}`}
                            className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 hover:bg-primary hover:text-white transition-colors"
                          >
                            <Eye className="size-3.5" />
                            View
                          </Link>
                          <Link
                            href={`/admin/customers/${user.id}/edit`}
                            className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium text-default-700 bg-default-100 hover:bg-default-200 transition-colors"
                          >
                            <Pencil className="size-3.5" />
                            Edit
                          </Link>
                          <button
                            type="button"
                            disabled={deletingId === user.id}
                            onClick={() => void handleDelete(user)}
                            className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium text-red-700 bg-red-500/10 hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
                          >
                            <Trash className="size-3.5" />
                            {deletingId === user.id ? "..." : "Delete"}
                          </button>
                          <button
                            type="button"
                            disabled={deletingId === user.id}
                            onClick={() => void handleDelete(user, true)}
                            className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50"
                            title="Delete customer with all orders, products, and images"
                          >
                            <TriangleAlert className="size-3.5" />
                            {deletingId === user.id ? "..." : "Force"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-default-200 px-6 py-4">
        <p className="text-sm text-default-500">
          Showing {startItem}–{endItem} of {total} customers
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page <= 1 || loading}
            onClick={() => setPage((current) => current - 1)}
            className="rounded-md px-4 py-2 text-sm font-medium text-default-700 bg-default-100 hover:bg-default-200 disabled:opacity-50 disabled:pointer-events-none"
          >
            Previous
          </button>
          <span className="text-sm text-default-600">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages || loading}
            onClick={() => setPage((current) => current + 1)}
            className="rounded-md px-4 py-2 text-sm font-medium text-default-700 bg-default-100 hover:bg-default-200 disabled:opacity-50 disabled:pointer-events-none"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
