import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getAuth, onAuthStateChanged } from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome5';

import HomeScreen from './src/homescreen';
import FriendsScreen from './src/FriendsScreen';
import CreateScreen from './src/CreateScreen';
import ChatScreen from './src/ChatScreen';
import ProfileScreen from './src/ProfileScreen';
import LoginScreen from './src/login';
import RegisterScreen from './src/register';
import CameraScreen from './src/Create/Camera';
import UploadScreen from './src/Create/Upload';
import AIGenerateScreen from './src/Create/AIGenerate';
import TemplatesScreen from './src/Create/Templates';
import { theme } from './styles/theme';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const CreateStack = createStackNavigator();

// Nested stack navigator for Create tab
const CreateStackScreen = () => (
  <CreateStack.Navigator screenOptions={{ headerShown: false }}>
    <CreateStack.Screen name="CreateMain" component={CreateScreen} />
    <CreateStack.Screen name="Camera" component={CameraScreen} />
    <CreateStack.Screen name="Upload" component={UploadScreen} />
    <CreateStack.Screen name="AIGenerate" component={AIGenerateScreen} />
    <CreateStack.Screen name="Templates" component={TemplatesScreen} />
  </CreateStack.Navigator>
);

// Main Tab Navigator
const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;
        if (route.name === 'Home') iconName = 'home';
        else if (route.name === 'Friends') iconName = 'user-friends';
        else if (route.name === 'Create') iconName = 'plus-square';
        else if (route.name === 'Chat') iconName = 'comment';
        else if (route.name === 'Profile') iconName = 'user';

        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: theme.accentColor,
      tabBarInactiveTintColor: theme.textSecondary,
      tabBarStyle: {
        backgroundColor: theme.headerBg,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.1)',
        paddingVertical: 12,
      },
      tabBarLabelStyle: { fontSize: 12, fontFamily: 'Segoe UI' },
      headerShown: false,
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Friends" component={FriendsScreen} />
    <Tab.Screen name="Create" component={CreateStackScreen} />
    <Tab.Screen name="Chat" component={ChatScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const App: React.FC = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const authUnsubscribe = onAuthStateChanged(getAuth(), (currentUser) => {
      setUser(currentUser);
      if (initializing) setInitializing(false);
    });
    return () => authUnsubscribe();
  }, [initializing]);

  if (initializing) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={user ? 'Main' : 'Login'}>
        {/* Main Tabs - Always available in navigator */}
        <Stack.Screen
          name="Main"
          component={MainTabs}
          options={{ headerShown: false }}
        />

        {/* Auth Screens - Only available when user is not logged in */}
        {!user && (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;



// import React, { useEffect, useState } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { getAuth, onAuthStateChanged } from '@react-native-firebase/auth';
// import Icon from 'react-native-vector-icons/FontAwesome5';
// import HomeScreen from './src/homescreen';
// import FriendsScreen from './src/FriendsScreen';
// import CreateScreen from './src/CreateScreen';
// import ChatScreen from './src/ChatScreen';
// import ProfileScreen from './src/ProfileScreen';
// import LoginScreen from './src/login';
// import RegisterScreen from './src/register';
// import { theme } from './styles/theme';

// const Stack = createStackNavigator();
// const Tab = createBottomTabNavigator();

// const MainTabs = () => (
//   <Tab.Navigator
//     screenOptions={({ route }) => ({
//       tabBarIcon: ({ color, size }) => {
//         let iconName;
//         if (route.name === 'Home') iconName = 'home';
//         else if (route.name === 'Friends') iconName = 'user-friends';
//         else if (route.name === 'Create') iconName = 'plus-square';
//         else if (route.name === 'Chat') iconName = 'comment';
//         else if (route.name === 'Profile') iconName = 'user';
//         return <Icon name={iconName} size={size} color={color} />;
//       },
//       tabBarActiveTintColor: theme.accentColor,
//       tabBarInactiveTintColor: theme.textSecondary,
//       tabBarStyle: {
//         backgroundColor: theme.headerBg,
//         borderTopWidth: 1,
//         borderTopColor: 'rgba(255, 255, 255, 0.1)',
//         paddingVertical: 12,
//       },
//       tabBarLabelStyle: { fontSize: 12, fontFamily: 'Segoe UI' },
//       headerShown: false,
//     })}
//   >
//     <Tab.Screen name="Home" component={HomeScreen} />
//     <Tab.Screen name="Friends" component={FriendsScreen} />
//     <Tab.Screen name="Create" component={CreateScreen} />
//     <Tab.Screen name="Chat" component={ChatScreen} />
//     <Tab.Screen name="Profile" component={ProfileScreen} />
//   </Tab.Navigator>
// );

// const App: React.FC = () => {
//   const [initializing, setInitializing] = useState(true);
//   const [user, setUser] = useState<any>(null);

//   useEffect(() => {
//     const authUnsubscribe = onAuthStateChanged(getAuth(), (currentUser) => {
//       setUser(currentUser);
//       if (initializing) setInitializing(false);
//     });
//     return () => authUnsubscribe();
//   }, [initializing]);

//   if (initializing) return null;

//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName={user ? 'Main' : 'Login'}>
//         {user ? (
//           <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
//         ) : (
//           <>
//             <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
//             <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
//           </>
//         )}
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// export default App;





// import React, { useEffect, useState } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import { getAuth, onAuthStateChanged } from '@react-native-firebase/auth'; // Updated import
// import RegisterScreen from './src/register';
// import LoginScreen from './src/login';
// import HomeScreen from './src/homescreen';

// const Stack = createStackNavigator();

// const App: React.FC = () => {
//   const [initializing, setInitializing] = useState(true);
//   const [user, setUser] = useState<any>(null);

//   useEffect(() => {
//     const authUnsubscribe = onAuthStateChanged(getAuth(), (currentUser) => {
//       setUser(currentUser);
//       if (initializing) setInitializing(false);
//       console.log('App.tsx: Auth state changed, user:', currentUser?.uid, 'initializing:', initializing);
//     });
//     return () => authUnsubscribe();
//   }, [initializing]);

//   if (initializing) return null;

//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName={user ? 'Home' : 'Login'}>
//         <Stack.Screen
//           name="Login"
//           component={LoginScreen}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="Register"
//           component={RegisterScreen}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="Home"
//           component={HomeScreen}
//           options={{ headerShown: false }}
//         />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// export default App;
