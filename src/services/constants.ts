import {DropdownDataString} from '../types/dropdownData';
import {PdfData} from '../types/graphql/contractPDFTypes';
import {PdfPlanData} from '../types/graphql/getPlansTypes';

export const MICRO_SERVICE_SLUG = 'procurements';

export enum REQUEST_STATUSES {
  success = 'success',
  error = 'error',
  // define other statuses here
}

export const BFF_URL = {
  local: 'http://localhost:8080',
  development: 'https://sss-erp-bff.oykos.me',
  staging: 'http://localhost:8080',
  production: 'http://localhost:8080',
};

export const yearsForDropdown = (maxOffset = 10, isFilter = true, nextYears = 0): DropdownDataString[] => {
  const thisYear = new Date().getFullYear() + nextYears;
  const allYears: DropdownDataString[] = isFilter ? [{id: '', title: 'Sve'}] : [];
  allYears.push(
    ...Array.from({length: maxOffset}, (_, index) => {
      const yearValue = thisYear - index;
      return {id: yearValue.toString(), title: yearValue.toString()};
    }),
  );
  return allYears;
};

export const downloadPDF = (blob: Blob | null, pdfData?: PdfData | PdfPlanData) => {
  let name = 'Izvještaj.pdf';
  if (pdfData && 'subtitles' in pdfData) {
    const organization_unit = pdfData?.subtitles?.organization_unit
      ? pdfData?.subtitles?.organization_unit.replaceAll(' ', '_')
      : 'Sve';
    const public_procurement = pdfData?.subtitles?.public_procurement
      ? pdfData?.subtitles?.public_procurement.replaceAll(' ', '_')
      : '';
    name = `Izvještaj_${organization_unit}_${public_procurement}.pdf`;
  } else if (pdfData && 'plan_id' in pdfData) {
    const year = pdfData?.year ? pdfData?.year : 'Sve';
    name = `Plan_za_${year}.pdf`;
  }

  if (blob === null) return;
  const blobUrl = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = name;
  link.style.display = 'none';
  document.body.appendChild(link);

  link.click();

  URL.revokeObjectURL(blobUrl);
};
