import { useEffect, useState, type ReactNode } from 'react';
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, radius, spacing } from '@/theme';

const ONBOARDING_KEY =
  'snapbrief_onboarding_complete';

const API_URL =
  process.env.EXPO_PUBLIC_API_URL || 'Not configured';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();

  const [localOnly, setLocalOnly] = useState(true);
  const [onboardingComplete, setOnboardingComplete] =
    useState(true);
  const [apiOnline, setApiOnline] =
    useState<boolean | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const completed = await AsyncStorage.getItem(
        ONBOARDING_KEY,
      );

      setOnboardingComplete(Boolean(completed));
    } catch {
      setOnboardingComplete(false);
    }
  }

  async function checkApi() {
    try {
      setApiOnline(null);

      const response = await fetch(
        `${API_URL}/health`,
      );

      setApiOnline(response.ok);
    } catch {
      setApiOnline(false);
    }
  }

  function resetOnboarding() {
    Alert.alert(
      'Show onboarding again?',
      'The introduction screens will appear the next time the app starts.',
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
              ONBOARDING_KEY,
            );

            setOnboardingComplete(false);
          },
        },
      ],
    );
  }

  function openRepository() {
    Linking.openURL(
      'https://github.com/izharahmaad/SnapBriefAI',
    );
  }

  const connectionLabel =
    apiOnline === null
      ? 'Not checked'
      : apiOnline
        ? 'Online'
        : 'Offline';

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: Math.max(insets.top + 18, 28),
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* =========================================================
          HEADER
      ========================================================= */}
      <View style={styles.header}>
        <View style={styles.eyebrowRow}>
          <View style={styles.eyebrowDot} />

          <Text style={styles.eyebrow}>
            04 / SETTINGS
          </Text>
        </View>

        <Text style={styles.title}>
          Settings
        </Text>

        <Text style={styles.subtitle}>
          Everything you need to keep SnapBrief
          simple, private and connected.
        </Text>
      </View>

      {/* =========================================================
          SYSTEM
      ========================================================= */}
      <View style={styles.systemSection}>
        <View style={styles.systemHeader}>
          <View>
            <Text style={styles.sectionEyebrow}>
              SYSTEM
            </Text>

            <Text style={styles.systemTitle}>
              Workspace status
            </Text>
          </View>

          <View style={styles.readyState}>
            <View style={styles.readyDot} />

            <Text style={styles.readyText}>
              READY
            </Text>
          </View>
        </View>

        <View style={styles.statusList}>
          <StatusRow
            icon="phone-portrait-outline"
            label="Workspace"
            value="Active"
            positive
          />

          <StatusRow
            icon="lock-closed-outline"
            label="Local storage"
            value="Enabled"
            positive
          />

          <StatusRow
            icon="cloud-outline"
            label="AI connection"
            value={connectionLabel}
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
            {apiOnline === null
              ? 'Check connection'
              : 'Check again'}
          </Text>
        </Pressable>
      </View>

      {/* =========================================================
          PRIVACY
      ========================================================= */}
      <SettingsSection label="PRIVACY">
        <View style={styles.row}>
          <SettingIcon icon="shield-checkmark-outline" />

          <View style={styles.rowContent}>
            <Text style={styles.rowTitle}>
              Local result storage
            </Text>

            <Text style={styles.rowDescription}>
              Keep generated briefs available on this device.
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
            ios_backgroundColor={colors.surface2}
          />
        </View>
      </SettingsSection>

      {/* =========================================================
          WORKSPACE
      ========================================================= */}
      <SettingsSection label="WORKSPACE">
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
          description="View the project repository."
          onPress={openRepository}
        />
      </SettingsSection>

      {/* =========================================================
          CONNECTION
      ========================================================= */}
      <SettingsSection label="CONNECTION">
        <View style={styles.row}>
          <SettingIcon icon="server-outline" />

          <View style={styles.rowContent}>
            <Text style={styles.rowTitle}>
              API endpoint
            </Text>

            <Text
              style={styles.endpoint}
              numberOfLines={1}
            >
              {API_URL}
            </Text>
          </View>

          <ConnectionBadge
            online={apiOnline}
          />
        </View>
      </SettingsSection>

      {/* =========================================================
          ABOUT
      ========================================================= */}
      <View style={styles.aboutSection}>
        <View style={styles.aboutHeader}>
          <View style={styles.aboutBrand}>
            <View style={styles.aboutMark}>
              <Ionicons
                name="document-text-outline"
                size={17}
                color={colors.bg}
              />
            </View>

            <View>
              <Text style={styles.aboutTitle}>
                SNAPBRIEF AI
              </Text>

              <Text style={styles.aboutVersion}>
                Version 1.0.0
              </Text>
            </View>
          </View>

          <Text style={styles.build}>
            BUILD 01
          </Text>
        </View>

        <View style={styles.aboutDivider} />

        <Text style={styles.aboutText}>
          Turn raw notes into clear briefs,
          useful priorities and actionable next steps.
        </Text>
      </View>

      <Text style={styles.footer}>
        Simple. Clear. Actionable.
      </Text>

      <View style={styles.bottomSpace} />
    </ScrollView>
  );
}

function SettingsSection({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>
        {label}
      </Text>

      <View style={styles.sectionCard}>
        {children}
      </View>
    </View>
  );
}

function SettingIcon({
  icon,
}: {
  icon: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <View style={styles.settingIcon}>
      <Ionicons
        name={icon}
        size={16}
        color={colors.accent}
      />
    </View>
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

      <Text style={styles.statusLabel}>
        {label}
      </Text>

      <View style={styles.statusValue}>
        <View
          style={[
            styles.statusDot,
            positive && styles.statusDotPositive,
          ]}
        />

        <Text
          style={[
            styles.statusText,
            positive && styles.statusTextPositive,
          ]}
        >
          {value}
        </Text>
      </View>
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
      <SettingIcon icon={icon} />

      <View style={styles.rowContent}>
        <Text style={styles.rowTitle}>
          {title}
        </Text>

        <Text style={styles.rowDescription}>
          {description}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={14}
        color={colors.dim}
      />
    </Pressable>
  );
}

function ConnectionBadge({
  online,
}: {
  online: boolean | null;
}) {
  const label =
    online === null
      ? 'READY'
      : online
        ? 'ONLINE'
        : 'OFFLINE';

  return (
    <View
      style={[
        styles.connectionBadge,
        online === true &&
          styles.connectionBadgeOnline,
        online === false &&
          styles.connectionBadgeOffline,
      ]}
    >
      <Text
        style={[
          styles.connectionBadgeText,
          online === true &&
            styles.connectionBadgeTextOnline,
          online === false &&
            styles.connectionBadgeTextOffline,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  content: {
    paddingHorizontal: spacing.xl,
    paddingBottom: 120,
  },

  /* ============================================================
     HEADER
  ============================================================ */

  header: {
    marginBottom: 29,
  },

  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  eyebrowDot: {
    width: 5,
    height: 5,
    borderRadius: 999,
    backgroundColor: colors.accent,
    marginRight: 7,
  },

  eyebrow: {
    color: colors.accentSoft,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.5,
  },

  title: {
    color: colors.white,
    fontSize: 31,
    lineHeight: 36,
    fontWeight: '900',
    letterSpacing: -0.9,
    marginTop: 6,
  },

  subtitle: {
    color: colors.dim,
    fontSize: 10,
    lineHeight: 16,
    maxWidth: 330,
    marginTop: 5,
  },

  /* ============================================================
     SYSTEM
  ============================================================ */

  systemSection: {
    padding: 16,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 28,
  },

  systemHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },

  systemHeaderCopy: {
    flex: 1,
  },

  sectionEyebrow: {
    color: colors.dim,
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 1.3,
  },

  systemTitle: {
    color: colors.white,
    fontSize: 17,
    lineHeight: 21,
    fontWeight: '900',
    marginTop: 5,
  },

  readyState: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 2,
  },

  readyDot: {
    width: 5,
    height: 5,
    borderRadius: 999,
    backgroundColor: colors.accent,
    marginRight: 5,
  },

  readyText: {
    color: colors.accentSoft,
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 0.9,
  },

  statusList: {
    marginTop: 18,
    gap: 13,
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  statusLabel: {
    flex: 1,
    color: colors.muted,
    fontSize: 9,
    marginLeft: 9,
  },

  statusValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  statusDot: {
    width: 4,
    height: 4,
    borderRadius: 999,
    backgroundColor: colors.dim,
    marginRight: 5,
  },

  statusDotPositive: {
    backgroundColor: colors.accent,
  },

  statusText: {
    color: colors.dim,
    fontSize: 8,
    fontWeight: '700',
  },

  statusTextPositive: {
    color: colors.accentSoft,
  },

  checkButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 18,
  },

  checkButtonText: {
    color: colors.accentSoft,
    fontSize: 8,
    fontWeight: '800',
    marginLeft: 5,
  },

  /* ============================================================
     SECTIONS
  ============================================================ */

  section: {
    marginBottom: 23,
  },

  sectionLabel: {
    color: colors.dim,
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 1.3,
    marginBottom: 9,
  },

  sectionCard: {
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xl,
  },

  /* ============================================================
     ROWS
  ============================================================ */

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },

  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },

  settingIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(45, 225, 214, 0.06)',
    marginRight: 10,
  },

  rowContent: {
    flex: 1,
  },

  rowTitle: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '800',
  },

  rowDescription: {
    color: colors.muted,
    fontSize: 8,
    lineHeight: 14,
    marginTop: 3,
  },

  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 56,
  },

  endpoint: {
    color: colors.dim,
    fontSize: 8,
    marginTop: 3,
  },

  /* ============================================================
     CONNECTION
  ============================================================ */

  connectionBadge: {
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
  },

  connectionBadgeOnline: {
    backgroundColor: 'rgba(45, 225, 214, 0.06)',
    borderColor: 'rgba(45, 225, 214, 0.15)',
  },

  connectionBadgeOffline: {
    backgroundColor: 'rgba(255, 124, 135, 0.06)',
    borderColor: 'rgba(255, 124, 135, 0.14)',
  },

  connectionBadgeText: {
    color: colors.dim,
    fontSize: 6.5,
    fontWeight: '900',
    letterSpacing: 0.7,
  },

  connectionBadgeTextOnline: {
    color: colors.accentSoft,
  },

  connectionBadgeTextOffline: {
    color: colors.danger,
  },

  /* ============================================================
     ABOUT
  ============================================================ */

  aboutSection: {
    padding: 15,
    borderRadius: radius.xl,
    backgroundColor: 'rgba(11, 24, 27, 0.58)',
    borderWidth: 1,
    borderColor: colors.border,
  },

  aboutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  aboutBrand: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  aboutMark: {
    width: 35,
    height: 35,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    marginRight: 9,
  },

  aboutTitle: {
    color: colors.white,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.4,
  },

  aboutVersion: {
    color: colors.dim,
    fontSize: 8,
    marginTop: 3,
  },

  build: {
    color: colors.accentSoft,
    fontSize: 6.5,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  aboutDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 13,
  },

  aboutText: {
    color: colors.dim,
    fontSize: 9,
    lineHeight: 15,
  },

  /* ============================================================
     FOOTER
  ============================================================ */

  footer: {
    color: colors.dim,
    textAlign: 'center',
    fontSize: 8,
    marginTop: 17,
  },

  pressed: {
    opacity: 0.6,
  },

  bottomSpace: {
    height: 20,
  },
});