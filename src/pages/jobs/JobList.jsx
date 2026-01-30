import React, { useEffect, useState } from 'react';
import { getJobs } from '../../services/jobService';
import JobTable from '../../features/jobs/JobTable';
import { ClipboardList } from 'lucide-react';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getJobs();
        setJobs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Servisní zakázky</h1>
          <p className="text-slate-500 text-sm">Přehled všech výjezdů a oprav</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm">
          <ClipboardList size={18} />
          Nová zakázka
        </button>
      </div>

      <JobTable jobs={jobs} loading={loading} />
    </div>
  );
};

export default JobList;