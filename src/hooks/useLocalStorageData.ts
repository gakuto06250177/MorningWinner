import { useState, useEffect } from 'react';
import { Member, AttendanceRecord, AttendanceStatus, MemberSummary } from '@/types';

const PENALTY_AMOUNT = 500;
const DEFAULT_MEMBERS: Member[] = [
  { id: '1', name: 'メンバー1' },
  { id: '2', name: 'メンバー2' },
  { id: '3', name: 'メンバー3' },
  { id: '4', name: 'メンバー4' },
];

export function useLocalStorageData() {
  const [members, setMembers] = useState<Member[]>(DEFAULT_MEMBERS);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedMembers = localStorage.getItem('morning-winner-members');
    const savedRecords = localStorage.getItem('morning-winner-attendance');
    
    if (savedMembers) {
      setMembers(JSON.parse(savedMembers));
    }
    
    if (savedRecords) {
      setAttendanceRecords(JSON.parse(savedRecords));
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('morning-winner-members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('morning-winner-attendance', JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  const updateMemberName = async (memberId: string, newName: string) => {
    setMembers(prev => prev.map(member => 
      member.id === memberId ? { ...member, name: newName } : member
    ));
  };

  const recordAttendance = async (memberId: string, status: AttendanceStatus, date: string) => {
    const recordId = `${memberId}-${date}`;
    const newRecord: AttendanceRecord = {
      id: recordId,
      memberId,
      date,
      status,
      timestamp: new Date().toISOString(),
    };

    setAttendanceRecords(prev => {
      const filtered = prev.filter(record => record.id !== recordId);
      return [...filtered, newRecord];
    });
  };

  const getTodaysAttendance = (memberId: string, date: string): AttendanceStatus | null => {
    const record = attendanceRecords.find(
      record => record.memberId === memberId && record.date === date
    );
    return record?.status || null;
  };

  const getAttendanceCountForDate = (date: string, status: AttendanceStatus): number => {
    return attendanceRecords.filter(record => 
      record.date === date && record.status === status
    ).length;
  };

  const calculatePenaltyForMember = (member: Member): number => {
    const memberRecords = attendanceRecords.filter(record => record.memberId === member.id);
    const lateRecords = memberRecords.filter(record => record.status === AttendanceStatus.LATE);
    
    let totalPenalty = 0;
    
    for (const lateRecord of lateRecords) {
      const presentCount = getAttendanceCountForDate(lateRecord.date, AttendanceStatus.PRESENT);
      totalPenalty += presentCount * PENALTY_AMOUNT;
    }
    
    return totalPenalty;
  };

  const getMemberSummary = (member: Member): MemberSummary => {
    const memberRecords = attendanceRecords.filter(record => record.memberId === member.id);
    
    const lateCount = memberRecords.filter(record => record.status === AttendanceStatus.LATE).length;
    const presentCount = memberRecords.filter(record => record.status === AttendanceStatus.PRESENT).length;
    const holidayCount = memberRecords.filter(record => record.status === AttendanceStatus.HOLIDAY).length;
    
    return {
      member,
      totalPenalty: calculatePenaltyForMember(member),
      lateCount,
      presentCount,
      holidayCount,
    };
  };

  const refreshData = async () => {
    // For localStorage, we don't need to refresh from external source
    // Data is already in sync
  };

  return {
    members,
    attendanceRecords,
    loading,
    error,
    updateMemberName,
    recordAttendance,
    getTodaysAttendance,
    getMemberSummary,
    refreshData
  };
}