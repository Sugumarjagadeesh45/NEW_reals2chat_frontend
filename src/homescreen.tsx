import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  ScrollView,
  FlatList,
  Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAuth } from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_URL from './utiliti/config';
import { theme } from '../styles/theme';
import { useRoute } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const route = useRoute();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('Following');
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const hasCheckedAuth = useRef(false);

  // Check for registration modal parameter
  useEffect(() => {
    if (route.params?.showRegistrationModal) {
      setShowRegistrationModal(true);
      // Reset the param to avoid showing the modal again when navigating back
      navigation.setParams({ showRegistrationModal: undefined });
    }
  }, [route.params, navigation]);

  useEffect(() => {
    const checkAuthState = async () => {
      if (hasCheckedAuth.current) return;
      hasCheckedAuth.current = true;

      try {
        const currentUser = getAuth().currentUser;
        const token = await AsyncStorage.getItem('authToken');
        const userInfo = await AsyncStorage.getItem('userInfo');

        let parsedUserInfo = null;
        if (userInfo) {
          try {
            parsedUserInfo = JSON.parse(userInfo);
          } catch (e) {
            console.error('Error parsing userInfo:', e);
          }
        }

        if (token && !currentUser) {
          try {
            const response = await fetch(`${API_URL}/api/auth/profile`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              timeout: 10000,
            });

            if (response.ok) {
              const userData = await response.json();
              setUserProfile(userData.user);
              setUser(parsedUserInfo || { email: userData.user.email });
            } else if (response.status === 401) {
              await AsyncStorage.removeItem('authToken');
              await AsyncStorage.removeItem('userInfo');
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
              return;
            }
          } catch (error) {
            console.error('Error checking token validity:', error);
            await AsyncStorage.removeItem('authToken');
            await AsyncStorage.removeItem('userInfo');
          }
        } else if (!token && !currentUser) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
          return;
        }

        setUser(currentUser || parsedUserInfo || { email: 'Backend User' });

        if (token && currentUser) {
          try {
            const response = await fetch(`${API_URL}/api/auth/profile`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              timeout: 10000,
            });

            if (response.ok) {
              const userData = await response.json();
              setUserProfile(userData.user);
            } else if (response.status === 401) {
              await AsyncStorage.removeItem('authToken');
              await AsyncStorage.removeItem('userInfo');
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            }
          } catch (error) {
            console.error('Error checking user profile:', error);
          }
        }
      } catch (error) {
        console.error('Error checking auth state:', error);
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      } finally {
        setLoading(false);
      }
    };

    checkAuthState();
  }, [navigation]);

  const tabs = ['Following', 'Friends', 'Follower', 'For You', 'Templates'];
  const stories = [
    { id: '1', username: 'Your Story', avatar: 'https://randomuser.me/api/portraits/women/32.jpg' },
    { id: '2', username: '@keirasugan', avatar: 'https://randomuser.me/api/portraits/men/22.jpg' },
    { id: '3', username: '@malarlithun', avatar: 'https://randomuser.me/api/portraits/women/65.jpg' },
    { id: '4', username: '@radhekrishna', avatar: 'https://randomuser.me/api/portraits/men/42.jpg' },
    { id: '5', username: '@doctorsango', avatar: 'https://randomuser.me/api/portraits/women/57.jpg' },
  ];

  const spotlightItems = [
    { id: '1', name: 'Sango 💬️', stats: ['2.4K', '140', '293'] },
    { id: '2', name: 'Husband 💤️', stats: ['1.5K', '85', '210'] },
    { id: '3', name: 'Ayoo semma', stats: ['22.9K', '1.2K', '3.5K'] },
  ];

  const reels = [
    {
      id: '1',
      username: '@keirasugan',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
      music: 'Dang Dang - Manam Kothi Paravai',
      description: 'Husband sleeping 😴️ #Funny #DailyLife',
      hashtags: '#Comedy #CoupleGoals #Sleeping',
      actions: { likes: '498', comments: '125', shares: '58' },
      image: 'https://picsum.photos/400/600',
    },
    {
      id: '2',
      username: '@malarlithun',
      avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
      music: 'Original Sound - by 11699245201',
      description: 'Ayoo semma 💬 💬 💬',
      hashtags: '#Pacholay #Pathikidichi #TaubaTauba',
      actions: { likes: '22.9K', comments: '1.2K', shares: '3.5K' },
      image: 'https://picsum.photos/400/600?2',
    },
  ];

  const renderStory = ({ item }) => (
    <View style={styles.story}>
      <TouchableOpacity style={styles.storyAvatar}>
        <LinearGradient
          colors={['#8a2be2', '#ff0084', '#33001b']}
          style={styles.storyAvatarGradient}
        >
          <Image source={{ uri: item.avatar }} style={styles.storyAvatarImage} />
        </LinearGradient>
        {item.id === '1' && (
          <View style={styles.addStoryIcon}>
            <Icon name="add" size={12} color={theme.textPrimary} />
          </View>
        )}
      </TouchableOpacity>
      <Text style={styles.storyUsername} numberOfLines={1}>
        {item.username}
      </Text>
    </View>
  );

  const renderSpotlight = ({ item }) => (
    <TouchableOpacity style={styles.spotlightItem}>
      <Image source={{ uri: 'https://picsum.photos/200/200' }} style={styles.spotlightImage} />
      <LinearGradient
        colors={['transparent', 'rgba(0, 0, 0, 0.8)']}
        style={styles.spotlightGradient}
      />
      <View style={styles.spotlightInfo}>
        <Text style={styles.spotlightName} numberOfLines={1}>
          {item.name}
        </Text>
        <View style={styles.spotlightStats}>
          <View style={styles.statItem}>
            <Icon name="visibility" size={14} color={theme.textPrimary} />
            <Text style={styles.spotlightStat}>{item.stats[0]}</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="favorite" size={14} color={theme.textPrimary} />
            <Text style={styles.spotlightStat}>{item.stats[1]}</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="share" size={14} color={theme.textPrimary} />
            <Text style={styles.spotlightStat}>{item.stats[2]}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderReel = ({ item }) => (
    <View style={styles.reelCard}>
      <View style={styles.reelHeader}>
        <View style={styles.userContainer}>
          <Image source={{ uri: item.avatar }} style={styles.reelAvatar} />
          <View style={styles.reelUserInfo}>
            <Text style={styles.reelUsername}>{item.username}</Text>
            <View style={styles.reelMusic}>
              <Icon name="music-note" size={14} color={theme.textSecondary} style={styles.reelMusicIcon} />
              <Text style={styles.reelMusicText}>{item.music}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.reelFollow}>
          <Text style={styles.reelFollowText}>Follow</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.reelVideo}>
        <Image source={{ uri: item.image }} style={styles.reelVideoImage} />
        <View style={styles.reelActions}>
          <TouchableOpacity style={styles.reelAction}>
            <View style={styles.actionIconBg}>
              <Icon name="favorite" size={22} color={theme.textPrimary} />
            </View>
            <Text style={styles.reelActionCount}>{item.actions.likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.reelAction}>
            <View style={styles.actionIconBg}>
              <Icon name="chat" size={22} color={theme.textPrimary} />
            </View>
            <Text style={styles.reelActionCount}>{item.actions.comments}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.reelAction}>
            <View style={styles.actionIconBg}>
              <Icon name="share" size={22} color={theme.textPrimary} />
            </View>
            <Text style={styles.reelActionCount}>{item.actions.shares}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.reelContent}>
          <Text style={styles.reelDescription}>{item.description}</Text>
          <Text style={styles.reelHashtags}>{item.hashtags}</Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <StatusBar barStyle="light-content" backgroundColor={theme.headerBg} />
        <LinearGradient colors={['#0f2027', '#203a43', '#2c5364']} style={styles.container}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.accentColor} />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor={theme.headerBg} />
      <LinearGradient colors={['#0f2027', '#203a43', '#2c5364']} style={styles.container}>
        <View style={styles.containerInner}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Icon name="home" size={22} color={theme.accentColor} />
              <Text style={styles.logo}>REELS2CHAT</Text>
            </View>
            <View style={styles.headerIcons}>
              <TouchableOpacity style={styles.headerIcon}>
                <Icon name="search" size={18} color={theme.textPrimary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerIcon}>
                <Icon name="mail" size={18} color={theme.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.navTabs}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.navTabsContent}
            >
              {tabs.map((tab) => (
                <TouchableOpacity
                  key={tab}
                  style={[styles.navTab, activeTab === tab && styles.navTabActive]}
                  onPress={() => setActiveTab(tab)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.navTabText, activeTab === tab && styles.navTabTextActive]}>
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitle}>
                  <Icon name="circle" size={16} color={theme.accentColor} style={styles.sectionTitleIcon} />
                  <Text style={styles.sectionTitleText}>Stories</Text>
                </View>
                <TouchableOpacity>
                  <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                horizontal
                data={stories}
                renderItem={renderStory}
                keyExtractor={(item) => item.id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.storySectionContent}
              />
            </View>

            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitle}>
                  <Icon name="star" size={16} color={theme.accentColor} style={styles.sectionTitleIcon} />
                  <Text style={styles.sectionTitleText}>Spotlight</Text>
                </View>
                <TouchableOpacity>
                  <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                horizontal
                data={spotlightItems}
                renderItem={renderSpotlight}
                keyExtractor={(item) => item.id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.spotlightGridContent}
              />
            </View>

            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitle}>
                  <Icon name="play-arrow" size={16} color={theme.accentColor} style={styles.sectionTitleIcon} />
                  <Text style={styles.sectionTitleText}>Trending Reels</Text>
                </View>
                <TouchableOpacity>
                  <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={reels}
                renderItem={renderReel}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            </View>
          </ScrollView>
        </View>
      </LinearGradient>

      {/* Registration Modal */}
      {showRegistrationModal && (
        <Modal
          visible={showRegistrationModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowRegistrationModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Complete Your Profile</Text>
              <Text style={styles.modalMessage}>
                Please complete your profile to access all features
              </Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setShowRegistrationModal(false);
                  navigation.navigate('Profile');
                }}
              >
                <Text style={styles.modalButtonText}>Complete Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  containerInner: {
    maxWidth: 480,
    width: '100%',
    flex: 1,
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(18, 24, 38, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    fontSize: 22,
    fontWeight: '700',
    fontFamily: 'Poppins',
    color: theme.textPrimary,
    marginLeft: 8,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 16,
  },
  headerIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navTabs: {
    backgroundColor: 'rgba(18, 24, 38, 0.95)',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  navTabsContent: {
    paddingHorizontal: 20,
  },
  navTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
  },
  navTabActive: {
    borderBottomWidth: 3,
    borderBottomColor: theme.accentColor,
  },
  navTabText: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.textPrimary,
    fontFamily: 'Poppins',
  },
  navTabTextActive: {
    color: theme.accentColor,
    fontWeight: '700',
  },
  content: {
    padding: 16,
    paddingBottom: 120,
  },
  sectionContainer: {
    backgroundColor: 'rgba(30, 40, 50, 0.7)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitleIcon: {
    marginRight: 8,
  },
  sectionTitleText: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.textPrimary,
    fontFamily: 'Poppins',
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.accentColor,
    fontFamily: 'Poppins',
  },
  storySectionContent: {
    paddingRight: 16,
  },
  story: {
    alignItems: 'center',
    marginRight: 16,
    width: 82,
  },
  storyAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 8,
    position: 'relative',
  },
  storyAvatarGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyAvatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
    borderWidth: 2,
    borderColor: theme.accentColor,
  },
  addStoryIcon: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.accentColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.headerBg,
  },
  storyUsername: {
    fontSize: 13,
    color: theme.textPrimary,
    textAlign: 'center',
    fontFamily: 'Poppins',
    fontWeight: '500',
  },
  spotlightGridContent: {
    paddingRight: 12,
  },
  spotlightItem: {
    width: width / 3 - 24,
    aspectRatio: 0.8,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 12,
    position: 'relative',
    backgroundColor: '#222',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  spotlightImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  spotlightGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  spotlightInfo: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
  },
  spotlightName: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.textPrimary,
    fontFamily: 'Poppins',
    marginBottom: 8,
  },
  spotlightStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spotlightStat: {
    fontSize: 11,
    color: theme.textPrimary,
    fontFamily: 'Poppins',
    fontWeight: '600',
    marginLeft: 4,
  },
  reelCard: {
    backgroundColor: 'rgba(30, 40, 50, 0.7)',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  reelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  reelAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  reelUserInfo: {
    flex: 1,
  },
  reelUsername: {
    fontWeight: '700',
    fontSize: 16,
    color: theme.textPrimary,
    fontFamily: 'Poppins',
    marginBottom: 4,
  },
  reelMusic: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reelMusicIcon: {
    marginRight: 6,
  },
  reelMusicText: {
    fontSize: 13,
    color: theme.textSecondary,
    fontFamily: 'Poppins',
  },
  reelFollow: {
    backgroundColor: theme.accentColor,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  reelFollowText: {
    color: theme.textPrimary,
    fontWeight: '600',
    fontSize: 13,
    fontFamily: 'Poppins',
  },
  reelVideo: {
    height: width <= 480 ? 420 : 520,
    position: 'relative',
  },
  reelVideoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 12,
  },
  reelActions: {
    position: 'absolute',
    right: 16,
    bottom: 110,
    alignItems: 'center',
    gap: 24,
  },
  reelAction: {
    alignItems: 'center',
  },
  actionIconBg: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  reelActionCount: {
    fontSize: 13,
    color: theme.textPrimary,
    marginTop: 6,
    fontFamily: 'Poppins',
    fontWeight: '600',
  },
  reelContent: {
    position: 'absolute',
    left: 16,
    bottom: 32,
    maxWidth: '70%',
  },
  reelDescription: {
    fontSize: 15,
    color: theme.textPrimary,
    marginBottom: 8,
    fontFamily: 'Poppins',
    fontWeight: '500',
  },
  reelHashtags: {
    fontSize: 14,
    color: theme.accentColor,
    fontFamily: 'Poppins',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: theme.textSecondary,
    fontSize: 16,
    fontFamily: 'Poppins',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: theme.surface,
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.textPrimary,
    marginBottom: 15,
  },
  modalMessage: {
    fontSize: 16,
    color: theme.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: theme.accentColor,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  modalButtonText: {
    color: theme.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;
// import React, { useEffect, useState, useRef } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   StatusBar,
//   Image,
//   TouchableOpacity,
//   Dimensions,
//   ActivityIndicator,
//   ScrollView,
//   FlatList,
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { getAuth } from '@react-native-firebase/auth';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import API_URL from './utiliti/config';
// import { theme } from '../styles/theme';

// const { width } = Dimensions.get('window');

// const HomeScreen = ({ navigation }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [userProfile, setUserProfile] = useState(null);
//   const [activeTab, setActiveTab] = useState('Following');
//   const hasCheckedAuth = useRef(false);

//   const tabs = ['Following', 'Friends', 'Follower', 'For You', 'Templates'];
//   const stories = [
//     { id: '1', username: 'Your Story', avatar: 'https://randomuser.me/api/portraits/women/32.jpg' },
//     { id: '2', username: '@keirasugan', avatar: 'https://randomuser.me/api/portraits/men/22.jpg' },
//     { id: '3', username: '@malarlithun', avatar: 'https://randomuser.me/api/portraits/women/65.jpg' },
//     { id: '4', username: '@radhekrishna', avatar: 'https://randomuser.me/api/portraits/men/42.jpg' },
//     { id: '5', username: '@doctorsango', avatar: 'https://randomuser.me/api/portraits/women/57.jpg' },
//   ];

//   const spotlightItems = [
//     { id: '1', name: 'Sango 💬️', stats: ['2.4K', '140', '293'] },
//     { id: '2', name: 'Husband 💤️', stats: ['1.5K', '85', '210'] },
//     { id: '3', name: 'Ayoo semma', stats: ['22.9K', '1.2K', '3.5K'] },
//   ];

//   const reels = [
//     {
//       id: '1',
//       username: '@keirasugan',
//       avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
//       music: 'Dang Dang - Manam Kothi Paravai',
//       description: 'Husband sleeping 😴️ #Funny #DailyLife',
//       hashtags: '#Comedy #CoupleGoals #Sleeping',
//       actions: { likes: '498', comments: '125', shares: '58' },
//       image: 'https://picsum.photos/400/600',
//     },
//     {
//       id: '2',
//       username: '@malarlithun',
//       avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
//       music: 'Original Sound - by 11699245201',
//       description: 'Ayoo semma 💬 💬 💬',
//       hashtags: '#Pacholay #Pathikidichi #TaubaTauba',
//       actions: { likes: '22.9K', comments: '1.2K', shares: '3.5K' },
//       image: 'https://picsum.photos/400/600?2',
//     },
//   ];

//   useEffect(() => {
//     const checkAuthState = async () => {
//       if (hasCheckedAuth.current) return;
//       hasCheckedAuth.current = true;

//       try {
//         const currentUser = getAuth().currentUser;
//         const token = await AsyncStorage.getItem('authToken');
//         const userInfo = await AsyncStorage.getItem('userInfo');

//         let parsedUserInfo = null;
//         if (userInfo) {
//           try {
//             parsedUserInfo = JSON.parse(userInfo);
//           } catch (e) {
//             console.error('Error parsing userInfo:', e);
//           }
//         }

//         if (token && !currentUser) {
//           try {
//             const response = await fetch(`${API_URL}/api/auth/profile`, {
//               method: 'GET',
//               headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: `Bearer ${token}`,
//               },
//               timeout: 10000,
//             });

//             if (response.ok) {
//               const userData = await response.json();
//               setUserProfile(userData.user);
//               setUser(parsedUserInfo || { email: userData.user.email });
//             } else if (response.status === 401) {
//               await AsyncStorage.removeItem('authToken');
//               await AsyncStorage.removeItem('userInfo');
//               navigation.reset({
//                 index: 0,
//                 routes: [{ name: 'Login' }],
//               });
//               return;
//             }
//           } catch (error) {
//             console.error('Error checking token validity:', error);
//             await AsyncStorage.removeItem('authToken');
//             await AsyncStorage.removeItem('userInfo');
//           }
//         } else if (!token && !currentUser) {
//           navigation.reset({
//             index: 0,
//             routes: [{ name: 'Login' }],
//           });
//           return;
//         }

//         setUser(currentUser || parsedUserInfo || { email: 'Backend User' });

//         if (token && currentUser) {
//           try {
//             const response = await fetch(`${API_URL}/api/auth/profile`, {
//               method: 'GET',
//               headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: `Bearer ${token}`,
//               },
//               timeout: 10000,
//             });

//             if (response.ok) {
//               const userData = await response.json();
//               setUserProfile(userData.user);
//             } else if (response.status === 401) {
//               await AsyncStorage.removeItem('authToken');
//               await AsyncStorage.removeItem('userInfo');
//               navigation.reset({
//                 index: 0,
//                 routes: [{ name: 'Login' }],
//               });
//             }
//           } catch (error) {
//             console.error('Error checking user profile:', error);
//           }
//         }
//       } catch (error) {
//         console.error('Error checking auth state:', error);
//         navigation.reset({
//           index: 0,
//           routes: [{ name: 'Login' }],
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkAuthState();
//   }, [navigation]);

//   const renderStory = ({ item }) => (
//     <View style={styles.story}>
//       <TouchableOpacity style={styles.storyAvatar}>
//         <LinearGradient
//           colors={['#8a2be2', '#ff0084', '#33001b']}
//           style={styles.storyAvatarGradient}
//         >
//           <Image source={{ uri: item.avatar }} style={styles.storyAvatarImage} />
//         </LinearGradient>
//         {item.id === '1' && (
//           <View style={styles.addStoryIcon}>
//             <Icon name="add" size={12} color={theme.textPrimary} />
//           </View>
//         )}
//       </TouchableOpacity>
//       <Text style={styles.storyUsername} numberOfLines={1}>
//         {item.username}
//       </Text>
//     </View>
//   );

//   const renderSpotlight = ({ item }) => (
//     <TouchableOpacity style={styles.spotlightItem}>
//       <Image source={{ uri: 'https://picsum.photos/200/200' }} style={styles.spotlightImage} />
//       <LinearGradient
//         colors={['transparent', 'rgba(0, 0, 0, 0.8)']}
//         style={styles.spotlightGradient}
//       />
//       <View style={styles.spotlightInfo}>
//         <Text style={styles.spotlightName} numberOfLines={1}>
//           {item.name}
//         </Text>
//         <View style={styles.spotlightStats}>
//           <View style={styles.statItem}>
//             <Icon name="visibility" size={14} color={theme.textPrimary} />
//             <Text style={styles.spotlightStat}>{item.stats[0]}</Text>
//           </View>
//           <View style={styles.statItem}>
//             <Icon name="favorite" size={14} color={theme.textPrimary} />
//             <Text style={styles.spotlightStat}>{item.stats[1]}</Text>
//           </View>
//           <View style={styles.statItem}>
//             <Icon name="share" size={14} color={theme.textPrimary} />
//             <Text style={styles.spotlightStat}>{item.stats[2]}</Text>
//           </View>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );

//   const renderReel = ({ item }) => (
//     <View style={styles.reelCard}>
//       <View style={styles.reelHeader}>
//         <View style={styles.userContainer}>
//           <Image source={{ uri: item.avatar }} style={styles.reelAvatar} />
//           <View style={styles.reelUserInfo}>
//             <Text style={styles.reelUsername}>{item.username}</Text>
//             <View style={styles.reelMusic}>
//               <Icon name="music-note" size={14} color={theme.textSecondary} style={styles.reelMusicIcon} />
//               <Text style={styles.reelMusicText}>{item.music}</Text>
//             </View>
//           </View>
//         </View>
//         <TouchableOpacity style={styles.reelFollow}>
//           <Text style={styles.reelFollowText}>Follow</Text>
//         </TouchableOpacity>
//       </View>
//       <View style={styles.reelVideo}>
//         <Image source={{ uri: item.image }} style={styles.reelVideoImage} />
//         <View style={styles.reelActions}>
//           <TouchableOpacity style={styles.reelAction}>
//             <View style={styles.actionIconBg}>
//               <Icon name="favorite" size={22} color={theme.textPrimary} />
//             </View>
//             <Text style={styles.reelActionCount}>{item.actions.likes}</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.reelAction}>
//             <View style={styles.actionIconBg}>
//               <Icon name="chat" size={22} color={theme.textPrimary} />
//             </View>
//             <Text style={styles.reelActionCount}>{item.actions.comments}</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.reelAction}>
//             <View style={styles.actionIconBg}>
//               <Icon name="share" size={22} color={theme.textPrimary} />
//             </View>
//             <Text style={styles.reelActionCount}>{item.actions.shares}</Text>
//           </TouchableOpacity>
//         </View>
//         <View style={styles.reelContent}>
//           <Text style={styles.reelDescription}>{item.description}</Text>
//           <Text style={styles.reelHashtags}>{item.hashtags}</Text>
//         </View>
//       </View>
//     </View>
//   );

//   if (loading) {
//     return (
//       <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
//         <StatusBar barStyle="light-content" backgroundColor={theme.headerBg} />
//         <LinearGradient colors={['#0f2027', '#203a43', '#2c5364']} style={styles.container}>
//           <View style={styles.loadingContainer}>
//             <ActivityIndicator size="large" color={theme.accentColor} />
//             <Text style={styles.loadingText}>Loading...</Text>
//           </View>
//         </LinearGradient>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
//       <StatusBar barStyle="light-content" backgroundColor={theme.headerBg} />
//       <LinearGradient colors={['#0f2027', '#203a43', '#2c5364']} style={styles.container}>
//         <View style={styles.containerInner}>
//           <View style={styles.header}>
//             <View style={styles.logoContainer}>
//               <Icon name="home" size={22} color={theme.accentColor} />
//               <Text style={styles.logo}>REELS2CHAT</Text>
//             </View>
//             <View style={styles.headerIcons}>
//               <TouchableOpacity style={styles.headerIcon}>
//                 <Icon name="search" size={18} color={theme.textPrimary} />
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.headerIcon}>
//                 <Icon name="mail" size={18} color={theme.textPrimary} />
//               </TouchableOpacity>
//             </View>
//           </View>

//           <View style={styles.navTabs}>
//             <ScrollView 
//               horizontal 
//               showsHorizontalScrollIndicator={false}
//               contentContainerStyle={styles.navTabsContent}
//             >
//               {tabs.map((tab) => (
//                 <TouchableOpacity
//                   key={tab}
//                   style={[styles.navTab, activeTab === tab && styles.navTabActive]}
//                   onPress={() => setActiveTab(tab)}
//                   activeOpacity={0.7}
//                 >
//                   <Text style={[styles.navTabText, activeTab === tab && styles.navTabTextActive]}>
//                     {tab}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>
//           </View>

//           <ScrollView contentContainerStyle={styles.content}>
//             <View style={styles.sectionContainer}>
//               <View style={styles.sectionHeader}>
//                 <View style={styles.sectionTitle}>
//                   <Icon name="circle" size={16} color={theme.accentColor} style={styles.sectionTitleIcon} />
//                   <Text style={styles.sectionTitleText}>Stories</Text>
//                 </View>
//                 <TouchableOpacity>
//                   <Text style={styles.seeAllText}>See All</Text>
//                 </TouchableOpacity>
//               </View>
//               <FlatList
//                 horizontal
//                 data={stories}
//                 renderItem={renderStory}
//                 keyExtractor={(item) => item.id}
//                 showsHorizontalScrollIndicator={false}
//                 contentContainerStyle={styles.storySectionContent}
//               />
//             </View>

//             <View style={styles.sectionContainer}>
//               <View style={styles.sectionHeader}>
//                 <View style={styles.sectionTitle}>
//                   <Icon name="star" size={16} color={theme.accentColor} style={styles.sectionTitleIcon} />
//                   <Text style={styles.sectionTitleText}>Spotlight</Text>
//                 </View>
//                 <TouchableOpacity>
//                   <Text style={styles.seeAllText}>See All</Text>
//                 </TouchableOpacity>
//               </View>
//               <FlatList
//                 horizontal
//                 data={spotlightItems}
//                 renderItem={renderSpotlight}
//                 keyExtractor={(item) => item.id}
//                 showsHorizontalScrollIndicator={false}
//                 contentContainerStyle={styles.spotlightGridContent}
//               />
//             </View>

//             <View style={styles.sectionContainer}>
//               <View style={styles.sectionHeader}>
//                 <View style={styles.sectionTitle}>
//                   <Icon name="play-arrow" size={16} color={theme.accentColor} style={styles.sectionTitleIcon} />
//                   <Text style={styles.sectionTitleText}>Trending Reels</Text>
//                 </View>
//                 <TouchableOpacity>
//                   <Text style={styles.seeAllText}>See All</Text>
//                 </TouchableOpacity>
//               </View>
//               <FlatList
//                 data={reels}
//                 renderItem={renderReel}
//                 keyExtractor={(item) => item.id}
//                 scrollEnabled={false}
//               />
//             </View>
//           </ScrollView>
//         </View>
//       </LinearGradient>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: theme.background,
//   },
//   containerInner: {
//     maxWidth: 480,
//     width: '100%',
//     flex: 1,
//     alignSelf: 'center',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 16,
//     paddingHorizontal: 20,
//     backgroundColor: 'rgba(18, 24, 38, 0.95)',
//     borderBottomWidth: 1,
//     borderBottomColor: 'rgba(255, 255, 255, 0.08)',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.15,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   logoContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   logo: {
//     fontSize: 22,
//     fontWeight: '700',
//     fontFamily: 'Poppins',
//     color: theme.textPrimary,
//     marginLeft: 8,
//   },
//   headerIcons: {
//     flexDirection: 'row',
//     gap: 16,
//   },
//   headerIcon: {
//     width: 38,
//     height: 38,
//     borderRadius: 19,
//     backgroundColor: 'rgba(255, 255, 255, 0.08)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   navTabs: {
//     backgroundColor: 'rgba(18, 24, 38, 0.95)',
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: 'rgba(255, 255, 255, 0.08)',
//   },
//   navTabsContent: {
//     paddingHorizontal: 20,
//   },
//   navTab: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     marginRight: 12,
//   },
//   navTabActive: {
//     borderBottomWidth: 3,
//     borderBottomColor: theme.accentColor,
//   },
//   navTabText: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: theme.textPrimary,
//     fontFamily: 'Poppins',
//   },
//   navTabTextActive: {
//     color: theme.accentColor,
//     fontWeight: '700',
//   },
//   content: {
//     padding: 16,
//     paddingBottom: 120,
//   },
//   sectionContainer: {
//     backgroundColor: 'rgba(30, 40, 50, 0.7)',
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.15,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   sectionTitle: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   sectionTitleIcon: {
//     marginRight: 8,
//   },
//   sectionTitleText: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: theme.textPrimary,
//     fontFamily: 'Poppins',
//   },
//   seeAllText: {
//     fontSize: 13,
//     fontWeight: '600',
//     color: theme.accentColor,
//     fontFamily: 'Poppins',
//   },
//   storySectionContent: {
//     paddingRight: 16,
//   },
//   story: {
//     alignItems: 'center',
//     marginRight: 16,
//     width: 82,
//   },
//   storyAvatar: {
//     width: 64,
//     height: 64,
//     borderRadius: 32,
//     marginBottom: 8,
//     position: 'relative',
//   },
//   storyAvatarGradient: {
//     width: '100%',
//     height: '100%',
//     borderRadius: 32,
//     padding: 3,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   storyAvatarImage: {
//     width: '100%',
//     height: '100%',
//     borderRadius: 32,
//     borderWidth: 2,
//     borderColor: theme.accentColor,
//   },
//   addStoryIcon: {
//     position: 'absolute',
//     bottom: 2,
//     right: 2,
//     width: 20,
//     height: 20,
//     borderRadius: 10,
//     backgroundColor: theme.accentColor,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: theme.headerBg,
//   },
//   storyUsername: {
//     fontSize: 13,
//     color: theme.textPrimary,
//     textAlign: 'center',
//     fontFamily: 'Poppins',
//     fontWeight: '500',
//   },
//   spotlightGridContent: {
//     paddingRight: 12,
//   },
//   spotlightItem: {
//     width: width / 3 - 24,
//     aspectRatio: 0.8,
//     borderRadius: 12,
//     overflow: 'hidden',
//     marginRight: 12,
//     position: 'relative',
//     backgroundColor: '#222',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.15,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   spotlightImage: {
//     width: '100%',
//     height: '100%',
//     resizeMode: 'cover',
//   },
//   spotlightGradient: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     height: '60%',
//   },
//   spotlightInfo: {
//     position: 'absolute',
//     bottom: 10,
//     left: 10,
//     right: 10,
//   },
//   spotlightName: {
//     fontSize: 13,
//     fontWeight: '700',
//     color: theme.textPrimary,
//     fontFamily: 'Poppins',
//     marginBottom: 8,
//   },
//   spotlightStats: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   statItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   spotlightStat: {
//     fontSize: 11,
//     color: theme.textPrimary,
//     fontFamily: 'Poppins',
//     fontWeight: '600',
//     marginLeft: 4,
//   },
//   reelCard: {
//     backgroundColor: 'rgba(30, 40, 50, 0.7)',
//     borderRadius: 16,
//     marginBottom: 16,
//     overflow: 'hidden',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.15,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   reelHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: 12,
//   },
//   userContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   reelAvatar: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     marginRight: 12,
//     borderWidth: 2,
//     borderColor: 'rgba(255, 255, 255, 0.15)',
//   },
//   reelUserInfo: {
//     flex: 1,
//   },
//   reelUsername: {
//     fontWeight: '700',
//     fontSize: 16,
//     color: theme.textPrimary,
//     fontFamily: 'Poppins',
//     marginBottom: 4,
//   },
//   reelMusic: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   reelMusicIcon: {
//     marginRight: 6,
//   },
//   reelMusicText: {
//     fontSize: 13,
//     color: theme.textSecondary,
//     fontFamily: 'Poppins',
//   },
//   reelFollow: {
//     backgroundColor: theme.accentColor,
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.15,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   reelFollowText: {
//     color: theme.textPrimary,
//     fontWeight: '600',
//     fontSize: 13,
//     fontFamily: 'Poppins',
//   },
//   reelVideo: {
//     height: width <= 480 ? 420 : 520,
//     position: 'relative',
//   },
//   reelVideoImage: {
//     width: '100%',
//     height: '100%',
//     resizeMode: 'cover',
//     borderRadius: 12,
//   },
//   reelActions: {
//     position: 'absolute',
//     right: 16,
//     bottom: 110,
//     alignItems: 'center',
//     gap: 24,
//   },
//   reelAction: {
//     alignItems: 'center',
//   },
//   actionIconBg: {
//     width: 45,
//     height: 45,
//     borderRadius: 22.5,
//     backgroundColor: 'rgba(255, 255, 255, 0.08)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.15,
//     shadowRadius: 8,
//   },
//   reelActionCount: {
//     fontSize: 13,
//     color: theme.textPrimary,
//     marginTop: 6,
//     fontFamily: 'Poppins',
//     fontWeight: '600',
//   },
//   reelContent: {
//     position: 'absolute',
//     left: 16,
//     bottom: 32,
//     maxWidth: '70%',
//   },
//   reelDescription: {
//     fontSize: 15,
//     color: theme.textPrimary,
//     marginBottom: 8,
//     fontFamily: 'Poppins',
//     fontWeight: '500',
//   },
//   reelHashtags: {
//     fontSize: 14,
//     color: theme.accentColor,
//     fontFamily: 'Poppins',
//     fontWeight: '600',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     marginTop: 16,
//     color: theme.textSecondary,
//     fontSize: 16,
//     fontFamily: 'Poppins',
//   },
// });

// export default HomeScreen;











// import React, { useEffect, useState, useRef } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   StatusBar,
//   Image,
//   TouchableOpacity,
//   Dimensions,
//   ActivityIndicator,
//   ScrollView,
//   FlatList,
// } from "react-native";
// import LinearGradient from "react-native-linear-gradient";
// import Icon from "react-native-vector-icons/FontAwesome5";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { getAuth } from "@react-native-firebase/auth";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import API_URL from "./utiliti/config";
// import { theme } from "../styles/theme";

// const { width } = Dimensions.get("window");

// const HomeScreen = ({ navigation }) => {
//   const [loading, setLoading] = useState(false);
//   const [activeTab, setActiveTab] = useState("Following");

//   const tabs = ["Following", "Friends", "Follower", "For You", "Templates"];
//   const stories = [
//     {
//       id: "1",
//       username: "Your Story",
//       avatar: "https://randomuser.me/api/portraits/women/32.jpg",
//     },
//     {
//       id: "2",
//       username: "@keirasugan",
//       avatar: "https://randomuser.me/api/portraits/men/22.jpg",
//     },
//     {
//       id: "3",
//       username: "@malarlithun",
//       avatar: "https://randomuser.me/api/portraits/women/65.jpg",
//     },
//     {
//       id: "4",
//       username: "@radhekrishna",
//       avatar: "https://randomuser.me/api/portraits/men/42.jpg",
//     },
//     {
//       id: "5",
//       username: "@doctorsango",
//       avatar: "https://randomuser.me/api/portraits/women/57.jpg",
//     },
//   ];

//   const spotlightItems = [
//     { id: "1", name: "Sango 💬️", stats: ["2.4K", "140", "293"] },
//     { id: "2", name: "Husband 💤️", stats: ["1.5K", "85", "210"] },
//     { id: "3", name: "Ayoo semma", stats: ["22.9K", "1.2K", "3.5K"] },
//   ];

//   const reels = [
//     {
//       id: "1",
//       username: "@keirasugan",
//       avatar: "https://randomuser.me/api/portraits/men/22.jpg",
//       music: "Dang Dang - Manam Kothi Paravai",
//       description: "Husband sleeping 😴️ #Funny #DailyLife",
//       hashtags: "#Comedy #CoupleGoals #Sleeping",
//       actions: { likes: "498", comments: "125", shares: "58" },
//       image: "https://picsum.photos/400/600",
//     },
//     {
//       id: "2",
//       username: "@malarlithun",
//       avatar: "https://randomuser.me/api/portraits/women/65.jpg",
//       music: "Original Sound - by 11699245201",
//       description: "Ayoo semma 💬 💬 💬",
//       hashtags: "#Pacholay #Pathikidichi #TaubaTauba",
//       actions: { likes: "22.9K", comments: "1.2K", shares: "3.5K" },
//       image: "https://picsum.photos/400/600?2",
//     },
//   ];

//   const renderStory = ({ item }) => (
//     <View style={styles.story}>
//       <TouchableOpacity style={styles.storyAvatar}>
//         <LinearGradient
//           colors={["#8a2be2", "#ff0084", "#33001b"]}
//           style={styles.storyAvatarGradient}
//         >
//           <Image source={{ uri: item.avatar }} style={styles.storyAvatarImage} />
//         </LinearGradient>
//         {item.id === "1" && (
//           <View style={styles.addStoryIcon}>
//             <Icon name="plus" size={12} color="#fff" />
//           </View>
//         )}
//       </TouchableOpacity>
//       <Text style={styles.storyUsername} numberOfLines={1}>
//         {item.username}
//       </Text>
//     </View>
//   );

//   const renderSpotlight = ({ item }) => (
//     <TouchableOpacity style={styles.spotlightItem}>
//       <Image
//         source={{ uri: "https://picsum.photos/200/200" }}
//         style={styles.spotlightImage}
//       />
//       <LinearGradient
//         colors={["transparent", "rgba(0, 0, 0, 0.7)"]}
//         style={styles.spotlightGradient}
//       />
//       <View style={styles.spotlightInfo}>
//         <Text style={styles.spotlightName} numberOfLines={1}>
//           {item.name}
//         </Text>
//         <View style={styles.spotlightStats}>
//           <View style={styles.statItem}>
//             <Icon name="eye" size={10} color="#fff" />
//             <Text style={styles.spotlightStat}>{item.stats[0]}</Text>
//           </View>
//           <View style={styles.statItem}>
//             <Icon name="heart" size={10} color="#fff" />
//             <Text style={styles.spotlightStat}>{item.stats[1]}</Text>
//           </View>
//           <View style={styles.statItem}>
//             <Icon name="share" size={10} color="#fff" />
//             <Text style={styles.spotlightStat}>{item.stats[2]}</Text>
//           </View>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );

//   const renderReel = ({ item }) => (
//     <View style={styles.reelCard}>
//       <View style={styles.reelHeader}>
//         <View style={styles.userContainer}>
//           <Image source={{ uri: item.avatar }} style={styles.reelAvatar} />
//           <View style={styles.reelUserInfo}>
//             <Text style={styles.reelUsername}>{item.username}</Text>
//             <View style={styles.reelMusic}>
//               <Icon name="music" size={12} color="#aaa" />
//               <Text style={styles.reelMusicText}>{item.music}</Text>
//             </View>
//           </View>
//         </View>
//         <TouchableOpacity style={styles.reelFollow}>
//           <Text style={styles.reelFollowText}>Follow</Text>
//         </TouchableOpacity>
//       </View>
//       <Image source={{ uri: item.image }} style={styles.reelVideo} />
//       <View style={styles.reelActions}>
//         <TouchableOpacity style={styles.reelAction}>
//           <Icon name="heart" size={22} color="#ff3366" />
//           <Text style={styles.reelActionCount}>{item.actions.likes}</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.reelAction}>
//           <Icon name="comment" size={22} color="#00aced" />
//           <Text style={styles.reelActionCount}>{item.actions.comments}</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.reelAction}>
//           <Icon name="share" size={22} color="#ffcc00" />
//           <Text style={styles.reelActionCount}>{item.actions.shares}</Text>
//         </TouchableOpacity>
//       </View>
//       <View style={styles.reelContent}>
//         <Text style={styles.reelDescription}>{item.description}</Text>
//         <Text style={styles.reelHashtags}>{item.hashtags}</Text>
//       </View>
//     </View>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor="#0b131b" />
//       <LinearGradient
//         colors={["#0f2027", "#203a43", "#2c5364"]}
//         style={styles.container}
//       >
//         {/* Header */}
//         <View style={styles.header}>
//           <Text style={styles.logo}>REELS2CHAT</Text>
//           <View style={styles.headerIcons}>
//             <TouchableOpacity>
//               <Icon name="search" size={20} color="#fff" />
//             </TouchableOpacity>
//             <TouchableOpacity>
//               <Icon name="envelope" size={20} color="#fff" />
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Tabs */}
//         <ScrollView
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           style={styles.navTabs}
//         >
//           {tabs.map((tab) => (
//             <TouchableOpacity
//               key={tab}
//               style={styles.navTab}
//               onPress={() => setActiveTab(tab)}
//             >
//               <Text
//                 style={[
//                   styles.navTabText,
//                   activeTab === tab && styles.navTabTextActive,
//                 ]}
//               >
//                 {tab}
//               </Text>
//               {activeTab === tab && <View style={styles.activeTabIndicator} />}
//             </TouchableOpacity>
//           ))}
//         </ScrollView>

//         <ScrollView contentContainerStyle={{ padding: 15 }}>
//           {/* Stories */}
//           <FlatList
//             horizontal
//             data={stories}
//             renderItem={renderStory}
//             keyExtractor={(item) => item.id}
//             showsHorizontalScrollIndicator={false}
//           />

//           {/* Spotlight */}
//           <View style={styles.sectionHeader}>
//             <Text style={styles.sectionTitle}>Spotlight</Text>
//             <Text style={styles.seeAllText}>See All</Text>
//           </View>
//           <FlatList
//             horizontal
//             data={spotlightItems}
//             renderItem={renderSpotlight}
//             keyExtractor={(item) => item.id}
//             showsHorizontalScrollIndicator={false}
//           />

//           {/* Reels */}
//           <View style={styles.sectionHeader}>
//             <Text style={styles.sectionTitle}>Trending Reels</Text>
//             <Text style={styles.seeAllText}>See All</Text>
//           </View>
//           <FlatList
//             data={reels}
//             renderItem={renderReel}
//             keyExtractor={(item) => item.id}
//             scrollEnabled={false}
//           />
//         </ScrollView>
//       </LinearGradient>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     padding: 15,
//   },
//   logo: { fontSize: 22, fontWeight: "bold", color: "#fff" },
//   headerIcons: { flexDirection: "row", gap: 15 },
//   navTabs: { paddingVertical: 10, paddingHorizontal: 15 },
//   navTab: { marginRight: 20, position: "relative" },
//   navTabText: { fontSize: 16, color: "#aaa" },
//   navTabTextActive: { color: "#fff", fontWeight: "bold" },
//   activeTabIndicator: {
//     height: 3,
//     backgroundColor: "#ff0084",
//     marginTop: 5,
//   },
//   story: { alignItems: "center", marginRight: 15 },
//   storyAvatar: { width: 70, height: 70, borderRadius: 35, overflow: "hidden" },
//   storyAvatarGradient: { flex: 1, borderRadius: 35, padding: 3 },
//   storyAvatarImage: { flex: 1, borderRadius: 35 },
//   addStoryIcon: {
//     position: "absolute",
//     bottom: 0,
//     right: 0,
//     backgroundColor: "#ff0084",
//     borderRadius: 10,
//     padding: 2,
//   },
//   storyUsername: { fontSize: 12, color: "#fff", marginTop: 5 },
//   sectionHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginVertical: 10,
//   },
//   sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#fff" },
//   seeAllText: { fontSize: 14, color: "#ff0084" },
//   spotlightItem: {
//     width: width / 3,
//     height: 150,
//     marginRight: 10,
//     borderRadius: 12,
//     overflow: "hidden",
//   },
//   spotlightImage: { width: "100%", height: "100%" },
//   spotlightGradient: {
//     position: "absolute",
//     bottom: 0,
//     height: "50%",
//     width: "100%",
//   },
//   spotlightInfo: { position: "absolute", bottom: 8, left: 8 },
//   spotlightName: { fontSize: 14, fontWeight: "bold", color: "#fff" },
//   spotlightStats: { flexDirection: "row", marginTop: 5, gap: 10 },
//   statItem: { flexDirection: "row", alignItems: "center" },
//   spotlightStat: { color: "#fff", fontSize: 10, marginLeft: 3 },
//   reelCard: { borderRadius: 12, marginBottom: 20, overflow: "hidden" },
//   reelHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     padding: 10,
//   },
//   userContainer: { flexDirection: "row", alignItems: "center" },
//   reelAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
//   reelUsername: { color: "#fff", fontWeight: "bold" },
//   reelMusic: { flexDirection: "row", alignItems: "center" },
//   reelMusicText: { fontSize: 12, color: "#aaa", marginLeft: 5 },
//   reelFollow: {
//     backgroundColor: "#ff0084",
//     paddingHorizontal: 12,
//     paddingVertical: 5,
//     borderRadius: 20,
//   },
//   reelFollowText: { color: "#fff", fontWeight: "bold" },
//   reelVideo: { width: "100%", height: 300, borderRadius: 10 },
//   reelActions: {
//     position: "absolute",
//     right: 15,
//     bottom: 80,
//     alignItems: "center",
//     gap: 15,
//   },
//   reelAction: { alignItems: "center" },
//   reelActionCount: { color: "#fff", fontSize: 12, marginTop: 3 },
//   reelContent: { padding: 10 },
//   reelDescription: { color: "#fff", marginBottom: 5 },
//   reelHashtags: { color: "#00aced" },
// });

// export default HomeScreen;















































































































































































































































// import React, { useEffect, useState, useMemo, useRef } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   SafeAreaView,
//   StatusBar,
//   Image,
//   TouchableOpacity,
//   Alert,
//   Dimensions,
//   ActivityIndicator,
//   Modal,
//   TextInput,
//   Platform,
// } from 'react-native';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import { getAuth, signOut } from '@react-native-firebase/auth';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import API_URL from './utiliti/config';
// import Icon from 'react-native-vector-icons/MaterialIcons';

// const theme = {
//   background: '#121212',
//   surface: '#1E1E1E',
//   text: '#FFFFFF',
//   textSecondary: 'rgba(255, 255, 255, 0.7)',
//   primary: '#6366F1',
//   primaryLight: '#818CF8',
//   secondary: '#0EA5E9',
//   accent: '#8B5CF6',
//   success: '#10B981',
//   error: '#EF4444',
//   warning: '#F59E0B',
// };

// const HomeScreen = ({ navigation, route }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isNewUser, setIsNewUser] = useState(false);
//   const [showWelcomeModal, setShowWelcomeModal] = useState(false);
//   const [name, setName] = useState('');
//   const [dateOfBirth, setDateOfBirth] = useState(new Date());
//   const [gender, setGender] = useState('male');
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [modalLoading, setModalLoading] = useState(false);
//   const [alertMessage, setAlertMessage] = useState('');
//   const [alertVisible, setAlertVisible] = useState(false);
//   const [userProfile, setUserProfile] = useState(null);
//   const hasCheckedAuth = useRef(false); // Prevent repeated auth checks

//   // Memoize userProfile to prevent unnecessary useEffect triggers
//   const memoizedUserProfile = useMemo(() => userProfile, [userProfile]);

//   useEffect(() => {
//     const checkAuthState = async () => {
//       // Skip if already checked
//       if (hasCheckedAuth.current) return;
//       hasCheckedAuth.current = true;

//       try {
//         const currentUser = getAuth().currentUser;
//         const token = await AsyncStorage.getItem('authToken');
//         const userInfo = await AsyncStorage.getItem('userInfo');
//         console.log('HomeScreen: Retrieved authToken:', token);
//         console.log('HomeScreen: Retrieved userInfo:', userInfo);

//         // Parse user info if it exists
//         let parsedUserInfo = null;
//         if (userInfo) {
//           try {
//             parsedUserInfo = JSON.parse(userInfo);
//           } catch (e) {
//             console.error('Error parsing userInfo:', e);
//           }
//         }

//         // If we have a token but no Firebase user, try to restore session
//         if (token && !currentUser) {
//           console.log('Token found but no Firebase user, checking token validity');
//           try {
//             const response = await fetch(`${API_URL}/api/auth/profile`, {
//               method: 'GET',
//               headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: `Bearer ${token}`,
//               },
//               timeout: 10000, // Add timeout
//             });

//             if (response.ok) {
//               const userData = await response.json();
//               setUserProfile(userData.user);
//               setUser(parsedUserInfo || { email: userData.user.email });

//               // Only show modal if registration is incomplete
//               if (!userData.user.registrationComplete) {
//                 setIsNewUser(true);
//                 setShowWelcomeModal(true);
//                 if (userData.user.name) setName(userData.user.name);
//                 if (userData.user.dateOfBirth) {
//                   setDateOfBirth(new Date(userData.user.dateOfBirth));
//                 }
//                 if (userData.user.gender) setGender(userData.user.gender);
//               }
//             } else if (response.status === 401) {
//               console.log('Token expired, clearing storage');
//               await AsyncStorage.removeItem('authToken');
//               await AsyncStorage.removeItem('userInfo');
//               navigation.reset({
//                 index: 0,
//                 routes: [{ name: 'Login' }],
//               });
//               return;
//             }
//           } catch (error) {
//             console.error('Error checking token validity:', error);
//             await AsyncStorage.removeItem('authToken');
//             await AsyncStorage.removeItem('userInfo');
//           }
//         } else if (!token && !currentUser) {
//           console.log('No user or token found, redirecting to Login');
//           navigation.reset({
//             index: 0,
//             routes: [{ name: 'Login' }],
//           });
//           return;
//         }

//         // Set user state
//         setUser(currentUser || parsedUserInfo || { email: 'Backend User' });

//         if (token && currentUser) {
//           try {
//             const response = await fetch(`${API_URL}/api/auth/profile`, {
//               method: 'GET',
//               headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: `Bearer ${token}`,
//               },
//               timeout: 10000,
//             });

//             if (response.ok) {
//               const userData = await response.json();
//               setUserProfile(userData.user);

//               // Only show modal if registration is incomplete
//               if (!userData.user.registrationComplete) {
//                 setIsNewUser(true);
//                 setShowWelcomeModal(true);
//                 if (userData.user.name) setName(userData.user.name);
//                 if (userData.user.dateOfBirth) {
//                   setDateOfBirth(new Date(userData.user.dateOfBirth));
//                 }
//                 if (userData.user.gender) setGender(userData.user.gender);
//               }
//             } else if (response.status === 401) {
//               await AsyncStorage.removeItem('authToken');
//               await AsyncStorage.removeItem('userInfo');
//               navigation.reset({
//                 index: 0,
//                 routes: [{ name: 'Login' }],
//               });
//             } else if (response.status === 404) {
//               setIsNewUser(true);
//               setShowWelcomeModal(true);
//             } else {
//               console.error('Error checking user profile:', response.status);
//             }
//           } catch (error) {
//             console.error('Error checking user profile:', error);
//           }
//         }
//       } catch (error) {
//         console.error('Error checking auth state:', error);
//         navigation.reset({
//           index: 0,
//           routes: [{ name: 'Login' }],
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkAuthState();
//   }, [navigation]); // Removed userProfile and route.params from dependencies

//   // Handle route.params.showRegistrationModal in a separate useEffect
//   useEffect(() => {
//     if (
//       route.params?.showRegistrationModal &&
//       memoizedUserProfile &&
//       !memoizedUserProfile.registrationComplete
//     ) {
//       setShowWelcomeModal(true);
//       setIsNewUser(true);
//     }
//   }, [route.params, memoizedUserProfile]);

//   const showQuickAlert = (message, type = 'error') => {
//     setAlertMessage(message);
//     setAlertVisible(true);
//     setTimeout(() => {
//       setAlertVisible(false);
//       setAlertMessage('');
//     }, 2500);
//   };

//   const handleProfileUpdate = async () => {
//     if (!name.trim()) {
//       showQuickAlert('Please enter your name', 'error');
//       return;
//     }
//     if (!dateOfBirth) {
//       showQuickAlert('Please select your date of birth', 'error');
//       return;
//     }

//     setModalLoading(true);
//     try {
//       const token = await AsyncStorage.getItem('authToken');
//       const formattedDateOfBirth = dateOfBirth.toISOString().split('T')[0];

//       const profileResponse = await fetch(`${API_URL}/api/auth/profile`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         timeout: 10000,
//       });

//       if (profileResponse.ok) {
//         const response = await fetch(`${API_URL}/api/auth/update-profile`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             name,
//             dateOfBirth: formattedDateOfBirth,
//             gender,
//           }),
//           timeout: 10000,
//         });

//         const data = await response.json();
//         if (response.ok) {
//           if (data.token) {
//             await AsyncStorage.setItem('authToken', data.token);
//           }

//           setUserProfile({
//             ...userProfile,
//             name,
//             dateOfBirth: formattedDateOfBirth,
//             gender,
//             registrationComplete: true,
//           });

//           showQuickAlert('Profile updated successfully!', 'success');
//           setShowWelcomeModal(false);
//           setIsNewUser(false);
//         } else {
//           showQuickAlert(data.message || 'Failed to update profile', 'error');
//         }
//       } else if (profileResponse.status === 404) {
//         const firebaseUser = getAuth().currentUser;
//         let phone = null;

//         if (firebaseUser && firebaseUser.phoneNumber) {
//           phone = firebaseUser.phoneNumber.replace('+91', '');
//         }

//         const userData = {
//           name,
//           email: firebaseUser?.email || '',
//           phone,
//           dateOfBirth: formattedDateOfBirth,
//           gender,
//           isPhoneVerified: !!firebaseUser?.phoneNumber,
//           isEmailVerified: !!firebaseUser?.emailVerified,
//         };

//         const registerResponse = await fetch(`${API_URL}/api/auth/register`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(userData),
//           timeout: 10000,
//         });

//         const registerData = await registerResponse.json();
//         if (registerResponse.ok) {
//           if (registerData.token) {
//             await AsyncStorage.setItem('authToken', registerData.token);
//           }

//           setUserProfile({
//             ...userProfile,
//             name,
//             dateOfBirth: formattedDateOfBirth,
//             gender,
//             registrationComplete: true,
//           });

//           showQuickAlert('Registration completed successfully!', 'success');
//           setShowWelcomeModal(false);
//           setIsNewUser(false);
//         } else {
//           showQuickAlert(registerData.message || 'Failed to complete registration', 'error');
//         }
//       } else {
//         showQuickAlert('Failed to check user profile', 'error');
//       }
//     } catch (error) {
//       console.error('Profile update error:', error);
//       showQuickAlert('Network error: Please check your connection and try again.', 'error');
//     } finally {
//       setModalLoading(false);
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       Alert.alert(
//         'Confirm Logout',
//         'Are you sure you want to logout?',
//         [
//           { text: 'Cancel', style: 'cancel' },
//           {
//             text: 'Logout',
//             onPress: async () => {
//               const auth = getAuth();
//               const firebaseUser = auth.currentUser;

//               if (firebaseUser) {
//                 await signOut(auth);
//                 console.log('Firebase sign-out successful');
//               }

//               const token = await AsyncStorage.getItem('authToken');
//               if (token) {
//                 try {
//                   const response = await fetch(`${API_URL}/api/auth/logout`, {
//                     method: 'POST',
//                     headers: {
//                       'Content-Type': 'application/json',
//                       Authorization: `Bearer ${token}`,
//                     },
//                     timeout: 10000,
//                   });
//                   console.log('Backend logout response:', response.status);
//                 } catch (error) {
//                   console.error('Backend logout error:', error);
//                 }
//               }

//               await AsyncStorage.removeItem('authToken');
//               await AsyncStorage.removeItem('userInfo');
//               console.log('authToken and userInfo removed from AsyncStorage');

//               setUser(null);
//               setUserProfile(null);
//               setIsNewUser(false);
//               setShowWelcomeModal(false);

//               navigation.reset({
//                 index: 0,
//                 routes: [{ name: 'Login' }],
//               });
//             },
//           },
//         ],
//         { cancelable: false }
//       );
//     } catch (error) {
//       console.error('Logout error:', error);
//       Alert.alert('Error', 'Failed to logout. Please try again.');
//     }
//   };

//   const handleDateChange = (event, selectedDate) => {
//     const currentDate = selectedDate || dateOfBirth;
//     setShowDatePicker(Platform.OS === 'ios');
//     setDateOfBirth(currentDate);
//   };

//   const formatDate = (date) => {
//     return date.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//     });
//   };

//   if (loading) {
//     return (
//       <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
//         <StatusBar barStyle="light-content" backgroundColor={theme.background} />
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color={theme.primary} />
//         </View>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
//       <StatusBar barStyle="light-content" backgroundColor={theme.background} />
//       <View style={styles.background}>
//         <View style={[styles.gradientCircle, styles.circle1]} />
//         <View style={[styles.gradientCircle, styles.circle2]} />
//         <View style={[styles.gradientCircle, styles.circle3]} />
//         <View style={[styles.gradientCircle, styles.circle4]} />
//       </View>

//       {alertVisible && (
//         <View
//           style={[
//             styles.alertContainer,
//             { backgroundColor: alertMessage.includes('success') ? theme.success : theme.error },
//           ]}
//         >
//           <Icon
//             name={alertMessage.includes('success') ? 'check-circle' : 'error'}
//             size={20}
//             color="#FFF"
//             style={styles.alertIcon}
//           />
//           <Text style={styles.alertText}>{alertMessage}</Text>
//         </View>
//       )}

//       <View style={styles.content}>
//         <Image
//           source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2504/2504957.png' }}
//           style={styles.logo}
//         />
//         <Text style={styles.title}>Welcome to Reals to Chat</Text>
//         <Text style={styles.subtitle}>Create. Connect. Chat.</Text>

//         {user && (
//           <Text style={styles.userInfo}>
//             Logged in as: {user.email || user.displayName || user.phoneNumber || 'User'}
//           </Text>
//         )}

//         <TouchableOpacity style={styles.button} onPress={handleLogout}>
//           <Text style={styles.buttonText}>Logout</Text>
//         </TouchableOpacity>
//       </View>

//       {showWelcomeModal && isNewUser && memoizedUserProfile && !memoizedUserProfile.registrationComplete && (
//         <Modal
//           visible={showWelcomeModal}
//           transparent={true}
//           animationType="fade"
//           onRequestClose={() => {
//             if (!modalLoading) setShowWelcomeModal(false);
//           }}
//         >
//           <View style={styles.modalContainer}>
//             <View style={styles.modalContent}>
//               <View style={styles.modalHeader}>
//                 <Image
//                   source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2504/2504957.png' }}
//                   style={styles.modalLogo}
//                 />
//                 <Text style={styles.modalTitle}>Welcome to Reals To Chat</Text>
//                 <Text style={styles.modalSubtitle}>
//                   Please complete your registration by entering your details.
//                 </Text>
//               </View>

//               <View style={styles.inputContainer}>
//                 <Icon name="person" size={20} color="rgba(255, 255, 255, 0.7)" style={styles.inputIcon} />
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Full Name"
//                   placeholderTextColor="rgba(255, 255, 255, 0.7)"
//                   value={name}
//                   onChangeText={setName}
//                   autoCapitalize="words"
//                   autoCorrect={false}
//                   spellCheck={false}
//                   autoComplete="off"
//                   textContentType="none"
//                 />
//               </View>

//               <TouchableOpacity
//                 style={styles.datePickerContainer}
//                 onPress={() => setShowDatePicker(true)}
//               >
//                 <Icon name="event" size={20} color="rgba(255, 255, 255, 0.7)" style={styles.inputIcon} />
//                 <Text style={styles.datePickerText}>{formatDate(dateOfBirth)}</Text>
//               </TouchableOpacity>

//               {showDatePicker && (
//                 <DateTimePicker
//                   value={dateOfBirth}
//                   mode="date"
//                   display="default"
//                   onChange={handleDateChange}
//                   maximumDate={new Date()}
//                 />
//               )}

//               <View style={styles.genderContainer}>
//                 <Text style={styles.genderLabel}>Gender:</Text>
//                 <View style={styles.genderOptions}>
//                   <TouchableOpacity
//                     style={[styles.genderOption, gender === 'male' && styles.genderSelected]}
//                     onPress={() => setGender('male')}
//                   >
//                     <Text style={styles.genderText}>Male</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     style={[styles.genderOption, gender === 'female' && styles.genderSelected]}
//                     onPress={() => setGender('female')}
//                   >
//                     <Text style={styles.genderText}>Female</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     style={[styles.genderOption, gender === 'transgender' && styles.genderSelected]}
//                     onPress={() => setGender('transgender')}
//                   >
//                     <Text style={styles.genderText}>Other</Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>

//               <TouchableOpacity
//                 style={[styles.modalButton, modalLoading && styles.disabledButton]}
//                 onPress={handleProfileUpdate}
//                 disabled={modalLoading}
//               >
//                 {modalLoading ? (
//                   <ActivityIndicator size="small" color="#FFFFFF" />
//                 ) : (
//                   <Text style={styles.modalButtonText}>Complete Registration</Text>
//                 )}
//               </TouchableOpacity>
//             </View>
//           </View>
//         </Modal>
//       )}
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: theme.background,
//   },
//   background: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//   },
//   gradientCircle: {
//     position: 'absolute',
//     borderRadius: 500,
//     opacity: 0.3,
//   },
//   circle1: {
//     width: Dimensions.get('window').width * 1.5,
//     height: Dimensions.get('window').width * 1.5,
//     backgroundColor: theme.primary,
//     top: -Dimensions.get('window').width * 0.7,
//     left: -Dimensions.get('window').width * 0.3,
//   },
//   circle2: {
//     width: Dimensions.get('window').width * 1.2,
//     height: Dimensions.get('window').width * 1.2,
//     backgroundColor: theme.secondary,
//     bottom: -Dimensions.get('window').width * 0.5,
//     right: -Dimensions.get('window').width * 0.4,
//   },
//   circle3: {
//     width: Dimensions.get('window').width * 0.8,
//     height: Dimensions.get('window').width * 0.8,
//     backgroundColor: theme.accent,
//     bottom: Dimensions.get('window').height * 0.2,
//     left: -Dimensions.get('window').width * 0.2,
//   },
//   circle4: {
//     width: Dimensions.get('window').width * 0.6,
//     height: Dimensions.get('window').width * 0.6,
//     backgroundColor: theme.surface,
//     top: Dimensions.get('window').height * 0.3,
//     right: -Dimensions.get('window').width * 0.1,
//   },
//   alertContainer: {
//     position: 'absolute',
//     top: Dimensions.get('window').height * 0.12,
//     left: 20,
//     right: 20,
//     padding: 12,
//     borderRadius: 8,
//     flexDirection: 'row',
//     alignItems: 'center',
//     zIndex: 1000,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   alertIcon: {
//     marginRight: 8,
//   },
//   alertText: {
//     color: '#FFF',
//     fontSize: 14,
//     fontWeight: '500',
//     flex: 1,
//   },
//   content: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   logo: {
//     width: 100,
//     height: 100,
//     tintColor: 'white',
//     marginBottom: 20,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: theme.text,
//     marginBottom: 10,
//     textAlign: 'center',
//   },
//   subtitle: {
//     fontSize: 16,
//     color: theme.textSecondary,
//     marginBottom: 30,
//     textAlign: 'center',
//   },
//   userInfo: {
//     fontSize: 16,
//     color: theme.text,
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   button: {
//     backgroundColor: theme.primary,
//     paddingVertical: 15,
//     paddingHorizontal: 30,
//     borderRadius: 25,
//     width: '80%',
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   buttonText: {
//     color: theme.text,
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.7)',
//   },
//   modalContent: {
//     width: '85%',
//     backgroundColor: '#1E1E1E',
//     borderRadius: 20,
//     padding: 25,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   modalHeader: {
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   modalLogo: {
//     width: 70,
//     height: 70,
//     tintColor: 'white',
//     marginBottom: 15,
//   },
//   modalTitle: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//     marginBottom: 10,
//     textAlign: 'center',
//   },
//   modalSubtitle: {
//     fontSize: 14,
//     color: 'rgba(255, 255, 255, 0.7)',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   modalButton: {
//     backgroundColor: '#FF0050',
//     paddingVertical: 12,
//     paddingHorizontal: 25,
//     borderRadius: 25,
//     width: '100%',
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   modalButtonText: {
//     color: '#FFFFFF',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     width: '100%',
//     height: 50,
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.1)',
//     borderRadius: 12,
//     backgroundColor: 'rgba(255, 255, 255, 0.05)',
//     marginBottom: 15,
//     paddingHorizontal: 10,
//   },
//   inputIcon: {
//     marginRight: 10,
//   },
//   input: {
//     flex: 1,
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '500',
//     paddingVertical: 8,
//     includeFontPadding: false,
//     textAlignVertical: 'center',
//   },
//   datePickerContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     width: '100%',
//     height: 50,
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.1)',
//     borderRadius: 12,
//     backgroundColor: 'rgba(255, 255, 255, 0.05)',
//     marginBottom: 15,
//     paddingHorizontal: 15,
//   },
//   datePickerText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '500',
//     marginLeft: 10,
//   },
//   genderContainer: {
//     width: '100%',
//     marginBottom: 20,
//   },
//   genderLabel: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     marginBottom: 10,
//   },
//   genderOptions: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   genderOption: {
//     flex: 1,
//     padding: 12,
//     borderRadius: 8,
//     backgroundColor: 'rgba(255, 255, 255, 0.05)',
//     marginHorizontal: 5,
//     alignItems: 'center',
//   },
//   genderSelected: {
//     backgroundColor: '#FF0050',
//   },
//   genderText: {
//     color: '#FFFFFF',
//     fontSize: 14,
//   },
//   disabledButton: {
//     opacity: 0.5,
//   },
// });

// export default HomeScreen;