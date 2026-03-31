import React from 'react';
import { StyleSheet, View, Text, StatusBar } from 'react-native';

export default function IndexScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#F494B7" />
      <View style={styles.header}>
        <Text style={styles.headerText}>fundayuda</Text>
      </View>
      
      <View style={styles.mainContent}>
        <Text style={styles.instructionText}>
          El mismo patrón que abre tu celular puede salvar tu vida.
        </Text>
        
        {/* Placeholder for the 9-dot grid */}
        <View style={styles.gridPlaceholder}>
          {[...Array(9)].map((_, i) => (
            <View key={i} style={styles.dotPlaceholder} />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F494B7',
  },
  header: {
    marginTop: 60,
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  instructionText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 60,
    fontWeight: '500',
  },
  gridPlaceholder: {
    width: 280,
    height: 280,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'space-between',
  },
  dotPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
