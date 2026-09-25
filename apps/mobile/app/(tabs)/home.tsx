import { SafeAreaView } from 'react-native-safe-area-context';
import HomeScreen from '@/screens/HomeScreen';
export default function Home() { return <SafeAreaView style={{ flex: 1, backgroundColor: '#0A0C0D' }} edges={['top']}><HomeScreen /></SafeAreaView>; }
