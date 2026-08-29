import { useEffect, useState } from 'react';
import Button from '../../components/common/Button';
import GlassCard from '../../components/common/GlassCard';
import { userService } from '../../services/user_service';
import { jobService } from '../../services/jobService';
import { applicationService } from '../../services/application_service';
import { notificationService } from '../../services/notification_service';

const E2ETest = () => {
  const [log, setLog] = useState([]);

  const append = (line) => setLog((l) => [...l, line]);

  const run = async () => {
    append('Starting E2E simulation...');

    // create recruiter
    let recruiter = userService.getUserByEmail('dev.recruiter@local');
    if (!recruiter) {
      recruiter = userService.createUser({ name: 'Dev Recruiter', email: 'dev.recruiter@local', password: 'pass', role: 'recruiter', company: 'DevCo' });
      append('Created recruiter: ' + recruiter.id);
    } else append('Found recruiter: ' + recruiter.id);

    // create candidate
    let candidate = userService.getUserByEmail('dev.candidate@local');
    if (!candidate) {
      candidate = userService.createUser({ name: 'Dev Candidate', email: 'dev.candidate@local', password: 'pass', role: 'candidate' });
      append('Created candidate: ' + candidate.id);
    } else append('Found candidate: ' + candidate.id);

    // post a job as recruiter
    const jobRes = await jobService.postJob({ title: 'E2E Test Role', jobTitle: 'E2E Test Role', company: recruiter.company || 'DevCo', postedBy: recruiter.id, location: 'Remote' });
    if (jobRes.success) {
      append('Job posted: ' + jobRes.data._id);
    } else {
      append('Job post failed: ' + jobRes.message);
      return;
    }

    // candidate applies
    const applicationPayload = {
      candidateId: candidate.id,
      candidateName: candidate.name,
      email: candidate.email,
      jobId: jobRes.data._id,
      jobTitle: jobRes.data.title || jobRes.data.jobTitle,
      company: jobRes.data.company,
      recruiterId: recruiter.id,
      resume: 'simulated-resume',
      status: 'Applied'
    };

    try {
      const app = applicationService.createApplication(applicationPayload);
      append('Application created: ' + app.id || app.applicationId);
    } catch (e) {
      append('Application error: ' + e.message);
    }

    // check notifications (global + targeted)
    const allNotifs = notificationService.getAllNotifications();
    const recruiterNotifs = notificationService.getAllNotifications(recruiter.id);
    const candidateNotifs = notificationService.getAllNotifications(candidate.id);
    append('Total notifications: ' + allNotifs.length);
    append('Recruiter notifications: ' + recruiterNotifs.length);
    append('Candidate notifications: ' + candidateNotifs.length);

    // check recruiter applicants
    const recApps = applicationService.getApplicationsByRecruiter(recruiter.id);
    append('Recruiter applications count: ' + recApps.length);

    append('E2E simulation complete. Check recruiter Applicants and notifications in UI.');
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl text-white font-bold mb-4">E2E Dev Simulation</h2>
      <GlassCard className="p-6">
        <p className="text-sm text-slate-300 mb-4">Runs a simulated flow: create recruiter, post job, candidate apply, then shows counts.</p>
        <Button onClick={run}>Run E2E Simulation</Button>
      </GlassCard>

      <GlassCard className="p-6 mt-6">
        <h3 className="text-lg text-white font-semibold mb-3">Log</h3>
        <div className="text-sm text-slate-300 space-y-2">
          {log.map((l, i) => (
            <div key={i}>{l}</div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};

export default E2ETest;
