import Papa from "papaparse";
import { csvImportSchema, type CsvRow } from "./validations";

export interface ParseCsvResult {
  rows: CsvRow[];
  errors: string[];
}

/**
 * Parse a CSV file (or string) into validated metric rows.
 * Expected columns: name, value, unit (optional), timestamp (optional)
 */
export function parseCsvText(text: string): ParseCsvResult {
  const { data, errors: parseErrors } = Papa.parse<Record<string, string>>(
    text.trim(),
    {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim().toLowerCase(),
    }
  );

  if (parseErrors.length > 0) {
    return {
      rows: [],
      errors: parseErrors.map((e) => `Row ${e.row}: ${e.message}`),
    };
  }

  const result = csvImportSchema.safeParse(data);

  if (!result.success) {
    const errors = result.error.issues.map((i) => {
      const path = i.path.join(".");
      return `${path}: ${i.message}`;
    });
    return { rows: [], errors };
  }

  return { rows: result.data, errors: [] };
}

/**
 * Parse a File object (browser) to validated metric rows.
 */
export async function parseCsvFile(file: File): Promise<ParseCsvResult> {
  const text = await file.text();
  return parseCsvText(text);
}
