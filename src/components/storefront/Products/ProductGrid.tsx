"use client";

import ProductCatalogResults from "@/components/storefront/Products/ProductCatalogResults";
import ProductViewModeToggle, {
  type ProductViewMode,
} from "@/components/storefront/Products/ProductViewModeToggle";
import { fetchProductsPage } from "@/lib/api/products";
import type { IProduct } from "@/types/product";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const DEFAULT_LIMIT = 10;

export default function ProductGrid() {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState<ProductViewMode>("grid");

    useEffect(() => {
        const controller = new AbortController();
        let active = true;

        const loadProducts = async () => {
            setIsLoading(true);

            try {
                const data = await fetchProductsPage({
                    page,
                    limit: DEFAULT_LIMIT,
                    signal: controller.signal,
                    endpoint: "/api/products",
                });

                if (!active) return;

                setProducts(data.products);
                setTotal(data.total);
                setTotalPages(data.totalPages);
            } catch (error) {
                if (!active || controller.signal.aborted) return;
                toast.error(
                    error instanceof Error ? error.message : "Failed to load products.",
                );
                setProducts([]);
                setTotal(0);
                setTotalPages(1);
            } finally {
                if (active) {
                    setIsLoading(false);
                }
            }
        };

        void loadProducts();

        return () => {
            active = false;
            controller.abort();
        };
    }, [page]);

    const startItem = total === 0 ? 0 : (page - 1) * DEFAULT_LIMIT + 1;
    const endItem = Math.min(page * DEFAULT_LIMIT, total);
    return (
        <section className="lg:py-8 py-6">
            <div className="container">
                <div className="lg:flex gap-6">
                    <div className="hs-overlay hs-overlay-open:translate-x-0 hidden max-w-xs lg:max-w-full lg:w-1/4 w-full -translate-x-full fixed top-0 start-0 transition-all transform h-full z-60 lg:z-auto bg-white lg:translate-x-0 lg:block lg:static lg:start-auto dark:bg-default-50" id="filter_Offcanvas" tabIndex={-1}>
                        <div className="flex justify-between items-center py-3 px-4 border-b border-default-200 lg:hidden">
                            <h3 className="font-medium text-default-800">
                                Filter Options
                            </h3>

                            <button className="inline-flex flex-shrink-0 justify-center items-center h-8 w-8 rounded-md text-default-500 hover:text-default-700 text-sm" data-hs-overlay="#filter_Offcanvas" type="button">
                                <span className="sr-only">Close modal</span>
                                <i className="h-5 w-5" data-lucide="x"></i>
                            </button>
                        </div>

                        <div className="h-[calc(100vh-128px)] overflow-y-auto lg:h-auto" data-simplebar>
                            <div className="p-6 lg:p-0 divide-y divide-default-200">
                                <div>
                                    <button className="hs-collapse-toggle py-4 inline-flex justify-between items-center gap-2 transition-all uppercase font-medium text-lg text-default-900 w-full open" data-hs-collapse="#all_categories" id="hs-basic-collapse" type="button">
                                        Category
                                    </button>

                                    <div className="hs-collapse w-full overflow-hidden transition-[height] duration-300 open" id="all_categories">
                                        <div className="relative flex flex-col space-y-4 mb-6">
                                            <div className="flex items-center">
                                                <input className="form-checkbox rounded-full text-primary border-default-400 bg-transparent w-5 h-5 focus:ring-0 focus:ring-transparent ring-offset-0 cursor-pointer" id="all" name="all" type="checkbox" defaultChecked />
                                                <label className="ps-3 inline-flex items-center text-default-600 text-sm select-none" htmlFor="all">All</label>
                                            </div>

                                            <div className="flex items-center">
                                                <input className="form-checkbox rounded-full text-primary border-default-400 bg-transparent w-5 h-5 focus:ring-0 focus:ring-transparent ring-offset-0 cursor-pointer" id="wraps_roll" type="checkbox" />
                                                <label className="ps-3 inline-flex items-center text-default-600 text-sm select-none" htmlFor="wraps_roll">Wraps</label>
                                            </div>

                                            <div className="flex items-center">
                                                <input className="form-checkbox rounded-full text-primary border-default-400 bg-transparent w-5 h-5 focus:ring-0 focus:ring-transparent ring-offset-0 cursor-pointer" id="noodles_bowl" type="checkbox" />
                                                <label className="ps-3 inline-flex items-center text-default-600 text-sm select-none" htmlFor="noodles_bowl">Noodles</label>
                                            </div>

                                            <div className="flex items-center">
                                                <input className="form-checkbox rounded-full text-primary border-default-400 bg-transparent w-5 h-5 focus:ring-0 focus:ring-transparent ring-offset-0 cursor-pointer" id="burrito_bowls" name="burrito_bowls" type="checkbox" />
                                                <label className="ps-3 inline-flex items-center text-default-600 text-sm select-none" htmlFor="burrito_bowls">Burrito Bowls</label>
                                            </div>

                                            <div className="flex items-center">
                                                <input className="form-checkbox rounded-full text-primary border-default-400 bg-transparent w-5 h-5 focus:ring-0 focus:ring-transparent ring-offset-0 cursor-pointer" id="thalis" name="thalis" type="checkbox" />
                                                <label className="ps-3 inline-flex items-center text-default-600 text-sm select-none" htmlFor="thalis">Thalis</label>
                                            </div>

                                            <div className="flex items-center">
                                                <input className="form-checkbox rounded-full text-primary border-default-400 bg-transparent w-5 h-5 focus:ring-0 focus:ring-transparent ring-offset-0 cursor-pointer" id="smart_meals" name="smart_meals" type="checkbox" />
                                                <label className="ps-3 inline-flex items-center text-default-600 text-sm select-none" htmlFor="smart_meals">Smart Meals</label>
                                            </div>

                                            <div className="flex items-center">
                                                <input className="form-checkbox rounded-full text-primary border-default-400 bg-transparent w-5 h-5 focus:ring-0 focus:ring-transparent ring-offset-0 cursor-pointer" id="salads" name="salads" type="checkbox" />
                                                <label className="ps-3 inline-flex items-center text-default-600 text-sm select-none" htmlFor="salads">Salads</label>
                                            </div>

                                            <div className="flex items-center">
                                                <input className="form-checkbox rounded-full text-primary border-default-400 bg-transparent w-5 h-5 focus:ring-0 focus:ring-transparent ring-offset-0 cursor-pointer" id="beverages_desserts" name="beverages_desserts" type="checkbox" />
                                                <label className="ps-3 inline-flex items-center text-default-600 text-sm select-none" htmlFor="beverages_desserts">Beverages & Desserts</label>
                                            </div>

                                            <div className="flex items-center">
                                                <input className="form-checkbox rounded-full text-primary border-default-400 bg-transparent w-5 h-5 focus:ring-0 focus:ring-transparent ring-offset-0 cursor-pointer" id="appetizers" name="appetizers" type="checkbox" />
                                                <label className="ps-3 inline-flex items-center text-default-600 text-sm select-none" htmlFor="appetizers">Appetizers</label>
                                            </div>

                                            <div className="flex items-center">
                                                <input className="form-checkbox rounded-full text-primary border-default-400 bg-transparent w-5 h-5 focus:ring-0 focus:ring-transparent ring-offset-0 cursor-pointer" id="burger_more" name="burger_more" type="checkbox" />
                                                <label className="ps-3 inline-flex items-center text-default-600 text-sm select-none" htmlFor="burger_more">Burger & More</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <button className="hs-collapse-toggle py-4 inline-flex justify-between items-center gap-2 transition-all uppercase font-medium text-lg text-default-900 w-full open" data-hs-collapse="#price_range" id="hs-basic-collapse" type="button">
                                        Price Range
                                    </button>

                                    <div className="hs-collapse w-full overflow-hidden transition-[height] duration-300 open" id="price_range">
                                        <div className="relative flex flex-col space-y-5 mb-6">
                                            <div className="space-y-2 py-4">
                                                <div id="product-price-range"></div>

                                                <div className="flex flex-wrap xl:flex-nowrap gap-2 items-center !mt-4">
                                                    <div className="inline-flex items-center justify-center whitespace-nowrap w-full xl:w-1/2 gap-1 border border-default-200 py-2 px-4 rounded-full">
                                                        Min price :
                                                        <input className="border-none p-0 w-10 bg-transparent focus:ring-0" id="minCost" type="text" defaultValue="0" />
                                                    </div>

                                                    <div className="inline-flex items-center justify-center whitespace-nowrap w-full xl:w-1/2 gap-1 border border-default-200 py-2 px-4 rounded-full">
                                                        Max price :
                                                        <input className="border-none p-0 w-10 bg-transparent focus:ring-0" id="maxCost" type="text" defaultValue="1000" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="relative flex flex-col space-y-4 mb-6">
                                                <div className="flex items-center">
                                                    <input className="form-radio rounded-full text-primary border-default-400 bg-transparent w-5 h-5 focus:ring-0 focus:ring-transparent cursor-pointer" id="all_price" name="radio" type="radio" />
                                                    <label className="ps-3 inline-flex items-center text-default-600 text-sm select-none" htmlFor="all_price">All
                                                        Price
                                                    </label>
                                                </div>

                                                <div className="flex items-center">
                                                    <input className="form-radio rounded-full text-primary border-default-400 bg-transparent w-5 h-5 focus:ring-0 focus:ring-transparent cursor-pointer" id="under_$20" name="radio" type="radio" />
                                                    <label className="ps-3 inline-flex items-center text-default-600 text-sm select-none" htmlFor="under_$20">Under
                                                        $20
                                                    </label>
                                                </div>

                                                <div className="flex items-center">
                                                    <input className="form-radio rounded-full text-primary border-default-400 bg-transparent w-5 h-5 focus:ring-0 focus:ring-transparent cursor-pointer" id="$25_$100" name="radio" type="radio" />
                                                    <label className="ps-3 inline-flex items-center text-default-600 text-sm select-none" htmlFor="$25_$100">$25
                                                        to $100
                                                    </label>
                                                </div>

                                                <div className="flex items-center">
                                                    <input className="form-radio rounded-full text-primary border-default-400 bg-transparent w-5 h-5 focus:ring-0 focus:ring-transparent cursor-pointer" id="$100_$300" name="radio" type="radio" />
                                                    <label className="ps-3 inline-flex items-center text-default-600 text-sm select-none" htmlFor="$100_$300">$100
                                                        to $300
                                                    </label>
                                                </div>

                                                <div className="flex items-center">
                                                    <input defaultChecked className="form-radio rounded-full text-primary border-default-400 bg-transparent w-5 h-5 focus:ring-0 focus:ring-transparent cursor-pointer" id="$300_$500" name="radio" type="radio" />
                                                    <label className="ps-3 inline-flex items-center text-default-600 text-sm select-none" htmlFor="$300_$500">$300
                                                        to $500
                                                    </label>
                                                </div>

                                                <div className="flex items-center">
                                                    <input className="form-radio rounded-full text-primary border-default-400 bg-transparent w-5 h-5 focus:ring-0 focus:ring-transparent cursor-pointer" id="$500_$1,000" name="radio" type="radio" />
                                                    <label className="ps-3 inline-flex items-center text-default-600 text-sm select-none" htmlFor="$500_$1,000">$500
                                                        to $1,000
                                                    </label>
                                                </div>

                                                <div className="flex items-center">
                                                    <input className="form-radio rounded-full text-primary border-default-400 bg-transparent w-5 h-5 focus:ring-0 focus:ring-transparent cursor-pointer" id="$1,000_$10,000" name="radio" type="radio" />
                                                    <label className="ps-3 inline-flex items-center text-default-600 text-sm select-none" htmlFor="$1,000_$10,000">$1,000
                                                        to $10,000
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <button className="hs-collapse-toggle py-4 inline-flex justify-between items-center gap-2 transition-all uppercase font-medium text-lg text-default-900 w-full open" data-hs-collapse="#cafe_restaurant" id="hs-basic-collapse" type="button">
                                        Popular Café / Restaurant
                                    </button>

                                    <div className="hs-collapse w-full overflow-hidden transition-[height] duration-300 open" id="cafe_restaurant">
                                        <div className="relative flex flex-col space-y-5 mb-6">
                                            <div className="flex gap-x-6">
                                                <div className="flex items-center w-1/2">
                                                    <input defaultChecked className="form-checkbox bg-transparent border-default-200 rounded text-primary focus:ring-transparent checked:bg-primary h-5 w-5 cursor-pointer" id="monginis" type="checkbox" />
                                                    <label className="ps-3 inline-flex items-center text-default-600 text-sm select-none" htmlFor="monginis">Monginis</label>
                                                </div>

                                                <div className="flex items-center w-1/2">
                                                    <input defaultChecked className="form-checkbox bg-transparent border-default-200 rounded text-primary focus:ring-transparent checked:bg-primary h-5 w-5 cursor-pointer" id="ferrero" type="checkbox" />
                                                    <label className="ps-3 inline-flex items-center text-default-600 text-sm select-none" htmlFor="ferrero">Ferrero</label>
                                                </div>
                                            </div>

                                            <div className="flex gap-x-6">
                                                <div className="flex items-center w-1/2">
                                                    <input defaultChecked className="form-checkbox bg-transparent border-default-200 rounded text-primary focus:ring-transparent checked:bg-primary h-5 w-5 cursor-pointer" id="burger_king" type="checkbox" />
                                                    <label className="ps-3 inline-flex items-center text-default-600 text-sm select-none" htmlFor="burger_king">Burger
                                                        King
                                                    </label>
                                                </div>

                                                <div className="flex items-center w-1/2">
                                                    <input className="form-checkbox bg-transparent border-default-200 rounded text-primary focus:ring-transparent checked:bg-primary h-5 w-5 cursor-pointer" id="starbucks" type="checkbox" />
                                                    <label className="ps-3 inline-flex items-center text-default-600 text-sm select-none" htmlFor="starbucks">Starbucks</label>
                                                </div>
                                            </div>

                                            <div className="flex gap-x-6">
                                                <div className="flex items-center w-1/2">
                                                    <input className="form-checkbox bg-transparent border-default-200 rounded text-primary focus:ring-transparent checked:bg-primary h-5 w-5 cursor-pointer" id="macDonald" type="checkbox" />
                                                    <label className="ps-3 inline-flex items-center text-default-600 text-sm select-none" htmlFor="macDonald">MacDonald's</label>
                                                </div>

                                                <div className="flex items-center w-1/2">
                                                    <input defaultChecked className="form-checkbox bg-transparent border-default-200 rounded text-primary focus:ring-transparent checked:bg-primary h-5 w-5 cursor-pointer" id="tim_hortons" type="checkbox" />
                                                    <label className="ps-3 inline-flex items-center text-default-600 text-sm select-none" htmlFor="tim_hortons">Tim
                                                        Hortons
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="flex gap-x-6">
                                                <div className="flex items-center w-1/2">
                                                    <input className="form-checkbox bg-transparent border-default-200 rounded text-primary focus:ring-transparent checked:bg-primary h-5 w-5 cursor-pointer" id="coffee_cafe" type="checkbox" />
                                                    <label className="ps-3 inline-flex items-center text-default-600 text-sm select-none" htmlFor="coffee_cafe">Coffee
                                                        Café
                                                    </label>
                                                </div>

                                                <div className="flex items-center w-1/2">
                                                    <input className="form-checkbox bg-transparent border-default-200 rounded text-primary focus:ring-transparent checked:bg-primary h-5 w-5 cursor-pointer" id="dominos" type="checkbox" />
                                                    <label className="ps-3 inline-flex items-center text-default-600 text-sm select-none" htmlFor="dominos">Dominos</label>
                                                </div>
                                            </div>

                                            <div className="flex gap-x-6">
                                                <div className="flex items-center w-1/2">
                                                    <input className="form-checkbox bg-transparent border-default-200 rounded text-primary focus:ring-transparent checked:bg-primary h-5 w-5 cursor-pointer" id="café_beats" type="checkbox" />
                                                    <label className="ps-3 inline-flex items-center text-default-600 text-sm select-none" htmlFor="café_beats">Café
                                                        Beats
                                                    </label>
                                                </div>

                                                <div className="flex items-center w-1/2">
                                                    <input defaultChecked className="form-checkbox bg-transparent border-default-200 rounded text-primary focus:ring-transparent checked:bg-primary h-5 w-5 cursor-pointer" id="blaze_pizza" type="checkbox" />
                                                    <label className="ps-3 inline-flex items-center text-default-600 text-sm select-none" htmlFor="blaze_pizza">Blaze
                                                        Pizza
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="flex gap-x-6">
                                                <div className="flex items-center w-1/2">
                                                    <input defaultChecked className="form-checkbox bg-transparent border-default-200 rounded text-primary focus:ring-transparent checked:bg-primary h-5 w-5 cursor-pointer" id="tgb" type="checkbox" />
                                                    <label className="ps-3 inline-flex items-center text-default-600 text-sm select-none" htmlFor="tgb">TGB</label>
                                                </div>

                                                <div className="flex items-center w-1/2">
                                                    <input className="form-checkbox bg-transparent border-default-200 rounded text-primary focus:ring-transparent checked:bg-primary h-5 w-5 cursor-pointer" id="red_robbin" type="checkbox" />
                                                    <label className="ps-3 inline-flex items-center text-default-600 text-sm select-none" htmlFor="red_robbin">Red
                                                        Robbin
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="flex gap-x-6">
                                                <div className="flex items-center w-1/2">
                                                    <input className="form-checkbox bg-transparent border-default-200 rounded text-primary focus:ring-transparent checked:bg-primary h-5 w-5 cursor-pointer" id="nestle" type="checkbox" />
                                                    <label className="ps-3 inline-flex items-center text-default-600 text-sm select-none" htmlFor="nestle">Nestle</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <button className="hs-collapse-toggle py-4 inline-flex justify-between items-center gap-2 transition-all uppercase font-medium text-lg text-default-900 w-full open" data-hs-collapse="#popular_tags" id="hs-basic-collapse" type="button">
                                        Popular tags
                                    </button>

                                    <div className="hs-collapse w-full overflow-hidden transition-[height] duration-300 open" id="popular_tags">
                                        <div className="relative mb-6">
                                            <div className="flex flex-wrap gap-1.5">
                                                <div className="text-default-950 px-3 py-1 rounded-full border border-default-200 cursor-pointer hover:bg-primary/10 hover:text-primary hover:border-primary-500/60 transition-all">
                                                    Pizza
                                                </div>

                                                <div className="text-default-950 px-3 py-1 rounded-full border border-default-200 cursor-pointer hover:bg-primary/10 hover:text-primary hover:border-primary-500/60 transition-all">
                                                    Burger
                                                </div>

                                                <div className="text-default-950 px-3 py-1 rounded-full border border-default-200 cursor-pointer hover:bg-primary/10 hover:text-primary hover:border-primary-500/60 transition-all">
                                                    Cake
                                                </div>

                                                <div className="text-default-950 px-3 py-1 rounded-full border border-default-200 cursor-pointer hover:bg-primary/10 hover:text-primary hover:border-primary-500/60 transition-all">
                                                    Desserts
                                                </div>

                                                <div className="text-default-950 px-3 py-1 rounded-full border border-default-200 cursor-pointer hover:bg-primary/10 hover:text-primary hover:border-primary-500/60 transition-all">
                                                    Coffee & Tea
                                                </div>

                                                <div className="text-default-950 px-3 py-1 rounded-full border border-default-200 cursor-pointer hover:bg-primary/10 hover:text-primary hover:border-primary-500/60 transition-all">
                                                    Juices
                                                </div>

                                                <div className="px-3 py-1 rounded-full border bg-primary/10 text-primary border-primary-500/60 transition-all">
                                                    Italian Food
                                                </div>

                                                <div className="text-default-950 px-3 py-1 rounded-full border border-default-200 cursor-pointer hover:bg-primary/10 hover:text-primary hover:border-primary-500/60 transition-all">
                                                    Beverages
                                                </div>

                                                <div className="text-default-950 px-3 py-1 rounded-full border border-default-200 cursor-pointer hover:bg-primary/10 hover:text-primary hover:border-primary-500/60 transition-all">
                                                    Noodles
                                                </div>

                                                <div className="text-default-950 px-3 py-1 rounded-full border border-default-200 cursor-pointer hover:bg-primary/10 hover:text-primary hover:border-primary-500/60 transition-all">
                                                    Momos
                                                </div>

                                                <div className="text-default-950 px-3 py-1 rounded-full border border-default-200 cursor-pointer hover:bg-primary/10 hover:text-primary hover:border-primary-500/60 transition-all">
                                                    Sandwich
                                                </div>

                                                <div className="text-default-950 px-3 py-1 rounded-full border border-default-200 cursor-pointer hover:bg-primary/10 hover:text-primary hover:border-primary-500/60 transition-all">
                                                    Frankie
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="py-6">
                                    <div className="relative rounded-lg bg-opacity-5 bg-center bg-cover overflow-hidden" style={{ backgroundImage: "url('/images/other/offer-bg.png')" }}>
                                        <div className="absolute inset-0 bg-primary/10 -z-10"></div>
                                        <div className="p-12">
                                            <div className="flex justify-center mb-6">
                                                <img src="/images/other/filter-offer-dish.png" />
                                            </div>

                                            <div className="text-center mb-10">
                                                <h3 className="text-2xl font-medium text-default-900 mb-2">
                                                    Burger Combo</h3>
                                                <p className="text-sm text-default-500">Lorem ipsum dolor sit
                                                    amet, consectetur adipiscing elit, sed do.</p>
                                            </div>

                                            <div className="flex items-center justify-center gap-2 w-full font-medium text-default-950 mb-6">
                                                Sort By :
                                                <span className="inline-flex items-center gap-4 text-sm py-2 px-4 xl:px-5 bg-default-50 rounded-full">
                                                    $59 USD
                                                </span>
                                            </div>

                                            <button className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-full bg-primary text-white hover:bg-primary-500 transition-all" type="button">
                                                Shop Now
                                                <i className="h-5 w-5" data-lucide="move-right"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="block lg:hidden py-4 px-4 border-t border-default-200">
                            <a className="w-full inline-flex items-center justify-center rounded border border-primary bg-primary px-6 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-all hover:border-primary-700 hover:bg-primary focus:ring focus:ring-primary/50" href="javascript:void(0)">Reset</a>
                        </div>
                    </div>

                    <div className="lg:w-3/4">
                        <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4 mb-10">
                            <div className="flex flex-wrap md:flex-nowrap items-center gap-4">
                                <button className="inline-flex lg:hidden items-center gap-4 text-sm py-2.5 px-4 xl:px-5 rounded-full text-default-950 border border-default-200 transition-all" data-hs-overlay="#filter_Offcanvas" type="button">
                                    Filter <i className="h-4 w-4" data-lucide="settings-2"></i>
                                </button>

                                <h6 className="lg:flex hidden text-default-950 text-base">
                                    {isLoading
                                        ? "Loading products..."
                                        : `Showing ${startItem}–${endItem} of ${total} results`}
                                </h6>

                                <ProductViewModeToggle
                                    value={viewMode}
                                    onChange={setViewMode}
                                />
                            </div>

                            <div className="flex items-center gap-4">
                                <span className="text-base text-default-950 me-3">Sort By :</span>
                                <div className="hs-dropdown relative inline-flex [--placement:bottom-left]">
                                    <button className="hs-dropdown-toggle flex items-center gap-2 font-medium text-default-950 text-sm py-2.5 px-4 xl:px-5 rounded-full border border-default-200 transition-all" type="button">
                                        Latest <i className="h-4 w-4" data-lucide="chevron-down"></i>
                                    </button>

                                    <div className="hs-dropdown-menu hs-dropdown-open:opacity-100 min-w-[200px] transition-[opacity,margin] mt-4 opacity-0 hidden z-20 bg-white shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] rounded-lg border border-default-100 p-1.5 dark:bg-default-50">
                                        <ul className="flex flex-col gap-1">
                                            <li>
                                                <a className="flex items-center gap-3 font-normal py-2 px-3 transition-all text-default-700 bg-default-400/20 rounded" href="javascript:void(0)">Latest</a>
                                            </li>

                                            <li>
                                                <a className="flex items-center gap-3 font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-400/20 rounded" href="javascript:void(0)">Featured</a>
                                            </li>

                                            <li>
                                                <a className="flex items-center gap-3 font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-400/20 rounded" href="javascript:void(0)">Release Date</a>
                                            </li>

                                            <li>
                                                <a className="flex items-center gap-3 font-normal text-default-600 py-2 px-3 transition-all hover:text-default-700 hover:bg-default-400/20 rounded" href="javascript:void(0)">Avg. Rating</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <ProductCatalogResults
                            products={products}
                            isLoading={isLoading}
                            page={page}
                            totalPages={totalPages}
                            total={total}
                            startItem={startItem}
                            endItem={endItem}
                            viewMode={viewMode}
                            onPageChange={setPage}
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}

