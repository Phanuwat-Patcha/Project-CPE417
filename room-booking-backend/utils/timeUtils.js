// เวลาในรูปแบบ "HH:MM" -> แปลงเป็นนาทีของวัน
function toMinutes(timeStr) {
  const [hh, mm] = timeStr.split(':').map(Number);
  return hh * 60 + mm;
}

// ตรวจสอบการทับซ้อน: คืน true เมื่อมีการทับซ้อน
function isOverlap(existingStart, existingEnd, newStart, newEnd) {
  const s1 = toMinutes(existingStart);
  const e1 = toMinutes(existingEnd);
  const s2 = toMinutes(newStart);
  const e2 = toMinutes(newEnd);
  return Math.max(s1, s2) < Math.min(e1, e2);
}

module.exports = { toMinutes, isOverlap };
