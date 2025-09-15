/**
 * 태그의 데이터 구조를 정의합니다.
 */
export interface Tag {
    id: number;
    color: string;
    createdAt: Date;
    label: string;
    updatedAt: Date;
    userId: number;
}