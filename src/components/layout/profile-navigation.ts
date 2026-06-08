export type ProfileNavLink = {
  type: "link";
  href: string;
  label: string;
  icon: string;
};

export type ProfileNavGroup = {
  type: "group";
  id: string;
  label: string;
  icon: string;
  prefix: string;
  children: { href: string; label: string }[];
};

export type ProfileNavItem = ProfileNavLink | ProfileNavGroup;

export const ADMIN_NAV_ITEMS: ProfileNavItem[] = [
  {
    type: "link",
    href: "/admin/dashboard",
    label: "Dashboard",
    icon: "layout-grid",
  },
  {
    type: "link",
    href: "/admin/manage",
    label: "Manage",
    icon: "settings-2",
  },
  {
    type: "group",
    id: "menuOrders",
    label: "Orders",
    icon: "list-ordered",
    prefix: "/admin/orders",
    children: [
      { href: "/admin/orders", label: "All Orders" },
      { href: "/admin/orders/1", label: "Order Details" },
    ],
  },
  {
    type: "link",
    href: "/admin/customers",
    label: "Customers",
    icon: "users"
  },
  // {
  //   type: "group",
  //   id: "menuCustomers",
  //   label: "Customers",
  //   icon: "users",
  //   prefix: "/admin/customers",
  //   children: [
  //     { href: "/admin/customers", label: "All Customers" },
  //     { href: "/admin/customers/1", label: "Customer Details" },
  //     { href: "/admin/customers/add", label: "Add Customer" },
  //     { href: "/admin/customers/1/edit", label: "Edit Customer" },
  //   ],
  // },
  {
    type: "group",
    id: "menuRestaurants",
    label: "Restaurants",
    icon: "hotel",
    prefix: "/admin/restaurants",
    children: [
      { href: "/admin/restaurants", label: "All Restaurants" },
      { href: "/admin/restaurants/1", label: "Restaurant Details" },
      { href: "/admin/restaurants/add", label: "Add Restaurant" },
      { href: "/admin/restaurants/1/edit", label: "Edit Restaurant" },
    ],
  },
  {
    type: "group",
    id: "menuProduct",
    label: "Products",
    icon: "shopping-bag",
    prefix: "/admin/products",
    children: [
      { href: "/admin/products", label: "All Products" },
      { href: "/admin/products/1", label: "Product Details" },
      { href: "/admin/products/add", label: "Add Product" },
      { href: "/admin/products/1/edit", label: "Edit Product" },
    ],
  },
  {
    type: "group",
    id: "menuSeller",
    label: "Sellers",
    icon: "user-cog",
    prefix: "/admin/sellers",
    children: [
      { href: "/admin/sellers", label: "All Sellers" },
      { href: "/admin/sellers/1", label: "Seller Details" },
      { href: "/admin/sellers/add", label: "Add Seller" },
      { href: "/admin/sellers/1/edit", label: "Edit Seller" },
    ],
  },
  {
    type: "link",
    href: "/admin/wallet",
    label: "Wallet",
    icon: "wallet",
  },
];

export const ADMIN_NAV_SECTIONS = ADMIN_NAV_ITEMS.filter(
  (item): item is ProfileNavGroup => item.type === "group",
).map(({ id, prefix }) => ({ id, prefix }));

export function getOpenSectionForPath(pathname: string): string | null {
  const match = ADMIN_NAV_SECTIONS.find(
    ({ prefix }) =>
      pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  return match?.id ?? null;
}

export const USER_NAV_ITEMS: ProfileNavItem[] = [
  {
    type: "link",
    href: "/user/dashboard",
    label: "Dashboard",
    icon: "layout-grid",
  },
  {
    type: "link",
    href: "/user/orders",
    label: "My Orders",
    icon: "list-ordered",
  },
];