import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Brief } from '@/types/brief';
import { colors, radius, spacing } from '@/theme';
import { Chip } from './Chip';
import { GlassCard } from './GlassCard';

export function BriefResult({ brief }: { brief: Brief }) {
  const priority = (brief.priority || 'normal').toLowerCase();

  const priorityConfig = {
    high: {
      icon: 'alert-circle-outline' as const,
      color: colors.accent,
      background: 'rgba(45, 225, 214, 0.08)',
      label: 'HIGH PRIORITY',
    },
    medium: {
      icon: 'time-outline' as const,
      color: colors.accentSoft,
      background: 'rgba(146, 255, 247, 0.06)',
      label: 'MEDIUM PRIORITY',
    },
    low: {
      icon: 'arrow-down-circle-outline' as const,
      color: colors.muted,
      background: 'rgba(135, 166, 165, 0.06)',
      label: 'LOW PRIORITY',
    },
    normal: {
      icon: 'remove-circle-outline' as const,
      color: colors.muted,
      background: 'rgba(135, 166, 165, 0.06)',
      label: 'NORMAL',
    },
  };

  const priorityStyle =
    priorityConfig[priority as keyof typeof priorityConfig] ??
    priorityConfig.normal;

  return (
    <GlassCard style={styles.wrap}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.aiBadge}>
          <View style={styles.aiIcon}>
            <Ionicons
              name="sparkles"
              size={12}
              color={colors.bg}
            />
          </View>

          <Text style={styles.aiBadgeText}>AI BRIEF</Text>
        </View>

        <View
          style={[
            styles.priorityBadge,
            {
              backgroundColor: priorityStyle.background,
              borderColor: `${priorityStyle.color}35`,
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
              {
                color: priorityStyle.color,
              },
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

      {/* Divider */}
      <View style={styles.divider} />

      {/* Key points */}
      {brief.key_points?.length ? (
        <View style={styles.section}>
          <View style={styles.headingRow}>
            <View style={styles.headingIcon}>
              <Ionicons
                name="list-outline"
                size={15}
                color={colors.accent}
              />
            </View>

            <View>
              <Text style={styles.heading}>Key points</Text>
              <Text style={styles.headingMeta}>
                What matters most
              </Text>
            </View>
          </View>

          <View style={styles.pointsList}>
            {brief.key_points.map((point, index) => (
              <View
                style={styles.point}
                key={`${point}-${index}`}
              >
                <View style={styles.pointMarker}>
                  <View style={styles.pointDot} />
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
          <View style={styles.headingRow}>
            <View style={styles.headingIcon}>
              <Ionicons
                name="arrow-forward-circle-outline"
                size={15}
                color={colors.accent}
              />
            </View>

            <View>
              <Text style={styles.heading}>Next actions</Text>
              <Text style={styles.headingMeta}>
                Suggested moves
              </Text>
            </View>
          </View>

          <View style={styles.actionsList}>
            {brief.actions.map((action, index) => (
              <View
                style={styles.action}
                key={`${action}-${index}`}
              >
                <View style={styles.check}>
                  <Ionicons
                    name="checkmark"
                    size={11}
                    color={colors.bg}
                  />
                </View>

                <Text style={styles.itemText}>{action}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {/* Tags */}
      {brief.tags?.length || brief.due_date ? (
        <View style={styles.tagsSection}>
          <View style={styles.tagHeading}>
            <Ionicons
              name="pricetags-outline"
              size={14}
              color={colors.dim}
            />

            <Text style={styles.tagHeadingText}>
              ORGANIZED AS
            </Text>
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
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  wrap: {
    padding: spacing.xl,
    borderRadius: 24,
    gap: 0,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },

  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 11,
    paddingLeft: 5,
    paddingVertical: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
  },

  aiIcon: {
    width: 23,
    height: 23,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(6, 17, 19, 0.12)',
    marginRight: 6,
  },

  aiBadgeText: {
    color: colors.bg,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
  },

  priorityBadge: {
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
    letterSpacing: 0.9,
    marginLeft: 5,
  },

  intro: {
    marginTop: 22,
  },

  title: {
    color: colors.white,
    fontSize: 27,
    lineHeight: 33,
    fontWeight: '800',
    letterSpacing: -0.7,
  },

  summary: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 10,
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 22,
  },

  section: {
    marginBottom: 22,
  },

  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 13,
  },

  headingIcon: {
    width: 31,
    height: 31,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(45, 225, 214, 0.07)',
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 10,
  },

  heading: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '800',
  },

  headingMeta: {
    color: colors.dim,
    fontSize: 9,
    marginTop: 2,
  },

  pointsList: {
    gap: 11,
  },

  point: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  pointMarker: {
    width: 20,
    height: 20,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(45, 225, 214, 0.06)',
    marginRight: 9,
    marginTop: 1,
  },

  pointDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.accent,
  },

  actionsList: {
    gap: 10,
  },

  action: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  check: {
    width: 21,
    height: 21,
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

  tagsSection: {
    paddingTop: 3,
  },

  tagHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  tagHeadingText: {
    color: colors.dim,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.3,
    marginLeft: 6,
  },

  tagsRow: {
    gap: 8,
    paddingRight: 4,
  },
});