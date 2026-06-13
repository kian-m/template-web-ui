import fetch from 'cross-fetch';

export type DataType = {
  v: string | null;
  f?: string;
};

export type CType = {
  c: DataType[];
};

export type SheetData = CType[];

export async function getSheetData() {
  const sheetId = '1zc_HJIBGEEFRzUbbXpogpDJRsoDWZZGkBmn6mbJW_II';
  const gid = '0'; // gid is the sheet number. The first sheet is 0, second is 1, and so on.
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&tq&gid=${gid}`;

  const response = await fetch(url);
  const data = await response.text();
  const jsonString = data.substring(47).slice(0, -2); // This trims the unwanted parts of the response
  const jsonData = JSON.parse(jsonString);

  return jsonData.table.rows;
}
