import React from 'react';
import {View, Text, StyleSheet} from '@react-pdf/renderer';

interface VerticalTableProps {
  data: Record<string, string | number>;
}

const VerticalTable: React.FC<VerticalTableProps> = ({data}) => {
  const entries = Object.entries(data);
  return (
    <View style={styles.container}>
      {entries.map(([key, value], index) => (
        <View style={[styles.row, index === 0 ? styles.firstRow : {}]} key={key}>
          <Text style={styles.key}>{key}:</Text>
          <Text style={styles.value}>{value}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
    borderBottom: 1,
    borderColor: 'black',
    borderRight: 1,
    borderLeft: 1,
  },
  firstRow: {
    borderTopWidth: 1,
  },
  key: {
    fontWeight: 'bold',
    marginRight: 5,
    fontSize: 10,
    backgroundColor: '#F3FFF8',
    width: '25%',
    padding: 6,
    borderRight: 1,
    borderColor: 'black',
  },
  value: {
    fontSize: 10,
    padding: 6,
  },
});

export default VerticalTable;
