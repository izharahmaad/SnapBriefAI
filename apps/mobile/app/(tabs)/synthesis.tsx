import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GlassCard } from '@/components/GlassCard';
import { getBriefs } from '@/lib/storage';
import { colors, radius, spacing } from '@/theme';
import { Brief } from '@/types/brief';

export default function SynthesisScreen() {
  const insets = useSafeAreaInsets();

  const [items, setItems] = useState<Brief[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadBriefs = useCallback(async () => {
    try {
      const briefs = await getBriefs();
      setItems(briefs);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      const refresh = async () => {
        try {
          const briefs = await getBriefs();

          if (active) {
            setItems(briefs);
            setLoading(false);
          }
        } catch {
          if (active) {
            setItems([]);
            setLoading(false);
          }
        }
      };

      refresh();

      const interval = setInterval(refresh, 5000);

      return () => {
        active = false;
        clearInterval(interval);
      };
    }, []),
  );

  useEffect(() => {
    loadBriefs();
  }, [loadBriefs]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);

    try {
      const briefs = await getBriefs();
      setItems(briefs);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const sortedItems = useMemo(() => {
    return [...items].sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime(),
    );
  }, [items]);

  const latest = sortedItems[0] ?? null;

  const stats = useMemo(() => {
    const today = new Date();

    const todayCount = items.filter((item) => {
      const date = new Date(item.created_at);

      return (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
      );
    }).length;

    const actions = items.reduce(
      (sum, item) => sum + (item.actions?.length ?? 0),
      0,
    );

    const highPriority = items.filter(
      (item) => item.priority?.toLowerCase() === 'high',
    ).length;

    return {
      total: items.length,
      today: todayCount,
      actions,
      highPriority,
    };
  }, [items]);

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: Math.max(insets.top + 18, 28),
          paddingBottom: insets.bottom + 108,
        },
      ]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={colors.accent}
          colors={[colors.accent]}
          progressBackgroundColor={colors.surface}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.eyebrowRow}>
          <View style={styles.eyebrowMark} />

          <Text style={styles.eyebrow}>02 / SYNTHESIS</Text>
        </View>

        <Text style={styles.title}>Synthesis</Text>

        <Text style={styles.subtitle}>
          A clear view of what your briefs contain, what needs attention,
          and what comes next.
        </Text>
      </View>

      {loading ? (
        <LoadingState />
      ) : items.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <View style={styles.metrics}>
            <Metric
              value={String(stats.total)}
              label="BRIEFS"
              accent
            />

            <View style={styles.metricDivider} />

            <Metric
              value={String(stats.today)}
              label="TODAY"
            />

            <View style={styles.metricDivider} />

            <Metric
              value={String(stats.actions)}
              label="ACTIONS"
            />
          </View>

          {latest ? (
            <View style={styles.section}>
              <SectionHeading
                eyebrow="LATEST"
                title="Your newest brief"
                trailing={
                  <View style={styles.syncStatus}>
                    <View style={styles.syncDot} />
                    <Text style={styles.syncText}>AUTO-SYNC</Text>
                  </View>
                }
              />

              <GlassCard style={styles.latestCard}>
                <View style={styles.metaRow}>
                  <View style={styles.dateGroup}>
                    <Text style={styles.date}>
                      {formatDate(latest.created_at)}
                    </Text>

                    <View style={styles.dateDot} />

                    <Text style={styles.time}>
                      {formatTime(latest.created_at)}
                    </Text>
                  </View>

                  <PriorityLabel priority={latest.priority} />
                </View>

                <Text style={styles.latestTitle} numberOfLines={3}>
                  {latest.title}
                </Text>

                <Text style={styles.latestSummary} numberOfLines={4}>
                  {latest.summary}
                </Text>

                <View style={styles.divider} />

                <View style={styles.signalGrid}>
                  <Signal
                    icon="list-outline"
                    value={String(latest.key_points?.length ?? 0)}
                    label="POINTS"
                  />

                  <Signal
                    icon="arrow-forward-outline"
                    value={String(latest.actions?.length ?? 0)}
                    label="ACTIONS"
                  />

                  <Signal
                    icon="pricetag-outline"
                    value={String(latest.tags?.length ?? 0)}
                    label="TAGS"
                  />
                </View>

                {latest.actions?.length ? (
                  <View style={styles.nextAction}>
                    <View style={styles.nextActionHeader}>
                      <Ionicons
                        name="arrow-forward-circle-outline"
                        size={13}
                        color={colors.accent}
                      />

                      <Text style={styles.nextActionLabel}>
                        NEXT ACTION
                      </Text>
                    </View>

                    <Text style={styles.nextActionText} numberOfLines={2}>
                      {latest.actions[0]}
                    </Text>
                  </View>
                ) : null}
              </GlassCard>
            </View>
          ) : null}

          <View style={styles.section}>
            <SectionHeading
              eyebrow="BREAKDOWN"
              title="What's being produced"
            />

            <View style={styles.breakdown}>
              <BreakdownRow
                icon="layers-outline"
                title="Structured briefs"
                description="Generated from raw input"
                value={String(stats.total)}
              />

              <RowDivider />

              <BreakdownRow
                icon="alert-circle-outline"
                title="High priority"
                description="Briefs marked for closer attention"
                value={String(stats.highPriority)}
                accent={stats.highPriority > 0}
              />

              <RowDivider />

              <BreakdownRow
                icon="checkmark-done-outline"
                title="Action items"
                description="Next steps identified across briefs"
                value={String(stats.actions)}
              />
            </View>
          </View>

          {sortedItems.length > 1 ? (
            <View style={styles.section}>
              <SectionHeading
                eyebrow="RECENT"
                title="Earlier briefs"
                trailing={
                  <Text style={styles.countText}>
                    {sortedItems.length - 1}
                  </Text>
                }
              />

              <View style={styles.recentList}>
                {sortedItems.slice(1, 5).map((item, index) => (
                  <RecentBrief
                    key={item.id}
                    item={item}
                    index={index}
                  />
                ))}
              </View>
            </View>
          ) : null}
        </>
      )}
    </ScrollView>
  );
}

function Metric({
  value,
  label,
  accent = false,
}: {
  value: string;
  label: string;
  accent?: boolean;
}) {
  return (
    <View style={styles.metric}>
      <Text
        style={[
          styles.metricValue,
          accent && styles.metricValueAccent,
        ]}
      >
        {value}
      </Text>

      <Text style={styles.metricLabel}>{label}</Text>

      <View
        style={[
          styles.metricLine,
          accent && styles.metricLineActive,
        ]}
      />
    </View>
  );
}

function SectionHeading({
  eyebrow,
  title,
  trailing,
}: {
  eyebrow: string;
  title: string;
  trailing?: React.ReactNode;
}) {
  return (
    <View style={styles.sectionHeading}>
      <View>
        <Text style={styles.sectionEyebrow}>{eyebrow}</Text>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>

      {trailing}
    </View>
  );
}

function PriorityLabel({
  priority,
}: {
  priority?: string;
}) {
  const value = priority?.toLowerCase() || 'normal';
  const isHigh = value === 'high';

  return (
    <View style={styles.priority}>
      <View
        style={[
          styles.priorityDot,
          isHigh && styles.priorityDotHigh,
        ]}
      />

      <Text
        style={[
          styles.priorityText,
          isHigh && styles.priorityTextHigh,
        ]}
      >
        {value.toUpperCase()}
      </Text>
    </View>
  );
}

function Signal({
  icon,
  value,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  label: string;
}) {
  return (
    <View style={styles.signal}>
      <Ionicons
        name={icon}
        size={13}
        color={colors.accent}
      />

      <View style={styles.signalCopy}>
        <Text style={styles.signalValue}>{value}</Text>
        <Text style={styles.signalLabel}>{label}</Text>
      </View>
    </View>
  );
}

function BreakdownRow({
  icon,
  title,
  description,
  value,
  accent = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <View style={styles.breakdownRow}>
      <View style={styles.breakdownIcon}>
        <Ionicons
          name={icon}
          size={15}
          color={accent ? colors.accent : colors.muted}
        />
      </View>

      <View style={styles.breakdownCopy}>
        <Text style={styles.breakdownTitle}>{title}</Text>

        <Text style={styles.breakdownDescription}>
          {description}
        </Text>
      </View>

      <Text
        style={[
          styles.breakdownValue,
          accent && styles.breakdownValueAccent,
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

function RowDivider() {
  return <View style={styles.rowDivider} />;
}

function RecentBrief({
  item,
  index,
}: {
  item: Brief;
  index: number;
}) {
  return (
    <View style={styles.recentItem}>
      <Text style={styles.recentIndex}>
        {String(index + 1).padStart(2, '0')}
      </Text>

      <View style={styles.recentCopy}>
        <Text
          style={styles.recentTitle}
          numberOfLines={1}
        >
          {item.title}
        </Text>

        <Text style={styles.recentDate}>
          {formatDate(item.created_at)}
        </Text>
      </View>

      <PriorityLabel priority={item.priority} />
    </View>
  );
}

function LoadingState() {
  return (
    <View style={styles.state}>
      <ActivityIndicator
        size="small"
        color={colors.accent}
      />

      <Text style={styles.stateTitle}>
        Loading synthesis
      </Text>

      <Text style={styles.stateText}>
        Reading your saved briefs.
      </Text>
    </View>
  );
}

function EmptyState() {
  return (
    <View style={styles.state}>
      <View style={styles.emptyIcon}>
        <Ionicons
          name="layers-outline"
          size={22}
          color={colors.accent}
        />
      </View>

      <Text style={styles.stateTitle}>
        Nothing to synthesize yet
      </Text>

      <Text style={styles.stateText}>
        Create your first brief from Home and your latest
        synthesis will appear here.
      </Text>
    </View>
  );
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Unknown date';
  }

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  content: {
    paddingHorizontal: spacing.xl,
  },

  header: {
    marginBottom: 28,
  },

  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  eyebrowMark: {
    width: 5,
    height: 5,
    borderRadius: 999,
    backgroundColor: colors.accent,
    marginRight: 7,
  },

  eyebrow: {
    color: colors.accentSoft,
    fontSize: 8,
    lineHeight: 10,
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
    maxWidth: 335,
    marginTop: 6,
  },

  metrics: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },

  metric: {
    flex: 1,
  },

  metricValue: {
    color: colors.white,
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
  },

  metricValueAccent: {
    color: colors.accentSoft,
  },

  metricLabel: {
    color: colors.dim,
    fontSize: 7,
    lineHeight: 9,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 4,
  },

  metricLine: {
    width: 16,
    height: 2,
    borderRadius: 999,
    backgroundColor: colors.border,
    marginTop: 7,
  },

  metricLineActive: {
    backgroundColor: colors.accent,
    width: 20,
  },

  metricDivider: {
    width: 1,
    height: 34,
    backgroundColor: colors.border,
    marginHorizontal: 14,
  },

  section: {
    marginBottom: 30,
  },

  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 11,
  },

  sectionEyebrow: {
    color: colors.dim,
    fontSize: 7,
    lineHeight: 9,
    fontWeight: '900',
    letterSpacing: 1.3,
  },

  sectionTitle: {
    color: colors.white,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '900',
    marginTop: 4,
  },

  syncStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 2,
  },

  syncDot: {
    width: 4,
    height: 4,
    borderRadius: 999,
    backgroundColor: colors.accent,
    marginRight: 5,
  },

  syncText: {
    color: colors.accentSoft,
    fontSize: 7,
    lineHeight: 9,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  countText: {
    color: colors.accentSoft,
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '800',
    paddingBottom: 2,
  },

  latestCard: {
    padding: 17,
    borderRadius: radius.xl,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  dateGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  date: {
    color: colors.dim,
    fontSize: 8,
    lineHeight: 10,
    fontWeight: '700',
  },

  dateDot: {
    width: 3,
    height: 3,
    borderRadius: 999,
    backgroundColor: colors.border,
    marginHorizontal: 7,
  },

  time: {
    color: colors.dim,
    fontSize: 8,
    lineHeight: 10,
    fontWeight: '700',
  },

  priority: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  priorityDot: {
    width: 5,
    height: 5,
    borderRadius: 999,
    backgroundColor: colors.dim,
    marginRight: 5,
  },

  priorityDotHigh: {
    backgroundColor: colors.accent,
  },

  priorityText: {
    color: colors.muted,
    fontSize: 7,
    lineHeight: 9,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  priorityTextHigh: {
    color: colors.accentSoft,
  },

  latestTitle: {
    color: colors.white,
    fontSize: 23,
    lineHeight: 28,
    fontWeight: '900',
    letterSpacing: -0.55,
    marginTop: 16,
  },

  latestSummary: {
    color: colors.muted,
    fontSize: 11,
    lineHeight: 18,
    marginTop: 7,
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },

  signalGrid: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  signal: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  signalCopy: {
    marginLeft: 6,
  },

  signalValue: {
    color: colors.white,
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '900',
  },

  signalLabel: {
    color: colors.dim,
    fontSize: 7,
    lineHeight: 9,
    fontWeight: '700',
    letterSpacing: 0.7,
    marginTop: 2,
  },

  nextAction: {
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  nextActionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 7,
  },

  nextActionLabel: {
    color: colors.accent,
    fontSize: 7,
    lineHeight: 9,
    fontWeight: '900',
    letterSpacing: 1.1,
    marginLeft: 6,
  },

  nextActionText: {
    color: colors.text,
    fontSize: 10,
    lineHeight: 16,
  },

  breakdown: {
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },

  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 66,
    paddingHorizontal: 14,
  },

  breakdownIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(45, 225, 214, 0.055)',
    marginRight: 10,
  },

  breakdownCopy: {
    flex: 1,
    paddingRight: 10,
  },

  breakdownTitle: {
    color: colors.white,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '800',
  },

  breakdownDescription: {
    color: colors.dim,
    fontSize: 8,
    lineHeight: 13,
    marginTop: 3,
  },

  breakdownValue: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '900',
  },

  breakdownValueAccent: {
    color: colors.accent,
  },

  rowDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 56,
  },

  recentList: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },

  recentItem: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  recentIndex: {
    width: 30,
    color: colors.accent,
    fontSize: 8,
    lineHeight: 10,
    fontWeight: '900',
  },

  recentCopy: {
    flex: 1,
    paddingRight: 10,
  },

  recentTitle: {
    color: colors.white,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '800',
  },

  recentDate: {
    color: colors.dim,
    fontSize: 8,
    lineHeight: 10,
    marginTop: 3,
  },

  state: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 110,
    paddingHorizontal: 28,
  },

  emptyIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(45, 225, 214, 0.055)',
    borderWidth: 1,
    borderColor: 'rgba(45, 225, 214, 0.11)',
    marginBottom: 15,
  },

  stateTitle: {
    color: colors.white,
    fontSize: 17,
    lineHeight: 21,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 14,
  },

  stateText: {
    color: colors.dim,
    fontSize: 10,
    lineHeight: 17,
    textAlign: 'center',
    maxWidth: 285,
    marginTop: 6,
  },
});