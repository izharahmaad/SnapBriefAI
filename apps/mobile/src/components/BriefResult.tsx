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
  const priorityConfig = {
    high: {
      icon: 'alert-circle-outline' as const,
      color: colors.accent,
      label: 'High',
      background: 'rgba(45, 225, 214, 0.08)',
    },
    medium: {
      icon: 'time-outline' as const,
      color: colors.accentSoft,
      label: 'Medium',
      background: 'rgba(146, 255, 247, 0.07)',
    },
    low: {
      icon: 'arrow-down-circle-outline' as const,
      color: colors.muted,
      label: 'Low',
      background: 'rgba(135, 166, 165, 0.07)',
    },
  };

  const priorityStyle =
    priorityConfig[brief.priority] ?? priorityConfig.medium;

  const hasKeyPoints = brief.key_points?.length > 0;
  const hasActions = brief.actions?.length > 0;
  const hasDueDate = Boolean(brief.due_date);
  const hasTags = brief.tags?.length > 0;
  const hasDetails = hasDueDate || hasTags;

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

          <View style={styles.identityCopy}>
            <Text style={styles.eyebrow}>
              SNAPBRIEF
            </Text>

            <Text style={styles.generated}>
              Generated brief
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.priorityBadge,
            {
              backgroundColor: priorityStyle.background,
              borderColor: `${priorityStyle.color}22`,
            },
          ]}
        >
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
      {hasKeyPoints ? (
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
      {hasActions ? (
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
      {hasDetails ? (
        <View style={styles.details}>
          <View style={styles.detailsHeader}>
            <Text style={styles.detailsLabel}>
              DETAILS
            </Text>

            <View style={styles.detailsLine} />
          </View>

          {hasDueDate ? (
            <View style={styles.detailRow}>
              <View style={styles.detailIdentity}>
                <View style={styles.detailIcon}>
                  <Ionicons
                    name="calendar-outline"
                    size={12}
                    color={colors.muted}
                  />
                </View>

                <Text style={styles.detailLabel}>
                  Due date
                </Text>
              </View>

              <Text
                style={styles.detailValue}
                numberOfLines={1}
              >
                {brief.due_date}
              </Text>
            </View>
          ) : null}

          {hasTags ? (
            <View
              style={[
                styles.tagsRow,
                hasDueDate && styles.tagsRowSpaced,
              ]}
            >
              <Text style={styles.tagsLabel}>
                Tags
              </Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tags}
              >
                {brief.tags.map((tag, index) => (
                  <Chip
                    key={`${tag}-${index}`}
                    text={tag}
                  />
                ))}
              </ScrollView>
            </View>
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
        <View style={styles.sectionNumberWrap}>
          <Text style={styles.sectionNumber}>
            {number}
          </Text>
        </View>

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
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },

  identityCopy: {
    flex: 1,
    minWidth: 0,
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

  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 25,
    paddingHorizontal: 9,
    borderRadius: radius.pill,
    borderWidth: 1,
  },

  priorityDot: {
    width: 5,
    height: 5,
    borderRadius: radius.pill,
    marginRight: 6,
  },

  priorityText: {
    fontSize: 8,
    lineHeight: 10,
    fontWeight: '900',
    letterSpacing: 0.55,
  },

  /* ============================================================
     MAIN
  ============================================================ */

  main: {
    marginTop: 22,
  },

  title: {
    color: colors.white,
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '900',
    letterSpacing: -0.7,
  },

  summary: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 9,
  },

  /* ============================================================
     SECTIONS
  ============================================================ */

  section: {
    marginTop: 25,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  sectionNumberWrap: {
    width: 30,
    height: 24,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },

  sectionNumber: {
    color: colors.accent,
    fontSize: 8,
    lineHeight: 10,
    fontWeight: '900',
    letterSpacing: 0.55,
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
    gap: 10,
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
    borderRadius: radius.pill,
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
    lineHeight: 18,
  },

  /* ============================================================
     DETAILS
  ============================================================ */

  details: {
    marginTop: 27,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
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

  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 24,
  },

  detailIdentity: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 0,
  },

  detailIcon: {
    width: 22,
    height: 22,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(135, 166, 165, 0.06)',
    marginRight: 8,
  },

  detailLabel: {
    color: colors.dim,
    fontSize: 9,
    lineHeight: 12,
  },

  detailValue: {
    maxWidth: '52%',
    color: colors.text,
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '800',
    textAlign: 'right',
  },

  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 27,
  },

  tagsRowSpaced: {
    marginTop: 10,
  },

  tagsLabel: {
    width: 30,
    color: colors.dim,
    fontSize: 8,
    lineHeight: 10,
    fontWeight: '700',
    marginRight: 7,
  },

  tags: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingRight: 4,
  },
});