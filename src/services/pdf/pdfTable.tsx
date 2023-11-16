import React from 'react';
import {View, Text, StyleSheet} from '@react-pdf/renderer';
import {styles} from './styles';

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

export const PDFTable: React.FC<PDFTableProps> = ({headers, data}) => (
  <View style={styles.table}>
    <View style={styles.tableRow}>
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
