import Card from './Card';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, delta, icon, className = '' }) => {
  return (
    <Card className={`flex items-center justify-between gap-4 ${className}`}>
      <div>
        <p className="text-sm text-(--muted)">{title}</p>
        <h3 className="mt-1 text-2xl font-black" style={{ color: 'var(--text)' }}>{value}</h3>
      </div>

      {icon && <div className="shrink-0">{icon}</div>}
    </Card>
  );
};

export default StatCard;
