# ОЧАГ: сайт ресторана

В папке: `index.html`, `images/` (фото), `og-image.jpg` (картинка для превью ссылки),
`robots.txt`, `sitemap.xml`, `worker/worker.js` (приём заявок в Telegram).

## 1. Заявки в Telegram

Токен бота нельзя класть в код сайта: его увидит любой посетитель. Поэтому заявки идут через маленький сервер (Worker), где токен хранится в секрете.

1. В Telegram откройте **@BotFather**, отправьте `/newbot`, придумайте имя. Он выдаст **токен**.
2. Напишите своему новому боту любое сообщение (например, `/start`).
3. Узнайте свой **chat id**: напишите боту **@userinfobot**, он ответит числом.
4. Зарегистрируйтесь на cloudflare.com, откройте **Workers & Pages → Create → Worker**, вставьте код из `worker/worker.js` и нажмите **Deploy**.
5. В настройках Worker (**Settings → Variables and Secrets**) добавьте:
   - `TG_TOKEN` — токен бота (тип Secret)
   - `TG_CHAT_ID` — ваш chat id (тип Secret)
   - `ALLOWED_ORIGIN` — адрес вашего сайта, например `https://username.github.io`
6. Скопируйте адрес Worker (вида `https://имя.аккаунт.workers.dev`) и вставьте в `index.html`:
   ```js
   var CONFIG={ BOOKING_ENDPOINT:"https://имя.аккаунт.workers.dev" };
   ```
7. Отправьте тестовую бронь на сайте: сообщение придёт вам в Telegram.

Пока `BOOKING_ENDPOINT` пустой, форма работает в демо-режиме (только показывает подтверждение).

## 2. Публикация на GitHub Pages (бесплатно)

1. Создайте репозиторий на github.com (например, `ochag`), загрузите все файлы из этой папки (кроме `worker/` при желании).
2. **Settings → Pages → Build and deployment → Deploy from a branch → main / (root) → Save**.
3. Через 1–2 минуты сайт откроется по адресу `https://ВАШ-ЛОГИН.github.io/ochag/`.

## 3. SEO и превью ссылки

Во всех местах замените `https://YOUR-DOMAIN` на реальный адрес сайта:
`index.html` (canonical, og:, twitter:, JSON-LD), `sitemap.xml`, `robots.txt`.
Если сайт лежит в подпапке (`/ochag/`), добавьте её к адресам, а картинку превью проверьте по полному пути.

После публикации:
- проверьте, как выглядит ссылка в Telegram (отправьте её себе);
- добавьте сайт в Яндекс Вебмастер и Google Search Console, отправьте `sitemap.xml`;
- замените вымышленные адрес и телефон на настоящие (в тексте страницы и в JSON-LD).
