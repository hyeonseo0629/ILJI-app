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
} from "@/components/iLog/ILogStyle";
import {ILogContents} from "./ILogContents";

const ILogView = () => {
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
                    <IEditButton>Edit Profile</IEditButton>
                </IBottom>
            </IWrap>
            <ILogContents/>
        </ILogContainer>
    )
}

export default ILogView
