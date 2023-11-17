import {StyleSheet} from '@react-pdf/renderer';

export const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontFamily: 'RobotoSlab',
  },
  title: {
    fontFamily: 'RobotoSlabBold',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    marginVertical: 10,
  },
  bold: {
    fontFamily: 'RobotoSlabBold',
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
});
