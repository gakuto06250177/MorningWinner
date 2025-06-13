import { useState, useEffect } from 'react';
import { Member, AttendanceRecord, AttendanceStatus, MemberSummary } from '@/types';
import { getMembers, getAttendanceRecords, updateMember, createOrUpdateAttendanceRecord, initializeDefaultMembers } from '@/lib/database';

export function useSupabaseData() {
  const [members, setMembers] = useState<Member[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Initialize default members if needed
      await initializeDefaultMembers();

      // Load members and attendance records
      const [membersData, recordsData] = await Promise.all([
        getMembers(),
        getAttendanceRecords()
      ]);

      setMembers(membersData);
      setAttendanceRecords(recordsData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('データの読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const updateMemberName = async (memberId: string, newName: string) => {
    try {
      const updatedMember = await updateMember(memberId, { name: newName });
      if (updatedMember) {
        setMembers(prev => prev.map(member => 
          member.id === memberId ? updatedMember : member
        ));
      }
    } catch (err) {
      console.error('Error updating member:', err);
      setError('メンバー名の更新に失敗しました');
    }
  };

  const recordAttendance = async (memberId: string, status: AttendanceStatus, date: string) => {
    try {
      const newRecord = await createOrUpdateAttendanceRecord({
        memberId,
        date,
        status,
        timestamp: new Date().toISOString(),
      });

      if (newRecord) {
        setAttendanceRecords(prev => {
          const filtered = prev.filter(record => !(record.memberId === memberId && record.date === date));
          return [...filtered, newRecord];
        });
      }
    } catch (err) {
      console.error('Error recording attendance:', err);
      setError('出席記録の保存に失敗しました');
    }
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
    const PENALTY_AMOUNT = 500;
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

  return {
    members,
    attendanceRecords,
    loading,
    error,
    updateMemberName,
    recordAttendance,
    getTodaysAttendance,
    getMemberSummary,
    refreshData: loadData
  };
}