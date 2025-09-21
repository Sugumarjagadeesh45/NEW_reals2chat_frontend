// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, Platform, PermissionsAndroid } from 'react-native';
// import { Camera, useCameraDevices } from 'react-native-vision-camera';

// export default function CameraView() {
//   const [hasPermission, setHasPermission] = useState(false);
//   const devices = useCameraDevices();
//   const device = devices[0]; // manually select first device

//   useEffect(() => {
//     const requestPermission = async () => {
//       const cameraPermission = await Camera.requestCameraPermission();
//       console.log('🔐 Camera Permission:', cameraPermission);

//       if (Platform.OS === 'android') {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.CAMERA
//         );
//         console.log('Android Camera Permission:', granted);
//         setHasPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
//       } else {
//         setHasPermission(cameraPermission === 'authorized');
//       }
//     };

//     requestPermission();
//   }, []);

//   useEffect(() => {
//     console.log('📷 Devices:', devices);
//     console.log('📷 Manually selected device:', device);
//   }, [devices]);

//   if (!hasPermission) {
//     return <Text>Camera permission not granted</Text>;
//   }

//   if (!device) {
//     return <Text>No camera device found</Text>;
//   }

//   return (
//     <View style={styles.container}>
//       <Camera
//         style={StyleSheet.absoluteFill}
//         device={device}
//         isActive={true}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
// });











import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  ActivityIndicator,
} from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function CameraView() {
  const [hasPermission, setHasPermission] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(false);
  const cameraRef = useRef(null);

  const devices = useCameraDevices();  // returns array of camera devices
  const device = devices?.find(d => d.position === (isFrontCamera ? 'front' : 'back')) 
                 ?? devices?.[0] 
                 ?? null;

  useEffect(() => {
    const requestPermissions = async () => {
      // Request Vision Camera permission
      const cameraStatus = await Camera.requestCameraPermission();
      console.log('🔐 Vision-Camera Permission:', cameraStatus);

      let grantedAndroid = false;

      if (Platform.OS === 'android') {
        grantedAndroid = (await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA
        )) === PermissionsAndroid.RESULTS.GRANTED;
      }

      // Combine permission states
      if (Platform.OS === 'android') {
        setHasPermission(grantedAndroid);
      } else {
        setHasPermission(cameraStatus === 'authorized');
      }
    };

    requestPermissions();
  }, []);

  useEffect(() => {
    console.log('📷 Devices:', devices);
    console.log('✅ Selected Device:', device);
  }, [devices, device]);

  const handleFlipCamera = () => {
    setIsFrontCamera(prev => !prev);
  };

  const handleCapture = () => {
    console.log('📸 Capture pressed');
    // Here you can add logic like cameraRef.current.takePhoto({...}) or video recording
  };

  const handleOpenGallery = async () => {
    console.log('🖼️ Open gallery pressed');
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
    });

    if (result.didCancel) {
      console.log('❌ User cancelled image picker');
    } else if (result.errorCode) {
      console.log('❌ ImagePicker Error:', result.errorMessage);
    } else {
      console.log('✅ File selected:', result.assets?.[0]);
      // Example: do something with result.assets[0].uri
    }
  };

  if (!hasPermission) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.text}>Camera permission not granted</Text>
      </View>
    );
  }

  if (!devices) {
    // devices is still loading
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#FFF" />
        <Text style={styles.text}>Loading camera devices...</Text>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.text}>No camera device found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
      />

      <View style={styles.controlsContainer}>
        {/* Gallery / File Upload Button */}
        <TouchableOpacity style={styles.sideButton} onPress={handleOpenGallery}>
          <Icon name="photo-library" size={28} color="white" />
        </TouchableOpacity>

        {/* Capture Button */}
        <TouchableOpacity style={styles.captureButton} onPress={handleCapture}>
          <View style={styles.captureInner} />
        </TouchableOpacity>

        {/* Flip Camera Button */}
        <TouchableOpacity style={styles.sideButton} onPress={handleFlipCamera}>
          <Icon name="flip-camera-ios" size={28} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centeredContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#FFF',
    fontSize: 16,
    marginTop: 12,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  sideButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF3B30',
  },
});
