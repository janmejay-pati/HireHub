import { motion } from 'framer-motion';
import Input from '../common/Input';

const AnimatedInput = ({ className = '', ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24 }}
      className={className}
    >
      <Input {...props} />
    </motion.div>
  );
};

export default AnimatedInput;
