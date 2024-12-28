import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { List, RadioButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSettings } from '../../context/SettingsContext';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'it', name: 'Italiano' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
];

export default function LanguageScreen() {
  const { settings, updateProfile } = useSettings();

  const handleLanguageChange = async (languageCode) => {
    await updateProfile({ language: languageCode });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <RadioButton.Group
          onValueChange={handleLanguageChange}
          value={settings.profile.language}
        >
          {LANGUAGES.map(language => (
            <List.Item
              key={language.code}
              title={language.name}
              onPress={() => handleLanguageChange(language.code)}
              right={() => (
                <RadioButton
                  value={language.code}
                  status={settings.profile.language === language.code ? 'checked' : 'unchecked'}
                />
              )}
              style={styles.languageItem}
            />
          ))}
        </RadioButton.Group>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  languageItem: {
    backgroundColor: '#fff',
    marginVertical: 1,
  },
});
