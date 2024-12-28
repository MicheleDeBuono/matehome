import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryTheme,
  VictoryBar,
  VictoryScatter,
  VictoryTooltip,
} from 'victory-native';

const screenWidth = Dimensions.get('window').width;

export default function TrendCharts({ activityData, agitationData, presenceData }) {
  const theme = useTheme();

  // Formatta i dati per i grafici
  const formatHourlyData = (data) => {
    return data.map(point => ({
      x: point.hour,
      y: parseFloat(point.averageActivity)
    }));
  };

  const formatTimeData = (data) => {
    return data.map(point => ({
      x: new Date(point.timestamp),
      y: point.value
    }));
  };

  return (
    <View style={styles.container}>
      {/* Grafico Attività */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Daily Activity Pattern</Text>
        <VictoryChart
          width={screenWidth - 32}
          height={200}
          theme={VictoryTheme.material}
          domainPadding={{ x: 10 }}
        >
          <VictoryAxis
            tickFormat={(t) => `${t}h`}
            style={{
              tickLabels: { fontSize: 8, padding: 5 }
            }}
          />
          <VictoryAxis
            dependentAxis
            tickFormat={(t) => `${t}`}
            style={{
              tickLabels: { fontSize: 8, padding: 5 }
            }}
          />
          <VictoryBar
            data={formatHourlyData(activityData)}
            style={{
              data: {
                fill: theme.colors.primary,
                opacity: 0.7
              }
            }}
          />
        </VictoryChart>
      </View>

      {/* Grafico Agitazione */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Agitation Trend</Text>
        <VictoryChart
          width={screenWidth - 32}
          height={200}
          theme={VictoryTheme.material}
          scale={{ x: "time" }}
        >
          <VictoryAxis
            tickFormat={(t) => {
              const date = new Date(t);
              return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
            }}
            style={{
              tickLabels: { fontSize: 8, angle: -45, padding: 5 }
            }}
          />
          <VictoryAxis
            dependentAxis
            tickFormat={(t) => `${t}%`}
            style={{
              tickLabels: { fontSize: 8, padding: 5 }
            }}
          />
          <VictoryLine
            data={formatTimeData(agitationData)}
            style={{
              data: { stroke: theme.colors.error }
            }}
          />
          <VictoryScatter
            data={formatTimeData(agitationData)}
            size={3}
            style={{
              data: { fill: theme.colors.error }
            }}
            labels={({ datum }) => `${Math.round(datum.y)}%`}
            labelComponent={
              <VictoryTooltip
                flyoutStyle={{
                  stroke: theme.colors.error
                }}
              />
            }
          />
        </VictoryChart>
      </View>

      {/* Grafico Presenza */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Presence Timeline</Text>
        <VictoryChart
          width={screenWidth - 32}
          height={150}
          theme={VictoryTheme.material}
          scale={{ x: "time" }}
          domainPadding={{ y: 20 }}
        >
          <VictoryAxis
            tickFormat={(t) => {
              const date = new Date(t);
              return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
            }}
            style={{
              tickLabels: { fontSize: 8, angle: -45, padding: 5 }
            }}
          />
          <VictoryAxis
            dependentAxis
            tickFormat={(t) => t === 1 ? 'Present' : 'Absent'}
            style={{
              tickLabels: { fontSize: 8, padding: 5 }
            }}
          />
          <VictoryLine
            data={formatTimeData(presenceData)}
            style={{
              data: { stroke: theme.colors.primary }
            }}
          />
        </VictoryChart>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  chartContainer: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
});
