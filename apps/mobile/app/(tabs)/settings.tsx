import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, radius } from '@/theme';

const ONBOARDING_KEY =
  'snapbrief_onboarding_complete';

const API_URL =
  process.env.EXPO_PUBLIC_API_URL || 'Not configured';

export default function SettingsScreen() {
  const [localOnly, setLocalOnly] = useState(true);
  const [onboardingComplete, setOnboardingComplete] =
    useState(true);
  const [apiOnline, setApiOnline] = useState<boolean | null>(
    null
  );

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    const completed = await AsyncStorage.getItem(
      ONBOARDING_KEY
    );

    setOnboardingComplete(Boolean(completed));
  }

  async function checkApi() {
    try {
      setApiOnline(null);

      const response = await fetch(`${API_URL}/health`);

      setApiOnline(response.ok);
    } catch {
      setApiOnline(false);
    }
  }

  function resetOnboarding() {
    Alert.alert(
      'Show onboarding again?',
      'This will restart the introductory flow the next time the app starts.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem(
              ONBOARDING_KEY
            );

            setOnboardingComplete(false);
          },
        },
      ]
    );
  }

  function openRepository() {
    Linking.openURL(
      'https://github.com/izharahmaad/SnapBriefAI'
    );
  }

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.eyebrow}>
          04 / SETTINGS
        </Text>

        <Text style={styles.title}>
          Control your workspace.
        </Text>

        <Text style={styles.subtitle}>
          SnapBrief stays simple by keeping the important
          controls in one place.
        </Text>
      </View>

      {/* Status */}
      <View style={styles.statusCard}>
        <View style={styles.statusHeader}>
          <View>
            <Text style={styles.cardLabel}>
              SYSTEM STATUS
            </Text>

            <Text style={styles.statusTitle}>
              SnapBrief is ready.
            </Text>
          </View>

          <View style={styles.statusIndicator}>
            <View style={styles.statusDot} />

            <Text style={styles.statusText}>
              LOCAL
            </Text>
          </View>
        </View>

        <View style={styles.statusRows}>
          <StatusRow
            icon="phone-portrait-outline"
            label="Local workspace"
            value="Active"
            positive
          />

          <StatusRow
            icon="lock-closed-outline"
            label="Local result storage"
            value="Enabled"
            positive
          />

          <StatusRow
            icon="cloud-outline"
            label="AI API"
            value={
              apiOnline === null
                ? 'Not checked'
                : apiOnline
                  ? 'Online'
                  : 'Offline'
            }
            positive={apiOnline === true}
          />
        </View>

        <Pressable
          onPress={checkApi}
          style={({ pressed }) => [
            styles.checkButton,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons
            name="pulse-outline"
            size={14}
            color={colors.accent}
          />

          <Text style={styles.checkButtonText}>
            Check API connection
          </Text>
        </Pressable>
      </View>

      {/* Privacy */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>
          PRIVACY
        </Text>

        <View style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingIcon}>
              <Ionicons
                name="shield-checkmark-outline"
                size={17}
                color={colors.accent}
              />
            </View>

            <View style={styles.settingCopy}>
              <Text style={styles.settingTitle}>
                Local result storage
              </Text>

              <Text style={styles.settingDescription}>
                Keep generated briefs stored on this device.
              </Text>
            </View>

            <Switch
              value={localOnly}
              onValueChange={setLocalOnly}
              trackColor={{
                false: colors.surface2,
                true: 'rgba(45, 225, 214, 0.28)',
              }}
              thumbColor={
                localOnly
                  ? colors.accent
                  : colors.dim
              }
            />
          </View>
        </View>
      </View>

      {/* Workspace */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>
          WORKSPACE
        </Text>

        <View style={styles.settingsCard}>
          <ActionRow
            icon="refresh-outline"
            title="Restart onboarding"
            description={
              onboardingComplete
                ? 'Review the introduction screens again.'
                : 'Onboarding will appear on next launch.'
            }
            onPress={resetOnboarding}
          />

          <View style={styles.separator} />

          <ActionRow
            icon="logo-github"
            title="SnapBrief on GitHub"
            description="Open the project repository."
            onPress={openRepository}
          />
        </View>
      </View>

      {/* API */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>
          CONNECTION
        </Text>

        <View style={styles.apiCard}>
          <View style={styles.apiIcon}>
            <Ionicons
              name="server-outline"
              size={17}
              color={colors.accent}
            />
          </View>

          <View style={styles.apiCopy}>
            <Text style={styles.apiTitle}>
              API endpoint
            </Text>

            <Text
              style={styles.apiValue}
              numberOfLines={1}
            >
              {API_URL}
            </Text>
          </View>
        </View>
      </View>

      {/* App info */}
      <View style={styles.aboutCard}>
        <View style={styles.aboutLogo}>
          <Ionicons
            name="sparkles"
            size={18}
            color={colors.bg}
          />
        </View>

        <View style={styles.aboutCopy}>
          <Text style={styles.aboutTitle}>
            SNAPBRIEF AI
          </Text>

          <Text style={styles.aboutVersion}>
            Version 1.0.0
          </Text>
        </View>

        <View style={styles.aboutBadge}>
          <Text style={styles.aboutBadgeText}>
            BUILD 01
          </Text>
        </View>
      </View>

      <Text style={styles.footer}>
        Simple. Clear. Actionable.
      </Text>

      <View style={styles.bottomSpace} />
    </ScrollView>
  );
}

function StatusRow({
  icon,
  label,
  value,
  positive,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  positive: boolean;
}) {
  return (
    <View style={styles.statusRow}>
      <Ionicons
        name={icon}
        size={15}
        color={colors.dim}
      />

      <Text style={styles.statusRowLabel}>
        {label}
      </Text>

      <Text
        style={[
          styles.statusRowValue,
          positive && styles.statusRowValuePositive,
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

function ActionRow({
  icon,
  title,
  description,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionRow,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.settingIcon}>
        <Ionicons
          name={icon}
          size={17}
          color={colors.accent}
        />
      </View>

      <View style={styles.settingCopy}>
        <Text style={styles.settingTitle}>
          {title}
        </Text>

        <Text style={styles.settingDescription}>
          {description}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={15}
        color={colors.dim}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 110,
  },

  header: {
    marginBottom: 22,
  },

  eyebrow: {
    color: colors.accent,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.4,
  },

  title: {
    color: colors.white,
    fontSize: 25,
    lineHeight: 29,
    fontWeight: '800',
    letterSpacing: -0.6,
    marginTop: 7,
  },

  subtitle: {
    color: colors.muted,
    fontSize: 10,
    lineHeight: 16,
    marginTop: 6,
    maxWidth: 350,
  },

  statusCard: {
    padding: 15,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 24,
  },

  statusHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },

  cardLabel: {
    color: colors.dim,
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 1.2,
  },

  statusTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
    marginTop: 4,
  },

  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(45, 225, 214, 0.06)',
    borderWidth: 1,
    borderColor: colors.border,
  },

  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.accent,
    marginRight: 5,
  },

  statusText: {
    color: colors.accentSoft,
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 0.8,
  },

  statusRows: {
    marginTop: 15,
    gap: 12,
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  statusRowLabel: {
    flex: 1,
    color: colors.muted,
    fontSize: 9,
    marginLeft: 8,
  },

  statusRowValue: {
    color: colors.dim,
    fontSize: 9,
    fontWeight: '700',
  },

  statusRowValuePositive: {
    color: colors.accentSoft,
  },

  checkButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 15,
  },

  checkButtonText: {
    color: colors.accentSoft,
    fontSize: 9,
    fontWeight: '800',
    marginLeft: 5,
  },

  section: {
    marginBottom: 22,
  },

  sectionLabel: {
    color: colors.dim,
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 9,
  },

  settingsCard: {
    overflow: 'hidden',
    borderRadius: 19,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 13,
  },

  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 13,
  },

  settingIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(45, 225, 214, 0.06)',
    marginRight: 10,
  },

  settingCopy: {
    flex: 1,
  },

  settingTitle: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '800',
  },

  settingDescription: {
    color: colors.muted,
    fontSize: 8,
    lineHeight: 14,
    marginTop: 3,
  },

  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 57,
  },

  apiCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 13,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  apiIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(45, 225, 214, 0.06)',
    marginRight: 10,
  },

  apiCopy: {
    flex: 1,
  },

  apiTitle: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '800',
  },

  apiValue: {
    color: colors.dim,
    fontSize: 8,
    marginTop: 3,
  },

  aboutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 13,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  aboutLogo: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
  },

  aboutCopy: {
    flex: 1,
    marginLeft: 10,
  },

  aboutTitle: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
  },

  aboutVersion: {
    color: colors.dim,
    fontSize: 8,
    marginTop: 3,
  },

  aboutBadge: {
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.bg,
  },

  aboutBadgeText: {
    color: colors.accentSoft,
    fontSize: 6,
    fontWeight: '800',
    letterSpacing: 0.7,
  },

  footer: {
    color: colors.dim,
    textAlign: 'center',
    fontSize: 8,
    marginTop: 18,
  },

  pressed: {
    opacity: 0.65,
  },

  bottomSpace: {
    height: 20,
  },
});