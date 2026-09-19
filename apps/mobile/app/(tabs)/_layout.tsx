import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/theme';

type TabDefinition = {
  route: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon: keyof typeof Ionicons.glyphMap;
};

const TABS: TabDefinition[] = [
  {
    route: 'home',
    label: 'Briefs',
    icon: 'home-outline',
    activeIcon: 'home',
  },
  {
    route: 'synthesis',
    label: 'Synthesis',
    icon: 'sparkles-outline',
    activeIcon: 'sparkles',
  },
  {
    route: 'vault',
    label: 'Vault',
    icon: 'archive-outline',
    activeIcon: 'archive',
  },
  {
    route: 'settings',
    label: 'Settings',
    icon: 'settings-outline',
    activeIcon: 'settings',
  },
];

function CustomTabBar({
  state,
  navigation,
}: {
  state: any;
  navigation: any;
}) {
  const insets = useSafeAreaInsets();

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.container,
        {
          paddingBottom: Math.max(insets.bottom + 5, 10),
        },
      ]}
    >
      <View style={styles.shadow}>
        <BlurView
          intensity={70}
          tint="dark"
          style={styles.bar}
        >
          <View
            pointerEvents="none"
            style={styles.tint}
          />

          <View style={styles.content}>
            {TABS.map((tab) => {
              const routeIndex = state.routes.findIndex(
                (route: { name: string }) =>
                  route.name === tab.route,
              );

              if (routeIndex === -1) {
                return null;
              }

              const route = state.routes[routeIndex];

              const focused =
                state.routes[state.index]?.name ===
                tab.route;

              const handlePress = () => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });

                if (
                  !focused &&
                  !event.defaultPrevented
                ) {
                  navigation.navigate(route.name);
                }
              };

              const handleLongPress = () => {
                navigation.emit({
                  type: 'tabLongPress',
                  target: route.key,
                });
              };

              return (
                <Pressable
                  key={tab.route}
                  onPress={handlePress}
                  onLongPress={handleLongPress}
                  accessibilityRole="button"
                  accessibilityLabel={`${tab.label} tab`}
                  accessibilityState={{
                    selected: focused,
                  }}
                  style={({ pressed }) => [
                    styles.tab,
                    pressed && styles.tabPressed,
                  ]}
                >
                  <View style={styles.iconArea}>
                    <Ionicons
                      name={
                        focused
                          ? tab.activeIcon
                          : tab.icon
                      }
                      size={17}
                      color={
                        focused
                          ? colors.accent
                          : colors.dim
                      }
                    />
                  </View>

                  <Text
                    style={[
                      styles.label,
                      focused && styles.labelActive,
                    ]}
                  >
                    {tab.label}
                  </Text>

                  <View
                    style={[
                      styles.indicator,
                      !focused &&
                        styles.indicatorHidden,
                    ]}
                  />
                </Pressable>
              );
            })}
          </View>
        </BlurView>
      </View>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => (
        <CustomTabBar
          state={props.state}
          navigation={props.navigation}
        />
      )}
      screenOptions={{
        headerShown: false,
        sceneStyle: {
          backgroundColor: colors.bg,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Briefs',
        }}
      />

      <Tabs.Screen
        name="synthesis"
        options={{
          title: 'Synthesis',
        }}
      />

      <Tabs.Screen
        name="vault"
        options={{
          title: 'Vault',
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 0,
    alignItems: 'center',
  },

  shadow: {
    width: '100%',
    maxWidth: 440,

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.24,
    shadowRadius: 13,

    elevation: 8,
  },

  bar: {
    width: '100%',
    height: 56,

    overflow: 'hidden',

    borderRadius: 999,

    borderWidth: 1,
    borderColor: 'rgba(146, 255, 247, 0.09)',

    backgroundColor: 'rgba(11, 24, 27, 0.78)',
  },

  tint: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(6, 17, 19, 0.10)',
  },

  content: {
    flex: 1,

    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 4,
  },

  tab: {
    flex: 1,
    height: 48,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 999,
  },

  tabPressed: {
    opacity: 0.58,
  },

  iconArea: {
    height: 20,

    alignItems: 'center',
    justifyContent: 'center',
  },

  label: {
    color: colors.dim,

    fontSize: 7,
    lineHeight: 9,

    fontWeight: '700',
    letterSpacing: 0.15,

    marginTop: 2,
  },

  labelActive: {
    color: colors.accentSoft,
    fontWeight: '800',
  },

  indicator: {
    width: 3,
    height: 3,

    borderRadius: 999,

    backgroundColor: colors.accent,

    marginTop: 3,
  },

  indicatorHidden: {
    opacity: 0,
  },
});