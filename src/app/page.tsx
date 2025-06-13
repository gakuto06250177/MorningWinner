'use client';

import { useState, useEffect } from 'react';
import { AttendanceStatus } from '@/types';
import { useLocalStorageData } from '@/hooks/useLocalStorageData';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { SunriseLoadingScreen } from '@/components/SunriseLoading';

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your_supabase_project_url' &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'your_supabase_anon_key'
  );
};

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [editingMember, setEditingMember] = useState<string | null>(null);
  const [showSunriseLoading, setShowSunriseLoading] = useState(true);
  const [sunriseProgress, setSunriseProgress] = useState(0);

  // Use Supabase if configured, otherwise fall back to localStorage
  const useSupabase = isSupabaseConfigured();
  const localStorageData = useLocalStorageData();
  const supabaseData = useSupabaseData();
  
  const {
    members,
    loading,
    error,
    updateMemberName: updateMemberNameHook,
    recordAttendance: recordAttendanceHook,
    getTodaysAttendance,
    getMemberSummary
  } = useSupabase ? supabaseData : localStorageData;

  // Sunrise animation effect (20 seconds)
  useEffect(() => {
    const startTime = Date.now();
    const duration = 10000; // 10 seconds
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setSunriseProgress(progress);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setTimeout(() => setShowSunriseLoading(false), 3000);
      }
    };
    
    animate();
  }, []);

  const updateMemberName = async (memberId: string, newName: string) => {
    await updateMemberNameHook(memberId, newName);
    setEditingMember(null);
  };

  const recordAttendance = async (memberId: string, status: AttendanceStatus) => {
    await recordAttendanceHook(memberId, status, selectedDate);
  };

  const getCurrentAttendance = (memberId: string): AttendanceStatus | null => {
    return getTodaysAttendance(memberId, selectedDate);
  };

  const getStatusColor = (status: AttendanceStatus | null) => {
    switch (status) {
      case AttendanceStatus.PRESENT:
        return 'bg-green-100 text-green-800 border-green-200';
      case AttendanceStatus.LATE:
        return 'bg-red-100 text-red-800 border-red-200';
      case AttendanceStatus.ABSENT:
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case AttendanceStatus.HOLIDAY:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-white text-gray-500 border-gray-200';
    }
  };

  const getStatusText = (status: AttendanceStatus | null) => {
    switch (status) {
      case AttendanceStatus.PRESENT:
        return '出席';
      case AttendanceStatus.LATE:
        return '遅刻';
      case AttendanceStatus.ABSENT:
        return '欠席';
      case AttendanceStatus.HOLIDAY:
        return '休み';
      default:
        return '未記録';
    }
  };

  // Show sunrise loading animation
  if (showSunriseLoading) {
    return <SunriseLoadingScreen sunriseProgress={sunriseProgress} />;
  }

  return (
    <div 
      className="min-h-screen py-8 relative"
      style={{
        backgroundImage: 'url(/loading-icon.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Background overlay for readability */}
      <div className="absolute inset-0 bg-white/10"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900">
                朝活出席チェッカー
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://meet.google.com/mni-ioqm-esx?authuser=0&hs=122&ijlm=1749828254853"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
              >
                MorningWinner Meeting 参加
              </a>
              {useSupabase && (
                <div className="text-sm text-green-600 font-medium">
                  ✓ Supabase連携
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Date Selection */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              記録日
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Daily Attendance */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {selectedDate} の出席状況
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {members.map((member) => {
                const currentStatus = getCurrentAttendance(member.id);
                return (
                  <div key={member.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      {editingMember === member.id ? (
                        <input
                          type="text"
                          defaultValue={member.name}
                          className="text-lg font-semibold bg-gray-50 border rounded px-2 py-1"
                          onBlur={(e) => updateMemberName(member.id, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              updateMemberName(member.id, e.currentTarget.value);
                            }
                          }}
                          autoFocus
                        />
                      ) : (
                        <h3 
                          className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-blue-600"
                          onClick={() => setEditingMember(member.id)}
                        >
                          {member.name}
                        </h3>
                      )}
                      <div className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(currentStatus)}`}>
                        {getStatusText(currentStatus)}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => recordAttendance(member.id, AttendanceStatus.PRESENT)}
                        className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                          currentStatus === AttendanceStatus.PRESENT
                            ? 'bg-green-600 text-white'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                        disabled={loading}
                      >
                        出席
                      </button>
                      <button
                        onClick={() => recordAttendance(member.id, AttendanceStatus.LATE)}
                        className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                          currentStatus === AttendanceStatus.LATE
                            ? 'bg-red-600 text-white'
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                        disabled={loading}
                      >
                        遅刻
                      </button>
                      <button
                        onClick={() => recordAttendance(member.id, AttendanceStatus.HOLIDAY)}
                        className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                          currentStatus === AttendanceStatus.HOLIDAY
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        }`}
                        disabled={loading}
                      >
                        休み
                      </button>
                      <button
                        onClick={() => recordAttendance(member.id, AttendanceStatus.ABSENT)}
                        className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                          currentStatus === AttendanceStatus.ABSENT
                            ? 'bg-gray-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        disabled={loading}
                      >
                        欠席
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              個人別サマリー
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      名前
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      出席回数
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      遅刻回数
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      休み回数
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ペナルティ金額
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {members.map((member) => {
                    const summary = getMemberSummary(member);
                    return (
                      <tr key={member.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {member.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                          {summary.presentCount}回
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                          {summary.lateCount}回
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                          {summary.holidayCount}回
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600">
                          ¥{summary.totalPenalty.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}