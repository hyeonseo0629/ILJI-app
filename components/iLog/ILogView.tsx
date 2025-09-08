import {Text} from "react-native";
import {
    ILogContainer,
    IBottom,
    ICount,
    IWrap,
    ICountWrap,
    IEditButton,
    IImage,
    ITextWrap,
    ITop,
    IUserID,
    IUserName,
    IEditButtonText
} from "@/components/iLog/ILogStyled";
import {ILogContents} from "./ILogContents";
import {useRouter} from "expo-router";

const ILogView = () => {
    const router = useRouter();

    return (
        <ILogContainer>
            <IWrap>
                <ITop>
                    <IImage/>
                    <ITextWrap>
                        <IUserID>@UserID</IUserID>
                        <ICountWrap>
                            <ICount>
                                <Text>Post</Text>
                                <Text>0</Text>
                            </ICount>
                            <ICount>
                                <Text>Post</Text>
                                <Text>0</Text>
                            </ICount>
                            <ICount>
                                <Text>Post</Text>
                                <Text>0</Text>
                            </ICount>
                        </ICountWrap>
                    </ITextWrap>
                </ITop>
                <IBottom>
                    <IUserName>User NickName</IUserName>
                    <IEditButton onPress={() => router.push('/profile-edit')}>
                        <IEditButtonText>Edit Profile</IEditButtonText>
                    </IEditButton>
                </IBottom>
            </IWrap>
            <ILogContents/>
        </ILogContainer>
    )
}

export default ILogView
