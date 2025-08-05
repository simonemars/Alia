import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react-native';

import Colors from '@/constants/Colors';
import { spacing, fontSizes, fontWeights } from '@/constants/Styles';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import RadioInput from '@/components/common/RadioInput';

export default function OnboardingScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Step 1: Basic Info
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [bio, setBio] = useState('');
  
  // Step 2: Interests/Hobbies
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);
  const availableHobbies = [
    'Reading', 'Gaming', 'Movies', 'Music', 'Cooking', 
    'Hiking', 'Photography', 'Art', 'Travel', 'Dancing',
    'Writing', 'Programming', 'Fashion', 'Gardening', 'Pets'
  ];
  
  // Step 3: Sports
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const availableSports = [
    'Basketball', 'Soccer', 'Tennis', 'Running', 'Swimming',
    'Yoga', 'Cycling', 'Volleyball', 'Golf', 'Hiking',
    'Fitness', 'Rock Climbing', 'Martial Arts', 'Skiing', 'Surfing'
  ];
  
  // Step 4: Preferences
  const [searchRadius, setSearchRadius] = useState('5');
  const [ageRange, setAgeRange] = useState('all');
  
  const nextStep = () => {
    // Validation for each step
    if (step === 1) {
      if (!name.trim() || !age.trim() || !bio.trim()) {
        // Show error
        return;
      }
    } else if (step === 2) {
      if (selectedHobbies.length === 0) {
        // Show error
        return;
      }
    } else if (step === 3) {
      if (selectedSports.length === 0) {
        // Show error
        return;
      }
    }
    
    if (step < 4) {
      setStep(step + 1);
    } else {
      completeOnboarding();
    }
  };
  
  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };
  
  const toggleHobby = (hobby: string) => {
    if (selectedHobbies.includes(hobby)) {
      setSelectedHobbies(selectedHobbies.filter(h => h !== hobby));
    } else {
      setSelectedHobbies([...selectedHobbies, hobby]);
    }
  };
  
  const toggleSport = (sport: string) => {
    if (selectedSports.includes(sport)) {
      setSelectedSports(selectedSports.filter(s => s !== sport));
    } else {
      setSelectedSports([...selectedSports, sport]);
    }
  };
  
  const completeOnboarding = async () => {
    setLoading(true);
    
    try {
      // This would normally save to an API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Navigate to main app
      router.replace('/(tabs)');
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={prevStep}>
          <ChevronLeft size={24} color={Colors.light.text} />
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          {[1, 2, 3, 4].map((s) => (
            <View 
              key={s} 
              style={[
                styles.progressDot, 
                s === step && styles.activeProgressDot
              ]} 
            />
          ))}
        </View>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {step === 1 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Tell us about yourself</Text>
            <Text style={styles.stepSubtitle}>This information helps people get to know you</Text>
            
            <Input
              label="Full Name"
              placeholder="Your name"
              value={name}
              onChangeText={setName}
            />
            
            <Input
              label="Age"
              placeholder="Your age"
              value={age}
              onChangeText={setAge}
              keyboardType="number-pad"
            />
            
            <Input
              label="Bio"
              placeholder="Write a short bio about yourself"
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={4}
              style={styles.textArea}
            />
          </View>
        )}
        
        {step === 2 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>What are your interests?</Text>
            <Text style={styles.stepSubtitle}>Select at least 3 hobbies you enjoy</Text>
            
            <View style={styles.hobbiesContainer}>
              {availableHobbies.map((hobby) => (
                <TouchableOpacity
                  key={hobby}
                  style={[
                    styles.hobbyButton,
                    selectedHobbies.includes(hobby) && styles.selectedHobbyButton,
                  ]}
                  onPress={() => toggleHobby(hobby)}
                >
                  <Text
                    style={[
                      styles.hobbyText,
                      selectedHobbies.includes(hobby) && styles.selectedHobbyText,
                    ]}
                  >
                    {hobby}
                  </Text>
                  {selectedHobbies.includes(hobby) && (
                    <Check size={16} color={Colors.light.tint} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
            
            <View style={styles.selectedContainer}>
              <Text style={styles.selectedLabel}>
                Selected ({selectedHobbies.length}):
              </Text>
              <View style={styles.selectedItemsContainer}>
                {selectedHobbies.map((hobby) => (
                  <Badge
                    key={hobby}
                    label={hobby}
                    type="primary"
                    style={styles.selectedBadge}
                  />
                ))}
              </View>
            </View>
          </View>
        )}
        
        {step === 3 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>What sports do you enjoy?</Text>
            <Text style={styles.stepSubtitle}>Select the sports you like to play</Text>
            
            <View style={styles.hobbiesContainer}>
              {availableSports.map((sport) => (
                <TouchableOpacity
                  key={sport}
                  style={[
                    styles.hobbyButton,
                    selectedSports.includes(sport) && styles.selectedHobbyButton,
                  ]}
                  onPress={() => toggleSport(sport)}
                >
                  <Text
                    style={[
                      styles.hobbyText,
                      selectedSports.includes(sport) && styles.selectedHobbyText,
                    ]}
                  >
                    {sport}
                  </Text>
                  {selectedSports.includes(sport) && (
                    <Check size={16} color={Colors.light.tint} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
            
            <View style={styles.selectedContainer}>
              <Text style={styles.selectedLabel}>
                Selected ({selectedSports.length}):
              </Text>
              <View style={styles.selectedItemsContainer}>
                {selectedSports.map((sport) => (
                  <Badge
                    key={sport}
                    label={sport}
                    type="primary"
                    style={styles.selectedBadge}
                  />
                ))}
              </View>
            </View>
          </View>
        )}
        
        {step === 4 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Set your preferences</Text>
            <Text style={styles.stepSubtitle}>Customize your experience</Text>
            
            <Input
              label="Search Radius (km)"
              placeholder="5"
              value={searchRadius}
              onChangeText={setSearchRadius}
              keyboardType="number-pad"
            />
            
            <RadioInput
              label="Age Range"
              options={[
                { label: 'All ages', value: 'all' },
                { label: 'Similar to my age (±5 years)', value: 'similar' },
                { label: 'Custom range', value: 'custom' },
              ]}
              selectedValue={ageRange}
              onSelect={(value) => setAgeRange(value.toString())}
            />
          </View>
        )}
      </ScrollView>
      
      <View style={styles.footer}>
        <Button
          title={step === 4 ? 'Complete' : 'Next'}
          onPress={nextStep}
          loading={loading}
          size="large"
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.lightGrey,
    marginHorizontal: 4,
  },
  activeProgressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.light.tint,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  stepContainer: {
    marginBottom: spacing.xl,
  },
  stepTitle: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold as '700',
    marginBottom: spacing.sm,
  },
  stepSubtitle: {
    fontSize: fontSizes.md,
    color: Colors.light.secondaryText,
    marginBottom: spacing.xl,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  hobbiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.lg,
  },
  hobbyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.lightGrey,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  selectedHobbyButton: {
    backgroundColor: `${Colors.light.tint}20`,
    borderWidth: 1,
    borderColor: Colors.light.tint,
  },
  hobbyText: {
    fontSize: fontSizes.sm,
    marginRight: spacing.xs,
  },
  selectedHobbyText: {
    color: Colors.light.tint,
    fontWeight: fontWeights.medium as '500',
  },
  selectedContainer: {
    marginTop: spacing.md,
  },
  selectedLabel: {
    fontSize: fontSizes.sm,
    marginBottom: spacing.sm,
    color: Colors.light.secondaryText,
  },
  selectedItemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  selectedBadge: {
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  button: {
    width: '100%',
  },
});