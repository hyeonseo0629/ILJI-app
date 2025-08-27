import React, {useState} from 'react';
import {
    ILogContentWrap,
    TopTabWrap,
    TabButton,
    ListContainer,
    ListItem,
    ListImage,
    ListTitle,
} from '@/components/iLog/ILogStyle';
import {Text} from 'react-native';

// Mock data for demonstration
const diaryData = [
    {id: 1, title: 'Diary 1', image: '../../'},
    {id: 2, title: 'Diary 2', image: 'https://via.placeholder.com/150'},
    {id: 3, title: 'Diary 3', image: 'https://via.placeholder.com/150'},
    {id: 4, title: 'Diary 4', image: 'https://via.placeholder.com/150'},
    {id: 5, title: 'Diary 5', image: 'https://via.placeholder.com/150'},
    {id: 6, title: 'Diary 6', image: 'https://via.placeholder.com/150'},
];

export const ILogContents = () => {
    const [activeTab, setActiveTab] = useState('grid');

    return (
        <ILogContentWrap>
            <TopTabWrap>
                <TabButton active={activeTab === 'list'} onPress={() => setActiveTab('list')}>
                    <Text>List</Text>
                </TabButton>
            </TopTabWrap>
            {activeTab === 'list' ? (
                <ListContainer>
                    {diaryData.map((item) => (
                        <ListItem key={item.id}>
                            <ListImage source={{uri: item.image}}/>
                            <ListTitle>{item.title}</ListTitle>
                        </ListItem>
                    ))}
                </ListContainer>
            ) : (
                <ListContainer>
                    {diaryData.map((item) => (
                        <ListItem key={item.id}>
                            <ListImage source={{uri: item.image}}/>
                            <ListTitle>{item.title}</ListTitle>
                        </ListItem>
                    ))}
                </ListContainer>
            )}
        </ILogContentWrap>
    );
};
