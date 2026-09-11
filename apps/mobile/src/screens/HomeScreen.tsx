import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
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

const CHARACTER_LIMIT = 3000;

const HERO_IMAGE = require('../../assets/images/snapbrief-crystal.png');

const QUICK_STARTS = [
  {
    label: 'Meeting',
    icon: 'people-outline' as const,
    text:
      'Meeting notes: We discussed the launch timeline, assigned owners for the remaining tasks, and agreed to review progress again on Friday.',
  },
  {
    label: 'Concept',
    icon: 'bulb-outline' as const,
    text:
      'Idea: Build a lightweight mobile tool that turns rough notes into structured briefs with a clear summary, action items, priority, and useful tags.',
  },
  {
    label: 'Action',
    icon: 'checkmark-circle-outline' as const,
    text:
      'Tasks: Finish the landing page, test the API connection, update the README, review the mobile UI, and prepare the final GitHub push.',
  },
];

export default function HomeScreen() {
  const { width } = useWindowDimensions();

  const compact = width < 380;
  const horizontalPadding = compact ? 16 : 20;

  const [text, setText] = useState(examples[0] ?? '');
  const [brief, setBrief] = useState<Brief | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const progress = useMemo(() => {
    if (!text.length) {
      return 0;
    }

    return Math.min(text.length / CHARACTER_LIMIT, 1);
  }, [text.length]);

  async function createBrief() {
    const trimmed = text.trim();

    if (!trimmed || loading) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const output = await generateBrief(trimmed);

      const nextBrief: Brief = {
        ...output,
        id: `${Date.now()}`,
        created_at: new Date().toISOString(),
      };

      setBrief(nextBrief);
      await saveBrief(nextBrief);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Could not create the brief. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  function loadExample() {
    const index = Math.floor(Math.random() * examples.length);

    setText(examples[index] ?? '');
    setBrief(null);
    setError('');
  }

  function selectQuickStart(value: string) {
    setText(value);
    setBrief(null);
    setError('');
  }

  function clearInput() {
    setText('');
    setBrief(null);
    setError('');
  }

  function startAnother() {
    setText('');
    setBrief(null);
    setError('');
  }

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={[
        styles.content,
        { paddingHorizontal: horizontalPadding },
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <View style={styles.brandRow}>
            <View style={styles.brandDot} />

            <Text style={styles.brandText}>
              SNAPBRIEF AI
            </Text>
          </View>

          <Text style={styles.headerSubtitle}>
            Executive clarity engine
          </Text>
        </View>

        <View style={styles.statusPill}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>ACTIVE</Text>
        </View>
      </View>

      {/* HERO */}
      <View style={styles.hero}>
        <View style={styles.heroCopy}>
          <Text style={styles.heroEyebrow}>
            EXECUTIVE INTELLIGENCE ENGINE
          </Text>

          <Text
            style={[
              styles.heroTitle,
              compact && styles.heroTitleCompact,
            ]}
          >
            Messy notes into
            {'\n'}
            executive clarity.
          </Text>

          <Text style={styles.heroDescription}>
            Distill unformatted thoughts, transcripts, messages,
            and raw notes into focused, actionable briefs.
          </Text>

          <View style={styles.heroMeta}>
            <View style={styles.metaItem}>
              <View style={styles.metaDot} />

              <Text style={styles.metaText}>
                4s typical latency
              </Text>
            </View>

            <View style={styles.metaItem}>
              <Ionicons
                name="lock-closed-outline"
                size={12}
                color={colors.accent}
              />

              <Text style={styles.metaText}>
                Confidential cache
              </Text>
            </View>
          </View>
        </View>

        {/* Full-width visual banner */}
        <ImageBackground
          source={HERO_IMAGE}
          resizeMode="cover"
          style={styles.heroImage}
          imageStyle={styles.heroImageStyle}
        >
          <View style={styles.heroImageShade} />

          <View style={styles.imageLabel}>
            <View style={styles.imageLabelDot} />

            <Text style={styles.imageLabelText}>
              SNAPBRIEF / SYNTHESIS
            </Text>
          </View>
        </ImageBackground>
      </View>

      {/* INPUT */}
      <View style={styles.sectionHeader}>
        <SectionTitle
          eyebrow="01 / INPUT BUFFER"
          title="Raw input"
        />

        <Pressable
          onPress={loadExample}
          hitSlop={8}
          style={({ pressed }) => [
            styles.loadButton,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.loadText}>
            Load sample
          </Text>

          <Ionicons
            name="arrow-forward"
            size={13}
            color={colors.accent}
          />
        </Pressable>
      </View>

      <GlassCard style={styles.inputCard}>
        <View style={styles.inputHeader}>
          <View style={styles.bufferLabel}>
            <View style={styles.bufferDot} />

            <Text style={styles.bufferText}>
              INPUT BUFFER
            </Text>
          </View>

          {text.length > 0 ? (
            <Pressable
              onPress={clearInput}
              hitSlop={8}
              style={({ pressed }) => [
                styles.clearButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.clearText}>Clear</Text>

              <Ionicons
                name="close-outline"
                size={14}
                color={colors.dim}
              />
            </Pressable>
          ) : null}
        </View>

        <TextInput
          value={text}
          onChangeText={(value) => {
            setText(value);

            if (error) {
              setError('');
            }
          }}
          multiline
          textAlignVertical="top"
          autoCapitalize="sentences"
          autoCorrect
          spellCheck
          maxLength={CHARACTER_LIMIT}
          placeholder="Type or paste raw thoughts, transcripts, Slack threads, strategic notes..."
          placeholderTextColor={colors.dim}
          style={[
            styles.input,
            compact && styles.inputCompact,
          ]}
        />

        <View style={styles.inputFooter}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickRow}
          >
            {QUICK_STARTS.map((item) => {
              const active = text === item.text;

              return (
                <Pressable
                  key={item.label}
                  onPress={() =>
                    selectQuickStart(item.text)
                  }
                  style={({ pressed }) => [
                    styles.quickChip,
                    active && styles.quickChipActive,
                    pressed && styles.quickChipPressed,
                  ]}
                >
                  <Ionicons
                    name={item.icon}
                    size={11}
                    color={
                      active
                        ? colors.accent
                        : colors.muted
                    }
                  />

                  <Text
                    style={[
                      styles.quickChipText,
                      active &&
                        styles.quickChipTextActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <Text style={styles.counter}>
            {text.length.toLocaleString()} / 3,000
          </Text>
        </View>

        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${progress * 100}%`,
              },
            ]}
          />
        </View>
      </GlassCard>

      {/* ACTION */}
      <Pressable
        onPress={createBrief}
        disabled={loading || !text.trim()}
        style={({ pressed }) => [
          styles.primaryButton,
          pressed &&
            !loading &&
            styles.primaryButtonPressed,
          (!text.trim() || loading) &&
            styles.primaryButtonDisabled,
        ]}
      >
        <View style={styles.primaryLeft}>
          <View style={styles.primaryIcon}>
            {loading ? (
              <ActivityIndicator
                size="small"
                color={colors.bg}
              />
            ) : (
              <Ionicons
                name="sparkles"
                size={17}
                color={colors.bg}
              />
            )}
          </View>

          <View style={styles.primaryCopy}>
            <Text style={styles.primaryTitle}>
              {loading
                ? 'Synthesizing executive brief'
                : 'Synthesize executive brief'}
            </Text>

            <Text style={styles.primarySubtitle}>
              {loading
                ? 'Analyzing your input...'
                : 'Convert raw input into actionable signal'}
            </Text>
          </View>
        </View>

        {!loading ? (
          <View style={styles.primaryArrow}>
            <Ionicons
              name="arrow-forward"
              size={17}
              color={colors.bg}
            />
          </View>
        ) : null}
      </Pressable>

      {/* ERROR */}
      {error ? (
        <View style={styles.errorCard}>
          <View style={styles.errorIcon}>
            <Ionicons
              name="alert-circle-outline"
              size={16}
              color={colors.danger}
            />
          </View>

          <View style={styles.errorBody}>
            <Text style={styles.errorTitle}>
              Generation failed
            </Text>

            <Text style={styles.errorText}>
              {error}
            </Text>
          </View>
        </View>
      ) : null}

      {/* RESULT */}
      <View style={styles.resultSection}>
        <View style={styles.sectionHeader}>
          <SectionTitle
            eyebrow="02 / SYNTHESIZED MEMO"
            title={brief ? 'Signal ready' : 'Output'}
          />

          <View style={styles.resultStatus}>
            <View style={styles.resultDot} />

            <Text style={styles.resultStatusText}>
              {brief ? 'LIVE RESULT' : 'READY'}
            </Text>
          </View>
        </View>

        {brief ? (
          <>
            <BriefResult brief={brief} />

            <View style={styles.disclaimer}>
              <Ionicons
                name="information-circle-outline"
                size={14}
                color={colors.dim}
              />

              <Text style={styles.disclaimerText}>
                AI-generated output. Review important dates,
                numbers, names, and commitments before sharing.
              </Text>
            </View>

            <Pressable
              onPress={startAnother}
              style={({ pressed }) => [
                styles.newBriefButton,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons
                name="add-outline"
                size={16}
                color={colors.accent}
              />

              <Text style={styles.newBriefText}>
                Create another brief
              </Text>
            </Pressable>
          </>
        ) : (
          <View style={styles.outputPreview}>
            <View style={styles.previewHeader}>
              <View style={styles.previewLabels}>
                <View style={styles.previewLabel}>
                  <Text style={styles.previewLabelText}>
                    STRATEGY
                  </Text>
                </View>

                <View
                  style={[
                    styles.previewLabel,
                    styles.previewLabelAccent,
                  ]}
                >
                  <Text
                    style={[
                      styles.previewLabelText,
                      styles.previewLabelAccentText,
                    ]}
                  >
                    BRIEF
                  </Text>
                </View>
              </View>

              <Text style={styles.previewPriority}>
                HIGH
              </Text>
            </View>

            <Text style={styles.previewTitle}>
              Clear, concise, decision-ready.
            </Text>

            <Text style={styles.previewDescription}>
              SnapBrief turns a messy stream of information
              into the key points and next actions that
              matter.
            </Text>

            <View style={styles.previewDivider} />

            <View style={styles.previewSection}>
              <Text style={styles.previewSectionLabel}>
                KEY TAKEAWAYS
              </Text>

              <View style={styles.previewPoint}>
                <View style={styles.previewDot} />

                <Text style={styles.previewPointText}>
                  Important context is separated from noise.
                </Text>
              </View>

              <View style={styles.previewPoint}>
                <View style={styles.previewDot} />

                <Text style={styles.previewPointText}>
                  Decisions and priorities become easier to scan.
                </Text>
              </View>
            </View>

            <View style={styles.previewSection}>
              <Text style={styles.previewSectionLabel}>
                NEXT ACTIONS
              </Text>

              <View style={styles.previewAction}>
                <View style={styles.previewCheck}>
                  <Ionicons
                    name="checkmark"
                    size={10}
                    color={colors.bg}
                  />
                </View>

                <Text style={styles.previewActionText}>
                  Review the generated brief
                </Text>
              </View>

              <View style={styles.previewAction}>
                <View style={styles.previewCheck}>
                  <Ionicons
                    name="checkmark"
                    size={10}
                    color={colors.bg}
                  />
                </View>

                <Text style={styles.previewActionText}>
                  Move forward with the important parts
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>

      <View style={styles.bottomSpace} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  content: {
    paddingTop: 14,
    paddingBottom: 28,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 17,
  },

  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  brandDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
    marginRight: 7,
  },

  brandText: {
    color: colors.accentSoft,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.6,
  },

  headerSubtitle: {
    color: colors.dim,
    fontSize: 9,
    marginTop: 6,
    marginLeft: 1,
  },

  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 7,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
    marginRight: 5,
  },

  statusText: {
    color: colors.muted,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.9,
  },

  /* Hero */
  hero: {
    overflow: 'hidden',
    borderRadius: 24,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 25,
  },

  heroCopy: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 17,
  },

  heroEyebrow: {
    color: colors.accent,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginBottom: 10,
  },

  heroTitle: {
    color: colors.white,
    fontSize: 31,
    lineHeight: 33,
    fontWeight: '800',
    letterSpacing: -1,
  },

  heroTitleCompact: {
    fontSize: 27,
    lineHeight: 30,
  },

  heroDescription: {
    color: colors.text,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 12,
  },

  heroMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginTop: 17,
    paddingTop: 13,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  metaDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
    marginRight: 5,
  },

  metaText: {
    color: colors.muted,
    fontSize: 9,
    fontWeight: '600',
    marginLeft: 4,
  },

  /*
   * Wide cinematic image.
   * The image fills the card width but stays short enough
   * to behave like a visual banner rather than a poster.
   */
  heroImage: {
    width: '100%',
    height: 205,
    justifyContent: 'flex-start',
  },

  heroImageStyle: {
    width: '100%',
    height: '100%',
  },

  heroImageShade: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(3, 15, 17, 0.08)',
  },

  imageLabel: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginLeft: 12,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(6, 17, 19, 0.76)',
    borderWidth: 1,
    borderColor: 'rgba(45, 225, 214, 0.12)',
  },

  imageLabelDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.accent,
    marginRight: 5,
  },

  imageLabelText: {
    color: colors.accentSoft,
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 0.9,
  },

  /* Section */
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 10,
  },

  loadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 2,
  },

  loadText: {
    color: colors.accent,
    fontSize: 9,
    fontWeight: '800',
    marginRight: 5,
  },

  pressed: {
    opacity: 0.62,
  },

  /* Input */
  inputCard: {
    padding: 14,
    borderRadius: 20,
  },

  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  bufferLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
  },

  bufferDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.accent,
    marginRight: 5,
  },

  bufferText: {
    color: colors.accentSoft,
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 1,
  },

  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  clearText: {
    color: colors.dim,
    fontSize: 9,
    fontWeight: '700',
    marginRight: 2,
  },

  input: {
    minHeight: 160,
    maxHeight: 285,
    color: colors.white,
    fontSize: 15,
    lineHeight: 24,
    fontWeight: '500',
    paddingTop: 12,
    paddingBottom: 9,
  },

  inputCompact: {
    minHeight: 145,
    fontSize: 14,
    lineHeight: 22,
  },

  inputFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  quickRow: {
    gap: 6,
    paddingRight: 6,
  },

  quickChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 7,
    borderRadius: radius.pill,
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
  },

  quickChipActive: {
    backgroundColor: 'rgba(45, 225, 214, 0.06)',
    borderColor: colors.accent,
  },

  quickChipPressed: {
    opacity: 0.68,
  },

  quickChipText: {
    color: colors.muted,
    fontSize: 8,
    fontWeight: '700',
    marginLeft: 4,
  },

  quickChipTextActive: {
    color: colors.accentSoft,
  },

  counter: {
    color: colors.dim,
    fontSize: 8,
    fontWeight: '700',
    marginLeft: 6,
  },

  progressTrack: {
    height: 2,
    borderRadius: radius.pill,
    backgroundColor: colors.surface2,
    overflow: 'hidden',
    marginTop: 9,
  },

  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: radius.pill,
  },

  /* Primary */
  primaryButton: {
    minHeight: 64,
    marginTop: 13,
    paddingHorizontal: 12,
    borderRadius: 19,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.accent,
  },

  primaryButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },

  primaryButtonDisabled: {
    opacity: 0.4,
  },

  primaryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  primaryIcon: {
    width: 41,
    height: 41,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(6, 17, 19, 0.10)',
    marginRight: 10,
  },

  primaryCopy: {
    flex: 1,
  },

  primaryTitle: {
    color: colors.bg,
    fontSize: 13,
    fontWeight: '800',
  },

  primarySubtitle: {
    color: 'rgba(6, 17, 19, 0.58)',
    fontSize: 8,
    fontWeight: '600',
    marginTop: 2,
  },

  primaryArrow: {
    width: 39,
    height: 39,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(6, 17, 19, 0.10)',
  },

  /* Error */
  errorCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 11,
    padding: 11,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 124, 135, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 124, 135, 0.15)',
  },

  errorIcon: {
    width: 30,
    height: 30,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 124, 135, 0.06)',
    marginRight: 8,
  },

  errorBody: {
    flex: 1,
  },

  errorTitle: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 3,
  },

  errorText: {
    color: colors.muted,
    fontSize: 9,
    lineHeight: 15,
  },

  /* Result */
  resultSection: {
    marginTop: 28,
  },

  resultStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 3,
  },

  resultDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.accent,
    marginRight: 5,
  },

  resultStatusText: {
    color: colors.accentSoft,
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 0.8,
  },

  /* Preview */
  outputPreview: {
    padding: 15,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  previewLabels: {
    flexDirection: 'row',
    gap: 6,
  },

  previewLabel: {
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
  },

  previewLabelAccent: {
    backgroundColor: 'rgba(45, 225, 214, 0.05)',
    borderColor: 'rgba(45, 225, 214, 0.14)',
  },

  previewLabelText: {
    color: colors.muted,
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 0.8,
  },

  previewLabelAccentText: {
    color: colors.accentSoft,
  },

  previewPriority: {
    color: colors.accent,
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 1,
  },

  previewTitle: {
    color: colors.white,
    fontSize: 20,
    lineHeight: 25,
    fontWeight: '800',
    letterSpacing: -0.4,
    marginTop: 14,
  },

  previewDescription: {
    color: colors.muted,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 8,
  },

  previewDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },

  previewSection: {
    marginBottom: 15,
  },

  previewSectionLabel: {
    color: colors.accent,
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 1.1,
    marginBottom: 9,
  },

  previewPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },

  previewDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.accent,
    marginTop: 5,
    marginRight: 8,
  },

  previewPointText: {
    flex: 1,
    color: colors.text,
    fontSize: 10,
    lineHeight: 16,
  },

  previewAction: {
    minHeight: 35,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: colors.surface2,
    marginBottom: 6,
  },

  previewCheck: {
    width: 19,
    height: 19,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    marginRight: 8,
  },

  previewActionText: {
    flex: 1,
    color: colors.text,
    fontSize: 9,
  },

  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 10,
    paddingHorizontal: 2,
  },

  disclaimerText: {
    flex: 1,
    color: colors.dim,
    fontSize: 8,
    lineHeight: 14,
    marginLeft: 6,
  },

  newBriefButton: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 9,
    marginTop: 12,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  newBriefText: {
    color: colors.accentSoft,
    fontSize: 9,
    fontWeight: '800',
    marginLeft: 5,
  },

  bottomSpace: {
    height: 18,
  },
});