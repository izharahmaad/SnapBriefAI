import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, radius, spacing } from '@/theme';
import { Brief } from '@/types/brief';
import { getBriefs } from '@/lib/storage';

type Filter = 'all' | 'high' | 'recent';

const RECENT_WINDOW = 7 * 24 * 60 * 60 * 1000;

export default function VaultScreen() {
  const insets = useSafeAreaInsets();

  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] =
    useState<Filter>('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] =
    useState(false);

  const loadBriefs = useCallback(async () => {
    try {
      const stored = await getBriefs();

      const ordered = [...stored].sort(
        (a, b) =>
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime(),
      );

      setBriefs(ordered);
    } catch {
      setBriefs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBriefs();
  }, [loadBriefs]);

  useEffect(() => {
    const interval = setInterval(() => {
      loadBriefs();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [loadBriefs]);

  const filteredBriefs = useMemo(() => {
    const query = search.trim().toLowerCase();
    const now = Date.now();

    return briefs.filter((brief) => {
      const matchesSearch =
        !query ||
        brief.title.toLowerCase().includes(query) ||
        brief.summary.toLowerCase().includes(query) ||
        brief.tags?.some((tag) =>
          tag.toLowerCase().includes(query),
        );

      if (!matchesSearch) {
        return false;
      }

      if (filter === 'high') {
        return (
          brief.priority?.toLowerCase() ===
          'high'
        );
      }

      if (filter === 'recent') {
        return (
          now -
            new Date(
              brief.created_at,
            ).getTime() <
          RECENT_WINDOW
        );
      }

      return true;
    });
  }, [briefs, filter, search]);

  const highPriorityCount = useMemo(() => {
    return briefs.filter(
      (brief) =>
        brief.priority?.toLowerCase() ===
        'high',
    ).length;
  }, [briefs]);

  const recentCount = useMemo(() => {
    const now = Date.now();

    return briefs.filter(
      (brief) =>
        now -
          new Date(
            brief.created_at,
          ).getTime() <
        RECENT_WINDOW,
    ).length;
  }, [briefs]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);

    try {
      const stored = await getBriefs();

      const ordered = [...stored].sort(
        (a, b) =>
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime(),
      );

      setBriefs(ordered);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const clearSearch = () => {
    setSearch('');
  };

  const hasActiveFilter =
    filter !== 'all' || search.trim().length > 0;

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: Math.max(
            insets.top + 18,
            28,
          ),
          paddingBottom:
            insets.bottom + 105,
        },
      ]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={colors.accent}
          colors={[colors.accent]}
          progressBackgroundColor={
            colors.surface
          }
        />
      }
      keyboardShouldPersistTaps="handled"
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
              03 / VAULT
            </Text>
          </View>

          <Text style={styles.title}>
            Your brief archive.
          </Text>

          <Text style={styles.subtitle}>
            Everything you've created, kept
            ready to revisit.
          </Text>
        </View>

        <View style={styles.headerIcon}>
          <Ionicons
            name="archive-outline"
            size={19}
            color={colors.accent}
          />
        </View>
      </View>

      {/* =========================================================
          OVERVIEW
      ========================================================= */}

      <View style={styles.overview}>
        <Metric
          value={String(briefs.length)}
          label="SAVED"
          active
        />

        <View style={styles.metricDivider} />

        <Metric
          value={String(highPriorityCount)}
          label="HIGH"
        />

        <View style={styles.metricDivider} />

        <Metric
          value={String(recentCount)}
          label="7 DAYS"
        />
      </View>

      {/* =========================================================
          SEARCH
      ========================================================= */}

      <View style={styles.searchBox}>
        <Ionicons
          name="search-outline"
          size={17}
          color={colors.dim}
        />

        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search your briefs..."
          placeholderTextColor={colors.dim}
          style={styles.searchInput}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
        />

        {search.length > 0 ? (
          <Pressable
            onPress={clearSearch}
            hitSlop={8}
            style={({ pressed }) => [
              styles.searchClear,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons
              name="close"
              size={14}
              color={colors.dim}
            />
          </Pressable>
        ) : null}
      </View>

      {/* =========================================================
          FILTERS
      ========================================================= */}

      <View style={styles.filterArea}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={
            styles.filterContent
          }
        >
          <FilterButton
            label="All"
            count={briefs.length}
            active={filter === 'all'}
            onPress={() => setFilter('all')}
          />

          <FilterButton
            label="High priority"
            count={highPriorityCount}
            active={filter === 'high'}
            onPress={() =>
              setFilter('high')
            }
          />

          <FilterButton
            label="Last 7 days"
            count={recentCount}
            active={filter === 'recent'}
            onPress={() =>
              setFilter('recent')
            }
          />
        </ScrollView>
      </View>

      {/* =========================================================
          LIST HEADER
      ========================================================= */}

      <View style={styles.listHeader}>
        <View>
          <Text style={styles.listEyebrow}>
            ARCHIVE
          </Text>

          <Text style={styles.listTitle}>
            {filteredBriefs.length}{' '}
            {filteredBriefs.length === 1
              ? 'brief'
              : 'briefs'}
          </Text>
        </View>

        {hasActiveFilter ? (
          <Pressable
            onPress={() => {
              setSearch('');
              setFilter('all');
            }}
            style={({ pressed }) => [
              styles.resetButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.resetText}>
              Reset
            </Text>
          </Pressable>
        ) : (
          <View style={styles.archiveStatus}>
            <View style={styles.archiveDot} />

            <Text
              style={
                styles.archiveStatusText
              }
            >
              SAVED LOCALLY
            </Text>
          </View>
        )}
      </View>

      {/* =========================================================
          CONTENT
      ========================================================= */}

      {loading ? (
        <LoadingState />
      ) : filteredBriefs.length > 0 ? (
        <View style={styles.list}>
          {filteredBriefs.map(
            (brief, index) => (
              <VaultItem
                key={brief.id}
                brief={brief}
                index={index}
                last={
                  index ===
                  filteredBriefs.length - 1
                }
              />
            ),
          )}
        </View>
      ) : (
        <EmptyVault
          hasBriefs={briefs.length > 0}
        />
      )}

      <View style={styles.bottomSpace} />
    </ScrollView>
  );
}

function Metric({
  value,
  label,
  active = false,
}: {
  value: string;
  label: string;
  active?: boolean;
}) {
  return (
    <View style={styles.metric}>
      <Text
        style={[
          styles.metricValue,
          active &&
            styles.metricValueActive,
        ]}
      >
        {value}
      </Text>

      <Text style={styles.metricLabel}>
        {label}
      </Text>

      <View
        style={[
          styles.metricLine,
          active &&
            styles.metricLineActive,
        ]}
      />
    </View>
  );
}

function FilterButton({
  label,
  count,
  active,
  onPress,
}: {
  label: string;
  count: number;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.filterButton,
        active &&
          styles.filterButtonActive,
        pressed && styles.pressed,
      ]}
    >
      <Text
        style={[
          styles.filterText,
          active &&
            styles.filterTextActive,
        ]}
      >
        {label}
      </Text>

      <View
        style={[
          styles.filterCount,
          active &&
            styles.filterCountActive,
        ]}
      >
        <Text
          style={[
            styles.filterCountText,
            active &&
              styles.filterCountTextActive,
          ]}
        >
          {count}
        </Text>
      </View>
    </Pressable>
  );
}

function VaultItem({
  brief,
  index,
  last,
}: {
  brief: Brief;
  index: number;
  last: boolean;
}) {
  const priority =
    brief.priority?.toLowerCase() ||
    'normal';

  const isHigh = priority === 'high';

  return (
    <View
      style={[
        styles.item,
        last && styles.itemLast,
      ]}
    >
      {/* Meta */}

      <View style={styles.itemMetaRow}>
        <View style={styles.itemMeta}>
          <Text style={styles.itemIndex}>
            {String(index + 1).padStart(
              2,
              '0',
            )}
          </Text>

          <View style={styles.metaDivider} />

          <Text style={styles.itemDate}>
            {formatDate(
              brief.created_at,
            )}
          </Text>
        </View>

        <View style={styles.priority}>
          <View
            style={[
              styles.priorityDot,
              isHigh &&
                styles.priorityDotHigh,
            ]}
          />

          <Text
            style={[
              styles.priorityText,
              isHigh &&
                styles.priorityTextHigh,
            ]}
          >
            {priority.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Content */}

      <Text
        style={styles.itemTitle}
        numberOfLines={2}
      >
        {brief.title}
      </Text>

      <Text
        style={styles.itemSummary}
        numberOfLines={3}
      >
        {brief.summary}
      </Text>

      {/* Stats */}

      <View style={styles.itemFooter}>
        <ItemStat
          icon="list-outline"
          value={
            brief.key_points?.length ?? 0
          }
          label="points"
        />

        <View style={styles.statDivider} />

        <ItemStat
          icon="arrow-forward-outline"
          value={
            brief.actions?.length ?? 0
          }
          label="actions"
        />

        {brief.tags?.length ? (
          <>
            <View
              style={styles.statDivider}
            />

            <ItemStat
              icon="pricetag-outline"
              value={brief.tags.length}
              label="tags"
            />
          </>
        ) : null}
      </View>
    </View>
  );
}

function ItemStat({
  icon,
  value,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  value: number;
  label: string;
}) {
  return (
    <View style={styles.itemStat}>
      <Ionicons
        name={icon}
        size={12}
        color={colors.dim}
      />

      <Text style={styles.itemStatText}>
        {value} {label}
      </Text>
    </View>
  );
}

function LoadingState() {
  return (
    <View style={styles.loading}>
      <ActivityIndicator
        size="small"
        color={colors.accent}
      />

      <Text style={styles.loadingTitle}>
        Loading archive
      </Text>

      <Text style={styles.loadingText}>
        Reading your saved briefs.
      </Text>
    </View>
  );
}

function EmptyVault({
  hasBriefs,
}: {
  hasBriefs: boolean;
}) {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <Ionicons
          name={
            hasBriefs
              ? 'search-outline'
              : 'archive-outline'
          }
          size={22}
          color={colors.accent}
        />
      </View>

      <Text style={styles.emptyTitle}>
        {hasBriefs
          ? 'Nothing matches'
          : 'Your vault is empty'}
      </Text>

      <Text style={styles.emptyText}>
        {hasBriefs
          ? 'Try another search or switch to a different filter.'
          : 'Create your first brief from Home and it will appear here automatically.'}
      </Text>
    </View>
  );
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Unknown date';
  }

  return date.toLocaleDateString(
    undefined,
    {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    },
  );
}

const styles = StyleSheet.create({
  /* ============================================================
     SCREEN
  ============================================================ */

  page: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  content: {
    paddingHorizontal: spacing.xl,
  },

  pressed: {
    opacity: 0.62,
  },

  /* ============================================================
     HEADER
  ============================================================ */

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginBottom: 29,
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
    lineHeight: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
  },

  title: {
    color: colors.white,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '900',
    letterSpacing: -0.9,
    marginTop: 6,
  },

  subtitle: {
    color: colors.dim,
    fontSize: 10,
    lineHeight: 16,
    maxWidth: 315,
    marginTop: 5,
  },

  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      'rgba(45, 225, 214, 0.055)',
    borderWidth: 1,
    borderColor:
      'rgba(45, 225, 214, 0.11)',
  },

  /* ============================================================
     OVERVIEW
  ============================================================ */

  overview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 27,
  },

  metric: {
    flex: 1,
  },

  metricValue: {
    color: colors.white,
    fontSize: 23,
    lineHeight: 27,
    fontWeight: '900',
    letterSpacing: -0.5,
  },

  metricValueActive: {
    color: colors.accentSoft,
  },

  metricLabel: {
    color: colors.dim,
    fontSize: 7,
    lineHeight: 9,
    fontWeight: '800',
    letterSpacing: 0.9,
    marginTop: 4,
  },

  metricLine: {
    width: 17,
    height: 2,
    borderRadius: 999,
    backgroundColor: colors.border,
    marginTop: 7,
  },

  metricLineActive: {
    width: 21,
    backgroundColor: colors.accent,
  },

  metricDivider: {
    width: 1,
    height: 36,
    backgroundColor: colors.border,
    marginHorizontal: 12,
  },

  /* ============================================================
     SEARCH
  ============================================================ */

  searchBox: {
    minHeight: 47,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  searchInput: {
    flex: 1,
    color: colors.white,
    fontSize: 11,
    lineHeight: 15,
    marginLeft: 9,
    paddingVertical: 10,
  },

  searchClear: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 8,
  },

  /* ============================================================
     FILTERS
  ============================================================ */

  filterArea: {
    marginTop: 2,
  },

  filterContent: {
    gap: 7,
    paddingVertical: 12,
  },

  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 34,
    paddingLeft: 11,
    paddingRight: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  filterButtonActive: {
    backgroundColor:
      'rgba(45, 225, 214, 0.065)',
    borderColor:
      'rgba(45, 225, 214, 0.24)',
  },

  filterText: {
    color: colors.muted,
    fontSize: 9,
    lineHeight: 11,
    fontWeight: '700',
  },

  filterTextActive: {
    color: colors.accentSoft,
  },

  filterCount: {
    minWidth: 20,
    height: 20,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 7,
    backgroundColor: colors.surface2,
  },

  filterCountActive: {
    backgroundColor:
      'rgba(45, 225, 214, 0.12)',
  },

  filterCountText: {
    color: colors.dim,
    fontSize: 7,
    lineHeight: 9,
    fontWeight: '900',
  },

  filterCountTextActive: {
    color: colors.accent,
  },

  /* ============================================================
     LIST HEADER
  ============================================================ */

  listHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 8,
  },

  listEyebrow: {
    color: colors.dim,
    fontSize: 7,
    lineHeight: 9,
    fontWeight: '900',
    letterSpacing: 1.3,
  },

  listTitle: {
    color: colors.white,
    fontSize: 16,
    lineHeight: 19,
    fontWeight: '900',
    marginTop: 4,
  },

  archiveStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 2,
  },

  archiveDot: {
    width: 4,
    height: 4,
    borderRadius: 999,
    backgroundColor: colors.accent,
    marginRight: 5,
  },

  archiveStatusText: {
    color: colors.dim,
    fontSize: 6.5,
    lineHeight: 9,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  resetButton: {
    paddingBottom: 2,
  },

  resetText: {
    color: colors.accentSoft,
    fontSize: 8,
    lineHeight: 10,
    fontWeight: '800',
  },

  /* ============================================================
     LIST
  ============================================================ */

  list: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  item: {
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  itemLast: {
    borderBottomWidth: 0,
  },

  itemMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },

  itemMeta: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  itemIndex: {
    color: colors.accent,
    fontSize: 8,
    lineHeight: 10,
    fontWeight: '900',
    letterSpacing: 0.7,
  },

  metaDivider: {
    width: 1,
    height: 10,
    backgroundColor: colors.border,
    marginHorizontal: 7,
  },

  itemDate: {
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

  itemTitle: {
    color: colors.white,
    fontSize: 18,
    lineHeight: 23,
    fontWeight: '900',
    letterSpacing: -0.35,
    marginTop: 14,
  },

  itemSummary: {
    color: colors.muted,
    fontSize: 10,
    lineHeight: 17,
    marginTop: 6,
  },

  itemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 13,
  },

  itemStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  itemStatText: {
    color: colors.dim,
    fontSize: 8,
    lineHeight: 10,
    fontWeight: '700',
    marginLeft: 4,
  },

  statDivider: {
    width: 3,
    height: 3,
    borderRadius: 999,
    backgroundColor: colors.border,
    marginHorizontal: 8,
  },

  /* ============================================================
     LOADING
  ============================================================ */

  loading: {
    minHeight: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingTitle: {
    color: colors.white,
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '800',
    marginTop: 11,
  },

  loadingText: {
    color: colors.dim,
    fontSize: 9,
    lineHeight: 13,
    marginTop: 4,
  },

  /* ============================================================
     EMPTY
  ============================================================ */

  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingTop: 82,
  },

  emptyIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      'rgba(45, 225, 214, 0.055)',
    borderWidth: 1,
    borderColor:
      'rgba(45, 225, 214, 0.11)',
    marginBottom: 15,
  },

  emptyTitle: {
    color: colors.white,
    fontSize: 17,
    lineHeight: 21,
    fontWeight: '900',
    textAlign: 'center',
  },

  emptyText: {
    color: colors.dim,
    fontSize: 10,
    lineHeight: 17,
    textAlign: 'center',
    maxWidth: 285,
    marginTop: 6,
  },

  bottomSpace: {
    height: 20,
  },
});