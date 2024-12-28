import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, List, FAB, Portal, Modal, TextInput, Button, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSettings } from '../../context/SettingsContext';

export default function EmergencyContactsScreen() {
  const { settings, addEmergencyContact, removeEmergencyContact } = useSettings();
  const [visible, setVisible] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    relationship: '',
  });
  const [errors, setErrors] = useState({});

  const validateContact = () => {
    const newErrors = {};
    if (!newContact.name) newErrors.name = 'Name is required';
    if (!newContact.phone) newErrors.phone = 'Phone number is required';
    if (!newContact.relationship) newErrors.relationship = 'Relationship is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddContact = async () => {
    if (!validateContact()) return;

    await addEmergencyContact({
      id: Date.now().toString(),
      ...newContact,
    });
    
    setNewContact({ name: '', phone: '', relationship: '' });
    setVisible(false);
  };

  const handleRemoveContact = (contactId) => {
    removeEmergencyContact(contactId);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {settings.profile.emergencyContacts.length === 0 ? (
          <Text style={styles.emptyText}>
            No emergency contacts added yet. Add contacts using the + button below.
          </Text>
        ) : (
          settings.profile.emergencyContacts.map(contact => (
            <List.Item
              key={contact.id}
              title={contact.name}
              description={`${contact.relationship} • ${contact.phone}`}
              left={props => <List.Icon {...props} icon="account" />}
              right={() => (
                <IconButton
                  icon="delete"
                  onPress={() => handleRemoveContact(contact.id)}
                />
              )}
              style={styles.contactItem}
            />
          ))
        )}
      </ScrollView>

      <Portal>
        <Modal
          visible={visible}
          onDismiss={() => setVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Text style={styles.modalTitle}>Add Emergency Contact</Text>
          
          <TextInput
            label="Name"
            value={newContact.name}
            onChangeText={(text) => setNewContact({ ...newContact, name: text })}
            mode="outlined"
            error={!!errors.name}
            style={styles.input}
          />
          {errors.name && <Text style={styles.error}>{errors.name}</Text>}
          
          <TextInput
            label="Phone Number"
            value={newContact.phone}
            onChangeText={(text) => setNewContact({ ...newContact, phone: text })}
            mode="outlined"
            keyboardType="phone-pad"
            error={!!errors.phone}
            style={styles.input}
          />
          {errors.phone && <Text style={styles.error}>{errors.phone}</Text>}
          
          <TextInput
            label="Relationship"
            value={newContact.relationship}
            onChangeText={(text) => setNewContact({ ...newContact, relationship: text })}
            mode="outlined"
            error={!!errors.relationship}
            style={styles.input}
          />
          {errors.relationship && <Text style={styles.error}>{errors.relationship}</Text>}
          
          <View style={styles.modalButtons}>
            <Button
              mode="outlined"
              onPress={() => setVisible(false)}
              style={styles.modalButton}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleAddContact}
              style={styles.modalButton}
            >
              Add Contact
            </Button>
          </View>
        </Modal>
      </Portal>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setVisible(true)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  emptyText: {
    textAlign: 'center',
    margin: 20,
    color: '#666',
  },
  contactItem: {
    backgroundColor: '#fff',
    marginVertical: 1,
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
  input: {
    marginBottom: 8,
  },
  error: {
    color: '#B00020',
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  modalButton: {
    marginLeft: 8,
  },
});
