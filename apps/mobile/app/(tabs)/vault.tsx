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
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadBriefs();
  }, [loadBriefs]);

  useEffect(() => {
    const interval = setInterval(() => {
      loadBriefs();
    }, 5000);

    return () => clearInterval(interval);
  }, [loadBriefs]);

  const filteredBriefs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return briefs.filter((brief) => {
      const matchesSearch =
        !query ||
        brief.title
          .toLowerCase()
          .includes(query) ||
        brief.summary
          .toLowerCase()
          .includes(query) ||
        brief.tags?.some((tag) =>
          tag.toLowerCase().includes(query),
        );

      const matchesFilter =
        filter === 'all' ||
        (filter === 'high' &&
          brief.priority?.toLowerCase() === 'high') ||
        (filter === 'recent' &&
          Date.now() -
            new Date(
              brief.created_at,
            ).getTime() <
            7 * 24 * 60 * 60 * 1000);

      return (
        matchesSearch &&
        matchesFilter
      );
    });
  }, [briefs, filter, search]);

  const highPriorityCount = useMemo(
    () =>
      briefs.filter(
        (brief) =>
          brief.priority?.toLowerCase() ===
          'high',
      ).length,
    [briefs],
  );

  const recentCount = useMemo(
    () =>
      briefs.filter(
        (brief) =>
          Date.now() -
            new Date(
              brief.created_at,
            ).getTime() <
          7 * 24 * 60 * 60 * 1000,
      ).length,
    [briefs],
  );

  async function refresh() {
    setRefreshing(true);
    await loadBriefs();
  }

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
        },
      ]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={refresh}
          tintColor={colors.accent}
          colors={[colors.accent]}
          progressBackgroundColor={
            colors.surface
          }
        />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* =======================================================
          HEADER
      ======================================================= */}
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
            Everything you've synthesized, kept
            ready to revisit.
          </Text>
        </View>

        <View style={styles.archiveMark}>
          <Ionicons
            name="archive-outline"
            size={19}
            color={colors.accent}
          />
        </View>
      </View>

      {/* =======================================================
          OVERVIEW
      ======================================================= */}
      <View style={styles.overview}>
        <VaultMetric
          value={String(briefs.length)}
          label="SAVED"
        />

        <View style={styles.overviewDivider} />

        <VaultMetric
          value={String(highPriorityCount)}
          label="HIGH"
        />

        <View style={styles.overviewDivider} />

        <VaultMetric
          value={String(recentCount)}
          label="7 DAYS"
        />
      </View>

      {/* =======================================================
          SEARCH
      ======================================================= */}
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
            onPress={() => setSearch('')}
            hitSlop={8}
            style={({ pressed }) => [
              styles.clearSearch,
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

      {/* =======================================================
          FILTERS
      ======================================================= */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filters}
      >
        <FilterButton
          label="All briefs"
          count={briefs.length}
          active={filter === 'all'}
          onPress={() => setFilter('all')}
        />

        <FilterButton
          label="High priority"
          count={highPriorityCount}
          active={filter === 'high'}
          onPress={() => setFilter('high')}
        />

        <FilterButton
          label="Last 7 days"
          count={recentCount}
          active={filter === 'recent'}
          onPress={() => setFilter('recent')}
        />
      </ScrollView>

      {/* =======================================================
          LIST HEADER
      ======================================================= */}
      <View style={styles.listHeader}>
        <View>
          <Text style={styles.listLabel}>
            SAVED BRIEFS
          </Text>

          <Text style={styles.listTitle}>
            {filteredBriefs.length}{' '}
            {filteredBriefs.length === 1
              ? 'brief'
              : 'briefs'}
          </Text>
        </View>

        {search || filter !== 'all' ? (
          <Text style={styles.filterStatus}>
            FILTERED
          </Text>
        ) : (
          <Ionicons
            name="layers-outline"
            size={17}
            color={colors.accent}
          />
        )}
      </View>

      {/* =======================================================
          CONTENT
      ======================================================= */}
      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator
            size="small"
            color={colors.accent}
          />

          <Text style={styles.loadingText}>
            Loading your archive...
          </Text>
        </View>
      ) : filteredBriefs.length > 0 ? (
        <View style={styles.list}>
          {filteredBriefs.map((brief, index) => (
            <VaultItem
              key={brief.id}
              brief={brief}
              index={index}
            />
          ))}
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

function VaultMetric({
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
        active && styles.filterButtonActive,
        pressed && styles.pressed,
      ]}
    >
      <Text
        style={[
          styles.filterText,
          active && styles.filterTextActive,
        ]}
      >
        {label}
      </Text>

      <Text
        style={[
          styles.filterCount,
          active && styles.filterCountActive,
        ]}
      >
        {count}
      </Text>
    </Pressable>
  );
}

function VaultItem({
  brief,
  index,
}: {
  brief: Brief;
  index: number;
}) {
  const priority =
    brief.priority?.toLowerCase() ||
    'normal';

  const isHigh = priority === 'high';

  return (
    <View style={styles.item}>
      {/* Top metadata */}
      <View style={styles.itemTop}>
        <View style={styles.itemMeta}>
          <Text style={styles.itemIndex}>
            {String(index + 1).padStart(2, '0')}
          </Text>

          <View style={styles.itemDivider} />

          <Text style={styles.itemDate}>
            {formatDate(brief.created_at)}
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

      {/* Main content */}
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

      {/* Footer */}
      <View style={styles.itemFooter}>
        <View style={styles.stat}>
          <Ionicons
            name="list-outline"
            size={12}
            color={colors.dim}
          />

          <Text style={styles.statText}>
            {brief.key_points?.length ?? 0}{' '}
            points
          </Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.stat}>
          <Ionicons
            name="arrow-forward-outline"
            size={12}
            color={colors.dim}
          />

          <Text style={styles.statText}>
            {brief.actions?.length ?? 0}{' '}
            actions
          </Text>
        </View>

        {brief.tags?.length ? (
          <>
            <View style={styles.statDivider} />

            <View style={styles.stat}>
              <Ionicons
                name="pricetag-outline"
                size={12}
                color={colors.dim}
              />

              <Text style={styles.statText}>
                {brief.tags.length}
              </Text>
            </View>
          </>
        ) : null}
      </View>
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
          name="archive-outline"
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
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 14,
    marginBottom: 28,
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

  archiveMark: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(45, 225, 214, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(45, 225, 214, 0.12)',
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

  metricLabel: {
    color: colors.dim,
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 0.9,
    marginTop: 4,
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
    marginLeft: 9,
    paddingVertical: 10,
  },

  clearSearch: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 8,
  },

  /* ============================================================
     FILTERS
  ============================================================ */

  filters: {
    gap: 7,
    paddingVertical: 12,
  },

  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  filterButtonActive: {
    backgroundColor: 'rgba(45, 225, 214, 0.07)',
    borderColor: 'rgba(45, 225, 214, 0.28)',
  },

  filterText: {
    color: colors.muted,
    fontSize: 9,
    fontWeight: '700',
  },

  filterTextActive: {
    color: colors.accentSoft,
  },

  filterCount: {
    color: colors.dim,
    fontSize: 8,
    fontWeight: '800',
    marginLeft: 6,
  },

  filterCountActive: {
    color: colors.accent,
  },

  pressed: {
    opacity: 0.62,
  },

  /* ============================================================
     LIST HEADER
  ============================================================ */

  listHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 11,
    marginBottom: 11,
  },

  listLabel: {
    color: colors.dim,
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 1.3,
  },

  listTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '900',
    marginTop: 4,
  },

  filterStatus: {
    color: colors.accentSoft,
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 0.8,
    paddingBottom: 3,
  },

  /* ============================================================
     LIST
  ============================================================ */

  list: {
    gap: 0,
  },

  item: {
    paddingVertical: 17,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  itemTop: {
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

  itemIndex: {
    color: colors.accent,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.7,
  },

  itemDivider: {
    width: 1,
    height: 11,
    backgroundColor: colors.border,
    marginHorizontal: 7,
  },

  itemDate: {
    color: colors.dim,
    fontSize: 8,
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
    letterSpacing: -0.3,
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
    flexWrap: 'wrap',
    marginTop: 13,
  },

  stat: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  statText: {
    color: colors.dim,
    fontSize: 8,
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
    minHeight: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    color: colors.dim,
    fontSize: 9,
    marginTop: 9,
  },

  /* ============================================================
     EMPTY
  ============================================================ */

  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingTop: 85,
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