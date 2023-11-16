import {TableRow} from '../../services/pdf/pdfTable';
import {SingularResponse} from './utils';

export enum SubtitleKey {
  PublicProcurement = 'public_procurement',
  OrganizationUnit = 'organization_unit',
  Supplier = 'supplier',
}

export interface PdfData {
  subtitles: Record<SubtitleKey, string>;
  table_data: TableRow[];
}

export interface ContractPDFResponse {
  publicProcurementPlanItem_PDF: SingularResponse<PdfData>;
}
