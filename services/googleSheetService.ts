
/**
 * Service untuk komunikasi dengan Google Sheets melalui Apps Script.
 * Versi Robust v10
 */

const API_URL = "https://script.google.com/macros/s/AKfycbxoJAFlMjYtAQ9liyyOfbRYORsiha-WImewQSgOdsR1gKR6deZaZJmRVvQj7m1Ve-az/exec";

const mapDataFromSheets = (tabName: string, data: any[]) => {
  if (!Array.isArray(data)) return [];
  return data.map(item => {
    const base = { ...item };
    base.id = String(base.id || '');

    if (tabName === 'Schedules') {
      return { 
        ...base, 
        taskTitle: base.tasktitle || '',
        ambassadorNames: typeof base.ambassadornames === 'string' ? base.ambassadornames.split(', ') : [] 
      };
    }
    if (tabName === 'Evidence') {
      return { 
        ...base, 
        activityTitle: base.activitytitle || '',
        pdfUrl: base.pdfurl || '#', 
        ambassadorName: base.ambassadorname || '' 
      };
    }
    if (tabName === 'Attendance') {
      return { 
        ...base, 
        location: { lat: parseFloat(base.lat) || 0, lng: parseFloat(base.lng) || 0 } 
      };
    }
    if (tabName === 'Minutes') {
      return {
        ...base,
        fileLink: base.filelink || '#'
      };
    }
    if (tabName === 'Performance') {
      return {
        ...base,
        likes: parseInt(base.likes) || 0,
        comments: parseInt(base.comments) || 0,
        views: parseInt(base.views) || 0,
        shares: parseInt(base.shares) || 0,
        month: base.month || ''
      };
    }
    return base;
  });
};

const prepareDataForSheets = (data: any) => {
  const prepared = { ...data };
  
  // Array ke String Koma
  if (Array.isArray(prepared.ambassadornames)) {
    prepared.ambassadornames = prepared.ambassadornames.join(', ');
  }
  
  // Normalisasi kunci ke lowercase
  const finalData: any = {};
  Object.keys(prepared).forEach(key => {
    finalData[key.toLowerCase()] = prepared[key];
  });
  return finalData;
};

export const fetchSheetData = async (tabName: string) => {
  if (!API_URL || API_URL.length < 20) {
    console.warn(`[CloudSync] API_URL belum dikonfigurasi untuk tab ${tabName}`);
    return null;
  }
  try {
    const response = await fetch(`${API_URL}?tab=${tabName}`, { 
      method: 'GET', 
      mode: 'cors', 
      redirect: 'follow' 
    });
    
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Jika data adalah objek error dari Apps Script
    if (data && data.success === false) {
      throw new Error(data.message || "Gagal mengambil data dari Apps Script");
    }
    
    return mapDataFromSheets(tabName, data);
  } catch (error: any) {
    console.error(`[CloudSync] Error fetching ${tabName}:`, error.message);
    throw error; // Lempar error agar ditangkap di App.tsx
  }
};

export const saveSheetData = async (tabName: string, data: any) => {
  try {
    const prepared = prepareDataForSheets(data);
    await fetch(API_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ tab: tabName, action: 'create', data: prepared })
    });
    return true;
  } catch (error) {
    return false;
  }
};

export const updateSheetData = async (tabName: string, id: string, data: any) => {
  try {
    const prepared = prepareDataForSheets({ ...data, id });
    await fetch(API_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ tab: tabName, action: 'update', data: prepared })
    });
    return true;
  } catch (error) {
    return false;
  }
};

export const deleteSheetData = async (tabName: string, id: string) => {
  try {
    await fetch(API_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ tab: tabName, action: 'delete', data: { id } })
    });
    return true;
  } catch (error) {
    return false;
  }
};
