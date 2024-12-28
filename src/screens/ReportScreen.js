import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, FAB, Portal, Modal, Button, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import DailyReport from '../components/monitoring/DailyReport';
import DataAnalysisService from '../services/DataAnalysisService';
import UWBSimulatorService from '../services/UWBSimulatorService';

export default function ReportScreen({ route }) {
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);
  const [trends, setTrends] = useState(null);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [exportModalVisible, setExportModalVisible] = useState(false);

  const deviceId = route.params?.deviceId || 'default-device';
  const roomName = route.params?.roomName || 'Living Room';

  useEffect(() => {
    // Simula il caricamento dei dati
    const simulator = new UWBSimulatorService(deviceId, roomName);
    simulator.startSimulation();

    // Dopo un po' di tempo, genera il report con i dati simulati
    const timeout = setTimeout(() => {
      const dailyReport = DataAnalysisService.generateDailyReport(deviceId);
      
      // Simula i dati dei trend
      const trendData = generateTrendData();
      
      setReport(dailyReport);
      setTrends(trendData);
      setLoading(false);
      
      simulator.stopSimulation();
    }, 2000);

    return () => {
      clearTimeout(timeout);
      simulator.stopSimulation();
    };
  }, [deviceId, roomName]);

  // Genera dati simulati per i trend
  const generateTrendData = () => {
    const now = new Date();
    const agitationData = [];
    const presenceData = [];

    // Genera 24 ore di dati
    for (let i = 0; i < 24; i++) {
      const timestamp = new Date(now.getTime() - (23 - i) * 3600 * 1000);
      
      // Simula l'agitazione
      const baseAgitation = 30 + Math.random() * 20;
      const agitation = Math.min(100, Math.max(0, baseAgitation + (Math.random() - 0.5) * 30));
      
      agitationData.push({
        timestamp: timestamp.toISOString(),
        value: agitation
      });

      // Simula la presenza (1 = presente, 0 = assente)
      const isPresent = Math.random() > 0.2 ? 1 : 0; // 80% di probabilità di presenza
      presenceData.push({
        timestamp: timestamp.toISOString(),
        value: isPresent
      });
    }

    return {
      agitation: agitationData,
      presence: presenceData
    };
  };

  const handleShare = () => {
    // Implementare la condivisione del report
    setShareModalVisible(false);
  };

  const handleExport = () => {
    // Implementare l'esportazione del report
    setExportModalVisible(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Generating report...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <DailyReport report={report} trends={trends} />

      {/* FAB Menu */}
      <FAB
        icon="share-variant"
        style={styles.fab}
        onPress={() => setShareModalVisible(true)}
      />

      {/* Share Modal */}
      <Portal>
        <Modal
          visible={shareModalVisible}
          onDismiss={() => setShareModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Text style={styles.modalTitle}>Share Report</Text>
          <Button
            mode="contained"
            icon="email"
            onPress={handleShare}
            style={styles.modalButton}
          >
            Send via Email
          </Button>
          <Button
            mode="contained"
            icon="file-pdf-box"
            onPress={() => {
              setShareModalVisible(false);
              setExportModalVisible(true);
            }}
            style={styles.modalButton}
          >
            Export as PDF
          </Button>
          <Button
            mode="outlined"
            onPress={() => setShareModalVisible(false)}
            style={styles.modalButton}
          >
            Cancel
          </Button>
        </Modal>
      </Portal>

      {/* Export Modal */}
      <Portal>
        <Modal
          visible={exportModalVisible}
          onDismiss={() => setExportModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Text style={styles.modalTitle}>Export Options</Text>
          <Button
            mode="contained"
            icon="file-pdf-box"
            onPress={handleExport}
            style={styles.modalButton}
          >
            Detailed Report (PDF)
          </Button>
          <Button
            mode="contained"
            icon="microsoft-excel"
            onPress={handleExport}
            style={styles.modalButton}
          >
            Raw Data (Excel)
          </Button>
          <Button
            mode="outlined"
            onPress={() => setExportModalVisible(false)}
            style={styles.modalButton}
          >
            Cancel
          </Button>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalButton: {
    marginTop: 8,
  },
});
