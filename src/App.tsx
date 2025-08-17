import React, { useMemo, useState, useEffect } from "react";
import { ShoppingCart, Search, Filter, Heart, Menu, X, Star, ChevronDown, ChevronUp } from "lucide-react";

// --- Theme Colors (Tailwind arbitrary colors are used inline) ---
// طلایی: #C9A227  |  سبز پررنگ: #0F5132  |  سبز تیره‌تر: #0B3D2E

// --- Mock Data (نمونه داده‌ها برای تست) ---
// در آینده می‌توانید این بخش را با API واقعی یا فایل JSON جایگزین کنید.
const CATEGORIES = [
  { id: "lighting", label: "روشنایی" },
  { id: "wall", label: "دیواری" },
  { id: "floor", label: "کفپوش" },
  { id: "furniture", label: "مبلمان" },
  { id: "textile", label: "پارچه و پرده" },
  { id: "decor", label: "اکسسوری" },
];

const TAGS = [
  { id: "eco", label: "دوست‌دار محیط‌زیست" },
  { id: "lux", label: "لاکچری" },
  { id: "modern", label: "مدرن" },
  { id: "classic", label: "کلاسیک" },
];

const MOCK_PRODUCTS = [
  {
    id: 1,
    title: "لوستر مدرن ۸ شاخه",
    price: 9800000,
    rating: 4.6,
    category: "lighting",
    tags: ["modern", "lux"],
    inStock: true,
    image: "https://images.unsplash.com/photo-1505692794403-34d4982f88aa?w=800&q=80&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "فرش دست‌بافت ۳x۲",
    price: 16500000,
    rating: 4.9,
    category: "textile",
    tags: ["classic", "lux"],
    inStock: true,
    image: "https://images.unsplash.com/photo-1591446474644-6c8f17b59d83?w=800&q=80&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "کاغذ دیواری طرح سنگ",
    price: 1850000,
    rating: 4.2,
    category: "wall",
    tags: ["modern"],
    inStock: true,
    image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "مبل دونفره چوبی",
    price: 12500000,
    rating: 4.4,
    category: "furniture",
    tags: ["classic", "eco"],
    inStock: false,
    image: "https://images.unsplash.com/photo-1549187774-b4e9b0445b06?w=800&q=80&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "کفپوش لمینت آنتیک",
    price: 5200000,
    rating: 4.1,
    category: "floor",
    tags: ["modern", "eco"],
    inStock: true,
    image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800&q=80&auto=format&fit=crop",
  },
  {
    id: 6,
    title: "ست کوسن مخمل",
    price: 890000,
    rating: 4.0,
    category: "textile",
    tags: ["modern"],
    inStock: true,
    image: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&q=80&auto=format&fit=crop",
  },
  {
    id: 7,
    title: "آینه دکوراتیو طلایی",
    price: 3700000,
    rating: 4.7,
    category: "decor",
    tags: ["lux", "modern"],
    inStock: true,
    image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800&q=80&auto=format&fit=crop",
  },
  {
    id: 8,
    title: "چراغ مطالعه سبز",
    price: 1450000,
    rating: 4.3,
    category: "lighting",
    tags: ["modern", "eco"],
    inStock: true,
    image: "https://images.unsplash.com/photo-1505691723518-36a5ac3b2d25?w=800&q=80&auto=format&fit=crop",
  },
];

// --- Helpers ---
const toIRR = (n: number) => n.toLocaleString("fa-IR");

// --- UI Subcomponents ---
function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium border-[#C9A227]/30 text-[#0F5132] bg-[#C9A227]/10">
      {children}
    </span>
  );
}

function Rating({ value }: { value: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <div className="flex items-center gap-1" aria-label={`امتیاز ${value}`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={
            "h-4 w-4 " +
            (i < full
              ? "fill-[#C9A227] stroke-[#C9A227]"
              : half && i === full
              ? "fill-[#C9A227]/60 stroke-[#C9A227]"
              : "stroke-[#C9A227]")
          }
        />
      ))}
      <span className="text-xs text-[#0F5132]">{value.toFixed(1)}</span>
    </div>
  );
}

function ProductCard({ p }: { p: any }) {
  return (
    <div className="group rounded-2xl border border-[#0F5132]/10 bg-white shadow-sm hover:shadow-md transition overflow-hidden">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={p.image} alt={p.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
        {!p.inStock && (
          <div className="absolute top-2 left-2">
            <Badge>ناموجود</Badge>
          </div>
        )}
        <button className="absolute top-2 right-2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur hover:bg-white border border-[#0F5132]/10">
          <Heart className="h-4 w-4" />
        </button>
      </div>
      <div className="p-3 sm:p-4">
        <h3 className="line-clamp-2 text-sm sm:text-base font-semibold text-[#0F5132]">{p.title}</h3>
        <div className="mt-2 flex items-center justify-between">
          <Rating value={p.rating} />
          <span className="text-lg sm:text-xl font-bold text-[#0F5132]">{toIRR(p.price)} تومان</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge>{CATEGORIES.find(c=>c.id===p.category)?.label}</Badge>
          {p.tags.slice(0,2).map((t:string)=>(
            <Badge key={t}>{TAGS.find(x=>x.id===t)?.label}</Badge>
          ))}
        </div>
        <button className="mt-4 w-full rounded-xl bg-[#0F5132] py-2.5 text-white font-semibold hover:bg-[#0B3D2E]" disabled={!p.inStock}>
          <div className="flex items-center justify-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            <span>افزودن به سبد</span>
          </div>
        </button>
      </div>
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-4 flex items-end justify-between">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F5132]">{title}</h2>
        {subtitle && <p className="text-xs sm:text-sm text-[#0F5132]/70 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}

// --- Filters Drawer ---
function FiltersDrawer({ open, onClose, filters, setFilters }: any) {
  const [expand, setExpand] = useState({ cat: true, price: true, tags: false, stock: false });

  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div className={`absolute inset-0 bg-black/30 transition-opacity ${open ? "opacity-100" : "opacity-0"}`} onClick={onClose} />
      <div className={`absolute right-0 top-0 h-full w-80 max-w-[90vw] bg-white shadow-xl transition-transform ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between p-4 border-b border-[#0F5132]/10">
          <h3 className="font-extrabold text-[#0F5132]">فیلترها</h3>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-[#0F5132]/5"><X /></button>
        </div>
        <div className="p-4 space-y-4">
          {/* دسته‌بندی */}
          <div className="border rounded-2xl border-[#0F5132]/10">
            <button className="w-full flex items-center justify-between p-3" onClick={()=>setExpand((s:any)=>({...s, cat:!s.cat}))}>
              <span className="font-bold text-[#0F5132]">دسته‌بندی</span>
              {expand.cat ? <ChevronUp /> : <ChevronDown />}
            </button>
            {expand.cat && (
              <div className="px-3 pb-3 space-y-2">
                {CATEGORIES.map(c => (
                  <label key={c.id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(c.id)}
                      onChange={(e)=>{
                        setFilters((f: any)=> ({
                          ...f,
                          categories: e.target.checked
                            ? [...f.categories, c.id]
                            : f.categories.filter((x:string)=>x!==c.id)
                        }));
                      }}
                    />
                    {c.label}
                  </label>
                ))}
              </div>
            )}
          </div>
          {/* قیمت */}
          <div className="border rounded-2xl border-[#0F5132]/10">
            <button className="w-full flex items-center justify-between p-3" onClick={()=>setExpand((s:any)=>({...s, price:!s.price}))}>
              <span className="font-bold text-[#0F5132]">قیمت</span>
              {expand.price ? <ChevronUp /> : <ChevronDown />}
            </button>
            {expand.price && (
              <div className="px-3 pb-4 space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    className="w-1/2 rounded-xl border px-3 py-2"
                    placeholder="حداقل"
                    value={filters.minPrice ?? ""}
                    onChange={(e)=> setFilters((f:any)=> ({...f, minPrice: e.target.value ? Number(e.target.value) : undefined}))}
                  />
                  <input
                    type="number"
                    className="w-1/2 rounded-xl border px-3 py-2"
                    placeholder="حداکثر"
                    value={filters.maxPrice ?? ""}
                    onChange={(e)=> setFilters((f:any)=> ({...f, maxPrice: e.target.value ? Number(e.target.value) : undefined}))}
                  />
                </div>
              </div>
            )}
          </div>
          {/* برچسب‌ها */}
          <div className="border rounded-2xl border-[#0F5132]/10">
            <button className="w-full flex items-center justify-between p-3" onClick={()=>setExpand((s:any)=>({...s, tags:!s.tags}))}>
              <span className="font-bold text-[#0F5132]">برچسب‌ها</span>
              {expand.tags ? <ChevronUp /> : <ChevronDown />}
            </button>
            {expand.tags && (
              <div className="px-3 pb-3 flex flex-wrap gap-2">
                {TAGS.map(t => (
                  <label key={t.id} className="inline-flex items-center gap-2 text-sm border px-3 py-1.5 rounded-full">
                    <input
                      type="checkbox"
                      checked={filters.tags.includes(t.id)}
                      onChange={(e)=>{
                        setFilters((f:any)=> ({
                          ...f,
                          tags: e.target.checked
                            ? [...f.tags, t.id]
                            : f.tags.filter((x:string)=>x!==t.id)
                        }));
                      }}
                    />
                    {t.label}
                  </label>
                ))}
              </div>
            )}
          </div>
          {/* موجودی */}
          <div className="border rounded-2xl border-[#0F5132]/10">
            <button className="w-full flex items-center justify-between p-3" onClick={()=>setExpand((s:any)=>({...s, stock:!s.stock}))}>
              <span className="font-bold text-[#0F5132]">وضعیت موجودی</span>
              {expand.stock ? <ChevronUp /> : <ChevronDown />}
            </button>
            {expand.stock && (
              <div className="px-3 pb-3 space-y-2">
                {[
                  {id:"all", label:"همه"},
                  {id:"in", label:"موجود"},
                  {id:"out", label:"ناموجود"},
                ].map(opt=> (
                  <label key={opt.id} className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="stock"
                      checked={filters.stock === opt.id}
                      onChange={()=> setFilters((f:any)=> ({...f, stock: opt.id}))}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            )}
          </div>
          <button
            className="w-full rounded-xl border border-[#0F5132]/20 py-2 font-bold text-[#0F5132] hover:bg-[#0F5132]/5"
            onClick={()=> setFilters({ query: "", categories: [], tags: [], minPrice: undefined, maxPrice: undefined, stock: "all", sort: "popular" })}
          >
            پاک‌کردن فیلترها
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Main App ---
export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [filters, setFilters] = useState<any>({
    query: "",
    categories: [] as string[],
    tags: [] as string[],
    minPrice: undefined as number | undefined,
    maxPrice: undefined as number | undefined,
    stock: "all" as "all" | "in" | "out",
    sort: "popular" as "popular" | "price-asc" | "price-desc" | "rating-desc",
  });

  // محصولات فیلتر و مرتب‌سازی‌شده
  const products = useMemo(() => {
    let res = [...MOCK_PRODUCTS];
    if (filters.query) {
      const q = filters.query.trim();
      res = res.filter(p => p.title.includes(q));
    }
    if (filters.categories.length) {
      res = res.filter(p => filters.categories.includes(p.category));
    }
    if (filters.tags.length) {
      res = res.filter(p => p.tags.some((t:string)=> filters.tags.includes(t)));
    }
    if (typeof filters.minPrice === 'number') {
      res = res.filter(p => p.price >= filters.minPrice!);
    }
    if (typeof filters.maxPrice === 'number') {
      res = res.filter(p => p.price <= filters.maxPrice!);
    }
    if (filters.stock !== 'all') {
      res = res.filter(p => filters.stock === 'in' ? p.inStock : !p.inStock);
    }

    switch(filters.sort){
      case 'price-asc': res.sort((a,b)=> a.price - b.price); break;
      case 'price-desc': res.sort((a,b)=> b.price - a.price); break;
      case 'rating-desc': res.sort((a,b)=> b.rating - a.rating); break;
      default: res.sort((a,b)=> b.rating - a.rating); // به‌عنوان محبوبیت
    }
    return res;
  }, [filters]);

  // برای RTL
  useEffect(()=>{
    if (typeof document !== 'undefined') {
      document.documentElement.dir = 'rtl';
      document.title = 'Neo Design Group | نئو دیزان گروپ';
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F8F6]">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 border-b border-[#0F5132]/10 bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-3 sm:px-4">
          <div className="flex items-center gap-3 py-3">
            <button className="lg:hidden rounded-xl p-2 hover:bg-[#0F5132]/5" onClick={()=> setMenuOpen(v=>!v)} aria-label="بازکردن منو">
              <Menu />
            </button>
            <a href="#" className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-[#0F5132] flex items-center justify-center text-white font-black">N</div>
              <div className="leading-tight">
                <div className="font-extrabold text-[#0F5132]">Neo Design Group</div>
                <div className="text-xs text-[#0F5132]/70">نئو دیزان گروپ</div>
              </div>
            </a>
            <div className="mx-2 hidden flex-1 items-center gap-2 rounded-2xl border border-[#0F5132]/20 bg-white px-2 py-1.5 lg:flex">
              <Search className="h-5 w-5" />
              <input
                value={filters.query}
                onChange={(e)=> setFilters((f:any)=> ({...f, query: e.target.value}))}
                placeholder="جست‌وجوی محصولات، برندها و دسته‌ها..."
                className="w-full bg-transparent outline-none placeholder:text-[#0F5132]/50"
              />
              <button className="rounded-xl bg-[#C9A227] px-4 py-2 font-bold text-[#0F5132] hover:bg-[#C9A227]/90">جست‌وجو</button>
            </div>
            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              <button className="inline-flex items-center gap-2 rounded-xl border border-[#0F5132]/20 px-3 py-2 font-bold text-[#0F5132] hover:bg-[#0F5132]/5" onClick={()=>setDrawerOpen(true)}>
                <Filter className="h-4 w-4" />
                فیلترها
              </button>
              <button className="relative rounded-xl border border-[#0F5132]/20 p-2 hover:bg-[#0F5132]/5" aria-label="سبد خرید">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#C9A227] px-1 text-xs font-bold text-[#0F5132]">2</span>
              </button>
            </div>
          </div>
          {/* Search (mobile) */}
          <div className="pb-3 lg:hidden">
            <div className="flex items-center gap-2 rounded-2xl border border-[#0F5132]/20 bg-white px-2 py-1.5">
              <Search className="h-5 w-5" />
              <input
                value={filters.query}
                onChange={(e)=> setFilters((f:any)=> ({...f, query: e.target.value}))}
                placeholder="جست‌وجو در نئو دیزان گروپ..."
                className="w-full bg-transparent outline-none placeholder:text-[#0F5132]/50"
              />
              <button className="rounded-xl bg-[#C9A227] px-3 py-1.5 text-sm font-bold text-[#0F5132] hover:bg-[#C9A227]/90">جست‌وجو</button>
            </div>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="mx-auto max-w-7xl px-3 sm:px-4">
        {/* Mega menu placeholder (mobile) */}
        {menuOpen && (
          <nav className="my-3 grid grid-cols-2 gap-2 rounded-2xl border border-[#0F5132]/10 bg-white p-3 lg:hidden">
            {CATEGORIES.map((c)=> (
              <a key={c.id} href="#" className="rounded-xl border border-[#0F5132]/10 p-3 hover:bg-[#0F5132]/5">
                {c.label}
              </a>
            ))}
          </nav>
        )}

        {/* Hero Banner */}
        <section className="mt-4 grid gap-3 sm:mt-6 lg:grid-cols-3">
          <div className="relative overflow-hidden rounded-2xl border border-[#0F5132]/10 bg-gradient-to-br from-[#0F5132] to-[#0B3D2E] p-6 lg:col-span-2 text-white">
            <h1 className="text-2xl sm:text-3xl font-black">سبک خانه‌ات را نونوار کن!</h1>
            <p className="mt-2 max-w-lg text-white/90">با محصولات منتخب نئو دیزان گروپ در رنگ‌های طلایی و سبز پررنگ، فضایی لوکس و دلنشین بساز.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a href="#products" className="rounded-xl bg-[#C9A227] px-4 py-2 font-bold text-[#0F5132] hover:bg-[#C9A227]/90">مشاهده محصولات</a>
              <a href="#categories" className="rounded-xl border border-white/30 px-4 py-2 font-bold hover:bg-white/10">دسته‌بندی‌ها</a>
            </div>
            <img alt="hero" src="https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=1200&q=80&auto=format&fit=crop" className="pointer-events-none absolute -bottom-8 left-6 hidden w-40 rotate-6 rounded-xl opacity-60 lg:block" />
          </div>
          <div className="grid grid-rows-2 gap-3">
            <div className="rounded-2xl border border-[#0F5132]/10 bg-white p-4">
              <div className="font-extrabold text-[#0F5132]">ارسال سریع</div>
              <div className="text-sm text-[#0F5132]/70">سریع، امن و به‌صرفه به سراسر کشور</div>
            </div>
            <div className="rounded-2xl border border-[#0F5132]/10 bg-white p-4">
              <div className="font-extrabold text-[#0F5132]">ضمانت اصالت</div>
              <div className="text-sm text-[#0F5132]/70">گارانتی کالا و خدمات پس از فروش</div>
            </div>
          </div>
        </section>

        {/* Controls Row */}
        <section className="mt-6 flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
          <div id="categories" className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map(c => (
              <button
                key={c.id}
                className={`rounded-full border px-3 py-1.5 text-sm ${filters.categories.includes(c.id) ? 'bg-[#0F5132] text-white border-[#0F5132]' : 'border-[#0F5132]/20 text-[#0F5132] hover:bg-[#0F5132]/5'}`}
                onClick={() => setFilters((f:any)=> ({
                  ...f,
                  categories: filters.categories.includes(c.id)
                    ? f.categories.filter((x:string)=>x!==c.id)
                    : [...f.categories, c.id]
                }))}
              >
                {c.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-[#0F5132]/80">مرتب‌سازی:</label>
            <select
              className="rounded-xl border border-[#0F5132]/20 bg-white px-3 py-2 text-sm"
              value={filters.sort}
              onChange={(e)=> setFilters((f:any)=> ({...f, sort: e.target.value}))}
            >
              <option value="popular">محبوب‌ترین</option>
              <option value="price-asc">ارزان‌ترین</option>
              <option value="price-desc">گران‌ترین</option>
              <option value="rating-desc">بالاترین امتیاز</option>
            </select>
          </div>
        </section>

        {/* Products */}
        <section id="products" className="mt-4 sm:mt-6">
          <SectionHeader title="منتخب امروز" subtitle="قابل جست‌وجو، فیلتر و مرتب‌سازی" />
          {products.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#0F5132]/20 bg-white p-10 text-center text-[#0F5132]/70">
              موردی یافت نشد. فیلترها را تغییر دهید.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {products.map(p => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
          )}
        </section>

        {/* Newsletter */}
        <section className="my-10">
          <div className="rounded-2xl border border-[#0F5132]/10 bg-gradient-to-br from-[#FFF9E6] to-white p-6 sm:p-8">
            <h3 className="text-lg sm:text-2xl font-extrabold text-[#0F5132]">خبرنامه نئو</h3>
            <p className="mt-1 text-sm text-[#0F5132]/80">جدیدترین ترندهای دکوراسیون، تخفیف‌ها و الهام‌بخش‌ترین ایده‌ها را دریافت کنید.</p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <input className="w-full rounded-xl border border-[#0F5132]/20 bg-white px-3 py-2" placeholder="ایمیل شما" />
              <button className="rounded-xl bg-[#0F5132] px-4 py-2 font-bold text-white hover:bg-[#0B3D2E]">عضویت</button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#0F5132]/10 bg-white">
        <div className="mx-auto max-w-7xl px-3 sm:px-4 py-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm">
          <div>
            <div className="font-extrabold text-[#0F5132]">نئو دیزان گروپ</div>
            <p className="mt-2 text-[#0F5132]/70">فروشگاه آنلاین تخصصی دکوراسیون داخلی با ارسال سراسری.</p>
          </div>
          <div>
            <div className="font-bold text-[#0F5132] mb-2">دسترسی سریع</div>
            <ul className="space-y-1 text-[#0F5132]/80">
              <li><a href="#">راهنمای خرید</a></li>
              <li><a href="#">سؤالات متداول</a></li>
              <li><a href="#">تماس با ما</a></li>
            </ul>
          </div>
          <div>
            <div className="font-bold text-[#0F5132] mb-2">دسته‌ها</div>
            <ul className="space-y-1 text-[#0F5132]/80">
              {CATEGORIES.slice(0,5).map(c=> (
                <li key={c.id}><a href="#">{c.label}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="font-bold text-[#0F5132] mb-2">ارتباط</div>
            <ul className="space-y-1 text-[#0F5132]/80">
              <li>تلفن: ۰۲۱-۱۲۳۴۵۶</li>
              <li>ایمیل: hello@neodesign.group</li>
              <li>اینستاگرام: @neodesign.group</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[#0F5132]/10 py-4 text-center text-xs text-[#0F5132]/70">© {new Date().getFullYear()} Neo Design Group — تمام حقوق محفوظ است.</div>
      </footer>

      {/* Drawer */}
      <FiltersDrawer open={drawerOpen} onClose={()=>setDrawerOpen(false)} filters={filters} setFilters={setFilters} />
    </div>
  );
}
