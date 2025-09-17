import { StyleSheet } from 'react-native';

const getProfileStylesAndTheme = (isDarkMode: boolean) => {
    const theme = {
        background: isDarkMode ? '#121212' : '#fff',
        text: isDarkMode ? '#fff' : '#000',
        card: isDarkMode ? '#1e1e1e' : '#f9f9f9',
        border: isDarkMode ? '#272727' : '#fff',
        subtleText: isDarkMode ? '#aaa' : '#333',
        bannerBackground: isDarkMode ? '#333' : '#f0f0f0',
        modalBackground: isDarkMode ? '#222' : 'white',
        modalText: isDarkMode ? '#fff' : '#333',
        iconColor: isDarkMode ? '#fff' : 'black',
        placeholder: isDarkMode ? '#444' : '#ccc',
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
        },
        loadingContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.background,
        },
        profileHeader: {
            marginBottom: 60,
        },
        banner: {
            height: 150,
            backgroundColor: theme.bannerBackground,
            position: 'relative',
        },
        menuIcon: {
            position: 'absolute',
            top: 10,
            right: 10,
            zIndex: 1,
            padding: 5,
        },
        profilePictureContainer: {
            position: 'absolute',
            top: 100,
            left: 20,
            width: 100,
            height: 100,
            borderRadius: 50,
            borderWidth: 2,
            borderColor: theme.border,
            backgroundColor: theme.background,
            elevation: 4,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 2,
        },
        profilePicture: {
            width: '100%',
            height: '100%',
            borderRadius: 50,
        },
        profilePicturePlaceholder: {
            width: '100%',
            height: '100%',
            borderRadius: 50,
            backgroundColor: theme.placeholder,
        },
        profileInfo: {
            paddingHorizontal: 20,
            alignItems: 'center',
            marginTop: 20,
        },
        profileName: {
            fontSize: 22,
            fontWeight: 'bold',
            marginBottom: 10,
            color: theme.text,
        },
        bio: {
            fontSize: 14,
            color: theme.subtleText,
            fontStyle: 'italic',
            textAlign: 'center'
        },
        diarySection: {
            paddingHorizontal: 20,
            marginTop: 20,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 10,
            color: theme.text,
        },
        diaryEntry: {
            padding: 15,
            backgroundColor: theme.card,
            borderRadius: 8,
            marginBottom: 10,
        },
        diaryText: {
            color: theme.text,
        },
        // Dropdown Menu Styles
        modalOverlay: {
            flex: 1,
        },
        modalContent: {
            position: 'absolute',
            top: 45,
            right: 15,
            backgroundColor: theme.modalBackground,
            borderRadius: 8,
            padding: 5,
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
        },
        modalItem: {
            paddingVertical: 10,
            paddingHorizontal: 15,
        },
        modalItemText: {
            fontSize: 16,
            color: theme.modalText,
        },
    });

    return { styles, theme };
};

export default getProfileStylesAndTheme;
