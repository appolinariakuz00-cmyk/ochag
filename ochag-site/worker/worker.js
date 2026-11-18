// Cloudflare Worker: принимает заявку с сайта и отправляет её в Telegram.
// Секреты (TG_TOKEN, TG_CHAT_ID) хранятся в настройках Worker, а не в коде сайта.
// Переменная ALLOWED_ORIGIN = адрес вашего сайта, например https://username.github.io

const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export default {
  async fetch(request, env) {
    const cors = {
      "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN || "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };
    const reply = (obj, status = 200) =>
      new Response(JSON.stringify(obj), { status, headers: { ...cors, "Content-Type": "application/json" } });

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (request.method !== "POST") return reply({ ok: false }, 405);

    let b;
    try { b = await request.json(); } catch { return reply({ ok: false }, 400); }

    if (b.website) return reply({ ok: true }); // ловушка для ботов

    const name = String(b.name || "").trim();
    const phone = String(b.phone || "").trim();
    const digits = phone.replace(/\D/g, "");
    const guests = parseInt(b.guests, 10);
    const note = String(b.note || "").trim().slice(0, 300);

    if (name.length < 2 || name.length > 60) return reply({ ok: false, error: "name" }, 400);
    if (digits.length < 10 || digits.length > 15) return reply({ ok: false, error: "phone" }, 400);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(b.date || "")) return reply({ ok: false, error: "date" }, 400);
    if (!/^\d{1,2}:\d{2}$/.test(b.time || "")) return reply({ ok: false, error: "time" }, 400);
    if (!(guests >= 1 && guests <= 10)) return reply({ ok: false, error: "guests" }, 400);

    const text =
      "🔥 <b>Новая бронь · ОЧАГ</b>\n\n" +
      `👤 ${esc(name)}\n📞 ${esc(phone)}\n📅 ${esc(b.date)} в ${esc(b.time)}\n👥 Гостей: ${guests}` +
      (note ? `\n💬 ${esc(note)}` : "");

    const tg = await fetch(`https://api.telegram.org/bot${env.TG_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: env.TG_CHAT_ID, text, parse_mode: "HTML" }),
    });

    return tg.ok ? reply({ ok: true }) : reply({ ok: false }, 502);
  },
};
