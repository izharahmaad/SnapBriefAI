import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { BriefResult } from '@/components/BriefResult';
import { GlassCard } from '@/components/GlassCard';
import { SectionTitle } from '@/components/SectionTitle';
import { examples } from '@/constants/examples';
import { generateBrief } from '@/lib/api';
import { saveBrief } from '@/lib/storage';
import { colors, radius, spacing } from '@/theme';
import { Brief } from '@/types/brief';

export default function HomeScreen() {
  const [text, setText] = useState(examples[0]);
  const [brief, setBrief] = useState<Brief | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function create() {
    if (!text.trim() || loading) return;
    setLoading(true); setError('');
    try {
      const output = await generateBrief(text.trim());
      const next: Brief = { ...output, id: `${Date.now()}`, created_at: new Date().toISOString() };
      setBrief(next);
      await saveBrief(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not create the brief.');
    } finally { setLoading(false); }
  }

  function loadExample() {
    const index = Math.floor(Math.random() * examples.length);
    setText(examples[index]);
    setBrief(null);
    setError('');
  }

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <View>
          <Text style={styles.kicker}>SNAPBRIEF</Text>
          <Text style={styles.headerTitle}>Make clarity happen.</Text>
        </View>
        <View style={styles.avatar}><Text style={styles.avatarText}>SB</Text></View>
      </View>

      <View style={styles.hero}>
        <View style={styles.heroGlow} />
        <View style={styles.sparkle}><Ionicons name="sparkles" size={17} color={colors.bg} /></View>
        <Text style={styles.heroTitle}>Messy input in.{"\n"}Sharp brief out.</Text>
        <Text style={styles.heroCopy}>Drop in rough notes, messages or ideas. SnapBrief finds what matters and gives you a clear next move.</Text>
      </View>

      <View style={styles.editorHeader}>
        <SectionTitle eyebrow="01 / INPUT" title="What’s on your mind?" />
        <Pressable onPress={loadExample} style={styles.exampleButton}>
          <Ionicons name="shuffle-outline" size={15} color={colors.muted} />
          <Text style={styles.exampleText}>Example</Text>
        </Pressable>
      </View>

      <GlassCard style={styles.editorCard}>
        <TextInput
          value={text}
          onChangeText={setText}
          multiline
          autoCapitalize="sentences"
          placeholder="Paste a note, meeting recap, idea…"
          placeholderTextColor={colors.dim}
          style={styles.input}
          maxLength={3000}
        />
        <View style={styles.editorFooter}>
          <Text style={styles.counter}>{text.length}/3000</Text>
          <View style={styles.private}><Ionicons name="lock-closed-outline" size={12} color={colors.dim} /><Text style={styles.privateText}>Private on this device</Text></View>
        </View>
      </GlassCard>

      <Pressable
        onPress={create}
        disabled={loading || !text.trim()}
        style={({ pressed }) => [styles.createButton, (pressed && !loading) && styles.pressed, (!text.trim() || loading) && styles.disabled]}
      >
        {loading ? <ActivityIndicator color={colors.bg} /> : <><Text style={styles.createText}>Create brief</Text><View style={styles.arrow}><Ionicons name="arrow-forward" size={18} color={colors.bg} /></View></>}
      </Pressable>

      {error ? <View style={styles.error}><Ionicons name="alert-circle-outline" size={17} color={colors.danger} /><Text style={styles.errorText}>{error}</Text></View> : null}

      {brief ? (
        <View style={styles.resultSection}>
          <View style={styles.resultHead}><SectionTitle eyebrow="02 / RESULT" title="Here’s the signal." /><View style={styles.success}><Ionicons name="checkmark" size={13} color={colors.bg} /></View></View>
          <BriefResult brief={brief} />
          <Text style={styles.disclaimer}>AI-generated. Review important dates, numbers and commitments before sending.</Text>
        </View>
      ) : (
        <GlassCard style={styles.tipCard}>
          <View style={styles.tipIcon}><Ionicons name="bulb-outline" size={18} color={colors.accent} /></View>
          <View style={styles.tipBody}><Text style={styles.tipTitle}>Good input is messy</Text><Text style={styles.tipText}>You don’t need to rewrite your notes first. Keep the rough version — that’s what this tool is for.</Text></View>
        </GlassCard>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingTop: 58, paddingBottom: 120 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 26 },
  kicker: { color: colors.accent, fontSize: 10, fontFamily: 'SpaceGrotesk_700Bold', letterSpacing: 2 },
  headerTitle: { color: colors.text, fontSize: 22, fontFamily: 'SpaceGrotesk_700Bold', marginTop: 4, letterSpacing: -0.6 },
  avatar: { width: 39, height: 39, borderRadius: 20, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.muted, fontSize: 11, fontFamily: 'SpaceGrotesk_700Bold', letterSpacing: 0.5 },
  hero: { position: 'relative', overflow: 'hidden', borderRadius: 24, backgroundColor: '#15191A', borderWidth: 1, borderColor: '#28302A', padding: 24, marginBottom: 30 },
  heroGlow: { position: 'absolute', width: 180, height: 180, borderRadius: 90, right: -70, top: -90, backgroundColor: '#2F4A09', opacity: 0.45 },
  sparkle: { width: 36, height: 36, borderRadius: 11, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', marginBottom: 19 },
  heroTitle: { color: colors.text, fontSize: 31, lineHeight: 34, fontFamily: 'SpaceGrotesk_700Bold', letterSpacing: -1.1 },
  heroCopy: { color: '#969E9B', fontSize: 13, lineHeight: 20, marginTop: 13, maxWidth: 310 },
  editorHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 11 },
  exampleButton: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingBottom: 4 },
  exampleText: { color: colors.muted, fontSize: 11, fontFamily: 'SpaceGrotesk_600SemiBold' },
  editorCard: { minHeight: 180, padding: 16, marginBottom: 13 },
  input: { color: colors.text, fontSize: 15, lineHeight: 22, minHeight: 128, textAlignVertical: 'top' },
  editorFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 9, borderTopWidth: 1, borderTopColor: colors.border },
  counter: { color: colors.dim, fontSize: 10, fontFamily: 'SpaceGrotesk_600SemiBold' },
  private: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  privateText: { color: colors.dim, fontSize: 10 },
  createButton: { minHeight: 58, borderRadius: 17, backgroundColor: colors.accent, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 },
  createText: { color: colors.bg, fontSize: 15, fontFamily: 'SpaceGrotesk_700Bold' },
  arrow: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#C4EA48', alignItems: 'center', justifyContent: 'center' },
  pressed: { transform: [{ scale: 0.985 }], opacity: 0.9 },
  disabled: { opacity: 0.45 },
  error: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, marginTop: 13, borderRadius: 12, backgroundColor: '#211414', borderWidth: 1, borderColor: '#412323' },
  errorText: { color: '#FFABAB', flex: 1, fontSize: 12, lineHeight: 18 },
  resultSection: { marginTop: 31 },
  resultHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 },
  success: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', marginBottom: 2 },
  disclaimer: { color: colors.dim, fontSize: 10, lineHeight: 15, marginTop: 10, paddingHorizontal: 2 },
  tipCard: { flexDirection: 'row', padding: 17, marginTop: 24, gap: 13 },
  tipIcon: { width: 34, height: 34, borderRadius: 11, backgroundColor: '#1A2010', alignItems: 'center', justifyContent: 'center' },
  tipBody: { flex: 1 },
  tipTitle: { color: colors.text, fontSize: 13, fontFamily: 'SpaceGrotesk_700Bold', marginBottom: 3 },
  tipText: { color: colors.muted, fontSize: 12, lineHeight: 18 },
});
