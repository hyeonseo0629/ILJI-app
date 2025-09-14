import { ILog } from './ilog';
// DTO (Data Transfer Object)는 보통 백엔드와 프론트엔드 간의 데이터 전송에 사용되는 객체를 의미합니다.
// ILogResponse DTO를 기반으로 프론트엔드에서 사용할 타입을 정의합니다.

// 백엔드로부터 직접 받는 원시 i-log 데이터 타입
// 날짜 관련 필드가 모두 문자열(string) 형태입니다.
export interface RawILog {
  id: number;
  userId: number;
  iLogDate: string; // ex: "2024-09-15"
  content: string;
  imgUrl: string | null;
  visibility: 'PUBLIC' | 'FRIENDS_ONLY' | 'PRIVATE';
  friendTags: string | null;
  tags: string | null;
  likeCount: number;
  commentCount: number;
  createdAt: string; // ex: "2024-09-15T10:00:00"
}

// 프론트엔드 애플리케이션 내부에서 사용할 i-log 데이터 타입
// 날짜 관련 필드를 JS의 Date 객체로 변환하여 사용의 편의성을 높입니다.
export interface ILog {
  id: number;
  userId: number;
  iLogDate: Date;
  content: string;
  imgUrl: string | null;
  visibility: 'PUBLIC' | 'FRIENDS_ONLY' | 'PRIVATE';
  friendTags: string | null;
  tags: string | null;
  likeCount: number;
  commentCount: number;
  createdAt: Date;
}
