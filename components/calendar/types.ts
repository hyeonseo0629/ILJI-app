// 이 파일은 캘린더 관련 컴포넌트에서 공통적으로 사용될 타입들을 정의합니다.

// `CalendarEvent` 인터페이스는 캘린더에 표시될 단일 이벤트의 구조를 정의합니다.
export interface CalendarEvent {
    // `id`는 이벤트를 고유하게 식별하는 문자열입니다.
    id: string;
    // `start`는 이벤트가 시작되는 시간을 나타내는 Date 객체입니다.
    start: Date;
    // `end`는 이벤트가 끝나는 시간을 나타내는 Date 객체입니다.
    end: Date;
    // `title`은 이벤트의 제목이나 설명을 담는 문자열입니다.
    title: string;
    // `color`는 캘린더에 이벤트를 표시할 때 사용할 색상을 나타내는 문자열입니다.
    // (예: '#FF0000', 'blue')
    color: string;
}