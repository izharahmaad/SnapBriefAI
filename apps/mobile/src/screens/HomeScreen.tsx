import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BriefResult } from '@/components/BriefResult';
import { GlassCard } from '@/components/GlassCard';
import { SectionTitle } from '@/components/SectionTitle';
import { examples } from '@/constants/examples';
import { generateBrief } from '@/lib/api';
import { saveBrief } from '@/lib/storage';
import { colors, radius, spacing } from '@/theme';
import { Brief } from '@/types/brief';

const MAX_LENGTH = 3000;

const BRAND = {
  bg: '#061113',
  panel: '#0C191B',
  panelRaised: '#102124',
  panelSoft: '#12292C',

  aqua: '#2DE1D6',
  aquaSoft: '#92FFF7',
  aquaDeep: '#12AAA4',

  white: '#F3FFFE',
  text: '#D7E8E7',
  muted: '#87A6A5',
  dim: '#5A7778',

  border: '#1B383A',
  borderStrong: '#29575A',

  danger: '#FF9E9E',
};

export default function HomeScreen() {
  const [text, setText] = useState('');
  const [brief, setBrief] = useState<Brief | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const remaining = MAX_LENGTH - text.length;

  const progressWidth = useMemo(() => {
    return Math.min(text.length / MAX_LENGTH, 1);
  }, [text.length]);

  const canCreate = text.trim().length > 0 && !loading;

  async function create() {
    const content = text.trim();

    if (!content || loading) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const output = await generateBrief(content);

      const next: Brief = {
        ...output,
        id: `${Date.now()}`,
        created_at: new Date().toISOString(),
      };

      setBrief(next);
      await saveBrief(next);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'Could not create the brief.'
      );
    } finally {
      setLoading(false);
    }
  }

  function loadExample() {
    const index = Math.floor(Math.random() * examples.length);
    const nextExample = examples[index] ?? '';

    setText(nextExample);
    setBrief(null);
    setError('');
  }

  function clearInput() {
    setText('');
    setBrief(null);
    setError('');
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.page}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerCopy}>
            <View style={styles.brandRow}>
              <View style={styles.statusDot} />
              <Text style={styles.brandLabel}>SNAPBRIEF AI</Text>
            </View>

            <Text style={styles.headerTitle}>
              Make clarity happen.
            </Text>

            <Text style={styles.headerSubtitle}>
              Turn rough notes into something you can act on.
            </Text>
          </View>

          <View style={styles.brandBadge}>
            <Ionicons
              name="flash"
              size={17}
              color={BRAND.bg}
            />
          </View>
        </View>

        {/* HERO */}
        <View style={styles.hero}>
          <View style={styles.heroOrbLarge} />
          <View style={styles.heroOrbSmall} />

          <View style={styles.heroTop}>
            <View style={styles.heroIcon}>
              <Ionicons
                name="sparkles"
                size={17}
                color={BRAND.bg}
              />
            </View>

            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>AI READY</Text>
            </View>
          </View>

          <Text style={styles.heroTitle}>
            Messy input.
            {'\n'}
            Sharp output.
          </Text>

          <Text style={styles.heroDescription}>
            Paste meeting notes, ideas, messages, reminders, or
            anything that needs turning into a useful brief.
          </Text>

          <View style={styles.heroFooter}>
            <View style={styles.heroMeta}>
              <Ionicons
                name="time-outline"
                size={14}
                color={BRAND.aqua}
              />
              <Text style={styles.heroMetaText}>
                Usually takes a few seconds
              </Text>
            </View>

            <View style={styles.heroMeta}>
              <Ionicons
                name="shield-checkmark-outline"
                size={14}
                color={BRAND.aqua}
              />
              <Text style={styles.heroMetaText}>
                Review before sharing
              </Text>
            </View>
          </View>
        </View>

        {/* INPUT */}
        <View style={styles.sectionHeader}>
          <SectionTitle
            eyebrow="01 / INPUT"
            title="What do you need to structure?"
          />

          <Pressable
            onPress={loadExample}
            style={({ pressed }) => [
              styles.exampleButton,
              pressed && styles.smallPressed,
            ]}
          >
            <Ionicons
              name="shuffle-outline"
              size={15}
              color={BRAND.aqua}
            />

            <Text style={styles.exampleText}>
              Try example
            </Text>
          </Pressable>
        </View>

        <GlassCard style={styles.editorCard}>
          <View style={styles.editorTop}>
            <View style={styles.editorPill}>
              <Ionicons
                name="create-outline"
                size={13}
                color={BRAND.aqua}
              />
              <Text style={styles.editorPillText}>
                NOTE
              </Text>
            </View>

            {text.length > 0 && (
              <Pressable
                onPress={clearInput}
                hitSlop={10}
                style={styles.clearButton}
              >
                <Ionicons
                  name="close-circle-outline"
                  size={18}
                  color={BRAND.dim}
                />
              </Pressable>
            )}
          </View>

          <TextInput
            value={text}
            onChangeText={setText}
            multiline
            maxLength={MAX_LENGTH}
            autoCapitalize="sentences"
            autoCorrect
            spellCheck
            placeholder={
              'Paste rough notes here…\n\nExample: client meeting Friday at 3 PM, website redesign, PKR 120k budget...'
            }
            placeholderTextColor="#5E7778"
            style={styles.input}
            textAlignVertical="top"
          />

          <View style={styles.editorBottom}>
            <View style={styles.privateRow}>
              <Ionicons
                name="lock-closed-outline"
                size={12}
                color={BRAND.dim}
              />

              <Text style={styles.privateText}>
                Stored locally in your device history
              </Text>
            </View>

            <Text
              style={[
                styles.counter,
                remaining < 300 && styles.counterWarning,
              ]}
            >
              {text.length}/{MAX_LENGTH}
            </Text>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progressWidth * 100}%`,
                },
              ]}
            />
          </View>
        </GlassCard>

        {/* QUICK PROMPTS */}
        <View style={styles.quickSection}>
          <Text style={styles.quickLabel}>
            QUICK START
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickScroll}
          >
            <Pressable
              onPress={() =>
                setText(
                  'Summarize the key decisions, open questions, and next steps from this meeting: '
                )
              }
              style={({ pressed }) => [
                styles.quickChip,
                pressed && styles.smallPressed,
              ]}
            >
              <Ionicons
                name="people-outline"
                size={15}
                color={BRAND.aqua}
              />
              <Text style={styles.quickChipText}>
                Meeting
              </Text>
            </Pressable>

            <Pressable
              onPress={() =>
                setText(
                  'Turn this idea into a concise plan with the goal, important points, risks, and next actions: '
                )
              }
              style={({ pressed }) => [
                styles.quickChip,
                pressed && styles.smallPressed,
              ]}
            >
              <Ionicons
                name="bulb-outline"
                size={15}
                color={BRAND.aqua}
              />
              <Text style={styles.quickChipText}>
                Idea
              </Text>
            </Pressable>

            <Pressable
              onPress={() =>
                setText(
                  'Extract the tasks, priorities, owners, and deadlines from these notes: '
                )
              }
              style={({ pressed }) => [
                styles.quickChip,
                pressed && styles.smallPressed,
              ]}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={15}
                color={BRAND.aqua}
              />
              <Text style={styles.quickChipText}>
                Tasks
              </Text>
            </Pressable>

            <Pressable
              onPress={() =>
                setText(
                  'Rewrite these rough notes into a concise client-ready brief while keeping every important fact: '
                )
              }
              style={({ pressed }) => [
                styles.quickChip,
                pressed && styles.smallPressed,
              ]}
            >
              <Ionicons
                name="document-text-outline"
                size={15}
                color={BRAND.aqua}
              />
              <Text style={styles.quickChipText}>
                Client
              </Text>
            </Pressable>
          </ScrollView>
        </View>

        {/* CREATE */}
        <Pressable
          onPress={create}
          disabled={!canCreate}
          style={({ pressed }) => [
            styles.createButton,
            !canCreate && styles.createDisabled,
            pressed && canCreate && styles.createPressed,
          ]}
        >
          {loading ? (
            <>
              <ActivityIndicator
                color={BRAND.bg}
                size="small"
              />

              <Text style={styles.createText}>
                Structuring your notes…
              </Text>
            </>
          ) : (
            <>
              <View style={styles.createIcon}>
                <Ionicons
                  name="sparkles"
                  size={17}
                  color={BRAND.bg}
                />
              </View>

              <Text style={styles.createText}>
                Create brief
              </Text>

              <View style={styles.createArrow}>
                <Ionicons
                  name="arrow-forward"
                  size={17}
                  color={BRAND.bg}
                />
              </View>
            </>
          )}
        </Pressable>

        {/* ERROR */}
        {error ? (
          <View style={styles.errorCard}>
            <View style={styles.errorIcon}>
              <Ionicons
                name="alert-circle-outline"
                size={18}
                color={BRAND.danger}
              />
            </View>

            <View style={styles.errorBody}>
              <Text style={styles.errorTitle}>
                Couldn’t create your brief
              </Text>

              <Text style={styles.errorText}>
                {error}
              </Text>
            </View>
          </View>
        ) : null}

        {/* RESULT */}
        {brief ? (
          <View style={styles.resultSection}>
            <View style={styles.resultHeader}>
              <SectionTitle
                eyebrow="02 / RESULT"
                title="Here’s the signal."
              />

              <View style={styles.savedBadge}>
                <Ionicons
                  name="checkmark"
                  size={13}
                  color={BRAND.bg}
                />
              </View>
            </View>

            <BriefResult brief={brief} />

            <View style={styles.disclaimer}>
              <Ionicons
                name="information-circle-outline"
                size={14}
                color={BRAND.dim}
              />

              <Text style={styles.disclaimerText}>
                AI-generated. Check names, dates, amounts and
                commitments before sharing.
              </Text>
            </View>

            <Pressable
              onPress={clearInput}
              style={({ pressed }) => [
                styles.newBriefButton,
                pressed && styles.smallPressed,
              ]}
            >
              <Ionicons
                name="add-outline"
                size={17}
                color={BRAND.aqua}
              />

              <Text style={styles.newBriefText}>
                Start another brief
              </Text>
            </Pressable>
          </View>
        ) : (
          /* EMPTY STATE */
          <GlassCard style={styles.tipCard}>
            <View style={styles.tipIcon}>
              <Ionicons
                name="sparkles-outline"
                size={18}
                color={BRAND.aqua}
              />
            </View>

            <View style={styles.tipBody}>
              <Text style={styles.tipTitle}>
                Keep it messy
              </Text>

              <Text style={styles.tipText}>
                You don't need to clean up your notes first.
                SnapBrief is built to find the useful parts for
                you.
              </Text>
            </View>
          </GlassCard>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BRAND.bg,
  },

  page: {
    flex: 1,
    backgroundColor: BRAND.bg,
  },

  content: {
    paddingHorizontal: 18,
    paddingTop: 58,
    paddingBottom: 120,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 24,
  },

  headerCopy: {
    flex: 1,
    paddingRight: 18,
  },

  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 8,
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: BRAND.aqua,
  },

  brandLabel: {
    color: BRAND.aqua,
    fontSize: 9,
    fontFamily: 'SpaceGrotesk_700Bold',
    letterSpacing: 1.6,
  },

  headerTitle: {
    color: BRAND.white,
    fontSize: 25,
    lineHeight: 29,
    fontFamily: 'SpaceGrotesk_700Bold',
    letterSpacing: -0.9,
  },

  headerSubtitle: {
    color: BRAND.muted,
    fontSize: 12.5,
    lineHeight: 18,
    marginTop: 5,
    maxWidth: 300,
  },

  brandBadge: {
    width: 43,
    height: 43,
    borderRadius: 15,
    backgroundColor: BRAND.aqua,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: BRAND.aqua,
    shadowOpacity: 0.22,
    shadowRadius: 15,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    elevation: 7,
  },

  hero: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 26,
    padding: 22,
    marginBottom: 28,
    backgroundColor: '#0B1A1C',
    borderWidth: 1,
    borderColor: BRAND.border,
  },

  heroOrbLarge: {
    position: 'absolute',
    width: 185,
    height: 185,
    borderRadius: 185,
    right: -75,
    top: -100,
    backgroundColor: BRAND.aqua,
    opacity: 0.055,
  },

  heroOrbSmall: {
    position: 'absolute',
    width: 85,
    height: 85,
    borderRadius: 85,
    left: -42,
    bottom: -42,
    backgroundColor: BRAND.aquaSoft,
    opacity: 0.035,
  },

  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },

  heroIcon: {
    width: 37,
    height: 37,
    borderRadius: 12,
    backgroundColor: BRAND.aqua,
    alignItems: 'center',
    justifyContent: 'center',
  },

  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#0E2022',
    borderWidth: 1,
    borderColor: BRAND.border,
  },

  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: BRAND.aqua,
  },

  liveText: {
    color: BRAND.aquaSoft,
    fontSize: 8,
    fontFamily: 'SpaceGrotesk_700Bold',
    letterSpacing: 1,
  },

  heroTitle: {
    color: BRAND.white,
    fontSize: 31,
    lineHeight: 33,
    fontFamily: 'SpaceGrotesk_700Bold',
    letterSpacing: -1.15,
  },

  heroDescription: {
    color: '#9DB1B0',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 12,
    maxWidth: 340,
  },

  heroFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: BRAND.border,
  },

  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  heroMetaText: {
    color: BRAND.dim,
    fontSize: 9.5,
    fontFamily: 'SpaceGrotesk_600SemiBold',
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 11,
  },

  exampleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingBottom: 4,
  },

  exampleText: {
    color: BRAND.aqua,
    fontSize: 10.5,
    fontFamily: 'SpaceGrotesk_600SemiBold',
  },

  smallPressed: {
    opacity: 0.72,
  },

  editorCard: {
    padding: 15,
    marginBottom: 14,
    borderRadius: 20,
  },

  editorTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  editorPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#11272A',
    borderWidth: 1,
    borderColor: BRAND.border,
  },

  editorPillText: {
    color: BRAND.aquaSoft,
    fontSize: 8,
    fontFamily: 'SpaceGrotesk_700Bold',
    letterSpacing: 1,
  },

  clearButton: {
    padding: 2,
  },

  input: {
    minHeight: 150,
    color: BRAND.text,
    fontSize: 14.5,
    lineHeight: 22,
    textAlignVertical: 'top',
    fontFamily: 'SpaceGrotesk_400Regular',
    paddingTop: 4,
  },

  editorBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 11,
    borderTopWidth: 1,
    borderTopColor: BRAND.border,
  },

  privateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    paddingRight: 8,
  },

  privateText: {
    color: BRAND.dim,
    fontSize: 9.5,
  },

  counter: {
    color: BRAND.dim,
    fontSize: 9.5,
    fontFamily: 'SpaceGrotesk_600SemiBold',
  },

  counterWarning: {
    color: BRAND.aqua,
  },

  progressTrack: {
    height: 3,
    marginTop: 10,
    borderRadius: 999,
    backgroundColor: '#172C2E',
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: BRAND.aqua,
  },

  quickSection: {
    marginBottom: 14,
  },

  quickLabel: {
    color: BRAND.subtle,
    fontSize: 8.5,
    fontFamily: 'SpaceGrotesk_700Bold',
    letterSpacing: 1.2,
    marginBottom: 8,
  },

  quickScroll: {
    gap: 8,
    paddingRight: 10,
  },

  quickChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: BRAND.panel,
    borderWidth: 1,
    borderColor: BRAND.border,
  },

  quickChipText: {
    color: BRAND.text,
    fontSize: 10.5,
    fontFamily: 'SpaceGrotesk_600SemiBold',
  },

  createButton: {
    minHeight: 58,
    borderRadius: 999,
    backgroundColor: BRAND.aqua,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingHorizontal: 54,
    shadowColor: BRAND.aqua,
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 6,
  },

  createPressed: {
    opacity: 0.84,
    transform: [{ scale: 0.987 }],
  },

  createDisabled: {
    opacity: 0.42,
  },

  createIcon: {
    position: 'absolute',
    left: 10,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(6,17,19,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  createText: {
    color: BRAND.bg,
    fontSize: 14.5,
    fontFamily: 'SpaceGrotesk_700Bold',
  },

  createArrow: {
    position: 'absolute',
    right: 10,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(6,17,19,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  errorCard: {
    marginTop: 12,
    padding: 13,
    borderRadius: 16,
    backgroundColor: '#1B1113',
    borderWidth: 1,
    borderColor: '#3C2427',
    flexDirection: 'row',
    gap: 10,
  },

  errorIcon: {
    width: 31,
    height: 31,
    borderRadius: 10,
    backgroundColor: '#291619',
    alignItems: 'center',
    justifyContent: 'center',
  },

  errorBody: {
    flex: 1,
  },

  errorTitle: {
    color: '#FFD3D3',
    fontSize: 12,
    fontFamily: 'SpaceGrotesk_700Bold',
    marginBottom: 3,
  },

  errorText: {
    color: BRAND.danger,
    fontSize: 11,
    lineHeight: 17,
  },

  resultSection: {
    marginTop: 30,
  },

  resultHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  savedBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: BRAND.aqua,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },

  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 7,
    marginTop: 11,
    paddingHorizontal: 2,
  },

  disclaimerText: {
    color: BRAND.dim,
    flex: 1,
    fontSize: 9.5,
    lineHeight: 14,
  },

  newBriefButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 17,
    paddingHorizontal: 13,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: BRAND.border,
    backgroundColor: BRAND.panel,
  },

  newBriefText: {
    color: BRAND.aqua,
    fontSize: 10.5,
    fontFamily: 'SpaceGrotesk_600SemiBold',
  },

  tipCard: {
    marginTop: 22,
    padding: 16,
    borderRadius: 18,
    flexDirection: 'row',
    gap: 12,
  },

  tipIcon: {
    width: 35,
    height: 35,
    borderRadius: 11,
    backgroundColor: '#11272A',
    alignItems: 'center',
    justifyContent: 'center',
  },

  tipBody: {
    flex: 1,
  },

  tipTitle: {
    color: BRAND.white,
    fontSize: 12.5,
    fontFamily: 'SpaceGrotesk_700Bold',
    marginBottom: 3,
  },

  tipText: {
    color: BRAND.muted,
    fontSize: 11.5,
    lineHeight: 17,
  },
});
