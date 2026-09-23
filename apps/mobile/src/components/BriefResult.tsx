import { Ionicons } from '@expo/vector-icons';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Brief } from '@/types/brief';
import { colors, radius, spacing } from '@/theme';
import { Chip } from './Chip';

export function BriefResult({ brief }: { brief: Brief }) {
  const priority = (brief.priority || 'normal').toLowerCase();

  const priorityConfig = {
    high: {
      icon: 'alert-circle-outline' as const,
      color: colors.accent,
      label: 'High',
    },
    medium: {
      icon: 'time-outline' as const,
      color: colors.accentSoft,
      label: 'Medium',
    },
    low: {
      icon: 'arrow-down-circle-outline' as const,
      color: colors.muted,
      label: 'Low',
    },
    normal: {
      icon: 'remove-circle-outline' as const,
      color: colors.muted,
      label: 'Normal',
    },
  };

  const priorityStyle =
    priorityConfig[
      priority as keyof typeof priorityConfig
    ] ?? priorityConfig.normal;

  return (
    <View style={styles.container}>
      {/* =========================================================
          HEADER
      ========================================================= */}
      <View style={styles.header}>
        <View style={styles.identity}>
          <View style={styles.documentIcon}>
            <Ionicons
              name="document-text-outline"
              size={15}
              color={colors.bg}
            />
          </View>

          <View>
            <Text style={styles.eyebrow}>SNAPBRIEF</Text>
            <Text style={styles.generated}>
              Generated brief
            </Text>
          </View>
        </View>

        <View style={styles.priority}>
          <View
            style={[
              styles.priorityDot,
              {
                backgroundColor: priorityStyle.color,
              },
            ]}
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

      {/* =========================================================
          MAIN CONTENT
      ========================================================= */}
      <View style={styles.main}>
        <Text style={styles.title}>
          {brief.title}
        </Text>

        <Text style={styles.summary}>
          {brief.summary}
        </Text>
      </View>

      {/* =========================================================
          KEY POINTS
      ========================================================= */}
      {brief.key_points?.length ? (
        <BriefSection
          number="01"
          title="Key points"
          caption="What matters most"
        >
          <View style={styles.itemList}>
            {brief.key_points.map((point, index) => (
              <View
                key={`${point}-${index}`}
                style={styles.item}
              >
                <View style={styles.pointMarker}>
                  <View style={styles.pointDot} />
                </View>

                <Text style={styles.itemText}>
                  {point}
                </Text>
              </View>
            ))}
          </View>
        </BriefSection>
      ) : null}

      {/* =========================================================
          ACTIONS
      ========================================================= */}
      {brief.actions?.length ? (
        <BriefSection
          number="02"
          title="Next actions"
          caption="What to do next"
        >
          <View style={styles.itemList}>
            {brief.actions.map((action, index) => (
              <View
                key={`${action}-${index}`}
                style={styles.item}
              >
                <View style={styles.actionMarker}>
                  <Ionicons
                    name="arrow-forward"
                    size={10}
                    color={colors.bg}
                  />
                </View>

                <Text style={styles.itemText}>
                  {action}
                </Text>
              </View>
            ))}
          </View>
        </BriefSection>
      ) : null}

      {/* =========================================================
          DETAILS
      ========================================================= */}
      {brief.tags?.length || brief.due_date ? (
        <View style={styles.details}>
          <View style={styles.detailsHeader}>
            <Text style={styles.detailsLabel}>
              DETAILS
            </Text>

            <View style={styles.detailsLine} />
          </View>

          <View style={styles.detailsRows}>
            <View style={styles.detailRow}>
              <View style={styles.detailIdentity}>
                <Ionicons
                  name={priorityStyle.icon}
                  size={14}
                  color={priorityStyle.color}
                />

                <Text style={styles.detailLabel}>
                  Priority
                </Text>
              </View>

              <Text
                style={[
                  styles.detailValue,
                  {
                    color: priorityStyle.color,
                  },
                ]}
              >
                {priorityStyle.label}
              </Text>
            </View>

            {brief.due_date ? (
              <View style={styles.detailRow}>
                <View style={styles.detailIdentity}>
                  <Ionicons
                    name="calendar-outline"
                    size={14}
                    color={colors.muted}
                  />

                  <Text style={styles.detailLabel}>
                    Due date
                  </Text>
                </View>

                <Text style={styles.detailValue}>
                  {brief.due_date}
                </Text>
              </View>
            ) : null}
          </View>

          {brief.tags?.length ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tags}
            >
              {brief.tags.map((tag) => (
                <Chip
                  key={tag}
                  text={tag}
                />
              ))}
            </ScrollView>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

function BriefSection({
  number,
  title,
  caption,
  children,
}: {
  number: string;
  title: string;
  caption: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionNumber}>
          {number}
        </Text>

        <View style={styles.sectionCopy}>
          <Text style={styles.sectionTitle}>
            {title}
          </Text>

          <Text style={styles.sectionCaption}>
            {caption}
          </Text>
        </View>
      </View>

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },

  /* ============================================================
     HEADER
  ============================================================ */

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },

  identity: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  documentIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    marginRight: 9,
  },

  eyebrow: {
    color: colors.accentSoft,
    fontSize: 8,
    lineHeight: 10,
    fontWeight: '900',
    letterSpacing: 1.45,
  },

  generated: {
    color: colors.dim,
    fontSize: 9,
    lineHeight: 12,
    marginTop: 2,
  },

  priority: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  priorityDot: {
    width: 5,
    height: 5,
    borderRadius: 999,
    marginRight: 6,
  },

  priorityText: {
    fontSize: 8,
    lineHeight: 10,
    fontWeight: '900',
    letterSpacing: 0.65,
  },

  /* ============================================================
     MAIN
  ============================================================ */

  main: {
    marginTop: 24,
  },

  title: {
    color: colors.white,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '900',
    letterSpacing: -0.8,
  },

  summary: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 21,
    marginTop: 10,
  },

  /* ============================================================
     SECTIONS
  ============================================================ */

  section: {
    marginTop: 28,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  sectionNumber: {
    width: 30,
    color: colors.accent,
    fontSize: 8,
    lineHeight: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },

  sectionCopy: {
    flex: 1,
  },

  sectionTitle: {
    color: colors.white,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '900',
  },

  sectionCaption: {
    color: colors.dim,
    fontSize: 8,
    lineHeight: 11,
    marginTop: 2,
  },

  itemList: {
    gap: 12,
  },

  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  pointMarker: {
    width: 21,
    height: 21,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(45, 225, 214, 0.055)',
    marginRight: 9,
    marginTop: 1,
  },

  pointDot: {
    width: 5,
    height: 5,
    borderRadius: 999,
    backgroundColor: colors.accent,
  },

  actionMarker: {
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
    fontSize: 12,
    lineHeight: 19,
  },

  /* ============================================================
     DETAILS
  ============================================================ */

  details: {
    marginTop: 29,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 11,
  },

  detailsLabel: {
    color: colors.dim,
    fontSize: 7,
    lineHeight: 9,
    fontWeight: '900',
    letterSpacing: 1.25,
  },

  detailsLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 9,
  },

  detailsRows: {
    gap: 11,
    marginBottom: 11,
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  detailIdentity: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  detailLabel: {
    color: colors.dim,
    fontSize: 9,
    marginLeft: 7,
  },

  detailValue: {
    color: colors.text,
    fontSize: 9,
    fontWeight: '800',
  },

  tags: {
    gap: 7,
    paddingRight: 4,
  },
});