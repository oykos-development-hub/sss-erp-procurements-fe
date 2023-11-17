import React from 'react';
import {View, Text} from '@react-pdf/renderer';
import {StyleSheet} from '@react-pdf/renderer';

export interface TableColumn {
  key: string;
  header: string;
}

export interface TableRow {
  [key: string]: string | number;
}

interface PDFTableProps {
  headers: TableColumn[];
  data: TableRow[];
}

export const styles = StyleSheet.create({
  table: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 20,
    borderLeft: 1,
    borderColor: '#000',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center', 
    borderBottom: 1,
    borderColor: '#000',
  },
  firstRow: {
    borderTopWidth: 1,
  },
  tableCell: {
    flex: 1,
    fontSize: 9,
    padding: 5,
    borderRightWidth: 1,
    borderColor: '#000',
    height: '100%'
  },
  headerCell: {
    fontWeight: 'bold',
    fontSize: 9,
    backgroundColor: '#eee',
  },
});

export const PDFTable: React.FC<PDFTableProps> = ({headers, data}) => (
  <View style={styles.table}>
    <View style={[styles.tableRow, styles.firstRow]}>
      {headers.map((header, index) => (
        <Text key={index} style={[styles.tableCell, styles.headerCell]}>
          {header.header}
        </Text>
      ))}
    </View>
    {data.map((row, index) => (
      <View key={index} style={styles.tableRow}>
        {headers.map((header, cellIndex) => (
          <Text key={cellIndex} style={styles.tableCell}>
            {row[header.key]}
          </Text>
        ))}
      </View>
    ))}
  </View>
);
