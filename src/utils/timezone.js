/**
 * Convierte una fecha y hora locales de una zona horaria IANA en un instante UTC
 * sin dependencias externas (usa Intl para obtener el desfase).
 */
function getOffsetMs(date, timeZone) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(date);
  const map = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  const asUtc = Date.UTC(
    Number(map.year),
    Number(map.month) - 1,
    Number(map.day),
    Number(map.hour),
    Number(map.minute),
    Number(map.second)
  );
  return asUtc - date.getTime();
}

function zonedTimeToUtc(dateStr, timeStr, timeZone) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hour, minute] = (timeStr || '00:00').split(':').map(Number);
  const naiveUtc = Date.UTC(year, month - 1, day, hour, minute, 0);
  // Dos pasadas para ajustar correctamente en cambios de horario.
  let offset = getOffsetMs(new Date(naiveUtc), timeZone);
  let result = naiveUtc - offset;
  const secondOffset = getOffsetMs(new Date(result), timeZone);
  if (secondOffset !== offset) result = naiveUtc - secondOffset;
  return new Date(result);
}

module.exports = { zonedTimeToUtc };
