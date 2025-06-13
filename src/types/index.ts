export interface Member {
  id: string;
  name: string;
}

export interface AttendanceRecord {
  id: string;
  memberId: string;
  date: string; // YYYY-MM-DD format
  status: AttendanceStatus;
  timestamp?: string; // When the status was recorded
}

export enum AttendanceStatus {
  PRESENT = 'present',
  LATE = 'late', 
  ABSENT = 'absent',
  HOLIDAY = 'holiday'
}

export interface MemberSummary {
  member: Member;
  totalPenalty: number;
  lateCount: number;
  presentCount: number;
  holidayCount: number;
}

export interface DailyAttendance {
  date: string;
  records: AttendanceRecord[];
}