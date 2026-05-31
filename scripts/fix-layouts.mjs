import fs from "fs";
import path from "path";

const dir = "src/components/layout";
const files = ["Navbar.tsx", "Footer.tsx", "AdminTopbar.tsx", "AdminSidebar.tsx"];

const replacements = [
  ["assets/images/", "/images/"],
  ["admin-order-details.html", "/admin/orders/1"],
  ["admin-order-list.html", "/admin/orders"],
  ["admin-product-details.html", "/admin/products/1"],
  ["admin-product-edit.html", "/admin/products/1/edit"],
  ["admin-product-add.html", "/admin/products/add"],
  ["admin-product-list.html", "/admin/products"],
  ["admin-customers-details.html", "/admin/customers/1"],
  ["admin-customers-edit.html", "/admin/customers/1/edit"],
  ["admin-customers-add.html", "/admin/customers/add"],
  ["admin-customers-list.html", "/admin/customers"],
  ["admin-restaurants-details.html", "/admin/restaurants/1"],
  ["admin-restaurants-edit.html", "/admin/restaurants/1/edit"],
  ["admin-restaurants-add.html", "/admin/restaurants/add"],
  ["admin-restaurants-list.html", "/admin/restaurants"],
  ["admin-seller-details.html", "/admin/sellers/1"],
  ["admin-seller-edit.html", "/admin/sellers/1/edit"],
  ["admin-seller-add.html", "/admin/sellers/add"],
  ["admin-seller-list.html", "/admin/sellers"],
  ["admin-dashboard.html", "/admin/dashboard"],
  ["admin-manage.html", "/admin/manage"],
  ["admin-settings.html", "/admin/settings"],
  ["admin-wallet.html", "/admin/wallet"],
  ["product-detail.html", "/products/classic-burger"],
  ["product-grid.html", "/products"],
  ["product-list.html", "/products/list"],
  ["contact-us.html", "/contact"],
  ["auth-recoverpw.html", "/recover-password"],
  ["auth-reset-password.html", "/reset-password"],
  ["auth-register.html", "/register"],
  ["auth-login.html", "/login"],
  ["error-404.html", "/404"],
  ["faqs.html", "/faqs"],
  ["checkout.html", "/checkout"],
  ["wishlist.html", "/wishlist"],
  ["home.html", "/home"],
  ["cart.html", "/cart"],
  ['href="javascript:void(0)"', 'href="#"'],
  ["href='javascript:void(0)'", "href='#'"],
  ['href="javascript:void(0);"', 'href="#"'],
  ["href='javascript:void(0);'", "href='#'"],
];

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, "utf8");

  if (!content.startsWith('"use client"')) {
    content = content.replace(
      /^import React from 'react'\n\n/,
      '"use client";\n\n',
    );
  }

  for (const [from, to] of replacements) {
    content = content.split(from).join(to);
  }

  fs.writeFileSync(filePath, content);
  console.log(`Updated ${file}`);
}
