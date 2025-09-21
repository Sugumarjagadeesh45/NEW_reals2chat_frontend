import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  Alert,
  Linking,
  AppState,
} from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { launchImageLibrary } from 'react-native-image-picker';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import RNFS from 'react-native-fs';

export default function CameraView({ navigation }) {
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [hasStoragePermission, setHasStoragePermission] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);
  const cameraRef = useRef(null);

  const devices = useCameraDevices();
  const device = devices?.find((d) => d.position === (isFrontCamera ? 'front' : 'back')) ?? devices?.[0] ?? null;

  // Function to check storage permission status
  const checkStoragePermission = async () => {
    try {
      let storageGranted = false;
      
      if (Platform.OS === 'android') {
        if (Platform.Version >= 33) {
          // For Android 13+ - Check READ_MEDIA_IMAGES permission
          const hasImagesPerm = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
          );
          storageGranted = hasImagesPerm;
          console.log('READ_MEDIA_IMAGES permission:', hasImagesPerm);
        } else {
          // For Android <13 - Check WRITE_EXTERNAL_STORAGE permission
          const hasStoragePerm = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
          );
          storageGranted = hasStoragePerm;
          console.log('WRITE_EXTERNAL_STORAGE permission:', hasStoragePerm);
        }
      } else {
        // For iOS, we assume granted as CameraRoll handles permissions
        storageGranted = true;
      }
      
      console.log('Storage permission checked:', storageGranted);
      setHasStoragePermission(storageGranted);
      return storageGranted;
    } catch (error) {
      console.error('Error checking storage permission:', error);
      return false;
    }
  };

  // Function to request storage permission
  const requestStoragePermission = async () => {
    try {
      let storageGranted = false;
      
      if (Platform.OS === 'android') {
        if (Platform.Version >= 33) {
          // For Android 13+ - Request READ_MEDIA_IMAGES permission
          const result = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
            {
              title: 'Storage Permission',
              message: 'This app needs access to your storage to save photos.',
              buttonPositive: 'OK',
            }
          );
          storageGranted = result === PermissionsAndroid.RESULTS.GRANTED;
          console.log('READ_MEDIA_IMAGES permission result:', result);
        } else {
          // For Android <13 - Request WRITE_EXTERNAL_STORAGE permission
          const result = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: 'Storage Permission',
              message: 'This app needs access to your storage to save photos.',
              buttonPositive: 'OK',
            }
          );
          storageGranted = result === PermissionsAndroid.RESULTS.GRANTED;
          console.log('WRITE_EXTERNAL_STORAGE permission result:', result);
        }
      } else {
        // For iOS
        storageGranted = true;
      }
      
      console.log('Storage permission requested:', storageGranted);
      setHasStoragePermission(storageGranted);
      return storageGranted;
    } catch (error) {
      console.error('Error requesting storage permission:', error);
      return false;
    }
  };

  useEffect(() => {
    const requestPermissions = async () => {
      try {
        // Camera permission
        const cameraStatus = await Camera.requestCameraPermission();
        let cameraGranted = cameraStatus === 'granted';
        
        if (Platform.OS === 'android') {
          const cam = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: 'Camera Permission',
              message: 'This app needs camera access to take photos and videos.',
              buttonPositive: 'OK',
            }
          );
          cameraGranted = cam === PermissionsAndroid.RESULTS.GRANTED;
        }
        
        setHasCameraPermission(cameraGranted);
        console.log('Camera permission granted:', cameraGranted);

        // Request storage permission
        await requestStoragePermission();
      } catch (error) {
        console.error('Error requesting permissions:', error);
      }
    };

    requestPermissions();

    // Add event listener for when app comes to foreground
    const subscription = AppState.addEventListener('change', async (nextAppState) => {
      if (nextAppState === 'active') {
        // Re-check permissions when app returns to foreground
        await checkStoragePermission();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleFlipCamera = () => setIsFrontCamera((prev) => !prev);

  // Alternative method to save image using react-native-share
  const saveImageToGallery = async (imagePath) => {
    try {
      // First try CameraRoll if available
      if (CameraRoll && CameraRoll.save) {
        const result = await CameraRoll.save(imagePath, { type: 'photo', album: 'Reals2Chat' });
        console.log('Photo saved with CameraRoll:', result);
        return true;
      }
      
      // Fallback: Use react-native-share to save to gallery
      const Share = await import('react-native-share');
      const shareOptions = {
        url: `file://${imagePath}`,
        type: 'image/jpeg',
        saveToFiles: true,
      };
      
      const result = await Share.default.open(shareOptions);
      console.log('Photo saved with react-native-share:', result);
      return true;
    } catch (error) {
      console.error('Error saving image:', error);
      return false;
    }
  };

  const handleCapture = async () => {
    if (!cameraRef.current || isTakingPhoto) {
      return;
    }

    setIsTakingPhoto(true);

    // Double-check permission before capturing
    const hasPermission = await checkStoragePermission();
    
    if (!hasPermission) {
      // If no permission, try to request it
      const requested = await requestStoragePermission();
      if (!requested) {
        setShowPermissionModal(true);
      }
      setIsTakingPhoto(false);
      return;
    }

    try {
      const photo = await cameraRef.current.takePhoto({
        flash: 'off',
        qualityPrioritization: 'balanced',
      });

      console.log('Photo captured:', photo);

      // Try to save the photo to gallery
      const saved = await saveImageToGallery(photo.path);
      
      if (saved) {
        Alert.alert('Success', 'Photo saved to gallery!');
      } else {
        Alert.alert(
          'Info', 
          `Photo captured but not saved to gallery. Path: ${photo.path}\n\nPlease check storage permissions.`
        );
      }
    } catch (error) {
      console.error('Capture error:', error);
      Alert.alert('Error', `Failed to capture photo: ${error.message}`);
    } finally {
      setIsTakingPhoto(false);
    }
  };

  const handleOpenGallery = async () => {
    // Check storage permission before opening gallery
    const hasPermission = await checkStoragePermission();
    
    if (!hasPermission) {
      // If no permission, try to request it
      const requested = await requestStoragePermission();
      if (!requested) {
        setShowPermissionModal(true);
        return;
      }
    }

    try {
      const result = await launchImageLibrary({ 
        mediaType: 'photo', 
        selectionLimit: 1 
      });
      
      if (result.didCancel) {
        return;
      }
      
      if (result.errorCode) {
        Alert.alert('Error', `Image picker error: ${result.errorMessage}`);
        return;
      }

      console.log('File selected:', result.assets?.[0]);
      // Handle the selected image here
    } catch (error) {
      console.error('Open gallery error:', error);
      Alert.alert('Error', `Failed to open gallery: ${error.message}`);
    }
  };

  const openAppSettings = () => {
    Linking.openSettings();
    setShowPermissionModal(false);
  };

  const handleRetryPermission = async () => {
    const granted = await requestStoragePermission();
    if (!granted) {
      setShowPermissionModal(true);
    } else {
      setShowPermissionModal(false);
    }
  };

  if (!hasCameraPermission) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <View style={styles.centeredContainer}>
          <Icon name="camera-off" size={50} color="white" />
          <Text style={styles.text}>Camera permission required</Text>
          <TouchableOpacity style={styles.button} onPress={() => Linking.openSettings()}>
            <Text style={styles.buttonText}>Open Settings</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!device) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <View style={styles.centeredContainer}>
          <Icon name="error-outline" size={50} color="white" />
          <Text style={styles.text}>No camera device found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true}
      />
      
      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.sideButton} onPress={handleOpenGallery}>
          <Icon name="photo-library" size={28} color="white" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.captureButton, isTakingPhoto && styles.captureButtonDisabled]}
          onPress={handleCapture}
          disabled={isTakingPhoto}
        >
          <View style={styles.captureInner} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.sideButton} onPress={handleFlipCamera}>
          <Icon name="flip-camera-ios" size={28} color="white" />
        </TouchableOpacity>
      </View>

      {/* Permission Denied Modal */}
      {showPermissionModal && (
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Icon name="error-outline" size={50} color="#FF3B30" style={styles.modalIcon} />
            <Text style={styles.modalTitle}>Permission Denied</Text>
            <Text style={styles.modalText}>
              Cannot save photo without storage permission. Please enable it in settings.
            </Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.settingsButton]}
                onPress={openAppSettings}
              >
                <Text style={styles.settingsButtonText}>OPEN SETTINGS</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowPermissionModal(false)}
              >
                <Text style={styles.cancelButtonText}>CANCEL</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.modalButton, styles.retryButton]}
                onPress={handleRetryPermission}
              >
                <Text style={styles.retryButtonText}>RETRY</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  text: {
    color: '#FFF',
    fontSize: 16,
    marginTop: 12,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
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
  captureButtonDisabled: {
    opacity: 0.5,
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF3B30',
  },
  // Modal styles
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalIcon: {
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#555',
    lineHeight: 22,
  },
  modalButtons: {
    width: '100%',
  },
  modalButton: {
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 5,
  },
  settingsButton: {
    backgroundColor: '#FF3B30',
  },
  cancelButton: {
    backgroundColor: '#E0E0E0',
  },
  retryButton: {
    backgroundColor: '#4CAF50',
  },
  settingsButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});