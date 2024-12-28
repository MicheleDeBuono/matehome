import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Surface, Text, Divider, List, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TrendCharts from './TrendCharts';

const StatisticCard = ({ title, value, icon, description }) => {
  const theme = useTheme();
  
  return (
    <Surface style={styles.statCard}>
      <View style={styles.statHeader}>
        <MaterialCommunityIcons name={icon} size={24} color={theme.colors.primary} />
        <Text style={styles.statTitle}>{title}</Text>
      </View>
      <Text style={styles.statValue}>{value}</Text>
      {description && (
        <Text style={styles.statDescription}>{description}</Text>
      )}
    </Surface>
  );
};

export default function DailyReport({ report, trends }) {
  if (!report) {
    return (
      <View style={styles.noDataContainer}>
        <MaterialCommunityIcons name="chart-timeline-variant" size={48} color="#666" />
        <Text style={styles.noDataText}>No report data available</Text>
      </View>
    );
  }

  const {
    date,
    roomName,
    statistics,
    activityPattern
  } = report;

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <Surface style={styles.header}>
        <Text style={styles.headerTitle}>Daily Activity Report</Text>
        <Text style={styles.headerSubtitle}>
          {new Date(date).toLocaleDateString()} - {roomName}
        </Text>
      </Surface>

      {/* Key Statistics */}
      <View style={styles.statsGrid}>
        <StatisticCard
          title="Activity Level"
          value={`${statistics.averageActivityIndex}/3`}
          icon="run"
          description="Average daily activity index"
        />
        
        <StatisticCard
          title="Agitation"
          value={`${statistics.averageAgitation}%`}
          icon="pulse"
          description="Average agitation level"
        />
        
        <StatisticCard
          title="Presence"
          value={`${statistics.presenceHours}h`}
          icon="home-clock"
          description="Total hours present"
        />
        
        <StatisticCard
          title="Breathing Events"
          value={statistics.irregularBreathingEvents}
          icon="lungs"
          description="Irregular breathing incidents"
        />
      </View>

      {/* Trend Charts */}
      <TrendCharts
        activityData={activityPattern}
        agitationData={trends.agitation}
        presenceData={trends.presence}
      />

      {/* Detailed Analysis */}
      <Surface style={styles.analysisSection}>
        <Text style={styles.sectionTitle}>Detailed Analysis</Text>
        <Divider style={styles.divider} />
        
        <List.Item
          title="Activity Pattern"
          description={getActivityDescription(statistics.averageActivityIndex)}
          left={props => <List.Icon {...props} icon="chart-bell-curve" />}
        />
        
        <Divider />
        
        <List.Item
          title="Rest Periods"
          description={getRestPeriodsDescription(activityPattern)}
          left={props => <List.Icon {...props} icon="power-sleep" />}
        />
        
        <Divider />
        
        <List.Item
          title="Movement Quality"
          description={getMovementQualityDescription(statistics)}
          left={props => <List.Icon {...props} icon="motion-sensor" />}
        />
      </Surface>
    </ScrollView>
  );
}

// Funzioni helper per l'analisi
function getActivityDescription(avgActivity) {
  const activity = parseFloat(avgActivity);
  if (activity < 1) return "Mostly sedentary day with minimal activity";
  if (activity < 2) return "Light activity throughout the day";
  return "Moderate to high activity levels observed";
}

function getRestPeriodsDescription(activityPattern) {
  const nightHours = activityPattern.slice(22).concat(activityPattern.slice(0, 6));
  const avgNightActivity = nightHours.reduce((sum, hour) => sum + parseFloat(hour.averageActivity), 0) / nightHours.length;
  
  if (avgNightActivity < 0.5) return "Normal rest periods during night hours";
  if (avgNightActivity < 1) return "Some movement during night hours";
  return "Frequent activity during night hours";
}

function getMovementQualityDescription(statistics) {
  const agitation = parseFloat(statistics.averageAgitation);
  if (agitation < 30) return "Calm and steady movements";
  if (agitation < 60) return "Moderate movement variations";
  return "Frequent agitated movements";
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  statCard: {
    width: '48%',
    margin: '1%',
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statTitle: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  analysisSection: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  divider: {
    marginVertical: 8,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  noDataText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});
