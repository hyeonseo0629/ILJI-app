import {Text, TouchableOpacity} from "react-native";
import {
    DiaryContainer,
    PBottom,
    PCount,
    PWrap,
    PCountWrap,
    PEditButton,
    PImage,
    PTextWrap,
    PTop,
    PUserID,
    PUserName, TopTabWrap, TopTab,
} from "@/components/Diary/DiaryStyle";

const DiaryView = () => {
    return (
        <DiaryContainer>
            <PWrap>
                <PTop>
                    <PImage/>
                    <PTextWrap>
                        <PUserID>@UserID</PUserID>
                        <PCountWrap>
                            <PCount>
                                <Text>Post</Text>
                                <Text>0</Text>
                            </PCount>
                            <PCount>
                                <Text>Post</Text>
                                <Text>0</Text>
                            </PCount>
                            <PCount>
                                <Text>Post</Text>
                                <Text>0</Text>
                            </PCount>
                        </PCountWrap>
                    </PTextWrap>
                </PTop>
                <PBottom>
                    <PUserName>User NickName</PUserName>
                    <PEditButton>Edit Profile</PEditButton>
                </PBottom>
            </PWrap>
            <TopTabWrap>
                <TouchableOpacity>
                    <TopTab>
                        Grid
                    </TopTab>
                </TouchableOpacity>
                <TouchableOpacity>
                    <TopTab>
                        List
                    </TopTab>
                </TouchableOpacity>
                <TouchableOpacity>
                    <TopTab>
                        BookMark
                    </TopTab>
                </TouchableOpacity>
            </TopTabWrap>
        </DiaryContainer>
    )
}

export default DiaryView

