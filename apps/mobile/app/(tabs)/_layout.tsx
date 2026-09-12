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

type TabIconProps = {
  name: keyof typeof Ionicons.glyphMap;
  focused: boolean;
};

function TabIcon({ name, focused }: TabIconProps) {
  return (
    <View
      style={[
        styles.iconWrap,
        focused && styles.iconWrapActive,
      ]}
    >
      <Ionicons
        name={name}
        size={17}
        color={focused ? colors.accent : colors.dim}
      />
    </View>
  );
}

function CustomTabBar({
  state,
  navigation,
}: {
  state: any;
  navigation: any;
}) {
  const insets = useSafeAreaInsets();

  const tabs = [
    {
      route: 'home',
      label: 'Briefs',
      icon: 'grid-outline' as const,
      activeIcon: 'grid' as const,
    },
    {
      route: 'synthesis',
      label: 'Synthesis',
      icon: 'sparkles-outline' as const,
      activeIcon: 'sparkles' as const,
    },
    {
      route: 'vault',
      label: 'Vault',
      icon: 'archive-outline' as const,
      activeIcon: 'archive' as const,
    },
    {
      route: 'settings',
      label: 'Settings',
      icon: 'settings-outline' as const,
      activeIcon: 'settings' as const,
    },
  ];

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.container,
        {
          paddingBottom: Math.max(insets.bottom, 6),
        },
      ]}
    >
      <View style={styles.barShadow}>
        <BlurView
          intensity={75}
          tint="dark"
          style={styles.blurBar}
        >
          <View style={styles.overlay} />

          <View style={styles.inner}>
            {tabs.map((tab) => {
              const routeIndex = state.routes.findIndex(
                (route: { name: string }) =>
                  route.name === tab.route
              );

              const focused =
                state.routes[state.index]?.name === tab.route;

              const handlePress = () => {
                if (routeIndex === -1) {
                  return;
                }

                const route = state.routes[routeIndex];

                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!focused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              };

              const handleLongPress = () => {
                if (routeIndex === -1) {
                  return;
                }

                const route = state.routes[routeIndex];

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
                  <TabIcon
                    name={
                      focused
                        ? tab.activeIcon
                        : tab.icon
                    }
                    focused={focused}
                  />

                  <Text
                    style={[
                      styles.label,
                      focused && styles.labelActive,
                    ]}
                  >
                    {tab.label}
                  </Text>

                  {focused ? (
                    <View style={styles.activeDot} />
                  ) : (
                    <View style={styles.dotPlaceholder} />
                  )}
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

      {/* Existing route kept so an existing history screen does
          not disappear from the route tree while Vault is being
          introduced. It is hidden from the custom navigation. */}
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
    left: 14,
    right: 14,
    bottom: 0,
    alignItems: 'center',
  },

  barShadow: {
    width: '100%',
    maxWidth: 500,

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.28,
    shadowRadius: 16,

    elevation: 10,
  },

  blurBar: {
    width: '100%',
    minHeight: 62,

    overflow: 'hidden',

    borderRadius: 999,

    borderWidth: 1,
    borderColor: 'rgba(146, 255, 247, 0.10)',

    backgroundColor: 'rgba(11, 24, 27, 0.72)',
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,

    backgroundColor: 'rgba(6, 17, 19, 0.18)',
  },

  inner: {
    flex: 1,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',

    paddingHorizontal: 5,
    paddingVertical: 5,
  },

  tab: {
    flex: 1,

    height: 52,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 999,
  },

  tabPressed: {
    opacity: 0.62,
  },

  iconWrap: {
    width: 29,
    height: 27,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 10,

    backgroundColor: 'transparent',
  },

  iconWrapActive: {
    backgroundColor: 'rgba(45, 225, 214, 0.09)',
  },

  label: {
    color: colors.dim,

    fontSize: 7.5,
    lineHeight: 10,

    fontWeight: '700',

    letterSpacing: 0.2,

    marginTop: 2,
  },

  labelActive: {
    color: colors.accentSoft,
    fontWeight: '800',
  },

  activeDot: {
    width: 3.5,
    height: 3.5,

    borderRadius: 2,

    backgroundColor: colors.accent,

    marginTop: 3,
  },

  dotPlaceholder: {
    width: 3.5,
    height: 3.5,

    marginTop: 3,
  },
});