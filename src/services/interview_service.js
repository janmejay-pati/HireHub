import { getInterviews, setInterviews } from './storage_service';

const normalizeInterview = (interview, fallbackId = 0) => ({
  id: interview.id || interview._id || `interview-${fallbackId}`,
  applicationId: interview.applicationId || interview.application_id || null,
  candidateId: interview.candidateId || interview.candidate_id || null,
  candidateName: interview.candidateName || 'Candidate',
  email: interview.email || '',
  role: interview.role || interview.jobTitle || 'Role',
  domain: interview.domain || 'General',
  interviewDate: interview.interviewDate || new Date().toISOString(),
  status: interview.status || 'Scheduled',
  mode: interview.mode || 'Video',
  notes: interview.notes || '',
  recruiterId: interview.recruiterId || null,
  questions: Array.isArray(interview.questions) ? interview.questions : [],
  createdAt: interview.createdAt || new Date().toISOString(),
});

export const interviewService = {
  getAllInterviews: () => getInterviews().map((interview, index) => normalizeInterview(interview, index + 1)),

  getInterviewById: (id) => interviewService.getAllInterviews().find((interview) => interview.id === id),

  getInterviewsByCandidate: (candidateId) =>
    interviewService.getAllInterviews().filter((interview) => interview.candidateId === candidateId),

  createInterview: (payload = {}) => {
    const interviews = interviewService.getAllInterviews();
    const newInterview = normalizeInterview(
      {
        ...payload,
        id: payload.id || `interview-${Date.now()}`,
        status: payload.status || 'Scheduled',
      },
      interviews.length + 1
    );

    setInterviews([newInterview, ...interviews]);
    return newInterview;
  },

  updateInterview: (id, updates = {}) => {
    const interviews = interviewService.getAllInterviews();
    const index = interviews.findIndex((interview) => interview.id === id);

    if (index === -1) {
      throw new Error('Interview not found');
    }

    const updated = {
      ...interviews[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    interviews[index] = updated;
    setInterviews(interviews);
    return updated;
  },

  deleteInterview: (id) => {
    const interviews = interviewService.getAllInterviews();
    const nextInterviews = interviews.filter((interview) => interview.id !== id);
    setInterviews(nextInterviews);
    return true;
  },

  getInterviewStats: () => {
    const interviews = interviewService.getAllInterviews();
    const scheduled = interviews.filter((interview) => interview.status === 'Scheduled').length;
    const completed = interviews.filter((interview) => interview.status === 'Completed').length;
    const cancelled = interviews.filter((interview) => interview.status === 'Cancelled').length;

    return {
      total: interviews.length,
      scheduled,
      completed,
      cancelled,
    };
  },
};
