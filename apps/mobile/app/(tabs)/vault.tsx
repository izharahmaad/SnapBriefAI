import { useCallback, useEffect, useMemo, useState } from 'react';
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

import { colors, radius } from '@/theme';
import { Brief } from '@/types/brief';
import { getBriefs } from '@/lib/storage';

type Filter = 'all' | 'high' | 'recent';

export default function VaultScreen() {
  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadBriefs = useCallback(async () => {
    try {
      const stored = await getBriefs();

      const ordered = [...stored].sort(
        (a, b) =>
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime()
      );

      setBriefs(ordered);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadBriefs();
  }, [loadBriefs]);

  useEffect(() => {
    const interval = setInterval(loadBriefs, 5000);

    return () => clearInterval(interval);
  }, [loadBriefs]);

  const filteredBriefs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return briefs.filter((brief) => {
      const matchesSearch =
        !query ||
        brief.title.toLowerCase().includes(query) ||
        brief.summary.toLowerCase().includes(query) ||
        brief.tags?.some((tag) =>
          tag.toLowerCase().includes(query)
        );

      const matchesFilter =
        filter === 'all' ||
        (filter === 'high' &&
          brief.priority?.toLowerCase() === 'high') ||
        (filter === 'recent' &&
          Date.now() -
            new Date(brief.created_at).getTime() <
            7 * 24 * 60 * 60 * 1000);

      return matchesSearch && matchesFilter;
    });
  }, [briefs, filter, search]);

  function refresh() {
    setRefreshing(true);
    loadBriefs();
  }

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={refresh}
          tintColor={colors.accent}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.eyebrow}>
            03 / VAULT
          </Text>

          <Text style={styles.title}>
            Your intelligence archive.
          </Text>

          <Text style={styles.subtitle}>
            Every generated brief, kept on this device.
          </Text>
        </View>

        <View style={styles.countBadge}>
          <Text style={styles.countValue}>
            {briefs.length}
          </Text>
          <Text style={styles.countLabel}>SAVED</Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchBox}>
        <Ionicons
          name="search-outline"
          size={17}
          color={colors.dim}
        />

        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search briefs, tags, summaries..."
          placeholderTextColor={colors.dim}
          style={styles.searchInput}
          autoCorrect={false}
        />

        {search.length > 0 ? (
          <Pressable
            onPress={() => setSearch('')}
            hitSlop={8}
          >
            <Ionicons
              name="close-circle"
              size={17}
              color={colors.dim}
            />
          </Pressable>
        ) : null}
      </View>

      {/* Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersRow}
      >
        <FilterButton
          label="All"
          active={filter === 'all'}
          onPress={() => setFilter('all')}
        />

        <FilterButton
          label="High priority"
          active={filter === 'high'}
          onPress={() => setFilter('high')}
        />

        <FilterButton
          label="Last 7 days"
          active={filter === 'recent'}
          onPress={() => setFilter('recent')}
        />
      </ScrollView>

      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionLabel}>
            SAVED BRIEFS
          </Text>

          <Text style={styles.sectionTitle}>
            {filteredBriefs.length} available
          </Text>
        </View>

        <Ionicons
          name="archive-outline"
          size={18}
          color={colors.accent}
        />
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator
            size="small"
            color={colors.accent}
          />

          <Text style={styles.loadingText}>
            Loading vault...
          </Text>
        </View>
      ) : filteredBriefs.length > 0 ? (
        <View style={styles.list}>
          {filteredBriefs.map((brief) => (
            <VaultCard
              key={brief.id}
              brief={brief}
            />
          ))}
        </View>
      ) : (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <Ionicons
              name="archive-outline"
              size={20}
              color={colors.accent}
            />
          </View>

          <Text style={styles.emptyTitle}>
            {briefs.length > 0
              ? 'Nothing matches your search.'
              : 'Your vault is empty.'}
          </Text>

          <Text style={styles.emptyText}>
            {briefs.length > 0
              ? 'Try another search or filter.'
              : 'Generated briefs will automatically appear here.'}
          </Text>
        </View>
      )}

      <View style={styles.bottomSpace} />
    </ScrollView>
  );
}

function FilterButton({
  label,
  active,
  onPress,
}: {
  label: string;
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
    </Pressable>
  );
}

function VaultCard({ brief }: { brief: Brief }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.cardBadge}>
          <Ionicons
            name="sparkles"
            size={10}
            color={colors.accent}
          />

          <Text style={styles.cardBadgeText}>
            BRIEF
          </Text>
        </View>

        <Text style={styles.cardDate}>
          {formatDate(brief.created_at)}
        </Text>
      </View>

      <Text style={styles.cardTitle} numberOfLines={2}>
        {brief.title}
      </Text>

      <Text
        style={styles.cardSummary}
        numberOfLines={2}
      >
        {brief.summary}
      </Text>

      <View style={styles.cardBottom}>
        <View style={styles.priority}>
          <View style={styles.priorityDot} />

          <Text style={styles.priorityText}>
            {(brief.priority || 'normal').toUpperCase()}
          </Text>
        </View>

        <View style={styles.cardStats}>
          <Text style={styles.cardStat}>
            {brief.actions?.length ?? 0} actions
          </Text>

          <View style={styles.statSeparator} />

          <Text style={styles.cardStat}>
            {brief.key_points?.length ?? 0} points
          </Text>
        </View>
      </View>
    </View>
  );
}

function formatDate(value: string) {
  const date = new Date(value);

  return date.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 110,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  headerCopy: {
    flex: 1,
    paddingRight: 12,
  },

  eyebrow: {
    color: colors.accent,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.4,
  },

  title: {
    color: colors.white,
    fontSize: 25,
    lineHeight: 29,
    fontWeight: '800',
    letterSpacing: -0.6,
    marginTop: 7,
  },

  subtitle: {
    color: colors.muted,
    fontSize: 10,
    lineHeight: 16,
    marginTop: 6,
  },

  countBadge: {
    width: 54,
    height: 54,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  countValue: {
    color: colors.accentSoft,
    fontSize: 17,
    fontWeight: '800',
  },

  countLabel: {
    color: colors.dim,
    fontSize: 6,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginTop: 1,
  },

  searchBox: {
    minHeight: 47,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  searchInput: {
    flex: 1,
    color: colors.white,
    fontSize: 11,
    marginLeft: 9,
  },

  filtersRow: {
    gap: 7,
    paddingVertical: 12,
  },

  filterButton: {
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  filterButtonActive: {
    backgroundColor: 'rgba(45, 225, 214, 0.07)',
    borderColor: colors.accent,
  },

  filterText: {
    color: colors.muted,
    fontSize: 9,
    fontWeight: '700',
  },

  filterTextActive: {
    color: colors.accentSoft,
  },

  pressed: {
    opacity: 0.65,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 14,
    marginBottom: 10,
  },

  sectionLabel: {
    color: colors.dim,
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 1.2,
  },

  sectionTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
    marginTop: 4,
  },

  list: {
    gap: 9,
  },

  card: {
    padding: 14,
    borderRadius: 19,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  cardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(45, 225, 214, 0.06)',
    borderWidth: 1,
    borderColor: colors.border,
  },

  cardBadgeText: {
    color: colors.accentSoft,
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginLeft: 4,
  },

  cardDate: {
    color: colors.dim,
    fontSize: 8,
  },

  cardTitle: {
    color: colors.white,
    fontSize: 17,
    lineHeight: 21,
    fontWeight: '800',
    marginTop: 13,
  },

  cardSummary: {
    color: colors.muted,
    fontSize: 10,
    lineHeight: 16,
    marginTop: 6,
  },

  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 13,
    paddingTop: 11,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  priority: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  priorityDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.accent,
    marginRight: 5,
  },

  priorityText: {
    color: colors.muted,
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 0.8,
  },

  cardStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  cardStat: {
    color: colors.dim,
    fontSize: 8,
  },

  statSeparator: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginHorizontal: 7,
  },

  loadingBox: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 180,
    borderRadius: 19,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  loadingText: {
    color: colors.dim,
    fontSize: 9,
    marginTop: 9,
  },

  empty: {
    alignItems: 'center',
    padding: 26,
    borderRadius: 19,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  emptyIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(45, 225, 214, 0.06)',
    marginBottom: 10,
  },

  emptyTitle: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
  },

  emptyText: {
    color: colors.muted,
    fontSize: 10,
    lineHeight: 16,
    textAlign: 'center',
    marginTop: 6,
    maxWidth: 280,
  },

  bottomSpace: {
    height: 20,
  },
});