/**
 * ПРИЁМ ЛИДОВ С САЙТА В GOOGLE-ТАБЛИЦУ
 * ===================================================================
 * Этот скрипт принимает данные из формы lead.html и добавляет строку
 * в таблицу. Деплоится как веб-приложение (Web App).
 *
 * КАК ПОДКЛЮЧИТЬ (один раз, ~3 минуты):
 *  1. Открой свою Google-таблицу.
 *  2. Меню: Расширения  ->  Apps Script.
 *  3. Удали весь код по умолчанию и вставь этот файл целиком.
 *  4. Сохрани (Ctrl+S).
 *  5. Нажми "Развернуть"  ->  "Новое развёртывание".
 *  6. Тип: выбери "Веб-приложение".
 *  7. "Запуск от имени": От моего имени.
 *     "У кого есть доступ": Все (Anyone).
 *  8. "Развернуть"  ->  разреши доступ (Authorize) своему аккаунту.
 *  9. Скопируй "URL веб-приложения" (заканчивается на /exec).
 * 10. Пришли этот URL мне - я вставлю его в форму (WEBHOOK_URL).
 *
 * После этого каждая заявка с сайта будет появляться новой строкой.
 * ===================================================================
 */

// Вкладка из твоей ссылки (gid=474108674). Если лист не найдётся - создастся "Лиды".
var SHEET_GID = 474108674;

// Колонки таблицы (порядок = порядок столбцов)
var HEADERS = [
  'Дата и время',
  'Имя',
  'Телефон',
  'Telegram',
  'О себе',
  'Цель',
  'Опыт с AI',
  'Готов(а) уделять',
  'UTM source',
  'UTM medium',
  'UTM campaign',
  'Страница'
];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000); // чтобы одновременные заявки не перезаписывали друг друга
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = getSheet_();

    // если лист пустой - добавляем шапку
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    var tz = SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetTimeZone();
    var stamp = Utilities.formatDate(new Date(), tz, 'dd.MM.yyyy HH:mm:ss');

    sheet.appendRow([
      stamp,
      data.name        || '',
      data.phone       || '',
      data.telegram    || '',
      data.about       || '',
      data.goal        || '',
      data.experience  || '',
      data.time        || '',
      data.utm_source  || '',
      data.utm_medium  || '',
      data.utm_campaign|| '',
      data.page        || ''
    ]);

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Проверка, что эндпоинт жив (открой /exec в браузере)
function doGet() {
  return ContentService.createTextOutput('Lead endpoint is live ✅');
}

// Находим нужный лист по gid, иначе создаём "Лиды"
function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    if (sheets[i].getSheetId() === SHEET_GID) return sheets[i];
  }
  return ss.getSheetByName('Лиды') || ss.insertSheet('Лиды');
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
