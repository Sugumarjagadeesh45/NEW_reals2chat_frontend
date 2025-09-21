import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  FlatList,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../../styles/theme';

const templates = [
  { id: '1', name: 'NEW', image: 'https://picsum.photos/200/200' },
  { id: '2', name: 'TRENDING', image: 'https://picsum.photos/200/200?1' },
  { id: '3', name: 'POPULAR', image: 'https://picsum.photos/200/200?2' },
  { id: '4', name: 'Sports Car', image: 'https://picsum.photos/200/200?3' },
  { id: '5', name: 'Nature', image: 'https://picsum.photos/200/200?4' },
  { id: '6', name: 'NEW', image: 'https://picsum.photos/200/200?5' },
  { id: '7', name: 'Fashion', image: 'https://picsum.photos/200/200?6' },
  { id: '8', name: 'Food', image: 'https://picsum.photos/200/200?7' },
  { id: '9', name: 'Home', image: 'https://picsum.photos/200/200?8' },
];

const TemplatesScreen = ({ navigation }) => {
  const renderTemplate = ({ item }) => (
    <TouchableOpacity style={styles.templateItem}>
      <Image source={{ uri: item.image }} style={styles.templateImage} />
      <View style={styles.templateBadge}>
        <Text style={styles.templateBadgeText}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.headerBg} />
      <LinearGradient colors={['#0f2027', '#203a43', '#2c5364']} style={styles.container}>
        <View style={styles.containerInner}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
              <Icon name="arrow-back" size={24} color={theme.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Templates</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.content}>
            <Text style={styles.sectionDescription}>
              Select a pre-designed template to get started quickly.
            </Text>
            <FlatList
              data={templates}
              renderItem={renderTemplate}
              keyExtractor={(item) => item.id}
              numColumns={3}
              contentContainerStyle={styles.templateGrid}
            />
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerInner: {
    flex: 1,
    maxWidth: 480,
    width: '100%',
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
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.textPrimary,
  },
  headerIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  sectionDescription: {
    fontSize: 16,
    color: theme.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  templateGrid: {
    paddingTop: 10,
  },
  templateItem: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 10,
    overflow: 'hidden',
    margin: 5,
  },
  templateImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  templateBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: theme.accentColor,
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: 3,
  },
  templateBadgeText: {
    fontSize: 10,
    color: theme.textPrimary,
  },
});

export default TemplatesScreen;




// import React, { useState } from 'react';
// import { 
//   View, 
//   Text, 
//   StyleSheet, 
//   StatusBar, 
//   TouchableOpacity, 
//   FlatList,
//   Image,
//   Modal
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import LinearGradient from 'react-native-linear-gradient';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { theme } from '../../styles/theme';

// const TemplatesScreen = ({ navigation }) => {
//   const [selectedTemplate, setSelectedTemplate] = useState(null);
//   const [previewVisible, setPreviewVisible] = useState(false);

//   const templateCategories = [
//     { id: 'all', name: 'All', icon: 'grid-view' },
//     { id: 'new', name: 'New', icon: 'new-releases' },
//     { id: 'trending', name: 'Trending', icon: 'trending-up' },
//     { id: 'popular', name: 'Popular', icon: 'star' },
//     { id: 'sports', name: 'Sports', icon: 'sports' },
//     { id: 'nature', name: 'Nature', icon: 'eco' },
//   ];

//   const templates = [
//     { 
//       id: '1', 
//       name: 'Summer Vibes', 
//       category: 'trending',
//       image: 'https://picsum.photos/400/600?template1',
//       duration: '0:30',
//       uses: '12.4K'
//     },
//     { 
//       id: '2', 
//       name: 'Travel Diary', 
//       category: 'popular',
//       image: 'https://picsum.photos/400/600?template2',
//       duration: '0:45',
//       uses: '8.7K'
//     },
//     { 
//       id: '3', 
//       name: 'Fitness Challenge', 
//       category: 'sports',
//       image: 'https://picsum.photos/400/600?template3',
//       duration: '0:15',
//       uses: '5.2K'
//     },
//     { 
//       id: '4', 
//       name: 'Nature Documentary', 
//       category: 'nature',
//       image: 'https://picsum.photos/400/600?template4',
//       duration: '1:00',
//       uses: '3.9K'
//     },
//     { 
//       id: '5', 
//       name: 'Food Adventure', 
//       category: 'new',
//       image: 'https://picsum.photos/400/600?template5',
//       duration: '0:30',
//       uses: '2.1K'
//     },
//     { 
//       id: '6', 
//       name: 'Fashion Show', 
//       category: 'trending',
//       image: 'https://picsum.photos/400/600?template6',
//       duration: '0:45',
//       uses: '7.5K'
//     },
//   ];

//   const [activeCategory, setActiveCategory] = useState('all');
//   const [filteredTemplates, setFilteredTemplates] = useState(templates);

//   const filterTemplates = (categoryId) => {
//     setActiveCategory(categoryId);
//     if (categoryId === 'all') {
//       setFilteredTemplates(templates);
//     } else {
//       setFilteredTemplates(templates.filter(template => template.category === categoryId));
//     }
//   };

//   const openPreview = (template) => {
//     setSelectedTemplate(template);
//     setPreviewVisible(true);
//   };

//   const closePreview = () => {
//     setPreviewVisible(false);
//     setSelectedTemplate(null);
//   };

//   const renderCategory = ({ item }) => (
//     <TouchableOpacity 
//       style={[styles.categoryItem, activeCategory === item.id && styles.activeCategory]}
//       onPress={() => filterTemplates(item.id)}
//     >
//       <Icon name={item.icon} size={18} color={activeCategory === item.id ? theme.textPrimary : theme.textSecondary} />
//       <Text style={[styles.categoryName, activeCategory === item.id && styles.activeCategoryName]}>
//         {item.name}
//       </Text>
//     </TouchableOpacity>
//   );

//   const renderTemplate = ({ item }) => (
//     <TouchableOpacity style={styles.templateItem} onPress={() => openPreview(item)}>
//       <Image source={{ uri: item.image }} style={styles.templateImage} />
//       <View style={styles.templateInfo}>
//         <Text style={styles.templateName}>{item.name}</Text>
//         <View style={styles.templateStats}>
//           <Icon name="schedule" size={12} color={theme.textSecondary} />
//           <Text style={styles.templateStatText}>{item.duration}</Text>
//           <Icon name="visibility" size={12} color={theme.textSecondary} style={styles.statIcon} />
//           <Text style={styles.templateStatText}>{item.uses}</Text>
//         </View>
//       </View>
//       <View style={styles.templateBadge}>
//         <Text style={styles.templateBadgeText}>USE</Text>
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
//       <StatusBar barStyle="light-content" backgroundColor={theme.headerBg} />
//       <LinearGradient colors={['#0f2027', '#203a43', '#2c5364']} style={styles.container}>
//         <View style={styles.containerInner}>
//           {/* Header */}
//           <View style={styles.header}>
//             <View style={styles.logoContainer}>
//               <Icon name="add-circle" size={22} color={theme.accentColor} />
//               <Text style={styles.logo}>REELS2CHAT</Text>
//             </View>
//             <View style={styles.headerIcons}>
//               <TouchableOpacity 
//                 style={styles.headerIcon}
//                 onPress={() => navigation.goBack()}
//               >
//                 <Icon name="arrow-back" size={18} color={theme.textPrimary} />
//               </TouchableOpacity>
//             </View>
//           </View>

//           {/* Content */}
//           <View style={styles.content}>
//             <View style={styles.sectionTitle}>
//               <Icon name="dashboard" size={18} color={theme.accentColor} style={styles.sectionTitleIcon} />
//               <Text style={styles.sectionTitleText}>Video Templates</Text>
//             </View>
//             <Text style={styles.sectionDescription}>Choose a template to create your reel quickly</Text>
            
//             <FlatList
//               data={templateCategories}
//               renderItem={renderCategory}
//               keyExtractor={(item) => item.id}
//               horizontal
//               showsHorizontalScrollIndicator={false}
//               style={styles.categoriesList}
//               contentContainerStyle={styles.categoriesContent}
//             />

//             <FlatList
//               data={filteredTemplates}
//               renderItem={renderTemplate}
//               keyExtractor={(item) => item.id}
//               numColumns={2}
//               style={styles.templatesGrid}
//               columnWrapperStyle={styles.templatesRow}
//               showsVerticalScrollIndicator={false}
//             />
//           </View>
//         </View>
//       </LinearGradient>

//       {/* Template Preview Modal */}
//       <Modal
//         visible={previewVisible}
//         animationType="slide"
//         transparent={false}
//         onRequestClose={closePreview}
//       >
//         <SafeAreaView style={styles.modalContainer}>
//           <StatusBar barStyle="light-content" backgroundColor={theme.headerBg} />
//           <LinearGradient colors={['#0f2027', '#203a43', '#2c5364']} style={styles.modalContainer}>
//             <View style={styles.modalHeader}>
//               <TouchableOpacity style={styles.modalBackButton} onPress={closePreview}>
//                 <Icon name="arrow-back" size={24} color={theme.textPrimary} />
//               </TouchableOpacity>
//               <Text style={styles.modalTitle}>Template Preview</Text>
//               <View style={styles.modalHeaderSpacer} />
//             </View>

//             {selectedTemplate && (
//               <View style={styles.modalContent}>
//                 <Image 
//                   source={{ uri: selectedTemplate.image }} 
//                   style={styles.modalPreview} 
//                 />
//                 <View style={styles.modalInfo}>
//                   <Text style={styles.modalTemplateName}>{selectedTemplate.name}</Text>
//                   <View style={styles.modalStats}>
//                     <View style={styles.modalStat}>
//                       <Icon name="schedule" size={16} color={theme.textSecondary} />
//                       <Text style={styles.modalStatText}>{selectedTemplate.duration}</Text>
//                     </View>
//                     <View style={styles.modalStat}>
//                       <Icon name="visibility" size={16} color={theme.textSecondary} />
//                       <Text style={styles.modalStatText}>{selectedTemplate.uses} uses</Text>
//                     </View>
//                   </View>
//                   <Text style={styles.modalDescription}>
//                     This template features dynamic transitions and trendy effects perfect for your content. 
//                     Just add your media and customize the text to make it your own.
//                   </Text>
//                 </View>
//                 <TouchableOpacity style={styles.modalUseButton}>
//                   <Text style={styles.modalUseButtonText}>Use This Template</Text>
//                 </TouchableOpacity>
//               </View>
//             )}
//           </LinearGradient>
//         </SafeAreaView>
//       </Modal>
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
//   content: {
//     flex: 1,
//     padding: 15,
//   },
//   sectionTitle: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 15,
//     marginTop: 10,
//   },
//   sectionTitleIcon: {
//     marginRight: 8,
//   },
//   sectionTitleText: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: theme.textPrimary,
//   },
//   sectionDescription: {
//     fontSize: 14,
//     color: theme.textSecondary,
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   categoriesList: {
//     marginBottom: 20,
//   },
//   categoriesContent: {
//     paddingRight: 10,
//   },
//   categoryItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 15,
//     paddingVertical: 8,
//     marginRight: 10,
//     borderRadius: 20,
//     backgroundColor: 'rgba(30, 40, 50, 0.7)',
//   },
//   activeCategory: {
//     backgroundColor: theme.accentColor,
//   },
//   categoryName: {
//     fontSize: 14,
//     color: theme.textSecondary,
//     marginLeft: 5,
//   },
//   activeCategoryName: {
//     color: theme.textPrimary,
//   },
//   templatesGrid: {
//     flex: 1,
//   },
//   templatesRow: {
//     justifyContent: 'space-between',
//   },
//   templateItem: {
//     width: '48%',
//     backgroundColor: 'rgba(30, 40, 50, 0.7)',
//     borderRadius: 15,
//     overflow: 'hidden',
//     marginBottom: 15,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.15,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   templateImage: {
//     width: '100%',
//     height: 180,
//     resizeMode: 'cover',
//   },
//   templateInfo: {
//     padding: 10,
//   },
//   templateName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: theme.textPrimary,
//     marginBottom: 5,
//   },
//   templateStats: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   templateStatText: {
//     fontSize: 12,
//     color: theme.textSecondary,
//     marginLeft: 3,
//   },
//   statIcon: {
//     marginLeft: 8,
//   },
//   templateBadge: {
//     position: 'absolute',
//     top: 10,
//     right: 10,
//     backgroundColor: theme.accentColor,
//     paddingVertical: 4,
//     paddingHorizontal: 8,
//     borderRadius: 10,
//   },
//   templateBadgeText: {
//     fontSize: 10,
//     fontWeight: '600',
//     color: theme.textPrimary,
//   },
//   modalContainer: {
//     flex: 1,
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 16,
//     paddingHorizontal: 20,
//     backgroundColor: 'rgba(18, 24, 38, 0.95)',
//     borderBottomWidth: 1,
//     borderBottomColor: 'rgba(255, 255, 255, 0.08)',
//   },
//   modalBackButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: 'rgba(255, 255, 255, 0.08)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: theme.textPrimary,
//   },
//   modalHeaderSpacer: {
//     width: 40,
//   },
//   modalContent: {
//     flex: 1,
//     padding: 15,
//   },
//   modalPreview: {
//     width: '100%',
//     height: 300,
//     borderRadius: 15,
//     resizeMode: 'cover',
//     marginBottom: 20,
//   },
//   modalInfo: {
//     marginBottom: 20,
//   },
//   modalTemplateName: {
//     fontSize: 22,
//     fontWeight: '600',
//     color: theme.textPrimary,
//     marginBottom: 10,
//   },
//   modalStats: {
//     flexDirection: 'row',
//     marginBottom: 15,
//   },
//   modalStat: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 15,
//   },
//   modalStatText: {
//     fontSize: 14,
//     color: theme.textSecondary,
//     marginLeft: 5,
//   },
//   modalDescription: {
//     fontSize: 16,
//     color: theme.textSecondary,
//     lineHeight: 24,
//   },
//   modalUseButton: {
//     backgroundColor: theme.accentColor,
//     paddingVertical: 15,
//     borderRadius: 15,
//     alignItems: 'center',
//   },
//   modalUseButtonText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: theme.textPrimary,
//   },
// });

// export default TemplatesScreen;