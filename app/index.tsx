import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  Modal,
  TouchableOpacity,
  ScrollView,
  Animated as RNAnimated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import PatternLock from '../components/PatternLock';
import { checkCanDonateToday, registerDonation, getBrandForToday } from '../utils/donationLogic';
import { TECHNIQUES, getTechniqueForToday, Technique } from '../utils/techniques';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function IndexScreen() {
  const [showTakeover, setShowTakeover] = useState(false);
  const [brandName, setBrandName] = useState('Solidarity Partner');
  const [canDonate, setCanDonate] = useState(false);
  const [alreadyDonated, setAlreadyDonated] = useState(false);
  const [matchedTechnique, setMatchedTechnique] = useState<Technique | null>(null);

  // Cycle through techniques — user can tap to switch
  const [currentTechIndex, setCurrentTechIndex] = useState(0);
  const currentTechnique = TECHNIQUES[currentTechIndex];

  // Animations
  const fadeAnim = useRef(new RNAnimated.Value(0)).current;
  const slideAnim = useRef(new RNAnimated.Value(30)).current;

  useEffect(() => {
    async function initCheck() {
      const allowed = await checkCanDonateToday();
      setCanDonate(allowed);
      setBrandName(getBrandForToday());
    }
    initCheck();

    // Entrance animation
    RNAnimated.parallel([
      RNAnimated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      RNAnimated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  const handlePatternSuccess = async (technique: Technique) => {
    setMatchedTechnique(technique);
    if (canDonate) {
      await registerDonation();
      setAlreadyDonated(false);
    } else {
      setAlreadyDonated(true);
    }
    setShowTakeover(true);
  };

  const cycleTechnique = () => {
    setCurrentTechIndex((prev) => (prev + 1) % TECHNIQUES.length);
  };

  const closeModal = async () => {
    setShowTakeover(false);
    const allowed = await checkCanDonateToday();
    setCanDonate(allowed);
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={['#1a0a1e', '#2d1035', '#4a1942', '#6b2055']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <RNAnimated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <Text style={styles.ribbon}>🎀</Text>
            <Text style={styles.headerTitle}>Unlock Health</Text>
            <Text style={styles.headerSubtitle}>Tu autoexamen diario, un gesto que salva vidas</Text>
          </RNAnimated.View>

          {/* Technique Card */}
          <RNAnimated.View style={[styles.techniqueCard, { opacity: fadeAnim }]}>
            <TouchableOpacity onPress={cycleTechnique} activeOpacity={0.8}>
              <View style={styles.techniqueHeader}>
                <Text style={styles.techniqueEmoji}>{currentTechnique.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.techniqueName}>Técnica {currentTechnique.name}</Text>
                  <Text style={styles.techniqueNameEn}>{currentTechnique.nameEn}</Text>
                </View>
                <View style={styles.techBadge}>
                  <Text style={styles.techBadgeText}>{currentTechIndex + 1}/{TECHNIQUES.length}</Text>
                </View>
              </View>
              <Text style={styles.techniqueDesc}>{currentTechnique.description}</Text>
              <View style={styles.tipContainer}>
                <Text style={styles.tipIcon}>💡</Text>
                <Text style={styles.tipText}>{currentTechnique.tip}</Text>
              </View>
              <Text style={styles.tapHint}>Toca para ver otra técnica →</Text>
            </TouchableOpacity>
          </RNAnimated.View>

          {/* Pattern Lock */}
          <View style={styles.patternContainer}>
            <PatternLock
              onSuccess={handlePatternSuccess}
              guidePath={currentTechnique.guidePath}
            />
          </View>

          {/* Instructions */}
          <View style={styles.instructionBar}>
            <Text style={styles.instructionText}>
              Sigue las líneas punteadas para aprender la técnica
            </Text>
          </View>

          {/* Footer branding */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Una iniciativa de <Text style={styles.footerBrand}>Fundayuda</Text></Text>
            <Text style={styles.footerSub}>Octubre es el mes de la concientización 🎀</Text>
          </View>
        </ScrollView>
      </LinearGradient>

      {/* Success Modal */}
      <Modal visible={showTakeover} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {/* Confetti-like accent */}
            <LinearGradient
              colors={alreadyDonated ? ['#667eea', '#764ba2'] : ['#f093fb', '#f5576c']}
              style={styles.modalAccent}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.modalAccentEmoji}>
                {alreadyDonated ? '💪' : '🎉'}
              </Text>
            </LinearGradient>

            <Text style={styles.modalTitle}>
              {alreadyDonated ? '¡Sigues mejorando!' : '¡Donación Desbloqueada!'}
            </Text>

            {matchedTechnique && (
              <View style={styles.matchedBadge}>
                <Text style={styles.matchedBadgeText}>
                  {matchedTechnique.emoji} Técnica {matchedTechnique.name}
                </Text>
              </View>
            )}

            <Text style={styles.modalText}>
              {alreadyDonated
                ? 'Tu donación de hoy ya fue registrada. La práctica constante es clave para detectar cambios a tiempo. ¡Vuelve mañana!'
                : `Has completado correctamente un patrón de autoexamen. Gracias a ti, nuestro patrocinador solidario de hoy:`}
            </Text>

            {!alreadyDonated && (
              <View style={styles.brandContainer}>
                <LinearGradient
                  colors={['#ffecd2', '#fcb69f']}
                  style={styles.brandGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.brandText}>{brandName}</Text>
                  <Text style={styles.donatedAmount}>ha donado $0.05</Text>
                  <Text style={styles.donatedTo}>a Fundayuda 🎀</Text>
                </LinearGradient>
              </View>
            )}

            <TouchableOpacity style={styles.modalButton} onPress={closeModal} activeOpacity={0.85}>
              <LinearGradient
                colors={['#f093fb', '#f5576c']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.buttonText}>
                  {alreadyDonated ? 'Seguir Practicando' : 'Continuar'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
  },

  // Header
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  ribbon: {
    fontSize: 40,
    marginBottom: 8,
  },
  headerTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    marginTop: 6,
    textAlign: 'center',
    fontWeight: '400',
  },

  // Technique Card
  techniqueCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    width: SCREEN_WIDTH - 40,
  },
  techniqueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  techniqueEmoji: {
    fontSize: 32,
  },
  techniqueName: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  techniqueNameEn: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 12,
    fontWeight: '500',
  },
  techBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  techBadgeText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    fontWeight: '600',
  },
  techniqueDesc: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 14,
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 200, 50, 0.08)',
    borderRadius: 12,
    padding: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 200, 50, 0.15)',
  },
  tipIcon: {
    fontSize: 16,
  },
  tipText: {
    color: 'rgba(255, 220, 100, 0.9)',
    fontSize: 13,
    flex: 1,
    lineHeight: 19,
  },
  tapHint: {
    color: 'rgba(255, 255, 255, 0.3)',
    fontSize: 11,
    textAlign: 'right',
    marginTop: 10,
  },

  // Pattern Area
  patternContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },

  // Instructions
  instructionBar: {
    paddingHorizontal: 30,
    marginBottom: 30,
  },
  instructionText: {
    color: 'rgba(255, 255, 255, 0.35)',
    fontSize: 13,
    textAlign: 'center',
    fontStyle: 'italic',
  },

  // Footer
  footer: {
    alignItems: 'center',
    paddingTop: 10,
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 13,
  },
  footerBrand: {
    color: '#f093fb',
    fontWeight: '700',
  },
  footerSub: {
    color: 'rgba(255, 255, 255, 0.25)',
    fontSize: 11,
    marginTop: 4,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: '#1e1028',
    borderRadius: 28,
    padding: 28,
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#f093fb',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 20,
  },
  modalAccent: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  modalAccentEmoji: {
    fontSize: 36,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: 'white',
    marginBottom: 12,
    textAlign: 'center',
  },
  matchedBadge: {
    backgroundColor: 'rgba(74, 230, 138, 0.12)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(74, 230, 138, 0.25)',
  },
  matchedBadgeText: {
    color: '#4AE68A',
    fontSize: 14,
    fontWeight: '600',
  },
  modalText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.65)',
    textAlign: 'center',
    lineHeight: 23,
    marginBottom: 24,
  },
  brandContainer: {
    width: '100%',
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  brandGradient: {
    padding: 20,
    alignItems: 'center',
  },
  brandText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#333',
    marginBottom: 4,
  },
  donatedAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
  },
  donatedTo: {
    fontSize: 14,
    color: '#777',
    marginTop: 2,
  },
  modalButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '700',
  },
});
