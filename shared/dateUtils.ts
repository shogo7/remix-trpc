// shared/dataUtils.ts
import dayjs from "dayjs";

export function formatDate(date: Date | string, format: string = "YYYY-MM-DD") {
  // ハート付き日付フォーマット関数
  const formattedDate = dayjs(date).format(format);
  
  // 数字をハート付きに変換
  return formattedDate.replace(/[0-9]/g, digit => {
    return digit + "❤️";
  });
}