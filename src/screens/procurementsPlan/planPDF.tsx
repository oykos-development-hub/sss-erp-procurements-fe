import React from 'react';
import {Page, Text, Document, Font} from '@react-pdf/renderer';
import {styles} from '../../services/pdf/styles';
import {PDFTable} from '../../services/pdf/pdfTable';
import {PdfPlanData} from '../../types/graphql/getPlansTypes';
import VerticalTable from '../../services/pdf/pdfVerticalTable';

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

const tableData1 = {
  'Naziv naručioca': 'SEKRETARIJAT SUDSKOG SAVJETA',
  PIB: '02721040',
  'E-mail': 'javne.nabavke@sudstvo.me',
  Telefon: '020/231-124',
  'Internet adresa': 'www.sudovi.me',
  Fax: '020/231-128',
  Adresa: 'Miljana Vukova bb',
  Grad: 'Podgorica',
  'Poštanski broj': '81000',
};

const tableHeaders3 = [
  {key: 'id', header: ''},
  {key: 'article_type', header: 'Vrsta predmeta'},
  {key: 'title', header: 'Opis'},
  {key: 'total_gross', header: 'Vrijednost nabavke'},
  {key: 'total_vat', header: 'Vrijednost PDV'},
  {key: 'type_of_procedure', header: 'Vrsta postupka'},
  {key: 'budget_indent', header: 'Konto / Budžetska pozicija'},
  {key: 'funding_source', header: 'Izvor finansiranja'},
];

const PlanPDFDocument: React.FC<{data: PdfPlanData}> = ({data}) => {
  const tableData2 = {
    'Naslov plana': 'SEKRETARIJAT SUDSKOG SAVJETA',
    Status: 'Objavljen',
    Kontakt: '020/231-124',
    'Odgovorna osoba': 'Vesna Aćimic',
    Godina: data.year,
    'Datum objave': data.published_date,
    'Ukupna vrijednost plana': data.total_gross,
    'Ukupna vrijednost PDV': data.total_vat,
  };

  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.title}>Pregled plana #{data.plan_id}</Text>

        <Text style={[styles.subtitle, styles.bold]}>1 PODACI O NARUČIOCU</Text>
        <VerticalTable data={tableData1} />

        <Text style={[styles.subtitle, styles.bold]}>2 OSNOVNI PODACI</Text>
        <VerticalTable data={tableData2} />

        <Text style={styles.footer}>{new Date().toISOString().slice(0, 10)}</Text>
      </Page>
      <Page style={styles.page}>
        <Text style={[styles.subtitle, styles.bold]}>3 STAVKE PLANA</Text>
        <PDFTable headers={tableHeaders3} data={data.table_data} />

        <Text style={styles.footer}>{new Date().toISOString().slice(0, 10)}</Text>
      </Page>
    </Document>
  );
};

export default PlanPDFDocument;
