import { Tabs } from 'expo-router';
import {
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, radius } from '@/theme';

type IconFamily = 'ionicons' | 'material';

type NavItem = {
  label: string;
  route: string;
  icon: string;
  activeIcon: string;
  family: IconFamily;
};

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Briefs',
    route: 'home',
    icon: 'grid-outline',
    activeIcon: 'grid',
    family: 'ionicons',
  },
  {
    label: 'Synthesis',
    route: 'synthesis',
    icon: 'auto-fix-high',
    activeIcon: 'auto-fix',
    family: 'material',
  },
  {
    label: 'Vault',
    route: 'vault',
    icon: 'archive-outline',
    activeIcon: 'archive',
    family: 'ionicons',
  },
  {
    label: 'Settings',
    route: 'settings',
    icon: 'options-outline',
    activeIcon: 'options',
    family: 'ionicons',
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

  const currentRoute = state.routes[state.index]?.name;

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.tabBarContainer,
        {
          paddingBottom: Math.max(insets.bottom, 8),
        },
      ]}
    >
      <View style={styles.tabBar}>
        <View style={styles.topHighlight} />

        {NAV_ITEMS.map((item) => {
          const routeIndex = state.routes.findIndex(
            (route: { name: string }) =>
              route.name === item.route
          );

          const focused = currentRoute === item.route;

          const onPress = () => {
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

          const onLongPress = () => {
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
              key={item.route}
              accessibilityRole="button"
              accessibilityState={
                focused ? { selected: true } : {}
              }
              accessibilityLabel={`${item.label} tab`}
              testID={`${item.route}-tab`}
              onPress={onPress}
              onLongPress={onLongPress}
              style={({ pressed }) => [
                styles.tabButton,
                pressed && styles.tabPressed,
              ]}
            >
              <View
                style={[
                  styles.iconContainer,
                  focused && styles.iconContainerActive,
                ]}
              >
                {item.family === 'material' ? (
                  <MaterialCommunityIcons
                    name={
                      focused
                        ? (item.activeIcon as any)
                        : (item.icon as any)
                    }
                    size={19}
                    color={
                      focused
                        ? colors.accent
                        : colors.dim
                    }
                  />
                ) : (
                  <Ionicons
                    name={
                      focused
                        ? (item.activeIcon as any)
                        : (item.icon as any)
                    }
                    size={19}
                    color={
                      focused
                        ? colors.accent
                        : colors.dim
                    }
                  />
                )}
              </View>

              <Text
                style={[
                  styles.tabLabel,
                  focused && styles.tabLabelActive,
                ]}
              >
                {item.label}
              </Text>

              {focused ? (
                <View style={styles.activeIndicator} />
              ) : (
                <View style={styles.inactiveIndicator} />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
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
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 0,
    alignItems: 'center',
  },

  tabBar: {
    position: 'relative',
    width: '100%',
    minHeight: 69,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',

    paddingHorizontal: 6,
    paddingTop: 7,
    paddingBottom: 5,

    borderRadius: 23,

    backgroundColor: colors.surface,

    borderWidth: 1,
    borderColor: colors.border,

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.25,
    shadowRadius: 18,

    elevation: 10,
  },

  topHighlight: {
    position: 'absolute',
    top: 0,
    left: 42,
    right: 42,
    height: 1,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(146, 255, 247, 0.11)',
  },

  tabButton: {
    flex: 1,
    minWidth: 66,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 3,
  },

  tabPressed: {
    opacity: 0.65,
  },

  iconContainer: {
    width: 34,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
    backgroundColor: 'transparent',
  },

  iconContainerActive: {
    backgroundColor: 'rgba(45, 225, 214, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(45, 225, 214, 0.10)',
  },

  tabLabel: {
    color: colors.dim,
    fontSize: 8,
    lineHeight: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
    marginTop: 2,
  },

  tabLabelActive: {
    color: colors.accentSoft,
    fontWeight: '800',
  },

  activeIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.accent,
    marginTop: 4,
  },

  inactiveIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'transparent',
    marginTop: 4,
  },
});