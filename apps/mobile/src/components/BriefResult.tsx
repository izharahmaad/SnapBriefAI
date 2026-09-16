import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Brief } from '@/types/brief';
import { colors, radius, spacing } from '@/theme';
import { Chip } from './Chip';

export function BriefResult({ brief }: { brief: Brief }) {
  const priority = (brief.priority || 'normal').toLowerCase();

  const priorityConfig = {
    high: {
      icon: 'alert-circle-outline' as const,
      color: colors.accent,
      background: 'rgba(45, 225, 214, 0.08)',
      label: 'High priority',
    },
    medium: {
      icon: 'time-outline' as const,
      color: colors.accentSoft,
      background: 'rgba(146, 255, 247, 0.06)',
      label: 'Medium priority',
    },
    low: {
      icon: 'arrow-down-circle-outline' as const,
      color: colors.muted,
      background: 'rgba(135, 166, 165, 0.06)',
      label: 'Low priority',
    },
    normal: {
      icon: 'remove-circle-outline' as const,
      color: colors.muted,
      background: 'rgba(135, 166, 165, 0.06)',
      label: 'Normal',
    },
  };

  const priorityStyle =
    priorityConfig[priority as keyof typeof priorityConfig] ??
    priorityConfig.normal;

  return (
    <View style={styles.container}>
      {/* Result identity */}
      <View style={styles.header}>
        <View style={styles.identity}>
          <View style={styles.sparkIcon}>
            <Ionicons
              name="sparkles"
              size={13}
              color={colors.bg}
            />
          </View>

          <View>
            <Text style={styles.eyebrow}>SNAPBRIEF</Text>
            <Text style={styles.generatedLabel}>Generated brief</Text>
          </View>
        </View>

        <View
          style={[
            styles.priority,
            {
              backgroundColor: priorityStyle.background,
              borderColor: `${priorityStyle.color}30`,
            },
          ]}
        >
          <Ionicons
            name={priorityStyle.icon}
            size={12}
            color={priorityStyle.color}
          />

          <Text
            style={[
              styles.priorityText,
              { color: priorityStyle.color },
            ]}
          >
            {priorityStyle.label}
          </Text>
        </View>
      </View>

      {/* Main result */}
      <View style={styles.intro}>
        <Text style={styles.title}>{brief.title}</Text>

        <Text style={styles.summary}>{brief.summary}</Text>
      </View>

      {/* Key points */}
      {brief.key_points?.length ? (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionNumber}>01</Text>

            <View>
              <Text style={styles.sectionTitle}>Key points</Text>

              <Text style={styles.sectionCaption}>
                What matters most
              </Text>
            </View>
          </View>

          <View style={styles.list}>
            {brief.key_points.map((point, index) => (
              <View
                key={`${point}-${index}`}
                style={styles.listItem}
              >
                <View style={styles.bullet}>
                  <View style={styles.bulletDot} />
                </View>

                <Text style={styles.itemText}>{point}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {/* Actions */}
      {brief.actions?.length ? (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionNumber}>02</Text>

            <View>
              <Text style={styles.sectionTitle}>Next actions</Text>

              <Text style={styles.sectionCaption}>
                What to do next
              </Text>
            </View>
          </View>

          <View style={styles.list}>
            {brief.actions.map((action, index) => (
              <View
                key={`${action}-${index}`}
                style={styles.listItem}
              >
                <View style={styles.actionIcon}>
                  <Ionicons
                    name="arrow-forward"
                    size={10}
                    color={colors.bg}
                  />
                </View>

                <Text style={styles.itemText}>{action}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {/* Metadata */}
      {brief.tags?.length || brief.due_date ? (
        <View style={styles.metadata}>
          <View style={styles.metadataHeader}>
            <Text style={styles.metadataLabel}>METADATA</Text>

            <View style={styles.metadataLine} />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tagsRow}
          >
            {brief.tags?.map((tag) => (
              <Chip key={tag} text={tag} />
            ))}

            {brief.due_date ? (
              <Chip text={`Due ${brief.due_date}`} />
            ) : null}
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },

  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  sparkIcon: {
    width: 32,
    height: 32,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    marginRight: 10,
  },

  eyebrow: {
    color: colors.accentSoft,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.6,
  },

  generatedLabel: {
    color: colors.dim,
    fontSize: 10,
    marginTop: 2,
  },

  priority: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 7,
    borderRadius: radius.pill,
    borderWidth: 1,
  },

  priorityText: {
    fontSize: 8,
    fontWeight: '800',
    marginLeft: 5,
  },

  intro: {
    marginTop: 25,
  },

  title: {
    color: colors.white,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
    letterSpacing: -0.8,
  },

  summary: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 11,
  },

  section: {
    marginTop: 28,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  sectionNumber: {
    width: 28,
    color: colors.accent,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },

  sectionTitle: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '800',
  },

  sectionCaption: {
    color: colors.dim,
    fontSize: 9,
    marginTop: 2,
  },

  list: {
    gap: 12,
  },

  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  bullet: {
    width: 20,
    height: 20,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(45, 225, 214, 0.07)',
    marginRight: 9,
    marginTop: 1,
  },

  bulletDot: {
    width: 5,
    height: 5,
    borderRadius: 999,
    backgroundColor: colors.accent,
  },

  actionIcon: {
    width: 20,
    height: 20,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    marginRight: 9,
    marginTop: 1,
  },

  itemText: {
    flex: 1,
    color: colors.text,
    fontSize: 13,
    lineHeight: 20,
  },

  metadata: {
    marginTop: 28,
  },

  metadataHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  metadataLabel: {
    color: colors.dim,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.4,
  },

  metadataLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 10,
  },

  tagsRow: {
    gap: 7,
    paddingRight: 4,
  },
});