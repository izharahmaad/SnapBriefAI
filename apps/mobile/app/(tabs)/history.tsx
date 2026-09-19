import { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GlassCard } from '@/components/GlassCard';
import { clearBriefs, getBriefs } from '@/lib/storage';
import { colors, radius, spacing } from '@/theme';
import { Brief } from '@/types/brief';

export default function History() {
  const insets = useSafeAreaInsets();

  const [items, setItems] = useState<Brief[]>([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = useCallback(async () => {
    try {
      setLoading(true);

      const briefs = await getBriefs();
      setItems(briefs);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [loadHistory]),
  );

  const stats = useMemo(() => {
    const total = items.length;

    const actions = items.reduce(
      (sum, item) => sum + (item.actions?.length ?? 0),
      0,
    );

    const points = items.reduce(
      (sum, item) => sum + (item.key_points?.length ?? 0),
      0,
    );

    return {
      total,
      actions,
      points,
    };
  }, [items]);

  const handleClear = () => {
    Alert.alert(
      'Clear history?',
      'This will remove all locally saved briefs from this device.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await clearBriefs();
            setItems([]);
          },
        },
      ],
    );
  };

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
        <View style={styles.headerCopy}>
          <View style={styles.eyebrowRow}>
            <View style={styles.eyebrowDot} />

            <Text style={styles.eyebrow}>
              YOUR WORKSPACE
            </Text>
          </View>

          <Text style={styles.title}>
            History
          </Text>

          <Text style={styles.subtitle}>
            Revisit the briefs you've created.
          </Text>
        </View>

        {items.length > 0 ? (
          <Pressable
            onPress={handleClear}
            hitSlop={8}
            style={({ pressed }) => [
              styles.clearButton,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons
              name="trash-outline"
              size={13}
              color={colors.dim}
            />

            <Text style={styles.clearText}>
              Clear
            </Text>
          </Pressable>
        ) : null}
      </View>

      {/* =========================================================
          OVERVIEW
      ========================================================= */}
      {!loading && items.length > 0 ? (
        <View style={styles.overview}>
          <HistoryMetric
            value={String(stats.total)}
            label="BRIEFS"
          />

          <View style={styles.overviewDivider} />

          <HistoryMetric
            value={String(stats.points)}
            label="KEY POINTS"
          />

          <View style={styles.overviewDivider} />

          <HistoryMetric
            value={String(stats.actions)}
            label="ACTIONS"
          />
        </View>
      ) : null}

      {/* =========================================================
          CONTENT
      ========================================================= */}
      {loading ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons
              name="time-outline"
              size={22}
              color={colors.accent}
            />
          </View>

          <Text style={styles.emptyTitle}>
            Loading history
          </Text>

          <Text style={styles.emptyText}>
            Your saved briefs are being loaded.
          </Text>
        </View>
      ) : items.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons
              name="time-outline"
              size={23}
              color={colors.accent}
            />
          </View>

          <Text style={styles.emptyTitle}>
            Nothing here yet
          </Text>

          <Text style={styles.emptyText}>
            Your generated briefs will appear here so
            you can return to them whenever you need.
          </Text>
        </View>
      ) : (
        <View style={styles.list}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>
              RECENT BRIEFS
            </Text>

            <Text style={styles.listCount}>
              {items.length}
            </Text>
          </View>

          {items.map((item, index) => (
            <HistoryItem
              key={item.id}
              item={item}
              index={index}
            />
          ))}
        </View>
      )}

      <View style={styles.bottomSpace} />
    </ScrollView>
  );
}

function HistoryMetric({
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

function HistoryItem({
  item,
  index,
}: {
  item: Brief;
  index: number;
}) {
  const date = new Date(item.created_at);

  const formattedDate = Number.isNaN(
    date.getTime(),
  )
    ? 'Unknown date'
    : date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

  const priority =
    item.priority?.toLowerCase() || 'normal';

  return (
    <GlassCard style={styles.item}>
      <View style={styles.itemHeader}>
        <View style={styles.itemMeta}>
          <Text style={styles.index}>
            {String(index + 1).padStart(2, '0')}
          </Text>

          <View style={styles.metaDivider} />

          <Text style={styles.date}>
            {formattedDate}
          </Text>
        </View>

        <View style={styles.priority}>
          <View
            style={[
              styles.priorityDot,
              priority === 'high' &&
                styles.priorityDotHigh,
            ]}
          />

          <Text
            style={[
              styles.priorityText,
              priority === 'high' &&
                styles.priorityTextHigh,
            ]}
          >
            {priority.toUpperCase()}
          </Text>
        </View>
      </View>

      <Text
        style={styles.itemTitle}
        numberOfLines={2}
      >
        {item.title}
      </Text>

      <Text
        style={styles.summary}
        numberOfLines={3}
      >
        {item.summary}
      </Text>

      <View style={styles.itemFooter}>
        <View style={styles.footerStat}>
          <Ionicons
            name="list-outline"
            size={12}
            color={colors.dim}
          />

          <Text style={styles.footerText}>
            {item.key_points?.length ?? 0} points
          </Text>
        </View>

        <View style={styles.footerSeparator} />

        <View style={styles.footerStat}>
          <Ionicons
            name="arrow-forward-outline"
            size={12}
            color={colors.dim}
          />

          <Text style={styles.footerText}>
            {item.actions?.length ?? 0} actions
          </Text>
        </View>

        {item.tags?.length ? (
          <>
            <View style={styles.footerSeparator} />

            <View style={styles.footerStat}>
              <Ionicons
                name="pricetag-outline"
                size={12}
                color={colors.dim}
              />

              <Text style={styles.footerText}>
                {item.tags.length}
              </Text>
            </View>
          </>
        ) : null}
      </View>
    </GlassCard>
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
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 14,
  },

  headerCopy: {
    flex: 1,
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
    marginTop: 4,
  },

  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 4,
  },

  clearText: {
    color: colors.dim,
    fontSize: 9,
    fontWeight: '800',
    marginLeft: 4,
  },

  pressed: {
    opacity: 0.58,
  },

  /* ============================================================
     OVERVIEW
  ============================================================ */

  overview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 28,
    marginBottom: 30,
  },

  metric: {
    flex: 1,
  },

  metricValue: {
    color: colors.white,
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
  },

  metricLabel: {
    color: colors.dim,
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 0.9,
    marginTop: 3,
  },

  metricAccent: {
    width: 18,
    height: 2,
    borderRadius: 999,
    backgroundColor: colors.accent,
    marginTop: 7,
  },

  overviewDivider: {
    width: 1,
    height: 36,
    backgroundColor: colors.border,
    marginHorizontal: 12,
  },

  /* ============================================================
     LIST
  ============================================================ */

  list: {
    marginTop: 30,
  },

  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 11,
  },

  listTitle: {
    color: colors.dim,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.4,
  },

  listCount: {
    color: colors.accentSoft,
    fontSize: 8,
    fontWeight: '800',
  },

  /* ============================================================
     HISTORY ITEM
  ============================================================ */

  item: {
    padding: 16,
    marginBottom: 10,
    borderRadius: radius.xl,
  },

  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },

  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  index: {
    color: colors.accent,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.7,
  },

  metaDivider: {
    width: 1,
    height: 12,
    backgroundColor: colors.border,
    marginHorizontal: 8,
  },

  date: {
    color: colors.dim,
    fontSize: 9,
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
    backgroundColor: colors.muted,
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

  itemTitle: {
    color: colors.white,
    fontSize: 18,
    lineHeight: 23,
    fontWeight: '900',
    letterSpacing: -0.35,
    marginTop: 15,
  },

  summary: {
    color: colors.muted,
    fontSize: 11,
    lineHeight: 18,
    marginTop: 7,
  },

  itemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 14,
    paddingTop: 11,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  footerStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  footerText: {
    color: colors.dim,
    fontSize: 8,
    fontWeight: '700',
    marginLeft: 4,
  },

  footerSeparator: {
    width: 3,
    height: 3,
    borderRadius: 999,
    backgroundColor: colors.border,
    marginHorizontal: 8,
  },

  /* ============================================================
     EMPTY
  ============================================================ */

  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingTop: 105,
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

  emptyTitle: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '900',
  },

  emptyText: {
    color: colors.dim,
    textAlign: 'center',
    fontSize: 10,
    lineHeight: 17,
    marginTop: 6,
    maxWidth: 290,
  },

  bottomSpace: {
    height: 20,
  },
});