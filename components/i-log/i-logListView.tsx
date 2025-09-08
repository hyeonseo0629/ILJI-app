import * as I from "@/components/style/I-logStyled";
import { ScrollView } from "react-native";
import { Diary } from "@/app/(tabs)/i-log"; // 부모에게서 Diary 타입을 import 합니다.

// ILogListView는 diaries 배열을 props로 받습니다.
const ILogListView = ({ diaries }: { diaries: Diary[] }) => {
    const maxLength = 100; // 내용 글자 수 제한

    return (
        <I.Container>
            <ScrollView>
                {diaries.map((diary) => {
                    // 각 다이어리 내용의 길이를 조절합니다.
                    const truncatedContent = diary.content.length > maxLength
                        ? diary.content.substring(0, maxLength) + "..."
                        : diary.content;

                    return (
                        <I.ListWrap key={diary.id}>
                            <I.ListDateWrap>
                                <I.ListDateText>{`${diary.year}.${diary.date}`}</I.ListDateText>
                                <I.ListTimeText>{diary.time}</I.ListTimeText>
                            </I.ListDateWrap>
                            <I.ListContentWrap>
                                <I.ListTitle>{diary.title}</I.ListTitle>
                                <I.ListContent>{truncatedContent}</I.ListContent>
                            </I.ListContentWrap>
                        </I.ListWrap>
                    );
                })}
            </ScrollView>
        </I.Container>
    );
};

export default ILogListView;
