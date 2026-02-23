import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface LessonSegment {
    content: string;
    exercise?: InteractiveExercise;
}
export interface Lesson {
    id: bigint;
    title: string;
    difficulty: string;
    segments: Array<LessonSegment>;
    category: string;
    estimatedTime: bigint;
}
export interface UserProgressView {
    xp: bigint;
    streak: bigint;
    lastActiveDay: Time;
    badges: Array<string>;
    completedLessons: Array<bigint>;
    currentSegment: Array<[bigint, bigint]>;
}
export interface Certificate {
    id: bigint;
    completionDate: Time;
    user: Principal;
    skill: string;
    verificationId: string;
}
export interface UserProfile {
    name: string;
    email: string;
}
export interface InteractiveExercise {
    question: string;
    explanation: string;
    correctAnswer: string;
    options: Array<string>;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addLesson(lesson: Lesson): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    generateCertificate(skill: string): Promise<Certificate | null>;
    getAllLessons(): Promise<Array<Lesson>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getLessonsByCategory(category: string): Promise<Array<Lesson>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserProgress(): Promise<UserProgressView | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateProgress(lessonId: bigint, segment: bigint, isComplete: boolean): Promise<void>;
    verifyCertificate(verificationId: string): Promise<Certificate | null>;
}
