import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  Search,
  ShoppingBag,
  Menu,
  X,
  Plus,
  Minus,
  Leaf,
  Sun,
  Citrus,
  Truck,
  ChevronDown,
} from "lucide-react";
import { products, money } from "../data/products";

const categories = ["Усі смаки", "Цитрусові", "Ягідні", "Фруктові мікси"];
const questions = [
  [
    "Коли можна буде замовити сік?",
    "Ми готуємо асортимент до запуску. Щойно товари з’являться в каталозі, ви зможете переглянути смаки, об’єм і ціни у гривнях.",
  ],
  [
    "Як відбуватиметься доставка?",
    "Способи доставки, географію та її вартість опублікуємо перед початком продажів. Наразі магазин не приймає замовлення.",
  ],
  [
    "Де знайти склад та умови зберігання?",
    "Після запуску інформація про склад, термін придатності та умови зберігання буде доступна на сторінці кожного товару.",
  ],
];

export default function Store() {
  const [category, setCategory] = useState("Усі смаки");
  const [panel, setPanel] = useState<"cart" | "search" | null>(null);
  const [menu, setMenu] = useState(false);
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<Record<string, number>>(() => {
    try {
      return JSON.parse(localStorage.getItem("sok-cart") || "{}");
    } catch {
      return {};
    }
  });
  const closeRef = useRef<HTMLButtonElement>(null);
  const count = products.reduce((sum, p) => sum + (cart[p.id] || 0), 0);
  const total = products.reduce((sum, p) => sum + p.price * (cart[p.id] || 0), 0);
  const filtered = products.filter(
    (p) =>
      (category === "Усі смаки" || p.category === category) &&
      p.name.toLowerCase().includes(query.toLowerCase()),
  );
  const update = (id: string, delta: number) =>
    setCart((c) => ({ ...c, [id]: Math.max(0, (c[id] || 0) + delta) }));
  useEffect(() => {
    localStorage.setItem("sok-cart", JSON.stringify(cart));
  }, [cart]);
  useEffect(() => {
    if (!panel) return;
    const previous = document.activeElement as HTMLElement;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPanel(null);
      if (e.key === "Tab") {
        const elements = Array.from(
          document.querySelectorAll<HTMLElement>(".dialog button, .dialog input, .dialog a"),
        );
        const first = elements[0],
          last = elements[elements.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handler);
      previous?.focus();
    };
  }, [panel]);

  return (
    <>
      <div className="announcement">
        Трохи сонця. Багато смаку. <span>Знайомтеся з СОК.</span>
        <Sun size={13} />
      </div>
      <header className="header" id="top">
        <button
          className="icon mobile-menu"
          aria-label="Відкрити меню"
          onClick={() => setMenu(!menu)}
        >
          {menu ? <X /> : <Menu />}
        </button>
        <nav className={menu ? "nav open" : "nav"}>
          {[
            ["Каталог", "#catalog"],
            ["Про нас", "#about"],
            ["Доставка", "#delivery"],
          ].map(([label, href]) => (
            <a key={href} href={href} onClick={() => setMenu(false)}>
              {label}
            </a>
          ))}
        </nav>
        <a className="logo" href="#top" aria-label="СОК — головна">
          сок<span className="logo-dot">.</span>
          <small>FRUIT FIRST</small>
        </a>
        <div className="header-tools">
          <span className="locale">UA / ₴</span>
          <button className="icon" aria-label="Пошук" onClick={() => setPanel("search")}>
            <Search size={20} />
          </button>
          <button
            className="cart-button"
            onClick={() => setPanel("cart")}
            aria-label={`Кошик, ${count} товарів`}
          >
            <ShoppingBag size={20} />
            <span className="cart-label">Кошик</span>
            <b>{count}</b>
          </button>
        </div>
      </header>

      <main>
        <section className="hero">
          <img
            className="hero-photo"
            src="/images/citrus.jpg"
            alt="Скибочки апельсина та свіжий цитрусовий сік на сонячно-жовтому фоні"
          />
          <div className="hero-content">
            <p className="eyebrow">
              <span /> СОНЯЧНИЙ НАСТРІЙ У КОЖНОМУ КОВТКУ
            </p>
            <h1>
              Більше фруктів.
              <br />
              Більше <span>життя.</span>
            </h1>
            <p className="hero-description">
              Для повільних ранків, яскравих перерв
              <br className="desktop-break" /> і маленьких моментів, що смакують.
            </p>
            <a className="button dark" href="#catalog">
              Знайти свій смак <ArrowUpRight size={19} />
            </a>
            <div className="hero-foot">
              <span className="little-star">✳</span>
              <span>
                Фрукти в центрі.
                <br />
                Задоволення — у деталях.
              </span>
            </div>
          </div>
          <div className="round-stamp">
            <span>НАЛИЙ СОБІ</span>
            <Sun size={33} strokeWidth={1.3} />
            <span>ТРОХИ СОНЦЯ</span>
          </div>
          <span className="hero-caption">СМАКУЙ МОМЕНТ — СОК.</span>
        </section>
        <div className="ticker" aria-hidden="true">
          <span>ФРУКТИ В ЦЕНТРІ</span>
          <span>✳</span>
          <span>СОНЦЕ В СКЛЯНЦІ</span>
          <span>✳</span>
          <span>ТВІЙ СМАЧНИЙ МОМЕНТ</span>
          <span>✳</span>
          <span>ФРУКТИ В ЦЕНТРІ</span>
          <span>✳</span>
        </div>

        <section className="values section-wrap" aria-label="Наш підхід">
          <article>
            <Citrus />
            <div>
              <h3>Смак понад усе</h3>
              <p>
                Від знайомих фруктів до несподіваних
                <br /> поєднань. Знайди те, що до душі.
              </p>
            </div>
          </article>
          <article>
            <Sun />
            <div>
              <h3>Маленька пауза для себе</h3>
              <p>
                До сніданку, на прогулянці чи просто так.
                <br /> Кожен момент може бути смачнішим.
              </p>
            </div>
          </article>
          <article>
            <Leaf />
            <div>
              <h3>Усе важливе — відкрито</h3>
              <p>
                Склад, об’єм і деталі кожного соку —<br /> у картці товару після запуску.
              </p>
            </div>
          </article>
        </section>

        <section id="catalog" className="catalog section-wrap">
          <div className="section-heading">
            <div>
              <p className="eyebrow">ОБИРАЙ ЗА НАСТРОЄМ</p>
              <h2>
                Твій наступний
                <br className="mobile-break" /> улюблений сік.
              </h2>
            </div>
            <span className="catalog-count">
              {products.length} товарів <ArrowDownIcon />
            </span>
          </div>
          <div className="catalog-toolbar">
            <div className="filters">
              {categories.map((c) => (
                <button
                  key={c}
                  className={category === c ? "active" : ""}
                  onClick={() => setCategory(c)}
                >
                  {c}
                </button>
              ))}
            </div>
            <span className="currency">Ціни в гривнях · ₴</span>
          </div>
          {filtered.length ? (
            <div className="product-grid">
              {filtered.map((p) => (
                <article className="product" key={p.id}>
                  <img src={p.image} alt={p.name} />
                  <small>
                    {p.category} · {p.volume}
                  </small>
                  <h3>{p.name}</h3>
                  {p.description && <p>{p.description}</p>}
                  <div>
                    <strong>{money(p.price)}</strong>
                    <button className="button dark" onClick={() => update(p.id, 1)}>
                      До кошика <Plus size={18} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-catalog">
              <div className="empty-art">
                <Citrus size={56} strokeWidth={1} />
                <span className="art-leaf">
                  <Leaf size={25} />
                </span>
              </div>
              <p className="eyebrow">ХОРОШЕ ПОПЕРЕДУ</p>
              <h3>
                {query
                  ? "Цього смаку ще немає"
                  : category === "Усі смаки"
                    ? "Нові смаки вже на підході"
                    : `${category}: незабаром у каталозі`}
              </h3>
              <p>
                Готуємо для вас дещо соковите.
                <br />
                Скоро тут з’явиться наша колекція фруктових соків.
              </p>
              <span className="coming-badge">
                <span /> Незабаром
              </span>
            </div>
          )}
        </section>

        <section id="about" className="story section-wrap">
          <div className="story-image">
            <img
              src="/images/oranges.jpg"
              alt="Свіжі скибочки апельсинів крупним планом"
              loading="lazy"
            />
            <span>ПРОСТО. ЯСКРАВО. СОКОВИТО.</span>
          </div>
          <div className="story-content">
            <p className="eyebrow">ЗНАЙОМТЕCЯ, МИ — СОК.</p>
            <h2>
              Не просто напій.
              <br />
              Твоя маленька
              <br />
              <span>сонячна звичка.</span>
            </h2>
            <p>
              Ми любимо фрукти. Їхні кольори, аромати й те, як один ковток може змінити настрій
              цілого дня.
            </p>
            <p>
              СОК — це простір для смаків, які хочеться зробити частиною своїх щоденних ритуалів.
              Без зайвих слів. Просто із задоволенням.
            </p>
            <a className="text-link" href="#catalog">
              Зазирнути в каталог <ArrowUpRight size={20} />
            </a>
          </div>
        </section>

        <section id="delivery" className="delivery section-wrap">
          <div>
            <p className="eyebrow">УСЕ, ЩО ВАРТО ЗНАТИ</p>
            <h2>
              Від нас.
              <br />
              До твого столу.
            </h2>
            <p>
              Магазин готується до запуску.
              <br />
              Відповідаємо на перші запитання.
            </p>
            <Truck size={44} strokeWidth={1.1} />
          </div>
          <div className="faq">
            {questions.map(([q, a]) => (
              <details key={q}>
                <summary>
                  {q}
                  <Plus size={20} />
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <footer>
        <div className="footer-top">
          <a className="footer-logo" href="#top">
            сок.
          </a>
          <p>
            Більше смаку.
            <br />
            Менше буденності.
          </p>
          <div>
            <a href="#catalog">Каталог</a>
            <a href="#about">Про нас</a>
            <a href="#delivery">Доставка та запитання</a>
          </div>
          <div className="footer-note">
            <Sun size={30} />
            <span>
              Зроби день
              <br />
              трохи соковитішим.
            </span>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} СОК. Усі права захищені.</span>
          <span>Україна · Українська · UAH ₴</span>
          <a href="#top">
            Нагору <ArrowUpRight size={14} />
          </a>
        </div>
      </footer>

      {panel && (
        <div className="overlay">
          <button className="overlay-backdrop" aria-label="Закрити вікно" onClick={() => setPanel(null)} />
          <dialog
            open
            aria-modal="true"
            aria-label={panel === "cart" ? "Кошик" : "Пошук"}
            className={`dialog ${panel}`}
          >
            <div className="dialog-title">
              <h2>{panel === "cart" ? "Твій кошик" : "Знайди свій смак"}</h2>
              <button
                ref={closeRef}
                className="icon"
                aria-label="Закрити"
                onClick={() => setPanel(null)}
              >
                <X />
              </button>
            </div>
            {panel === "search" ? (
              <>
                <label className="search-input">
                  <Search size={20} />
                  <input
                      aria-label="Назва соку або смак"
                    autoFocus
                    placeholder="Назва соку або смак…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </label>
                <p className="search-message">
                  {products.length
                    ? `Знайдено товарів: ${filtered.length}`
                    : "Каталог ще готується. Смаки з’являться незабаром."}
                </p>
                <a className="button dark" href="#catalog" onClick={() => setPanel(null)}>
                  Перейти до каталогу <ArrowRight size={18} />
                </a>
              </>
            ) : count ? (
              <>
                <div className="cart-items">
                  {products
                    .filter((p) => cart[p.id] > 0)
                    .map((p) => (
                      <div className="cart-item" key={p.id}>
                        <img src={p.image} alt={p.name} />
                        <div>
                          <h3>{p.name}</h3>
                          <p>{money(p.price)}</p>
                          <div className="quantity">
                            <button
                              aria-label={`Зменшити кількість ${p.name}`}
                              onClick={() => update(p.id, -1)}
                            >
                              <Minus size={16} />
                            </button>
                            <span>{cart[p.id]}</span>
                            <button
                              aria-label={`Збільшити кількість ${p.name}`}
                              onClick={() => update(p.id, 1)}
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
                <div className="cart-total">
                  <span>Разом</span>
                  <strong>{money(total)}</strong>
                </div>
                <p>Оформлення замовлень буде доступне після запуску магазину.</p>
              </>
            ) : (
              <div className="empty-cart">
                <ShoppingBag size={56} strokeWidth={1} />
                <h3>Тут поки порожньо</h3>
                <p>
                  Твій наступний улюблений сік
                  <br />
                  незабаром з’явиться в каталозі.
                </p>
                <a className="button dark" href="#catalog" onClick={() => setPanel(null)}>
                  До каталогу <ArrowRight size={18} />
                </a>
              </div>
            )}
          </dialog>
        </div>
      )}
    </>
  );
}
function ArrowDownIcon() {
  return <ChevronDown size={16} />;
}
