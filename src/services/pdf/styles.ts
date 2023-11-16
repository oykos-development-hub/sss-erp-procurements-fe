import {StyleSheet} from '@react-pdf/renderer';

export const styles = StyleSheet.create({
  page: {
    padding: 50,
  },
  title: {
    fontFamily: 'RobotoSlabBold',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'RobotoSlab',
    fontSize: 14,
    marginVertical: 10,
  },
  footer: {
    position: 'absolute',
    fontSize: 10,
    bottom: 20,
    left: 50,
    right: 0,
    textAlign: 'left',
    color: '#3F444C',
  },

  table: {
    fontFamily: 'RobotoSlab',
    display: 'flex',
    flexDirection: 'column',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#000',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#000',
  },
  tableCell: {
    flex: 1,
    fontSize: 10,
    padding: 5,
    borderRightWidth: 1,
    borderColor: '#000',
  },
  headerCell: {
    fontWeight: 'bold',
    fontSize: 10,
    backgroundColor: '#eee',
  },
});
