import React, { useEffect, useState } from 'react';
import { getJobs } from '../../services/jobService';
import JobTable from '../../features/jobs/JobTable';
import CreateJobModal from '../../modals/jobs/CreateJobModal';
import { ClipboardList } from 'lucide-react';
import Header from '../../components/layout/Header';
import Button from '../../components/ui/Button';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getJobs();
      setJobs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <Header
        title="Servisní zakázky"
        subtitle="Přehled všech výjezdů a oprav"
        actions={
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
          >
            <ClipboardList size={18} />
            Nová zakázka
          </Button>
        }
      />

      <JobTable jobs={jobs} loading={loading} />

      <CreateJobModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
};

export default JobList;
