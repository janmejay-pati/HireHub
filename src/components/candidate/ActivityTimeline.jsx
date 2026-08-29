import { motion } from 'framer-motion';
import GlassCard from '../common/GlassCard';

const ActivityTimeline = ({ events }) => {
  return (
    <GlassCard className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Activity</p>
          <h3 className="mt-2 text-2xl font-black text-white">Recent Profile Activity</h3>
        </div>
      </div>

      <div className="space-y-4">
        {events.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 text-center text-slate-400">
            No activity to show yet. Interact with your profile to populate the timeline.
          </div>
        ) : (
          events.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="rounded-3xl border border-white/10 bg-slate-950/70 p-5"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-400">{event.type}</p>
                  <h4 className="mt-1 text-lg font-semibold text-white">{event.title}</h4>
                </div>
                <p className="text-sm text-slate-500">{event.time}</p>
              </div>
              <p className="mt-3 text-sm text-slate-400">{event.description}</p>
            </motion.div>
          ))
        )}
      </div>
    </GlassCard>
  );
};

export default ActivityTimeline;
