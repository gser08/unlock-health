import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, StatusBar, Modal, TouchableOpacity } from 'react-native';
import PatternLock from '../components/PatternLock';
import { checkCanDonateToday, registerDonation, getBrandForToday } from '../utils/donationLogic';

export default function IndexScreen() {
  const [showTakeover, setShowTakeover] = useState(false);
  const [brandName, setBrandName] = useState("Solidarity Partner");
  const [canDonate, setCanDonate] = useState(false);
  const [alreadyDonated, setAlreadyDonated] = useState(false);

  useEffect(() => {
    async function initCheck() {
      const allowed = await checkCanDonateToday();
      setCanDonate(allowed);
      setBrandName(getBrandForToday());
    }
    initCheck();
  }, [showTakeover]); // Re-check when modal closes

  const handlePatternSuccess = async () => {
    if (canDonate) {
      const success = await registerDonation();
      if (success) {
        setAlreadyDonated(false);
        setShowTakeover(true);
      }
    } else {
      // User already donated today (or it's not October)
      setAlreadyDonated(true);
      setShowTakeover(true);
    }
  };

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
        
        <PatternLock onSuccess={handlePatternSuccess} />
      </View>

      <Modal
        visible={showTakeover}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            {alreadyDonated ? "¡Sigues mejorando!" : "¡Logrado!"}
          </Text>
          
          <Text style={styles.modalText}>
            {alreadyDonated 
              ? "Tu donación de hoy ya fue registrada, pero la práctica hace al maestro. Vuelve mañana para desbloquear otra donación."
              : `¡Gracias por cuidar tu salud! Cientos de mujeres te lo agradecen. Hoy, nuestro patrocinador solidario:`}
          </Text>

          {!alreadyDonated && (
            <View style={styles.brandBox}>
              <Text style={styles.brandText}>{brandName}</Text>
              <Text style={styles.donatedText}>ha donado $0.05 a Fundayuda</Text>
            </View>
          )}

          <TouchableOpacity style={styles.button} onPress={() => setShowTakeover(false)}>
            <Text style={styles.buttonText}>Aceptar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F494B7',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 40,
  },
  brandBox: {
    padding: 20,
    backgroundColor: '#f8f8f8',
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
    borderWidth: 1,
    borderColor: '#eee',
  },
  brandText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  donatedText: {
    fontSize: 16,
    color: '#666',
  },
  button: {
    backgroundColor: '#F494B7',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  }
});
