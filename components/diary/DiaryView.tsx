import {Text, TouchableOpacity} from "react-native";
import {
    DiaryContainer,
    PCount,
    PWrap,
    PCountWrap,
    PEditButton,
    PImage,
    PTextWrap,
    PTop,
    PUserID,
} from "@/components/diary/DiaryStyle";

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
            </PWrap>
        </DiaryContainer>
    )
}

export default DiaryView

