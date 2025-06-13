import { supabase } from './supabase';
import { Member, AttendanceRecord, AttendanceStatus } from '@/types';

// Members operations
export async function getMembers(): Promise<Member[]> {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .order('created_at');

  if (error) {
    console.error('Error fetching members:', error);
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.map((row: any) => ({
    id: row.id,
    name: row.name
  }));
}

export async function createMember(member: Omit<Member, 'id'>): Promise<Member | null> {
  const { data, error } = await supabase
    .from('members')
    .insert({
      name: member.name
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating member:', error);
    return null;
  }

  return {
    id: data.id,
    name: data.name
  };
}

export async function updateMember(id: string, updates: Partial<Member>): Promise<Member | null> {
  const { data, error } = await supabase
    .from('members')
    .update({
      name: updates.name,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating member:', error);
    return null;
  }

  return {
    id: data.id,
    name: data.name
  };
}

// Attendance records operations
export async function getAttendanceRecords(): Promise<AttendanceRecord[]> {
  const { data, error } = await supabase
    .from('attendance_records')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching attendance records:', error);
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.map((row: any) => ({
    id: row.id,
    memberId: row.member_id,
    date: row.date,
    status: row.status as AttendanceStatus,
    timestamp: row.timestamp
  }));
}

export async function createOrUpdateAttendanceRecord(record: Omit<AttendanceRecord, 'id'>): Promise<AttendanceRecord | null> {
  // First, try to find existing record for this member and date
  const { data: existing } = await supabase
    .from('attendance_records')
    .select('*')
    .eq('member_id', record.memberId)
    .eq('date', record.date)
    .single();

  if (existing) {
    // Update existing record
    const { data, error } = await supabase
      .from('attendance_records')
      .update({
        status: record.status,
        timestamp: record.timestamp || new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', existing.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating attendance record:', error);
      return null;
    }

    return {
      id: data.id,
      memberId: data.member_id,
      date: data.date,
      status: data.status as AttendanceStatus,
      timestamp: data.timestamp
    };
  } else {
    // Create new record
    const { data, error } = await supabase
      .from('attendance_records')
      .insert({
        member_id: record.memberId,
        date: record.date,
        status: record.status,
        timestamp: record.timestamp || new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating attendance record:', error);
      return null;
    }

    return {
      id: data.id,
      memberId: data.member_id,
      date: data.date,
      status: data.status as AttendanceStatus,
      timestamp: data.timestamp
    };
  }
}

// Initialize default members if they don't exist
export async function initializeDefaultMembers(): Promise<void> {
  const existingMembers = await getMembers();
  
  if (existingMembers.length === 0) {
    const defaultMembers = [
      { name: 'メンバー1' },
      { name: 'メンバー2' },
      { name: 'メンバー3' },
      { name: 'メンバー4' }
    ];

    for (const member of defaultMembers) {
      await createMember(member);
    }
  }
}

// Migrate data from localStorage to Supabase
export async function migrateFromLocalStorage(): Promise<boolean> {
  try {
    // Get existing data from localStorage
    const savedMembers = localStorage.getItem('morning-winner-members');
    const savedRecords = localStorage.getItem('morning-winner-attendance');

    let localMembers: Member[] = [];
    
    if (savedMembers) {
      localMembers = JSON.parse(savedMembers);
      
      for (const member of localMembers) {
        // Check if member already exists in Supabase
        const existingMembers = await getMembers();
        const exists = existingMembers.find(m => m.name === member.name);
        
        if (!exists) {
          await createMember({ name: member.name });
        }
      }
    }

    if (savedRecords) {
      const localRecords: AttendanceRecord[] = JSON.parse(savedRecords);
      const supabaseMembers = await getMembers();
      
      for (const record of localRecords) {
        // Find corresponding member in Supabase
        const member = supabaseMembers.find(m => 
          // Try to match by index if names are default, otherwise by name
          m.name === `メンバー${parseInt(record.memberId)}` || 
          localMembers.find(lm => lm.id === record.memberId)?.name === m.name
        );
        
        if (member) {
          await createOrUpdateAttendanceRecord({
            memberId: member.id,
            date: record.date,
            status: record.status,
            timestamp: record.timestamp
          });
        }
      }
    }

    return true;
  } catch (error) {
    console.error('Error migrating from localStorage:', error);
    return false;
  }
}