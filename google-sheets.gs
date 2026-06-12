/**
 * ПРИЁМ ЛИДОВ С САЙТА В GOOGLE-ТАБЛИЦУ
 * ===================================================================
 * Принимает данные из формы lead.html и добавляет строку в таблицу.
 * Работает, даже если таблица НЕ твоя - достаточно доступа "Редактор".
 * Скрипт открывает таблицу ПО ID, поэтому живёт в твоём аккаунте и
 * лезть в чужой файл не нужно.
 *
 * КАК ПОДКЛЮЧИТЬ (один раз, ~3 минуты):
 *  1. Зайди на script.google.com  ->  "Новый проект".
 *  2. Удали код по умолчанию и вставь этот файл целиком.
 *  3. Сохрани (Ctrl+S).
 *  4. "Развернуть"  ->  "Новое развёртывание".
 *  5. Тип (шестерёнка): "Веб-приложение".
 *  6. "Запуск от имени": От моего имени.
 *     "У кого есть доступ": Все (Anyone).
 *  7. "Развернуть"  ->  разреши доступ (Authorize) своему аккаунту.
 *     (Если пишет "приложение не проверено" -> Дополнительно -> Перейти.)
 *  8. Скопируй "URL веб-приложения" (заканчивается на /exec).
 *  9. Пришли этот URL мне - я вставлю его в форму (WEBHOOK_URL).
 *
 * ВАЖНО про доступ:
 *  - Аккаунт, под которым ты деплоишь, должен иметь доступ "Редактор"
 *    к таблице (быть владельцем НЕ обязательно).
 *  - Если доступа нет - попроси владельца добавить тебя редактором,
 *    либо пусть владелец сам развернёт этот скрипт у себя.
 * ===================================================================
 */

// ID таблицы (из ссылки: .../spreadsheets/d/<ВОТ_ЭТО>/edit)
var SPREADSHEET_ID = '18YY2JNmpYYAPojgCfXqgCcAL_be6Z-jscpc8HGk_2bQ';

// Вкладка из ссылки (gid=474108674). Если не найдётся - создастся лист "Лиды".
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
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = getSheet_(ss);

    // если лист пустой - добавляем шапку
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    var tz = ss.getSpreadsheetTimeZone();
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
function getSheet_(ss) {
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
