import React from 'react';
import {Page, Text, Document, Font} from '@react-pdf/renderer';
import {PdfData, SubtitleKey} from '../../../types/graphql/contractPDFTypes';
import {PDFTable, TableColumn} from '../../../services/pdf/pdfTable';
import {styles} from '../../../services/pdf/styles';

// Register custom fonts
Font.register({
  family: 'RobotoSlab',
  src: '/pdf-fonts/RobotoSlab-VariableFont_wght.ttf', // Adjust the path as needed
  fontWeight: 'bold',
});

Font.register({
  family: 'RobotoSlabBold',
  src: '/pdf-fonts/RobotoSlab-Bold.ttf',
});

const tableHeaders: TableColumn[] = [
  {key: 'procurement_item', header: 'OPIS PREDMETA NABAVKE'},
  {key: 'key_features', header: 'BITNE KARAKTERISTIKE'},
  {key: 'contracted_amount', header: 'UGOVORENA KOLIČINA'},
  {key: 'available_amount', header: 'DOSTUPNA KOLIČINA'},
  {key: 'consumed_amount', header: 'POTROŠENA KOLIČINA'},
];

const MyPdfDocument: React.FC<{data: PdfData}> = ({data}) => {
  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.title}>Izvještaj o potrošnji i dostupnim količinama</Text>

        {/* Subtitles */}
        <Text style={styles.subtitle}>JAVNA NABAVKA: {data.subtitles[SubtitleKey.PublicProcurement]}</Text>
        <Text style={styles.subtitle}>ORGANIZACIONA JEDINICA: {data.subtitles[SubtitleKey.OrganizationUnit]}</Text>
        <Text style={styles.subtitle}>DOBAVLJAČ: {data.subtitles[SubtitleKey.Supplier]}</Text>

        <PDFTable headers={tableHeaders} data={data.table_data} />

        {/* Footer */}
        <Text style={styles.footer}>{new Date().toISOString().slice(0, 10)}</Text>
      </Page>
    </Document>
  );
};

export default MyPdfDocument;
