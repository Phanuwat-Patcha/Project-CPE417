// utils/availableRoomUtils.js
const { toMinutes } = require('./timeUtils'); // ถ้าอยากใช้ toMinutes เดียวกัน
// helper: convert minutes -> "HH:MM"
function minutesToHHMM(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  const hh = String(h).padStart(2, '0');
  const mm = String(m).padStart(2, '0');
  return `${hh}:${mm}`;
}

/**
 * existingBookings: อาเรย์ของรายการเวลาที่ถูกจองไปแล้ว  
 *   รูปแบบแต่ละรายการ: { start_time: "HH:MM", end_time: "HH:MM" }
 *
 * dayStart / dayEnd: เวลาเริ่มต้น–สิ้นสุดของวันที่ต้องการตรวจสอบ  
 *   (ปกติใช้เป็นช่วงเวลาทำการ เช่น 08:00 - 17:00 สามารถแก้ไขได้)
 *
 * minSlotMinutes: ระยะเวลา "ขั้นต่ำ" ของช่วงเวลาว่าง (เป็นนาที)  
 *   เช่น 30 หมายถึงต้องการให้ช่วงเวลาว่างมีอย่างน้อย 30 นาทีขึ้นไป
 *
 * ฟังก์ชันจะคืนค่า (return):  
 *   อาเรย์ของช่วงเวลาที่ว่าง โดยแต่ละรายการเป็นรูปแบบ:  
 *     { start: "HH:MM", end: "HH:MM" }
 *
 * ตัวอย่างผลลัพธ์:
 * [
 *   { start: "08:00", end: "09:30" },
 *   { start: "11:00", end: "12:00" }
 * ]
 */

function findAvailableSlots(existingBookings = [], dayStart = '00:00', dayEnd = '23:59', minSlotMinutes = 15) {
  // แปลงเป็น minutes และ sort by start
  const sDay = toMinutes(dayStart);
  const eDay = toMinutes(dayEnd);

  const slots = [];

  // normalize bookings: map to [s,e] in minutes, clamp to day
  const intervals = existingBookings.map(b => {
    const s = Math.max(sDay, toMinutes(b.start_time));
    const e = Math.min(eDay, toMinutes(b.end_time));
    return { s, e };
  })
  // filter invalid (end <= start)
  .filter(x => x.e > x.s)
  // sort
  .sort((a,b) => a.s - b.s);

  // merge overlapping intervals (safety)
  const merged = [];
  for (const iv of intervals) {
    if (!merged.length) { merged.push(iv); continue; }
    const last = merged[merged.length - 1];
    if (iv.s <= last.e) {
      // overlap -> extend
      last.e = Math.max(last.e, iv.e);
    } else {
      merged.push(iv);
    }
  }

  // scan gaps between dayStart -> merged[0].s, between merged -> merged, and merged[last].e -> dayEnd
  let cursor = sDay;
  for (const m of merged) {
    if (m.s - cursor >= minSlotMinutes) {
      slots.push({ start: minutesToHHMM(cursor), end: minutesToHHMM(m.s) });
    }
    cursor = Math.max(cursor, m.e);
  }
  // tail
  if (eDay - cursor >= minSlotMinutes) {
    slots.push({ start: minutesToHHMM(cursor), end: minutesToHHMM(eDay) });
  }

  return slots;
}

module.exports = { findAvailableSlots, minutesToHHMM };
