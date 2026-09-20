import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
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

      async function refresh() {
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
      }

      refresh();

      const interval = setInterval(() => {
        refresh();
      }, 5000);

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
      (item) =>
        item.priority?.toLowerCase() === 'high',
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
      {/* =========================================================
          HEADER
      ========================================================= */}
      <View style={styles.header}>
        <View style={styles.eyebrowRow}>
          <View style={styles.eyebrowDot} />

          <Text style={styles.eyebrow}>
            02 / SYNTHESIS
          </Text>
        </View>

        <Text style={styles.title}>
          Synthesis
        </Text>

        <Text style={styles.subtitle}>
          See the signal across everything you've turned
          into a brief.
        </Text>
      </View>

      {loading ? (
        <LoadingState />
      ) : items.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {/* =====================================================
              OVERVIEW
          ===================================================== */}
          <View style={styles.overview}>
            <SynthesisMetric
              value={String(stats.total)}
              label="BRIEFS"
            />

            <View style={styles.overviewDivider} />

            <SynthesisMetric
              value={String(stats.today)}
              label="TODAY"
            />

            <View style={styles.overviewDivider} />

            <SynthesisMetric
              value={String(stats.actions)}
              label="ACTIONS"
            />
          </View>

          {/* =====================================================
              LATEST SYNTHESIS
          ===================================================== */}
          {latest ? (
            <View style={styles.latestSection}>
              <View style={styles.sectionHeader}>
                <View>
                  <Text style={styles.sectionLabel}>
                    LATEST SYNTHESIS
                  </Text>

                  <Text style={styles.sectionTitle}>
                    Your newest signal
                  </Text>
                </View>

                <View style={styles.liveStatus}>
                  <View style={styles.liveDot} />

                  <Text style={styles.liveText}>
                    LIVE
                  </Text>
                </View>
              </View>

              <GlassCard style={styles.latestCard}>
                <View style={styles.latestHeader}>
                  <View style={styles.latestMeta}>
                    <Text style={styles.latestDate}>
                      {formatDate(latest.created_at)}
                    </Text>

                    <View style={styles.metaSeparator} />

                    <Text style={styles.latestTime}>
                      {formatTime(latest.created_at)}
                    </Text>
                  </View>

                  <PriorityLabel
                    priority={latest.priority}
                  />
                </View>

                <Text
                  style={styles.latestTitle}
                  numberOfLines={3}
                >
                  {latest.title}
                </Text>

                <Text
                  style={styles.latestSummary}
                  numberOfLines={4}
                >
                  {latest.summary}
                </Text>

                <View style={styles.latestDivider} />

                <View style={styles.signalRow}>
                  <SignalItem
                    icon="list-outline"
                    value={String(
                      latest.key_points?.length ?? 0,
                    )}
                    label="key points"
                  />

                  <SignalItem
                    icon="arrow-forward-outline"
                    value={String(
                      latest.actions?.length ?? 0,
                    )}
                    label="actions"
                  />

                  <SignalItem
                    icon="pricetag-outline"
                    value={String(
                      latest.tags?.length ?? 0,
                    )}
                    label="tags"
                  />
                </View>

                {latest.actions?.length ? (
                  <View style={styles.actionPreview}>
                    <Text style={styles.actionPreviewLabel}>
                      NEXT ACTION
                    </Text>

                    <View style={styles.actionPreviewRow}>
                      <View style={styles.actionMarker}>
                        <Ionicons
                          name="arrow-forward"
                          size={10}
                          color={colors.bg}
                        />
                      </View>

                      <Text
                        style={styles.actionPreviewText}
                        numberOfLines={2}
                      >
                        {latest.actions[0]}
                      </Text>
                    </View>
                  </View>
                ) : null}
              </GlassCard>
            </View>
          ) : null}

          {/* =====================================================
              SIGNAL BREAKDOWN
          ===================================================== */}
          <View style={styles.breakdownSection}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionLabel}>
                  SIGNAL BREAKDOWN
                </Text>

                <Text style={styles.sectionTitle}>
                  What's being produced
                </Text>
              </View>
            </View>

            <View style={styles.breakdown}>
              <BreakdownRow
                icon="layers-outline"
                title="Structured briefs"
                value={`${stats.total}`}
                description="Generated from your raw input"
              />

              <View style={styles.rowDivider} />

              <BreakdownRow
                icon="alert-circle-outline"
                title="High priority"
                value={`${stats.highPriority}`}
                description="Briefs marked for closer attention"
                accent={stats.highPriority > 0}
              />

              <View style={styles.rowDivider} />

              <BreakdownRow
                icon="checkmark-done-outline"
                title="Action items"
                value={`${stats.actions}`}
                description="Next steps identified across briefs"
              />
            </View>
          </View>

          {/* =====================================================
              RECENT ACTIVITY
          ===================================================== */}
          {sortedItems.length > 1 ? (
            <View style={styles.recentSection}>
              <View style={styles.sectionHeader}>
                <View>
                  <Text style={styles.sectionLabel}>
                    RECENT ACTIVITY
                  </Text>

                  <Text style={styles.sectionTitle}>
                    Earlier briefs
                  </Text>
                </View>

                <Text style={styles.recentCount}>
                  {sortedItems.length - 1}
                </Text>
              </View>

              <View style={styles.recentList}>
                {sortedItems
                  .slice(1, 5)
                  .map((item, index) => (
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

      <View style={styles.bottomSpace} />
    </ScrollView>
  );
}

function SynthesisMetric({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricValue}>
        {value}
      </Text>

      <Text style={styles.metricLabel}>
        {label}
      </Text>

      <View style={styles.metricAccent} />
    </View>
  );
}

function PriorityLabel({
  priority,
}: {
  priority?: string;
}) {
  const value =
    priority?.toLowerCase() || 'normal';

  const high = value === 'high';

  return (
    <View style={styles.priority}>
      <View
        style={[
          styles.priorityDot,
          high && styles.priorityDotHigh,
        ]}
      />

      <Text
        style={[
          styles.priorityText,
          high && styles.priorityTextHigh,
        ]}
      >
        {value.toUpperCase()}
      </Text>
    </View>
  );
}

function SignalItem({
  icon,
  value,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  label: string;
}) {
  return (
    <View style={styles.signalItem}>
      <Ionicons
        name={icon}
        size={13}
        color={colors.accent}
      />

      <Text style={styles.signalValue}>
        {value}
      </Text>

      <Text style={styles.signalLabel}>
        {label}
      </Text>
    </View>
  );
}

function BreakdownRow({
  icon,
  title,
  value,
  description,
  accent = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value: string;
  description: string;
  accent?: boolean;
}) {
  return (
    <View style={styles.breakdownRow}>
      <View style={styles.breakdownIcon}>
        <Ionicons
          name={icon}
          size={15}
          color={accent ? colors.accent : colors.dim}
        />
      </View>

      <View style={styles.breakdownCopy}>
        <Text style={styles.breakdownTitle}>
          {title}
        </Text>

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

function RecentBrief({
  item,
  index,
}: {
  item: Brief;
  index: number;
}) {
  return (
    <View style={styles.recentItem}>
      <View style={styles.recentIndex}>
        <Text style={styles.recentIndexText}>
          {String(index + 1).padStart(2, '0')}
        </Text>
      </View>

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
    <View style={styles.emptyState}>
      <View style={styles.emptyLine} />

      <Text style={styles.emptyTitle}>
        Loading your synthesis
      </Text>

      <Text style={styles.emptyText}>
        Reading your saved briefs.
      </Text>
    </View>
  );
}

function EmptyState() {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Ionicons
          name="layers-outline"
          size={23}
          color={colors.accent}
        />
      </View>

      <Text style={styles.emptyTitle}>
        Nothing to synthesize yet
      </Text>

      <Text style={styles.emptyText}>
        Create your first brief from the Home screen.
        Your latest signal will appear here.
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
    paddingBottom: 120,
  },

  /* ============================================================
     HEADER
  ============================================================ */

  header: {
    marginBottom: 28,
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
     OVERVIEW
  ============================================================ */

  overview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 31,
  },

  metric: {
    flex: 1,
  },

  metricValue: {
    color: colors.white,
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '900',
    letterSpacing: -0.6,
  },

  metricLabel: {
    color: colors.dim,
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 4,
  },

  metricAccent: {
    width: 19,
    height: 2,
    borderRadius: 999,
    backgroundColor: colors.accent,
    marginTop: 7,
  },

  overviewDivider: {
    width: 1,
    height: 37,
    backgroundColor: colors.border,
    marginHorizontal: 13,
  },

  /* ============================================================
     SECTION HEADERS
  ============================================================ */

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 11,
  },

  sectionLabel: {
    color: colors.dim,
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 1.3,
  },

  sectionTitle: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '900',
    marginTop: 4,
  },

  liveStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 2,
  },

  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 999,
    backgroundColor: colors.accent,
    marginRight: 5,
  },

  liveText: {
    color: colors.accentSoft,
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  /* ============================================================
     LATEST
  ============================================================ */

  latestSection: {
    marginBottom: 30,
  },

  latestCard: {
    padding: 16,
    borderRadius: radius.xl,
  },

  latestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  latestMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  latestDate: {
    color: colors.dim,
    fontSize: 8,
    fontWeight: '700',
  },

  latestTime: {
    color: colors.dim,
    fontSize: 8,
    fontWeight: '700',
  },

  metaSeparator: {
    width: 3,
    height: 3,
    borderRadius: 999,
    backgroundColor: colors.border,
    marginHorizontal: 7,
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

  latestDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 15,
  },

  signalRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  signalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 14,
  },

  signalValue: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '800',
    marginLeft: 5,
  },

  signalLabel: {
    color: colors.dim,
    fontSize: 8,
    marginLeft: 3,
  },

  actionPreview: {
    marginTop: 16,
    paddingTop: 13,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  actionPreviewLabel: {
    color: colors.accent,
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 1.1,
    marginBottom: 8,
  },

  actionPreviewRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  actionMarker: {
    width: 20,
    height: 20,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    marginRight: 8,
    marginTop: 1,
  },

  actionPreviewText: {
    flex: 1,
    color: colors.text,
    fontSize: 10,
    lineHeight: 16,
  },

  /* ============================================================
     BREAKDOWN
  ============================================================ */

  breakdownSection: {
    marginBottom: 30,
  },

  breakdown: {
    overflow: 'hidden',
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },

  breakdownIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(45, 225, 214, 0.06)',
    marginRight: 10,
  },

  breakdownCopy: {
    flex: 1,
  },

  breakdownTitle: {
    color: colors.white,
    fontSize: 10,
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
    fontSize: 14,
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

  /* ============================================================
     RECENT
  ============================================================ */

  recentSection: {
    marginBottom: 20,
  },

  recentCount: {
    color: colors.accentSoft,
    fontSize: 8,
    fontWeight: '800',
    paddingBottom: 3,
  },

  recentList: {
    overflow: 'hidden',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },

  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 64,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  recentIndex: {
    width: 30,
  },

  recentIndexText: {
    color: colors.accent,
    fontSize: 8,
    fontWeight: '900',
  },

  recentCopy: {
    flex: 1,
    paddingRight: 10,
  },

  recentTitle: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '800',
  },

  recentDate: {
    color: colors.dim,
    fontSize: 8,
    marginTop: 3,
  },

  /* ============================================================
     EMPTY / LOADING
  ============================================================ */

  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 110,
    paddingHorizontal: 28,
  },

  emptyIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(45, 225, 214, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(45, 225, 214, 0.12)',
    marginBottom: 15,
  },

  emptyLine: {
    width: 22,
    height: 2,
    borderRadius: 999,
    backgroundColor: colors.accent,
    marginBottom: 18,
  },

  emptyTitle: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '900',
    textAlign: 'center',
  },

  emptyText: {
    color: colors.dim,
    fontSize: 10,
    lineHeight: 17,
    textAlign: 'center',
    marginTop: 6,
    maxWidth: 285,
  },

  bottomSpace: {
    height: 20,
  },
});